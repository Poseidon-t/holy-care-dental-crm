import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute, formatOpNumber, formatInvoiceNumber, formatXrayId } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const patient = await queryOne<Record<string, unknown>>(
      'SELECT * FROM patients WHERE id = ?',
      [id]
    );

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const treatments = await query<Record<string, unknown>>(
      'SELECT * FROM treatments WHERE patient_id = ? ORDER BY appointment_date ASC',
      [id]
    );

    const totalBilling = treatments.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return NextResponse.json({
      patient: {
        ...patient,
        op_number_formatted: formatOpNumber(patient.op_number as number),
        invoice_number_formatted: formatInvoiceNumber(patient.invoice_number as number),
        xray_id_formatted: formatXrayId(patient.xray_id_number as number),
      },
      treatments,
      totalBilling,
    });
  } catch (error) {
    console.error('Get patient error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Allowed fields that can be updated via PATCH
const ALLOWED_FIELDS = new Set([
  'name', 'age', 'sex', 'address', 'phone', 'occupation', 'chief_complaint',
  'jaundice', 'high_blood_pressure', 'heart_diseases', 'bleeding_disorders',
  'hemophilia', 'allergy', 'anemia', 'fits', 'asthma_rs_disorders', 'thyroid',
  'diabetes', 'kidney_diseases', 'pregnancy_lactating',
  'previous_dental_history', 'diagnosis', 'treatment_plan',
  'dentist_signature',
]);

const BOOLEAN_FIELDS = new Set([
  'jaundice', 'high_blood_pressure', 'heart_diseases', 'bleeding_disorders',
  'hemophilia', 'allergy', 'anemia', 'fits', 'asthma_rs_disorders', 'thyroid',
  'diabetes', 'kidney_diseases', 'pregnancy_lactating',
]);

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const patient = await queryOne<{ id: number }>(
      'SELECT id FROM patients WHERE id = ?',
      [id]
    );
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    await execute('DELETE FROM treatments WHERE patient_id = ?', [id]);
    await execute('DELETE FROM patients WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete patient error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const patient = await queryOne<{ id: number }>(
      'SELECT id FROM patients WHERE id = ?',
      [id]
    );
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Build dynamic update query from allowed fields
    const setClauses: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.has(key)) continue;

      if (BOOLEAN_FIELDS.has(key)) {
        setClauses.push(`${key} = ?`);
        values.push(value ? 1 : 0);
      } else if (key === 'age') {
        const parsed = Math.max(0, Math.min(150, Math.floor(Number(value))));
        setClauses.push(`${key} = ?`);
        values.push(parsed);
      } else {
        const trimmed = String(value ?? '').trim().slice(0, key === 'dentist_signature' ? 2 * 1024 * 1024 : 2000);
        setClauses.push(`${key} = ?`);
        values.push(trimmed);
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    values.push(id);
    await execute(
      `UPDATE patients SET ${setClauses.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update patient error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
