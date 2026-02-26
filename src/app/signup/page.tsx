'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    clinicName: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          clinicName: form.clinicName,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Redirect to setup wizard
      window.location.href = '/setup';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="card max-w-lg w-full">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold font-heading text-primary-700">ClinicFlow</h1>
          <p className="text-sm text-muted mt-1">Create your clinic account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="label-field">Your Full Name</label>
            <input
              id="name"
              type="text"
              className="input-field"
              value={form.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder="Dr. John Smith"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="email" className="label-field">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={form.email}
              onChange={e => updateField('email', e.target.value)}
              placeholder="doctor@clinic.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="label-field">Phone Number</label>
            <input
              id="phone"
              type="tel"
              className="input-field"
              value={form.phone}
              onChange={e => updateField('phone', e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label htmlFor="clinicName" className="label-field">Clinic Name</label>
            <input
              id="clinicName"
              type="text"
              className="input-field"
              value={form.clinicName}
              onChange={e => updateField('clinicName', e.target.value)}
              placeholder="My Dental Clinic"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="label-field">Password</label>
              <input
                id="password"
                type="password"
                className="input-field"
                value={form.password}
                onChange={e => updateField('password', e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label-field">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="input-field"
                value={form.confirmPassword}
                onChange={e => updateField('confirmPassword', e.target.value)}
                placeholder="Confirm password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full text-lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Get Started Free'
            )}
          </button>

          <p className="text-xs text-center text-muted mt-2">
            Free plan includes up to 50 patients. No credit card required.
          </p>
        </form>

        <div className="mt-6 text-center border-t border-line pt-4">
          <p className="text-sm text-muted">
            Already have an account?{' '}
            <a href="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
