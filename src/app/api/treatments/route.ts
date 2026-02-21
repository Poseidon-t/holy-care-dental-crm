import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const { patient_id, treatments, signature } = body;

    if (!patient_id || !treatments || !Array.isArray(treatments) || treatments.length === 0) {
      return NextResponse.json(
        { error: 'Patient ID and at least one treatment entry are required' },
        { status: 400 }
      );
    }

    // Verify patient exists
    const patient = db.prepare('SELECT id FROM patients WHERE id = ?').get(patient_id);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const insertStmt = db.prepare(
      'INSERT INTO treatments (patient_id, appointment_date, description, amount, signature) VALUES (?, ?, ?, ?, ?)'
    );

    const insertMany = db.transaction((entries: Array<{ appointment_date: string; description: string; amount: number }>) => {
      for (const entry of entries) {
        insertStmt.run(
          patient_id,
          entry.appointment_date,
          entry.description,
          entry.amount || 0,
          signature || ''
        );
      }
    });

    insertMany(treatments);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Create treatment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
