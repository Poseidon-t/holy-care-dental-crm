import { NextRequest, NextResponse } from 'next/server';
import { getSetting, setSetting } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { isValidTheme } from '@/lib/themes';

export async function GET() {
  try {
    const session = await getSession();
    if (session?.clinicId) {
      const theme = await getSetting(session.clinicId, 'theme') || 'classic';
      return NextResponse.json({ theme });
    }
    return NextResponse.json({ theme: 'classic' });
  } catch {
    return NextResponse.json({ theme: 'classic' });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { theme } = await request.json();
    if (!theme || !isValidTheme(theme)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }
    await setSetting(session.clinicId, 'theme', theme);
    return NextResponse.json({ success: true, theme });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
