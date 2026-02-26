import { NextRequest, NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    // Verify webhook signature
    const signature = request.headers.get('x-razorpay-signature');
    const body = await request.text();

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    switch (eventType) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        const clinicId = payment.notes?.clinicId;

        if (clinicId) {
          await execute(
            `UPDATE clinics
             SET plan = 'annual',
                 patient_limit = 999999,
                 razorpay_subscription_id = $1,
                 updated_at = NOW()
             WHERE id = $2`,
            [payment.id, clinicId]
          );
        }
        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        console.error('Payment failed:', payment.id, payment.error_description);
        break;
      }

      default:
        // Log unhandled events for debugging
        console.log('Unhandled webhook event:', eventType);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
