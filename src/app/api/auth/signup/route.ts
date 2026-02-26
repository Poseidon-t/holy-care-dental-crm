import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { createToken, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, clinicName, password } = await request.json();

    // Validation
    if (!name?.trim() || !email?.trim() || !clinicName?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [emailLower]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Generate slug from clinic name
    let slug = clinicName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slugCheck = await pool.query('SELECT id FROM clinics WHERE slug = $1', [slug]);
    if (slugCheck.rows.length > 0) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Create clinic and user in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create clinic
      const clinicResult = await client.query(
        `INSERT INTO clinics (name, slug, phone, email, plan, patient_limit)
         VALUES ($1, $2, $3, $4, 'free', 50)
         RETURNING id`,
        [clinicName.trim(), slug, phone?.trim() || null, emailLower]
      );
      const clinicId = clinicResult.rows[0].id;

      // Hash password and create user
      const passwordHash = hashPassword(password);
      const userResult = await client.query(
        `INSERT INTO users (clinic_id, email, password_hash, full_name, role)
         VALUES ($1, $2, $3, $4, 'admin')
         RETURNING id`,
        [clinicId, emailLower, passwordHash, name.trim()]
      );
      const userId = userResult.rows[0].id;

      await client.query('COMMIT');

      // Create JWT token
      const token = await createToken({
        userId,
        clinicId,
        email: emailLower,
        fullName: name.trim(),
      });

      const response = NextResponse.json({
        success: true,
        clinicId,
        needsSetup: true,
      });

      response.cookies.set('holycare_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
