import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { execute, queryOne } from '@/lib/db';

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@clinicflow.in';

async function requireSuperAdmin() {
  const session = await getSession();
  if (!session) return null;
  if (session.email !== SUPER_ADMIN_EMAIL) return null;
  return session;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { plan, patient_limit } = body;

  const clinic = await queryOne('SELECT id FROM clinics WHERE id = $1', [id]);
  if (!clinic) {
    return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
  }

  const updates: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (plan && ['free', 'annual', 'custom'].includes(plan)) {
    updates.push(`plan = $${paramIndex++}`);
    values.push(plan);
  }

  if (patient_limit !== undefined) {
    updates.push(`patient_limit = $${paramIndex++}`);
    values.push(patient_limit);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  await execute(
    `UPDATE clinics SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
    values
  );

  return NextResponse.json({ success: true });
}
