import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute, getNextNumbers, getPatientCount, getClinic, formatOpNumber } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clinicId } = session;
    const url = new URL(request.url);

    // Quick count-only mode for billing page
    const countOnly = url.searchParams.get('countOnly');
    if (countOnly) {
      const count = await getPatientCount(clinicId);
      return NextResponse.json({ total: count });
    }

    const search = url.searchParams.get('search') || '';
    const dateFrom = url.searchParams.get('dateFrom') || '';
    const dateTo = url.searchParams.get('dateTo') || '';

    let sql = `
      SELECT p.*,
        COALESCE(SUM(t.amount), 0) as total_billing
      FROM patients p
      LEFT JOIN treatments t ON t.patient_id = p.id
      WHERE p.clinic_id = $1
    `;

    const params: unknown[] = [clinicId];
    let paramIndex = 2;

    if (search) {
      sql += ` AND (p.name ILIKE $${paramIndex} OR p.phone LIKE $${paramIndex} OR CAST(p.op_number AS TEXT) LIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (dateFrom) {
      sql += ` AND DATE(p.created_at) >= $${paramIndex}`;
      params.push(dateFrom);
      paramIndex++;
    }

    if (dateTo) {
      sql += ` AND DATE(p.created_at) <= $${paramIndex}`;
      params.push(dateTo);
      paramIndex++;
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
      clinic_slug,
      name, age, sex, address, phone, occupation, chief_complaint,
      jaundice, high_blood_pressure, heart_diseases, bleeding_disorders,
      hemophilia, allergy, anemia, fits, asthma_rs_disorders, thyroid,
      diabetes, kidney_diseases, pregnancy_lactating,
      previous_dental_history, diagnosis, treatment_plan,
      consent_agreed,
      patient_signature, dentist_signature,
    } = body;

    // Determine clinic_id
    let clinicId: string | null = null;

    // 1. Check if authenticated (dashboard submission)
    const session = await getSession();
    if (session) {
      clinicId = session.clinicId;
    }

    // 2. If remote submission with link token, get clinic from link
    if (!clinicId && submission_method === 'remote' && link_token) {
      const link = await queryOne<{ id: number; clinic_id: string }>(
        'SELECT id, clinic_id FROM registration_links WHERE token = $1 AND used_at IS NULL',
        [link_token]
      );
      if (!link) {
        return NextResponse.json(
          { error: 'Invalid or expired registration link' },
          { status: 400 }
        );
      }
      clinicId = link.clinic_id;
    }

    // 3. If tablet submission with clinic_slug
    if (!clinicId && clinic_slug) {
      const clinic = await queryOne<{ id: string }>('SELECT id FROM clinics WHERE slug = $1', [clinic_slug]);
      if (clinic) {
        clinicId = clinic.id;
      }
    }

    if (!clinicId) {
      return NextResponse.json(
        { error: 'Could not determine clinic. Please provide a valid registration link or clinic identifier.' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !age || !sex || !phone) {
      return NextResponse.json(
        { error: 'Name, age, sex, and phone are required' },
        { status: 400 }
      );
    }

    // Check freemium patient limit
    const clinic = await getClinic(clinicId);
    if (clinic && clinic.plan === 'free') {
      const count = await getPatientCount(clinicId);
      if (count >= clinic.patient_limit) {
        return NextResponse.json(
          { error: `Patient limit reached (${clinic.patient_limit}). Please upgrade your plan to add more patients.` },
          { status: 403 }
        );
      }
    }

    const { opNumber, invoiceNumber, xrayIdNumber } = await getNextNumbers(clinicId);

    const result = await execute(
      `INSERT INTO patients (
        clinic_id, op_number, invoice_number, xray_id_number, submission_method,
        name, age, sex, address, phone, occupation, chief_complaint,
        jaundice, high_blood_pressure, heart_diseases, bleeding_disorders,
        hemophilia, allergy, anemia, fits, asthma_rs_disorders, thyroid,
        diabetes, kidney_diseases, pregnancy_lactating,
        previous_dental_history, diagnosis, treatment_plan,
        consent_agreed, patient_signature, dentist_signature
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22,
        $23, $24, $25,
        $26, $27, $28,
        $29, $30, $31
      ) RETURNING id`,
      [
        clinicId, opNumber, invoiceNumber, xrayIdNumber, submission_method,
        name, age, sex, address || '', phone, occupation || '', chief_complaint || '',
        !!jaundice, !!high_blood_pressure, !!heart_diseases, !!bleeding_disorders,
        !!hemophilia, !!allergy, !!anemia, !!fits, !!asthma_rs_disorders, !!thyroid,
        !!diabetes, !!kidney_diseases, !!pregnancy_lactating,
        previous_dental_history || '', diagnosis || '', treatment_plan || '',
        !!consent_agreed, patient_signature || '', dentist_signature || '',
      ]
    );

    const patientId = result.rows[0]?.id;

    // Mark link as used if remote
    if (submission_method === 'remote' && link_token) {
      await execute(
        'UPDATE registration_links SET used_at = NOW(), patient_id = $1 WHERE token = $2',
        [patientId, link_token]
      );
    }

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
