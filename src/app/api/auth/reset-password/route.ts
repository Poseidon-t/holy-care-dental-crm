import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { master_key, new_password } = await request.json();

    if (!master_key || !new_password) {
      return NextResponse.json(
        { error: 'Master key and new password are required' },
        { status: 400 }
      );
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Verify master key matches ADMIN_PASSWORD env var
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || master_key !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid master key' },
        { status: 401 }
      );
    }

    // Update the admin user's password
    const db = getDb();
    const newHash = hashPassword(new_password);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(newHash, 'admin');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
