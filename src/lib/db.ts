import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// ─── Query Helpers ───

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const result = await pool.query(text, params);
  return (result.rows[0] as T) ?? null;
}

export async function execute(
  text: string,
  params?: unknown[]
): Promise<{ rowCount: number; rows: Record<string, unknown>[] }> {
  const result = await pool.query(text, params);
  return { rowCount: result.rowCount ?? 0, rows: result.rows };
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
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  clinic_id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  created_at: Date;
}

// ─── Clinic Functions ───

export async function getClinic(clinicId: string): Promise<Clinic | null> {
  return queryOne<Clinic>('SELECT * FROM clinics WHERE id = $1', [clinicId]);
}

export async function getClinicBySlug(slug: string): Promise<Clinic | null> {
  return queryOne<Clinic>('SELECT * FROM clinics WHERE slug = $1', [slug]);
}

// ─── User Functions ───

export async function getUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>('SELECT * FROM users WHERE email = $1', [email]);
}

// ─── Patient Helpers ───

export async function getNextNumbers(clinicId: string): Promise<{ opNumber: number; invoiceNumber: number; xrayIdNumber: number }> {
  const result = await queryOne<{ next: string }>(
    'SELECT COALESCE(MAX(op_number), 0) + 1 as next FROM patients WHERE clinic_id = $1',
    [clinicId]
  );
  const next = parseInt(result?.next ?? '1', 10);
  return { opNumber: next, invoiceNumber: next, xrayIdNumber: next };
}

// ─── Settings Functions ───

export async function getSetting(clinicId: string, key: string): Promise<string | null> {
  const row = await queryOne<{ value: string }>(
    'SELECT value FROM clinic_settings WHERE clinic_id = $1 AND key = $2',
    [clinicId, key]
  );
  return row?.value ?? null;
}

export async function setSetting(clinicId: string, key: string, value: string): Promise<void> {
  await execute(
    `INSERT INTO clinic_settings (clinic_id, key, value, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (clinic_id, key) DO UPDATE SET value = $3, updated_at = NOW()`,
    [clinicId, key, value]
  );
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

// ─── Pool export (for transactions) ───

export { pool };
