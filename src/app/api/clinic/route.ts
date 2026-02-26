import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getClinic, execute } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clinic = await getClinic(session.clinicId);
    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    return NextResponse.json({ clinic });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const allowedFields = [
      'name', 'doctor_name', 'specialization', 'registration_number',
      'phone', 'email', 'address', 'city', 'state', 'pincode', 'logo_url',
    ];

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (field in body) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(body[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(session.clinicId);

    await execute(
      `UPDATE clinics SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    const clinic = await getClinic(session.clinicId);
    return NextResponse.json({ clinic });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
