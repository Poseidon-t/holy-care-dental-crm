import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, queryOne, formatOpNumber } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // ── Summary Cards ──
    const summary = await queryOne<{
      total_billed: number;
      total_collected: number;
      total_patients: number;
      total_treatments: number;
    }>(`
      SELECT
        COALESCE((SELECT SUM(amount) FROM treatments), 0) as total_billed,
        COALESCE((SELECT SUM(amount_paid) FROM treatments), 0) as total_collected,
        (SELECT COUNT(*) FROM patients) as total_patients,
        (SELECT COUNT(*) FROM treatments) as total_treatments
    `);

    // ── This Month ──
    const thisMonth = await queryOne<{ billed: number; collected: number; new_patients: number }>(`
      SELECT
        COALESCE(SUM(t.amount), 0) as billed,
        COALESCE(SUM(t.amount_paid), 0) as collected,
        (SELECT COUNT(*) FROM patients WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')) as new_patients
      FROM treatments t
      WHERE strftime('%Y-%m', t.appointment_date) = strftime('%Y-%m', 'now')
    `);

    // ── Last Month ──
    const lastMonth = await queryOne<{ billed: number; collected: number }>(`
      SELECT
        COALESCE(SUM(amount), 0) as billed,
        COALESCE(SUM(amount_paid), 0) as collected
      FROM treatments
      WHERE strftime('%Y-%m', appointment_date) = strftime('%Y-%m', date('now', '-1 month'))
    `);

    // ── Monthly Revenue — last 6 months ──
    const monthlyRevenue = await query<{ month: string; billed: number; collected: number }>(`
      SELECT
        strftime('%Y-%m', appointment_date) as month,
        SUM(amount) as billed,
        SUM(amount_paid) as collected
      FROM treatments
      WHERE appointment_date >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month ASC
    `);

    // ── Monthly New Patients — last 6 months ──
    const monthlyPatients = await query<{ month: string; count: number }>(`
      SELECT
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count
      FROM patients
      WHERE created_at >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month ASC
    `);

    // ── Outstanding by patient (top 5) ──
    const topOutstanding = await query<{ name: string; op_number: number; outstanding: number }>(`
      SELECT
        p.name,
        p.op_number,
        ROUND(SUM(t.amount - t.amount_paid), 2) as outstanding
      FROM patients p
      JOIN treatments t ON t.patient_id = p.id
      GROUP BY p.id
      HAVING outstanding > 0
      ORDER BY outstanding DESC
      LIMIT 5
    `);

    // ── Daily revenue — last 30 days ──
    const dailyRevenue = await query<{ day: string; billed: number; collected: number }>(`
      SELECT
        strftime('%Y-%m-%d', appointment_date) as day,
        SUM(amount) as billed,
        SUM(amount_paid) as collected
      FROM treatments
      WHERE appointment_date >= date('now', '-30 days')
      GROUP BY day
      ORDER BY day ASC
    `);

    return NextResponse.json({
      summary,
      thisMonth,
      lastMonth,
      monthlyRevenue,
      monthlyPatients,
      topOutstanding: topOutstanding.map(p => ({
        ...p,
        op_number_formatted: formatOpNumber(p.op_number),
      })),
      dailyRevenue,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
