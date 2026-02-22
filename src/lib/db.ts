import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { hashPassword } from './auth';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'holycare.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      op_number INTEGER UNIQUE NOT NULL,
      invoice_number INTEGER UNIQUE NOT NULL,
      xray_id_number INTEGER UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      submission_method TEXT NOT NULL DEFAULT 'tablet' CHECK(submission_method IN ('tablet', 'remote')),
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      sex TEXT NOT NULL CHECK(sex IN ('Male', 'Female', 'Other')),
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
    );

    CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      appointment_date TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      signature TEXT,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS registration_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      used_at TEXT,
      patient_id INTEGER,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed default theme
  db.prepare("INSERT OR IGNORE INTO site_settings (key, value) VALUES ('theme', 'classic')").run();

  // Seed admin user if none exists
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (adminCount.count === 0) {
    const hash = hashPassword('holycare2026');
    db.prepare('INSERT INTO admin_users (username, password_hash, full_name) VALUES (?, ?, ?)').run(
      'admin',
      hash,
      'Dr. Pinky Vijay'
    );
  }

  // Seed sample patients if none exist
  const patientCount = db.prepare('SELECT COUNT(*) as count FROM patients').get() as { count: number };
  if (patientCount.count === 0) {
    seedSampleData(db);
  }
}

function seedSampleData(db: Database.Database) {
  const insertPatient = db.prepare(`
    INSERT INTO patients (
      op_number, invoice_number, xray_id_number, created_at, submission_method,
      name, age, sex, address, phone, occupation, chief_complaint,
      jaundice, high_blood_pressure, heart_diseases, bleeding_disorders,
      hemophilia, allergy, anemia, fits, asthma_rs_disorders, thyroid,
      diabetes, kidney_diseases, pregnancy_lactating,
      previous_dental_history, diagnosis, treatment_plan, consent_agreed
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, 1
    )
  `);

  const insertTreatment = db.prepare(`
    INSERT INTO treatments (patient_id, appointment_date, description, amount)
    VALUES (?, ?, ?, ?)
  `);

  // Patient 1
  insertPatient.run(
    1, 1, 1, '2026-02-15 09:30:00', 'tablet',
    'Rajesh Kumar', 35, 'Male', '12/5, Gandhi Nagar, Kavalkinaru - 627105', '9876543210', 'Teacher',
    'Tooth pain in lower right molar for 2 weeks',
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    'Root canal treatment done 3 years ago on upper left molar',
    'Dental caries in 46, Periapical abscess',
    'Root canal treatment followed by crown placement'
  );

  insertTreatment.run(1, '2026-02-15', 'Initial examination and X-ray', 500);
  insertTreatment.run(1, '2026-02-17', 'Root canal treatment - Session 1', 3000);
  insertTreatment.run(1, '2026-02-19', 'Root canal treatment - Session 2 and filling', 2500);

  // Patient 2
  insertPatient.run(
    2, 2, 2, '2026-02-16 10:15:00', 'tablet',
    'Lakshmi Devi', 28, 'Female', '45, Nehru Street, Nagercoil - 629001', '8765432109', 'Homemaker',
    'Irregular teeth alignment, wants braces',
    0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    'No previous dental treatment',
    'Class II malocclusion with crowding',
    'Fixed orthodontic treatment - 18 months estimated'
  );

  insertTreatment.run(2, '2026-02-16', 'Orthodontic consultation and records', 1000);
  insertTreatment.run(2, '2026-02-18', 'Upper arch banding and bonding', 15000);

  // Patient 3
  insertPatient.run(
    3, 3, 3, '2026-02-18 14:00:00', 'remote',
    'Mohammed Farooq', 52, 'Male', '78/2, Anna Nagar, Marthandam - 629165', '7654321098', 'Business',
    'Loose teeth and bleeding gums',
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    'Scaling done 1 year ago at another clinic',
    'Generalized chronic periodontitis with Grade II mobility in 31, 41',
    'Full mouth scaling and root planing, Splinting of mobile teeth, Follow-up every 3 months'
  );

  insertTreatment.run(3, '2026-02-18', 'Full mouth examination and OPG X-ray', 800);
  insertTreatment.run(3, '2026-02-19', 'Full mouth scaling - Session 1 (Upper arch)', 2000);
  insertTreatment.run(3, '2026-02-20', 'Full mouth scaling - Session 2 (Lower arch)', 2000);
}

export function getNextNumbers(): { opNumber: number; invoiceNumber: number; xrayIdNumber: number } {
  const result = getDb().prepare(
    'SELECT COALESCE(MAX(op_number), 0) + 1 as next FROM patients'
  ).get() as { next: number };

  return {
    opNumber: result.next,
    invoiceNumber: result.next,
    xrayIdNumber: result.next,
  };
}

export function formatOpNumber(num: number): string {
  return `OP-${String(num).padStart(3, '0')}`;
}

export function formatInvoiceNumber(num: number): string {
  return `INV-${String(num).padStart(3, '0')}`;
}

export function formatXrayId(num: number): string {
  return `XRAY-${String(num).padStart(3, '0')}`;
}

export function getSetting(key: string): string | null {
  const row = getDb().prepare('SELECT value FROM site_settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string): void {
  getDb().prepare(
    "INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')"
  ).run(key, value, value);
}
