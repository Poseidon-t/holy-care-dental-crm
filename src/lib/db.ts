import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync } from 'fs';
import { scryptSync, randomBytes } from 'crypto';

// ─── Database Connection ───

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'holycare.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    // Ensure the data directory exists (Railway has ephemeral filesystem)
    mkdirSync(path.dirname(DB_PATH), { recursive: true });
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('synchronous = FULL');
    _db.pragma('busy_timeout = 5000');
    _db.pragma('foreign_keys = ON');
    initDb(_db);
  }
  return _db;
}

function seedAdmin(db: Database.Database) {
  const count = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (count.count > 0) return;
  const password = process.env.ADMIN_PASSWORD || 'holycareortho2026';
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  const passwordHash = `${salt}:${hash}`;
  db.prepare(
    'INSERT INTO admin_users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)'
  ).run('holycareortho@gmail.com', passwordHash, 'Holy Care Admin', 'admin');
}

function initDb(db: Database.Database) {
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

  db.exec(`
    CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      appointment_date TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      amount_paid REAL NOT NULL DEFAULT 0,
      signature TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Add amount_paid column to existing tables that don't have it
  try {
    db.exec('ALTER TABLE treatments ADD COLUMN amount_paid REAL NOT NULL DEFAULT 0');
  } catch {
    // Column already exists
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS registration_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL DEFAULT (datetime('now', '+24 hours')),
      used_at TEXT,
      patient_id INTEGER REFERENCES patients(id)
    )
  `);

  // Add expires_at column to existing tables that don't have it
  try {
    db.exec(`ALTER TABLE registration_links ADD COLUMN expires_at TEXT NOT NULL DEFAULT (datetime('now', '+24 hours'))`);
  } catch {
    // Column already exists
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create indexes
  db.exec('CREATE INDEX IF NOT EXISTS idx_patients_op ON patients(op_number)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_treatments_patient ON treatments(patient_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_registration_links_token ON registration_links(token)');

  // Seed default admin if none exist
  seedAdmin(db);
}

// ─── Query Helpers (async-compatible wrappers) ───

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const db = getDb();
  return db.prepare(text).all(...(params || [])) as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const db = getDb();
  const row = db.prepare(text).get(...(params || []));
  return (row as T) ?? null;
}

export async function execute(
  text: string,
  params?: unknown[]
): Promise<{ rowCount: number; rows: Record<string, unknown>[]; lastInsertRowid: number }> {
  const db = getDb();
  const result = db.prepare(text).run(...(params || []));
  return {
    rowCount: result.changes,
    rows: [],
    lastInsertRowid: Number(result.lastInsertRowid),
  };
}

// ─── Types ───

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  doctor_name: string | null;
  specialization: string | null;
  registration_number: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  full_name: string;
  role: string;
  created_at: string;
}

// ─── User Functions ───

export async function getUserByEmail(login: string): Promise<User | null> {
  return queryOne<User>('SELECT * FROM admin_users WHERE username = ?', [login]);
}

// ─── Clinic Functions (hardcoded for single-tenant) ───

const HARDCODED_CLINIC: Clinic = {
  id: 'single-tenant',
  name: 'Holy Care Dental & Orthodontics Clinic',
  slug: 'holy-care',
  doctor_name: 'Dr. Pinky Vijay',
  specialization: 'MDS - Orthodontics & Dentofacial Orthopedics',
  registration_number: 'A-34195',
  phone: '+917977257779',
  email: 'holycareortho@gmail.com',
  address: '8/277, Rachel Enclave, Kavalkinaru Main Road, Kavalkinaru - 627105',
  city: 'Kavalkinaru',
  state: 'Tamil Nadu',
  pincode: '627105',
  logo_url: null,
  created_at: '',
  updated_at: '',
};

export async function getClinic(): Promise<Clinic> {
  return HARDCODED_CLINIC;
}

export async function getClinicBySlug(): Promise<Clinic> {
  return HARDCODED_CLINIC;
}

// ─── Patient Helpers ───

export async function getNextNumbers(): Promise<{ opNumber: number; invoiceNumber: number; xrayIdNumber: number }> {
  const result = getDb().prepare('SELECT COALESCE(MAX(op_number), 0) + 1 as next FROM patients').get() as { next: number } | undefined;
  const next = result?.next ?? 1;
  return { opNumber: next, invoiceNumber: next, xrayIdNumber: next };
}

// ─── Settings Functions ───

export async function getSetting(_clinicId: string, key: string): Promise<string | null> {
  const row = await queryOne<{ value: string }>('SELECT value FROM settings WHERE key = ?', [key]);
  return row?.value ?? null;
}

export async function setSetting(_clinicId: string, key: string, value: string): Promise<void> {
  const db = getDb();
  db.prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT (key) DO UPDATE SET value = ?, updated_at = datetime('now')`
  ).run(key, value, value);
}

// ─── Format Helpers (sync) ───

export function formatOpNumber(num: number): string {
  return `OP-${String(num).padStart(3, '0')}`;
}

export function formatInvoiceNumber(num: number): string {
  return `INV-${String(num).padStart(3, '0')}`;
}

export function formatXrayId(num: number): string {
  return `XRAY-${String(num).padStart(3, '0')}`;
}
