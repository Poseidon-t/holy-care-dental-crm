import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getClinic } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clinic = await getClinic();
    return NextResponse.json({ clinic });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
