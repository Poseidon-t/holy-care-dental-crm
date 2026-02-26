import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { randomBytes } from 'crypto';

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = randomBytes(24).toString('hex');

    await execute(
      'INSERT INTO registration_links (token) VALUES (?)',
      [token]
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const link = `${appUrl}/register/${token}`;

    return NextResponse.json({ success: true, token, link });
  } catch (error) {
    console.error('Generate link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
