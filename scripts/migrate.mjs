import pg from 'pg';
import { scryptSync, randomBytes } from 'crypto';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function migrate() {
  console.log('🔄 Running ClinicFlow database migration...\n');

  // Enable UUID extension
  await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  // ─── Create Tables ───

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clinics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      doctor_name VARCHAR(255),
      specialization VARCHAR(255),
      registration_number VARCHAR(100),
      phone VARCHAR(20),
      email VARCHAR(255),
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(100),
      pincode VARCHAR(10),
      logo_url TEXT,
      plan VARCHAR(20) NOT NULL DEFAULT 'free',
      patient_limit INT NOT NULL DEFAULT 50,
      razorpay_subscription_id VARCHAR(255),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Add razorpay_subscription_id if it doesn't exist (for existing DBs)
  await pool.query(`
    ALTER TABLE clinics ADD COLUMN IF NOT EXISTS razorpay_subscription_id VARCHAR(255)
  `).catch(() => {});

  console.log('✓ clinics table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'admin',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  console.log('✓ users table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
      op_number INT NOT NULL,
      invoice_number INT NOT NULL,
      xray_id_number INT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      submission_method VARCHAR(20) NOT NULL DEFAULT 'tablet',
      name VARCHAR(255) NOT NULL,
      age INT NOT NULL,
      sex VARCHAR(10) NOT NULL,
      address TEXT,
      phone VARCHAR(20) NOT NULL,
      occupation VARCHAR(255),
      chief_complaint TEXT,
      jaundice BOOLEAN NOT NULL DEFAULT FALSE,
      high_blood_pressure BOOLEAN NOT NULL DEFAULT FALSE,
      heart_diseases BOOLEAN NOT NULL DEFAULT FALSE,
      bleeding_disorders BOOLEAN NOT NULL DEFAULT FALSE,
      hemophilia BOOLEAN NOT NULL DEFAULT FALSE,
      allergy BOOLEAN NOT NULL DEFAULT FALSE,
      anemia BOOLEAN NOT NULL DEFAULT FALSE,
      fits BOOLEAN NOT NULL DEFAULT FALSE,
      asthma_rs_disorders BOOLEAN NOT NULL DEFAULT FALSE,
      thyroid BOOLEAN NOT NULL DEFAULT FALSE,
      diabetes BOOLEAN NOT NULL DEFAULT FALSE,
      kidney_diseases BOOLEAN NOT NULL DEFAULT FALSE,
      pregnancy_lactating BOOLEAN NOT NULL DEFAULT FALSE,
      previous_dental_history TEXT,
      diagnosis TEXT,
      treatment_plan TEXT,
      consent_agreed BOOLEAN NOT NULL DEFAULT FALSE,
      patient_signature TEXT,
      dentist_signature TEXT,
      UNIQUE(clinic_id, op_number)
    )
  `);
  console.log('✓ patients table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS treatments (
      id SERIAL PRIMARY KEY,
      clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
      patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      appointment_date DATE NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      signature TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  console.log('✓ treatments table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS registration_links (
      id SERIAL PRIMARY KEY,
      clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
      token VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      used_at TIMESTAMPTZ,
      patient_id INT REFERENCES patients(id)
    )
  `);
  console.log('✓ registration_links table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clinic_settings (
      clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
      key VARCHAR(100) NOT NULL,
      value TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (clinic_id, key)
    )
  `);
  console.log('✓ clinic_settings table ready');

  // ─── Create indexes ───
  await pool.query('CREATE INDEX IF NOT EXISTS idx_patients_clinic ON patients(clinic_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_treatments_clinic ON treatments(clinic_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_treatments_patient ON treatments(patient_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_users_clinic ON users(clinic_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_registration_links_clinic ON registration_links(clinic_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_registration_links_token ON registration_links(token)');
  console.log('✓ indexes ready');

  // ─── Seed Holy Care as first clinic (if no clinics exist) ───
  const { rows: clinics } = await pool.query('SELECT COUNT(*) as count FROM clinics');
  if (parseInt(clinics[0].count) === 0) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('\n⚠ No clinics exist. Set ADMIN_EMAIL and ADMIN_PASSWORD env vars to create the first clinic.');
    } else {
      const { rows: [clinic] } = await pool.query(
        `INSERT INTO clinics (name, slug, doctor_name, specialization, registration_number, phone, email, address, city, state, pincode, plan, patient_limit)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING id`,
        [
          'Holy Care Dental & Orthodontics Clinic',
          'holy-care',
          'Dr. Pinky Vijay',
          'MDS - Orthodontics & Dentofacial Orthopedics',
          'A-34195',
          '+917977257779',
          'holycareortho@gmail.com',
          '8/277, Rachel Enclave, Kavalkinaru Main Road, Kavalkinaru - 627105',
          'Kavalkinaru',
          'Tamil Nadu',
          '627105',
          'annual',  // Holy Care gets the paid plan
          999999,    // unlimited patients
        ]
      );

      const clinicId = clinic.id;
      const passwordHash = hashPassword(adminPassword);

      await pool.query(
        `INSERT INTO users (clinic_id, email, password_hash, full_name, role)
         VALUES ($1, $2, $3, $4, $5)`,
        [clinicId, adminEmail, passwordHash, 'Dr. Pinky Vijay', 'admin']
      );

      // Seed default theme
      await pool.query(
        `INSERT INTO clinic_settings (clinic_id, key, value) VALUES ($1, 'theme', 'classic')`,
        [clinicId]
      );

      console.log(`\n✅ First clinic created:`);
      console.log(`   Clinic: Holy Care Dental & Orthodontics Clinic`);
      console.log(`   ID: ${clinicId}`);
      console.log(`   Login: ${adminEmail}`);
      console.log(`   Plan: annual (unlimited patients)`);
    }
  } else {
    console.log(`\n✓ ${clinics[0].count} clinic(s) already exist, skipping seed.`);
  }

  console.log('\n✅ Migration complete!');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
