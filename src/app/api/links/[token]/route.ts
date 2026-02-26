import { NextRequest, NextResponse } from 'next/server';
import { queryOne, getClinic } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const link = await queryOne<{ id: number; token: string; created_at: string }>(
      'SELECT * FROM registration_links WHERE token = ? AND used_at IS NULL',
      [token]
    );

    if (!link) {
      return NextResponse.json(
        { valid: false, error: 'This registration link is invalid or has already been used' },
        { status: 404 }
      );
    }

    const clinic = await getClinic();

    return NextResponse.json({
      valid: true,
      token: link.token,
      clinicId: 'single-tenant',
      clinic: {
        name: clinic.name,
        doctor_name: clinic.doctor_name,
        specialization: clinic.specialization,
        registration_number: clinic.registration_number,
        phone: clinic.phone,
        address: clinic.address,
        logo_url: clinic.logo_url,
      },
    });
  } catch (error) {
    console.error('Validate link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
