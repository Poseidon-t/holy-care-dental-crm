import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword, createToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as {
      id: number;
      username: string;
      password_hash: string;
      full_name: string;
    } | undefined;

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: user.id,
      username: user.username,
      fullName: user.full_name,
    });

    const response = NextResponse.json({
      user: { id: user.id, username: user.username, fullName: user.full_name },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
