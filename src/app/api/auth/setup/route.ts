import { NextResponse } from 'next/server';
import { query, queryOne, execute, pool } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: 'ADMIN_EMAIL and ADMIN_PASSWORD env vars required' }, { status: 400 });
    }

    // Check existing users
    const users = await query<{ id: string; email: string; full_name: string; clinic_id: string }>(
      'SELECT id, email, full_name, clinic_id FROM users LIMIT 10'
    );

    // Check existing clinics
    const clinics = await query<{ id: string; name: string; slug: string }>(
      'SELECT id, name, slug FROM clinics LIMIT 10'
    );

    let clinicId: string;

    if (clinics.length === 0) {
      // Create the clinic
      const result = await pool.query(
        `INSERT INTO clinics (name, slug, doctor_name, specialization, registration_number, phone, email, address, city, state, pincode)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [
          'Holy Care Dental & Orthodontics Clinic',
          'holy-care',
          'Dr. Pinky Vijay',
          'MDS - Orthodontics & Dentofacial Orthopedics',
          'A-34195',
          '+917977257779',
          'holycareortho@gmail.com',
          '8/277, Rachel Enclave, Kavalkinaru Main Road, Kavalkinaru - 627105',
          'Kavalkinaru',
          'Tamil Nadu',
          '627105',
        ]
      );
      clinicId = result.rows[0].id;
    } else {
      clinicId = clinics[0].id;
    }

    // Check if user exists
    const existingUser = await queryOne<{ id: string; email: string }>(
      'SELECT id, email FROM users WHERE email = $1',
      [adminEmail]
    );

    const passwordHash = hashPassword(adminPassword);

    if (existingUser) {
      // Update password
      await execute(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [passwordHash, existingUser.id]
      );
      return NextResponse.json({
        action: 'password_reset',
        email: adminEmail,
        message: 'Password has been reset. Use this email and password to login.',
        clinics_found: clinics.length,
        users_found: users.length,
      });
    } else {
      // Create user
      await execute(
        'INSERT INTO users (clinic_id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5)',
        [clinicId, adminEmail, passwordHash, 'Dr. Pinky Vijay', 'admin']
      );
      return NextResponse.json({
        action: 'user_created',
        email: adminEmail,
        message: 'Admin user created. Use this email and password to login.',
        clinics_found: clinics.length,
        users_found: users.length,
      });
    }
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
