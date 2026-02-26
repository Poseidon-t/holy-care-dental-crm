'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="card max-w-md w-full">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold font-heading text-primary-700">ClinicFlow</h1>
          <p className="text-sm text-muted mt-1">Patient Management System</p>
        </div>

        <div className="mt-2 mb-2">
          <h2 className="text-center text-lg font-semibold font-heading text-body">Sign In</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="email" className="label-field">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="label-field">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
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
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-line pt-4">
          <p className="text-sm text-muted">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-primary-600 font-medium hover:text-primary-700">
              Sign up free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
