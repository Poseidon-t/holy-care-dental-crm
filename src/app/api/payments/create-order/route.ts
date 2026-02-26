import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getClinic } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getRazorpay() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 });
    }

    const clinic = await getClinic(session.clinicId);
    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    if (clinic.plan === 'annual') {
      return NextResponse.json({ error: 'Already on annual plan' }, { status: 400 });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: 499900, // ₹4,999 in paise
      currency: 'INR',
      receipt: `clinicflow_${session.clinicId}_${Date.now()}`,
      notes: {
        clinicId: session.clinicId,
        clinicName: clinic.name,
        plan: 'annual',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      clinicName: clinic.name,
      email: session.email,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
