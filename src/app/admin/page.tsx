'use client';

import { useState, useEffect, useCallback } from 'react';

interface Clinic {
  id: string;
  name: string;
  slug: string;
  doctor_name: string | null;
  email: string | null;
  phone: string | null;
  plan: string;
  patient_limit: number;
  patient_count: string;
  created_at: string;
}

interface Stats {
  totalClinics: number;
  freeClinics: number;
  paidClinics: number;
  totalPatients: number;
}

export default function AdminPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState('');
  const [editLimit, setEditLimit] = useState('');

  const fetchClinics = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/clinics');
      if (res.status === 403) {
        setError('Access denied. Super admin privileges required.');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setClinics(data.clinics);
      setStats(data.stats);
    } catch {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClinics(); }, [fetchClinics]);

  const handleSave = async (clinicId: string) => {
    try {
      const body: Record<string, unknown> = {};
      if (editPlan) body.plan = editPlan;
      if (editLimit) body.patient_limit = parseInt(editLimit, 10);

      const res = await fetch(`/api/admin/clinics/${clinicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Update failed');
      setEditingId(null);
      fetchClinics();
    } catch {
      alert('Failed to update clinic');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="card max-w-md w-full text-center p-8">
          <h1 className="text-xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-muted">{error}</p>
          <a href="/dashboard" className="btn-primary inline-block mt-4">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Header */}
      <header className="bg-surface border-b border-line px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-heading text-heading">ClinicFlow Admin</h1>
            <p className="text-sm text-muted">Super Admin Dashboard</p>
          </div>
          <a href="/dashboard" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            &larr; Back to Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Clinics" value={stats.totalClinics} color="blue" />
            <StatCard label="Free Plan" value={stats.freeClinics} color="gray" />
            <StatCard label="Paid Plan" value={stats.paidClinics} color="green" />
            <StatCard label="Total Patients" value={stats.totalPatients} color="purple" />
          </div>
        )}

        {/* Revenue Estimate */}
        {stats && (
          <div className="card p-4 mb-8 bg-green-50 border-green-200">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Estimated Annual Revenue:</span>{' '}
              ₹{(stats.paidClinics * 4999).toLocaleString('en-IN')}
              <span className="text-green-600 ml-2">({stats.paidClinics} paid clinics × ₹4,999/yr)</span>
            </p>
          </div>
        )}

        {/* Clinics Table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-line">
            <h2 className="text-lg font-semibold font-heading text-heading">All Clinics</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-alt text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted">Clinic</th>
                  <th className="px-4 py-3 font-medium text-muted">Doctor</th>
                  <th className="px-4 py-3 font-medium text-muted">Plan</th>
                  <th className="px-4 py-3 font-medium text-muted">Patients</th>
                  <th className="px-4 py-3 font-medium text-muted">Joined</th>
                  <th className="px-4 py-3 font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {clinics.map(clinic => (
                  <tr key={clinic.id} className="hover:bg-surface-alt/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-heading">{clinic.name}</div>
                      <div className="text-xs text-muted">{clinic.email || clinic.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-body">{clinic.doctor_name || '—'}</td>
                    <td className="px-4 py-3">
                      {editingId === clinic.id ? (
                        <select
                          value={editPlan}
                          onChange={e => setEditPlan(e.target.value)}
                          className="input-field text-xs py-1 px-2"
                        >
                          <option value="free">Free</option>
                          <option value="annual">Annual</option>
                          <option value="custom">Custom</option>
                        </select>
                      ) : (
                        <PlanBadge plan={clinic.plan} />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === clinic.id ? (
                        <input
                          type="number"
                          value={editLimit}
                          onChange={e => setEditLimit(e.target.value)}
                          className="input-field text-xs py-1 px-2 w-24"
                        />
                      ) : (
                        <span className="text-body">
                          {clinic.patient_count}
                          <span className="text-muted">/{clinic.patient_limit === 999999 ? '∞' : clinic.patient_limit}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(clinic.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === clinic.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(clinic.id)}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(clinic.id);
                            setEditPlan(clinic.plan);
                            setEditLimit(String(clinic.patient_limit));
                          }}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {clinics.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted">
                      No clinics registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] || colorMap.blue}`}>
      <p className="text-2xl font-bold">{value.toLocaleString('en-IN')}</p>
      <p className="text-sm opacity-80">{label}</p>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    free: 'bg-gray-100 text-gray-700',
    annual: 'bg-green-100 text-green-700',
    custom: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[plan] || styles.free}`}>
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}
