import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'holycare-dental-default-secret'
);

const publicPaths = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/patients',
  '/api/links/',
];

function isPublicPath(pathname: string): boolean {
  // Public website home page
  if (pathname === '/') return true;

  // Exact matches
  if (pathname === '/login' || pathname === '/api/auth/login') return true;

  // Registration paths (tablet and remote)
  if (pathname.startsWith('/register')) return true;

  // Patient creation API (POST only - checked in the route handler)
  if (pathname === '/api/patients') return true;

  // Link validation API
  if (pathname.startsWith('/api/links/')) return true;

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check authentication
  const token = request.cookies.get('holycare_session')?.value;

  if (!token) {
    // Redirect to login for page requests
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Return 401 for API requests
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    // Invalid token - redirect to login
    if (!pathname.startsWith('/api/')) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('holycare_session');
      return response;
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
