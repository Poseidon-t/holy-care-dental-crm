import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const treatment = await queryOne<{ id: number }>(
      'SELECT id FROM treatments WHERE id = ?', [id]
    );
    if (!treatment) return NextResponse.json({ error: 'Treatment not found' }, { status: 404 });

    const date = String(body.appointment_date || '').trim();
    const description = String(body.description || '').trim().slice(0, 2000);
    const amount = Math.max(0, Number(body.amount) || 0);

    if (!date || !description) {
      return NextResponse.json({ error: 'Date and description are required' }, { status: 400 });
    }

    await execute(
      'UPDATE treatments SET appointment_date = ?, description = ?, amount = ? WHERE id = ?',
      [date, description, amount, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update treatment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const treatment = await queryOne<{ id: number }>(
      'SELECT id FROM treatments WHERE id = ?', [id]
    );
    if (!treatment) return NextResponse.json({ error: 'Treatment not found' }, { status: 404 });

    await execute('DELETE FROM treatments WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete treatment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
