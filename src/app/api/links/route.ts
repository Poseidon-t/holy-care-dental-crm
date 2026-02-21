import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomBytes } from 'crypto';

export async function POST() {
  try {
    const db = getDb();
    const token = randomBytes(24).toString('hex');

    db.prepare('INSERT INTO registration_links (token) VALUES (?)').run(token);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const link = `${appUrl}/register/${token}`;

    return NextResponse.json({ success: true, token, link });
  } catch (error) {
    console.error('Generate link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
