import { NextRequest, NextResponse } from 'next/server';
import { queryOne, pool } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clinicId } = session;
    const body = await request.json();
    const { patient_id, treatments, signature } = body;

    if (!patient_id || !treatments || !Array.isArray(treatments) || treatments.length === 0) {
      return NextResponse.json(
        { error: 'Patient ID and at least one treatment entry are required' },
        { status: 400 }
      );
    }

    // Verify patient exists and belongs to this clinic
    const patient = await queryOne<{ id: number }>(
      'SELECT id FROM patients WHERE id = $1 AND clinic_id = $2',
      [patient_id, clinicId]
    );
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Use transaction for batch insert
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const entry of treatments as Array<{ appointment_date: string; description: string; amount: number }>) {
        await client.query(
          'INSERT INTO treatments (clinic_id, patient_id, appointment_date, description, amount, signature) VALUES ($1, $2, $3, $4, $5, $6)',
          [clinicId, patient_id, entry.appointment_date, entry.description, entry.amount || 0, signature || '']
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Create treatment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
