import { NextRequest, NextResponse } from 'next/server';
import { getDb, formatOpNumber, formatInvoiceNumber, formatXrayId } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(id) as Record<string, unknown> | undefined;

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const treatments = db.prepare(
      'SELECT * FROM treatments WHERE patient_id = ? ORDER BY appointment_date ASC'
    ).all(id) as Array<Record<string, unknown>>;

    const totalBilling = treatments.reduce((sum: number, t: Record<string, unknown>) => sum + (t.amount as number || 0), 0);

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

    const db = getDb();

    const patient = db.prepare('SELECT id FROM patients WHERE id = ?').get(id);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    db.prepare(
      'UPDATE patients SET dentist_signature = ? WHERE id = ?'
    ).run(dentist_signature, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update dentist signature error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
