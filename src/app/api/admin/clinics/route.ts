import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@clinicflow.in';

async function requireSuperAdmin() {
  const session = await getSession();
  if (!session) return null;
  if (session.email !== SUPER_ADMIN_EMAIL) return null;
  return session;
}

interface ClinicRow {
  id: string;
  name: string;
  slug: string;
  doctor_name: string | null;
  email: string | null;
  phone: string | null;
  plan: string;
  patient_limit: number;
  patient_count: string;
  created_at: Date;
}

export async function GET() {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const clinics = await query<ClinicRow>(
    `SELECT c.*,
            COALESCE(p.cnt, 0) as patient_count
     FROM clinics c
     LEFT JOIN (
       SELECT clinic_id, COUNT(*) as cnt FROM patients GROUP BY clinic_id
     ) p ON p.clinic_id = c.id
     ORDER BY c.created_at DESC`
  );

  const stats = {
    totalClinics: clinics.length,
    freeClinics: clinics.filter(c => c.plan === 'free').length,
    paidClinics: clinics.filter(c => c.plan === 'annual' || c.plan === 'custom').length,
    totalPatients: clinics.reduce((sum, c) => sum + parseInt(String(c.patient_count), 10), 0),
  };

  return NextResponse.json({ clinics, stats });
}
