import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import Database from 'better-sqlite3';
import { existsSync } from 'fs';

export async function POST() {
  const dbPath = process.env.DATABASE_PATH || '/app/data/holycare.db';

  // Check if SQLite file exists
  if (!existsSync(dbPath)) {
    return NextResponse.json({
      error: 'SQLite database not found',
      path: dbPath,
      hint: 'The old SQLite database file does not exist at this path.',
    }, { status: 404 });
  }

  try {
    const sqlite = new Database(dbPath, { readonly: true });

    // Get clinic ID from PostgreSQL
    const { rows: clinics } = await pool.query('SELECT id FROM clinics LIMIT 1');
    if (clinics.length === 0) {
      return NextResponse.json({ error: 'No clinic found in PostgreSQL' }, { status: 400 });
    }
    const clinicId = clinics[0].id;

    // Check how many patients already exist in PostgreSQL
    const { rows: pgCount } = await pool.query('SELECT COUNT(*) as count FROM patients WHERE clinic_id = $1', [clinicId]);
    const existingPgPatients = parseInt(pgCount[0].count);

    // Read patients from SQLite
    const sqlitePatients = sqlite.prepare('SELECT * FROM patients ORDER BY id').all() as Record<string, unknown>[];

    // Read treatments from SQLite
    const sqliteTreatments = sqlite.prepare('SELECT * FROM treatments ORDER BY id').all() as Record<string, unknown>[];

    if (sqlitePatients.length === 0) {
      sqlite.close();
      return NextResponse.json({
        message: 'No patients found in SQLite database',
        pg_existing: existingPgPatients,
      });
    }

    // If PostgreSQL already has patients, skip to avoid duplicates
    if (existingPgPatients > 0) {
      sqlite.close();
      return NextResponse.json({
        message: `PostgreSQL already has ${existingPgPatients} patients. Skipping migration to avoid duplicates.`,
        sqlite_patients: sqlitePatients.length,
        sqlite_treatments: sqliteTreatments.length,
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let patientsMigrated = 0;
      let treatmentsMigrated = 0;
      const oldIdToNewId: Record<number, number> = {};

      // Migrate patients
      for (const p of sqlitePatients) {
        const result = await client.query(
          `INSERT INTO patients (
            clinic_id, op_number, invoice_number, xray_id_number,
            created_at, submission_method, name, age, sex, address, phone, occupation,
            chief_complaint, jaundice, high_blood_pressure, heart_diseases,
            bleeding_disorders, hemophilia, allergy, anemia, fits,
            asthma_rs_disorders, thyroid, diabetes, kidney_diseases,
            pregnancy_lactating, previous_dental_history, diagnosis,
            treatment_plan, consent_agreed, patient_signature, dentist_signature
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25,
            $26, $27, $28, $29, $30, $31, $32
          ) RETURNING id`,
          [
            clinicId,
            p.op_number,
            p.invoice_number || p.op_number,
            p.xray_id_number || p.op_number,
            p.created_at || new Date().toISOString(),
            p.submission_method || 'tablet',
            p.name,
            p.age || 0,
            p.sex || 'Other',
            p.address || '',
            p.phone || '',
            p.occupation || '',
            p.chief_complaint || '',
            p.jaundice ? true : false,
            p.high_blood_pressure ? true : false,
            p.heart_diseases ? true : false,
            p.bleeding_disorders ? true : false,
            p.hemophilia ? true : false,
            p.allergy ? true : false,
            p.anemia ? true : false,
            p.fits ? true : false,
            p.asthma_rs_disorders ? true : false,
            p.thyroid ? true : false,
            p.diabetes ? true : false,
            p.kidney_diseases ? true : false,
            p.pregnancy_lactating ? true : false,
            p.previous_dental_history || '',
            p.diagnosis || '',
            p.treatment_plan || '',
            p.consent_agreed ? true : false,
            p.patient_signature || '',
            p.dentist_signature || '',
          ]
        );
        oldIdToNewId[p.id as number] = result.rows[0].id;
        patientsMigrated++;
      }

      // Migrate treatments
      for (const t of sqliteTreatments) {
        const newPatientId = oldIdToNewId[t.patient_id as number];
        if (!newPatientId) continue;

        await client.query(
          `INSERT INTO treatments (clinic_id, patient_id, appointment_date, description, amount, signature, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            clinicId,
            newPatientId,
            t.appointment_date || new Date().toISOString().split('T')[0],
            t.description || '',
            t.amount || 0,
            t.signature || '',
            t.created_at || new Date().toISOString(),
          ]
        );
        treatmentsMigrated++;
      }

      await client.query('COMMIT');

      sqlite.close();

      return NextResponse.json({
        success: true,
        patients_migrated: patientsMigrated,
        treatments_migrated: treatmentsMigrated,
        message: `Successfully migrated ${patientsMigrated} patients and ${treatmentsMigrated} treatments from SQLite to PostgreSQL.`,
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
