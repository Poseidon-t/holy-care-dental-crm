'use client';

import { useState, useEffect } from 'react';

interface ClinicBilling {
  name: string;
  plan: string;
  patient_limit: number;
  patient_count: number;
  razorpay_subscription_id: string | null;
  created_at: string;
}

export default function BillingPage() {
  const [billing, setBilling] = useState<ClinicBilling | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBilling() {
      try {
        const res = await fetch('/api/clinic');
        const data = await res.json();
        if (data.clinic) {
          // Fetch patient count
          const pRes = await fetch('/api/patients?countOnly=true');
          const pData = await pRes.json();

          setBilling({
            name: data.clinic.name,
            plan: data.clinic.plan,
            patient_limit: data.clinic.patient_limit,
            patient_count: pData.total || 0,
            razorpay_subscription_id: data.clinic.razorpay_subscription_id,
            created_at: data.clinic.created_at,
          });
        }
      } catch {
        // Error loading
      } finally {
        setIsLoading(false);
      }
    }
    loadBilling();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <svg className="animate-spin h-10 w-10 text-primary-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const planLabel = billing?.plan === 'annual' ? 'Annual' : billing?.plan === 'custom' ? 'Custom' : 'Free';
  const usagePercent = billing ? Math.min(100, Math.round((billing.patient_count / billing.patient_limit) * 100)) : 0;
  const isNearLimit = billing && billing.plan === 'free' && billing.patient_count >= 40;
  const isAtLimit = billing && billing.plan === 'free' && billing.patient_count >= billing.patient_limit;

  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="bg-surface shadow-sm border-b border-line-strong">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold font-heading text-primary-700">Billing & Plan</h1>
          <a href="/dashboard" className="text-sm text-primary-600 font-medium hover:text-primary-700">
            Back to Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Current Plan */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-heading">Current Plan</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-2xl font-bold ${billing?.plan === 'annual' ? 'text-green-600' : 'text-primary-600'}`}>
                  {planLabel}
                </span>
                {billing?.plan === 'annual' && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Active</span>
                )}
              </div>
            </div>
            {billing?.plan === 'free' && (
              <a href="/pricing" className="btn-primary">
                Upgrade
              </a>
            )}
          </div>
        </div>

        {/* Usage */}
        <div className="card">
          <h2 className="text-lg font-bold font-heading text-heading mb-4">Patient Usage</h2>
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm text-muted">
              {billing?.patient_count || 0} / {billing?.plan === 'annual' ? 'Unlimited' : billing?.patient_limit || 50} patients
            </span>
            {billing?.plan !== 'annual' && (
              <span className="text-sm font-medium">{usagePercent}%</span>
            )}
          </div>
          {billing?.plan !== 'annual' && (
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-primary-500'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          )}
          {isNearLimit && !isAtLimit && (
            <p className="text-sm text-amber-600 mt-2">
              You&apos;re approaching your patient limit. <a href="/pricing" className="font-medium underline">Upgrade</a> for unlimited patients.
            </p>
          )}
          {isAtLimit && (
            <p className="text-sm text-red-600 mt-2">
              You&apos;ve reached your patient limit. <a href="/pricing" className="font-medium underline">Upgrade now</a> to add more patients.
            </p>
          )}
        </div>

        {/* Plan Details */}
        <div className="card">
          <h2 className="text-lg font-bold font-heading text-heading mb-4">Plan Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-line-subtle">
              <span className="text-muted">Clinic</span>
              <span className="font-medium">{billing?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-line-subtle">
              <span className="text-muted">Plan</span>
              <span className="font-medium">{planLabel}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-line-subtle">
              <span className="text-muted">Patient Limit</span>
              <span className="font-medium">{billing?.plan === 'annual' ? 'Unlimited' : billing?.patient_limit}</span>
            </div>
            {billing?.razorpay_subscription_id && (
              <div className="flex justify-between py-2 border-b border-line-subtle">
                <span className="text-muted">Payment ID</span>
                <span className="font-mono text-xs">{billing.razorpay_subscription_id}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-muted">Member Since</span>
              <span className="font-medium">
                {billing?.created_at
                  ? new Date(billing.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                  : '-'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
