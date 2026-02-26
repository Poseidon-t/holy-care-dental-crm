import Database from 'better-sqlite3';
import { scryptSync, randomBytes } from 'crypto';
import path from 'path';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'holycare.db');

console.log(`📂 Database path: ${DB_PATH}`);

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function migrate() {
  console.log('🔄 Running Holy Care database migration...\n');

  // ─── Create Tables ───

  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL DEFAULT 'Admin',
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  console.log('✓ admin_users table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      op_number INTEGER NOT NULL,
      invoice_number INTEGER NOT NULL,
      xray_id_number INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      submission_method TEXT NOT NULL DEFAULT 'tablet',
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      sex TEXT NOT NULL,
      address TEXT,
      phone TEXT NOT NULL,
      occupation TEXT,
      chief_complaint TEXT,
      jaundice INTEGER NOT NULL DEFAULT 0,
      high_blood_pressure INTEGER NOT NULL DEFAULT 0,
      heart_diseases INTEGER NOT NULL DEFAULT 0,
      bleeding_disorders INTEGER NOT NULL DEFAULT 0,
      hemophilia INTEGER NOT NULL DEFAULT 0,
      allergy INTEGER NOT NULL DEFAULT 0,
      anemia INTEGER NOT NULL DEFAULT 0,
      fits INTEGER NOT NULL DEFAULT 0,
      asthma_rs_disorders INTEGER NOT NULL DEFAULT 0,
      thyroid INTEGER NOT NULL DEFAULT 0,
      diabetes INTEGER NOT NULL DEFAULT 0,
      kidney_diseases INTEGER NOT NULL DEFAULT 0,
      pregnancy_lactating INTEGER NOT NULL DEFAULT 0,
      previous_dental_history TEXT,
      diagnosis TEXT,
      treatment_plan TEXT,
      consent_agreed INTEGER NOT NULL DEFAULT 0,
      patient_signature TEXT,
      dentist_signature TEXT
    )
  `);
  console.log('✓ patients table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      appointment_date TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      signature TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  console.log('✓ treatments table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS registration_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      used_at TEXT,
      patient_id INTEGER REFERENCES patients(id)
    )
  `);
  console.log('✓ registration_links table ready');

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  console.log('✓ settings table ready');

  // ─── Create indexes ───
  db.exec('CREATE INDEX IF NOT EXISTS idx_patients_op ON patients(op_number)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_treatments_patient ON treatments(patient_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_registration_links_token ON registration_links(token)');
  console.log('✓ indexes ready');

  // ─── Seed admin user (if none exist) ───
  const userCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
  if (userCount.count === 0) {
    const adminUsername = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.log('\n⚠ No admin users exist. Set ADMIN_EMAIL and ADMIN_PASSWORD env vars to create the first admin.');
    } else {
      const passwordHash = hashPassword(adminPassword);

      db.prepare(
        `INSERT INTO admin_users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)`
      ).run(adminUsername, passwordHash, 'Dr. Pinky Vijay', 'admin');

      // Seed default theme
      db.prepare(
        `INSERT OR IGNORE INTO settings (key, value) VALUES ('theme', 'classic')`
      ).run();

      console.log(`\n✅ Admin user created:`);
      console.log(`   Username: ${adminUsername}`);
      console.log(`   Use the password you set in ADMIN_PASSWORD`);
    }
  } else {
    console.log(`\n✓ ${userCount.count} admin user(s) already exist, skipping seed.`);
  }

  console.log('\n✅ Migration complete!');
  db.close();
}

try {
  migrate();
} catch (err) {
  console.error('Migration failed:', err);
  process.exit(1);
}
