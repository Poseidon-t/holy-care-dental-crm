import { NextRequest, NextResponse } from 'next/server';
import { getSetting, setSetting } from '@/lib/db';
import { isValidTheme } from '@/lib/themes';

export async function GET() {
  const theme = getSetting('theme') || 'classic';
  return NextResponse.json({ theme });
}

export async function PUT(request: NextRequest) {
  try {
    const { theme } = await request.json();
    if (!theme || !isValidTheme(theme)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }
    setSetting('theme', theme);
    return NextResponse.json({ success: true, theme });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
