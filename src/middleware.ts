import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

function isPublicPath(pathname: string, method: string): boolean {
  // Public website home page
  if (pathname === '/') return true;

  // Exact matches
  if (pathname === '/login' || pathname === '/api/auth/login') return true;

  // Registration paths (tablet and remote)
  if (pathname.startsWith('/register')) return true;

  // Patient creation API - POST only (for registration form submissions)
  if (pathname === '/api/patients' && method === 'POST') return true;

  // Link validation API
  if (pathname.startsWith('/api/links/')) return true;

  // Theme API - GET only (needed for client hydration)
  if (pathname === '/api/settings/theme' && method === 'GET') return true;

  // Chat API - POST only (public chatbot)
  if (pathname === '/api/chat' && method === 'POST') return true;

  // Knowledge/Articles pages - public
  if (pathname.startsWith('/knowledge')) return true;

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname, request.method)) {
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
