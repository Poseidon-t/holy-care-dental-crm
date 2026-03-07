import { NextRequest, NextResponse } from 'next/server';
import { queryOne, getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { patient_id, treatments, signature } = body;

    if (!patient_id || !treatments || !Array.isArray(treatments) || treatments.length === 0) {
      return NextResponse.json(
        { error: 'Patient ID and at least one treatment entry are required' },
        { status: 400 }
      );
    }

    // Verify patient exists
    const patient = await queryOne<{ id: number }>(
      'SELECT id FROM patients WHERE id = ?',
      [patient_id]
    );
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Use transaction for batch insert
    const db = getDb();
    const insertTreatment = db.prepare(
      'INSERT INTO treatments (patient_id, appointment_date, description, amount, amount_paid, signature) VALUES (?, ?, ?, ?, ?, ?)'
    );

    const insertMany = db.transaction((entries: Array<{ appointment_date: string; description: string; amount: number; amount_paid?: number }>) => {
      for (const entry of entries) {
        insertTreatment.run(patient_id, entry.appointment_date, entry.description, entry.amount || 0, entry.amount_paid || 0, signature || '');
      }
    });

    insertMany(treatments);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Create treatment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
