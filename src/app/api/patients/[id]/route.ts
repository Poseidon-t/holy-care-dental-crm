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
    const { dentist_signature } = body;

    if (!dentist_signature) {
      return NextResponse.json({ error: 'Dentist signature is required' }, { status: 400 });
    }

    const patient = await queryOne<{ id: number }>(
      'SELECT id FROM patients WHERE id = ?',
      [id]
    );
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    await execute(
      'UPDATE patients SET dentist_signature = ? WHERE id = ?',
      [dentist_signature, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update dentist signature error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
