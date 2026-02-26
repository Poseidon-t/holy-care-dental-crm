import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute, getNextNumbers, formatOpNumber } from '@/lib/db';
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

    // For remote submissions, validate the link token
    if (submission_method === 'remote' && link_token) {
      const link = await queryOne<{ id: number; token: string }>(
        'SELECT id, token FROM registration_links WHERE token = ? AND used_at IS NULL',
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

    const { opNumber, invoiceNumber, xrayIdNumber } = await getNextNumbers();

    const result = await execute(
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
      )`,
      [
        opNumber, invoiceNumber, xrayIdNumber, submission_method,
        name, age, sex, address || '', phone, occupation || '', chief_complaint || '',
        jaundice ? 1 : 0, high_blood_pressure ? 1 : 0, heart_diseases ? 1 : 0, bleeding_disorders ? 1 : 0,
        hemophilia ? 1 : 0, allergy ? 1 : 0, anemia ? 1 : 0, fits ? 1 : 0, asthma_rs_disorders ? 1 : 0, thyroid ? 1 : 0,
        diabetes ? 1 : 0, kidney_diseases ? 1 : 0, pregnancy_lactating ? 1 : 0,
        previous_dental_history || '', diagnosis || '', treatment_plan || '',
        consent_agreed ? 1 : 0, patient_signature || '', dentist_signature || '',
      ]
    );

    const patientId = result.lastInsertRowid;

    // Mark link as used if remote
    if (submission_method === 'remote' && link_token) {
      await execute(
        "UPDATE registration_links SET used_at = datetime('now'), patient_id = ? WHERE token = ?",
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
