import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = getDb();

    const link = db.prepare(
      'SELECT * FROM registration_links WHERE token = ? AND used_at IS NULL'
    ).get(token) as { id: number; token: string; created_at: string } | undefined;

    if (!link) {
      return NextResponse.json(
        { valid: false, error: 'This registration link is invalid or has already been used' },
        { status: 404 }
      );
    }

    return NextResponse.json({ valid: true, token: link.token });
  } catch (error) {
    console.error('Validate link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
