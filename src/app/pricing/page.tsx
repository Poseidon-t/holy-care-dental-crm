'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/clinic')
      .then(r => r.json())
      .then(d => {
        if (d.clinic) setCurrentPlan(d.clinic.plan);
      })
      .catch(() => {});
  }, []);

  const handleUpgrade = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Load Razorpay script
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay'));
          document.body.appendChild(script);
        });
      }

      // Create order
      const orderRes = await fetch('/api/payments/create-order', { method: 'POST' });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ClinicFlow',
        description: 'Annual Plan - Unlimited Patients',
        order_id: orderData.orderId,
        prefill: {
          email: orderData.email,
        },
        theme: {
          color: '#2563eb',
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // Verify payment
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });

          if (verifyRes.ok) {
            setCurrentPlan('annual');
            setSuccess('Payment successful! Your plan has been upgraded.');
          } else {
            setError('Payment verification failed. Please contact support.');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="bg-surface shadow-sm border-b border-line-strong">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold font-heading text-primary-700">Pricing</h1>
          <a href="/dashboard" className="text-sm text-primary-600 font-medium hover:text-primary-700">
            Back to Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center mb-8">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center mb-8">
            {error}
          </div>
        )}

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-heading text-heading">Simple, Transparent Pricing</h2>
          <p className="text-muted mt-2">Start free, upgrade when you need to.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className={`card border-2 ${currentPlan === 'free' ? 'border-primary-500' : 'border-line'}`}>
            {currentPlan === 'free' && (
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">Current Plan</span>
            )}
            <h3 className="text-xl font-bold font-heading mt-3">Free</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">₹0</span>
              <span className="text-muted">/forever</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Up to 50 patients
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Patient registration forms
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Treatment records & billing
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Printable reports
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                QR code registration
              </li>
            </ul>
            {currentPlan === 'free' && (
              <div className="mt-6 text-center text-sm text-muted">Your current plan</div>
            )}
          </div>

          {/* Annual Plan */}
          <div className={`card border-2 ${currentPlan === 'annual' ? 'border-primary-500' : 'border-primary-300'} relative`}>
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-primary-600 px-4 py-1 rounded-full">
              {currentPlan === 'annual' ? 'Current Plan' : 'Most Popular'}
            </span>
            <h3 className="text-xl font-bold font-heading mt-3">Annual</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">₹4,999</span>
              <span className="text-muted">/year</span>
            </div>
            <p className="text-xs text-muted mt-1">~₹416/month</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <strong>Unlimited patients</strong>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Everything in Free
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Priority support
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Custom branding
              </li>
            </ul>
            <div className="mt-6">
              {currentPlan === 'annual' ? (
                <div className="text-center text-sm text-muted">Your current plan</div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="btn-primary w-full"
                >
                  {isLoading ? 'Processing...' : 'Upgrade Now'}
                </button>
              )}
            </div>
          </div>

          {/* Custom Plan */}
          <div className="card border-2 border-line">
            <h3 className="text-xl font-bold font-heading mt-3">Custom</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">Contact Us</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Everything in Annual
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                White-label branding
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Custom features
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Dedicated support
              </li>
            </ul>
            <div className="mt-6">
              <a href="mailto:support@clinicflow.in" className="btn-secondary w-full text-center">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
