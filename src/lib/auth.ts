import { SignJWT, jwtVerify } from 'jose';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const COOKIE_NAME = 'holycare_session';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const hashBuffer = Buffer.from(hash, 'hex');
  const testHash = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuffer, testHash);
}

export async function createToken(payload: { userId: number; username: string; fullName: string }): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<{ userId: number; username: string; fullName: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as { userId: number; username: string; fullName: string };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ userId: number; username: string; fullName: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export { COOKIE_NAME };
