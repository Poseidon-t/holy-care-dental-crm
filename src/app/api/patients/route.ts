import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, formatOpNumber, getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);

    const search = url.searchParams.get('search') || '';
    const dateFrom = url.searchParams.get('dateFrom') || '';
    const dateTo = url.searchParams.get('dateTo') || '';

    let sql = `
      SELECT p.*,
        COALESCE(SUM(t.amount), 0) as total_billing
      FROM patients p
      LEFT JOIN treatments t ON t.patient_id = p.id
      WHERE 1=1
    `;

    const params: unknown[] = [];

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.phone LIKE ? OR CAST(p.op_number AS TEXT) LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (dateFrom) {
      sql += ` AND DATE(p.created_at) >= ?`;
      params.push(dateFrom);
    }

    if (dateTo) {
      sql += ` AND DATE(p.created_at) <= ?`;
      params.push(dateTo);
    }

    sql += ' GROUP BY p.id ORDER BY p.created_at DESC';

    const patients = await query<{
      id: number;
      op_number: number;
      name: string;
      phone: string;
      created_at: string;
      total_billing: number;
      dentist_signature: string;
    }>(sql, params);

    const formatted = patients.map((p) => ({
      ...p,
      op_number_formatted: formatOpNumber(p.op_number),
    }));

    return NextResponse.json({ patients: formatted });
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      submission_method = 'tablet',
      link_token,
      name, age, sex, address, phone, occupation, chief_complaint,
      jaundice, high_blood_pressure, heart_diseases, bleeding_disorders,
      hemophilia, allergy, anemia, fits, asthma_rs_disorders, thyroid,
      diabetes, kidney_diseases, pregnancy_lactating,
      previous_dental_history, diagnosis, treatment_plan,
      consent_agreed,
      patient_signature, dentist_signature,
    } = body;

    // For remote submissions, validate the link token (with 24h expiry)
    if (submission_method === 'remote' && link_token) {
      const link = await queryOne<{ id: number; token: string }>(
        "SELECT id, token FROM registration_links WHERE token = ? AND used_at IS NULL AND datetime(expires_at) > datetime('now')",
        [link_token]
      );
      if (!link) {
        return NextResponse.json(
          { error: 'Invalid or expired registration link' },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!name || !age || !sex || !phone) {
      return NextResponse.json(
        { error: 'Name, age, sex, and phone are required' },
        { status: 400 }
      );
    }

    // Input validation
    const trimmedName = String(name).trim().slice(0, 255);
    const parsedAge = Math.max(0, Math.min(150, Math.floor(Number(age))));
    const trimmedSex = String(sex).trim().slice(0, 10);
    const trimmedPhone = String(phone).trim().slice(0, 20);
    const trimmedAddress = address ? String(address).trim().slice(0, 500) : '';
    const trimmedOccupation = occupation ? String(occupation).trim().slice(0, 255) : '';
    const trimmedChiefComplaint = chief_complaint ? String(chief_complaint).trim().slice(0, 2000) : '';
    const trimmedPrevDental = previous_dental_history ? String(previous_dental_history).trim().slice(0, 2000) : '';
    const trimmedDiagnosis = diagnosis ? String(diagnosis).trim().slice(0, 2000) : '';
    const trimmedTreatmentPlan = treatment_plan ? String(treatment_plan).trim().slice(0, 2000) : '';

    // Limit signature data to 2MB
    const MAX_SIG_LEN = 2 * 1024 * 1024;
    const trimmedPatientSig = patient_signature ? String(patient_signature).slice(0, MAX_SIG_LEN) : '';
    const trimmedDentistSig = dentist_signature ? String(dentist_signature).slice(0, MAX_SIG_LEN) : '';

    if (!trimmedName || isNaN(parsedAge) || !trimmedSex || !trimmedPhone) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Use transaction for atomic patient creation + link marking
    const db = getDb();
    const createPatient = db.transaction(() => {
      const { opNumber, invoiceNumber, xrayIdNumber } = (() => {
        const result = db.prepare('SELECT COALESCE(MAX(op_number), 0) + 1 as next FROM patients').get() as { next: number } | undefined;
        const next = result?.next ?? 1;
        return { opNumber: next, invoiceNumber: next, xrayIdNumber: next };
      })();

      const insertResult = db.prepare(
        `INSERT INTO patients (
          op_number, invoice_number, xray_id_number, submission_method,
          name, age, sex, address, phone, occupation, chief_complaint,
          jaundice, high_blood_pressure, heart_diseases, bleeding_disorders,
          hemophilia, allergy, anemia, fits, asthma_rs_disorders, thyroid,
          diabetes, kidney_diseases, pregnancy_lactating,
          previous_dental_history, diagnosis, treatment_plan,
          consent_agreed, patient_signature, dentist_signature
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?
        )`
      ).run(
        opNumber, invoiceNumber, xrayIdNumber, submission_method,
        trimmedName, parsedAge, trimmedSex, trimmedAddress, trimmedPhone, trimmedOccupation, trimmedChiefComplaint,
        jaundice ? 1 : 0, high_blood_pressure ? 1 : 0, heart_diseases ? 1 : 0, bleeding_disorders ? 1 : 0,
        hemophilia ? 1 : 0, allergy ? 1 : 0, anemia ? 1 : 0, fits ? 1 : 0, asthma_rs_disorders ? 1 : 0, thyroid ? 1 : 0,
        diabetes ? 1 : 0, kidney_diseases ? 1 : 0, pregnancy_lactating ? 1 : 0,
        trimmedPrevDental, trimmedDiagnosis, trimmedTreatmentPlan,
        consent_agreed ? 1 : 0, trimmedPatientSig, trimmedDentistSig,
      );

      const patientId = Number(insertResult.lastInsertRowid);

      // Mark link as used atomically
      if (submission_method === 'remote' && link_token) {
        db.prepare(
          "UPDATE registration_links SET used_at = datetime('now'), patient_id = ? WHERE token = ?"
        ).run(patientId, link_token);
      }

      return { patientId, opNumber };
    });

    const { patientId, opNumber } = createPatient();

    return NextResponse.json({
      success: true,
      patient: {
        id: patientId,
        op_number: opNumber,
        op_number_formatted: formatOpNumber(opNumber),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
