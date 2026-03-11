'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

interface AnalyticsData {
  summary: { total_billed: number; total_collected: number; total_patients: number; total_treatments: number };
  thisMonth: { billed: number; collected: number; new_patients: number };
  lastMonth: { billed: number; collected: number };
  monthlyRevenue: { month: string; billed: number; collected: number }[];
  monthlyPatients: { month: string; count: number }[];
  topOutstanding: { name: string; op_number_formatted: string; outstanding: number }[];
  dailyRevenue: { day: string; billed: number; collected: number }[];
}

const COLORS = {
  billed: '#6366f1',
  collected: '#22c55e',
  outstanding: '#f59e0b',
  patients: '#0ea5e9',
};

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function fmtFull(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function monthLabel(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
}

function dayLabel(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function pct(a: number, b: number) {
  if (!b) return 0;
  return Math.round((a / b) * 100);
}

function trend(current: number, previous: number) {
  if (!previous) return null;
  const delta = ((current - previous) / previous) * 100;
  return delta;
}

const CustomTooltip = ({ active, payload, label, isCurrency = true }: {
  active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string; isCurrency?: boolean;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-500 capitalize">{p.name}</span>
          </span>
          <span className="font-bold text-gray-800">
            {isCurrency ? fmtFull(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'6m' | '30d'>('6m');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => {
        if (d && !d.error && d.summary) setData(d);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-alt flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto mb-3 text-primary-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-muted text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-surface-alt flex items-center justify-center">
        <p className="text-red-500">Failed to load analytics</p>
      </div>
    );
  }

  const { summary, thisMonth, lastMonth, monthlyRevenue, monthlyPatients, topOutstanding, dailyRevenue } = data;
  const outstanding = summary.total_billed - summary.total_collected;
  const collectionRate = pct(summary.total_collected, summary.total_billed);
  const monthlyTrend = trend(thisMonth.billed, lastMonth.billed);
  const collectedTrend = trend(thisMonth.collected, lastMonth.collected);

  const pieData = [
    { name: 'Collected', value: summary.total_collected },
    { name: 'Outstanding', value: Math.max(outstanding, 0) },
  ];

  const chartData = activeView === '6m' ? monthlyRevenue.map(d => ({
    label: monthLabel(d.month),
    billed: Math.round(d.billed),
    collected: Math.round(d.collected),
  })) : dailyRevenue.map(d => ({
    label: dayLabel(d.day),
    billed: Math.round(d.billed),
    collected: Math.round(d.collected),
  }));

  const patientChartData = monthlyPatients.map(d => ({
    label: monthLabel(d.month),
    patients: d.count,
  }));

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Revenue Analytics</h1>
              <p className="text-xs text-gray-400">Holy Care Dental & Orthodontics</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
            {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Billed */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Billed</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-5.586a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 0011.586 3H4a2 2 0 00-2 2v13a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{fmt(summary.total_billed)}</p>
            <p className="text-xs text-gray-400 mt-1">{summary.total_treatments} treatments</p>
          </div>

          {/* Collected */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Collected</span>
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">{fmt(summary.total_collected)}</p>
            <p className="text-xs text-gray-400 mt-1">{collectionRate}% collection rate</p>
          </div>

          {/* Outstanding */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Outstanding</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600">{fmt(Math.max(outstanding, 0))}</p>
            <p className="text-xs text-gray-400 mt-1">{100 - collectionRate}% pending</p>
          </div>

          {/* Patients */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Patients</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.total_patients}</p>
            <p className="text-xs text-gray-400 mt-1">+{thisMonth.new_patients} this month</p>
          </div>
        </div>

        {/* ── This Month Spotlight ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">This Month Billed</p>
            <p className="text-3xl font-bold">{fmt(thisMonth.billed)}</p>
            {monthlyTrend !== null && (
              <p className={`text-xs mt-2 font-medium ${monthlyTrend >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {monthlyTrend >= 0 ? '▲' : '▼'} {Math.abs(Math.round(monthlyTrend))}% vs last month
              </p>
            )}
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-green-200 text-xs font-semibold uppercase tracking-wider mb-1">This Month Collected</p>
            <p className="text-3xl font-bold">{fmt(thisMonth.collected)}</p>
            {collectedTrend !== null && (
              <p className={`text-xs mt-2 font-medium ${collectedTrend >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {collectedTrend >= 0 ? '▲' : '▼'} {Math.abs(Math.round(collectedTrend))}% vs last month
              </p>
            )}
          </div>
          <div className="bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-sky-200 text-xs font-semibold uppercase tracking-wider mb-1">New Patients This Month</p>
            <p className="text-3xl font-bold">{thisMonth.new_patients}</p>
            <p className="text-xs text-sky-200 mt-2 font-medium">
              Avg ₹{thisMonth.new_patients ? Math.round(thisMonth.billed / (thisMonth.new_patients || 1)).toLocaleString('en-IN') : 0} / patient
            </p>
          </div>
        </div>

        {/* ── Revenue Chart ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Billed vs Collected</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1 self-start">
              <button
                onClick={() => setActiveView('6m')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${activeView === '6m' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                6 Months
              </button>
              <button
                onClick={() => setActiveView('30d')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${activeView === '30d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                30 Days
              </button>
            </div>
          </div>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No data yet for this period</div>
          ) : mounted ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', radius: 4 }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 12, color: '#6b7280', textTransform: 'capitalize' }}>{value}</span>}
                />
                <Bar dataKey="billed" name="Billed" fill={COLORS.billed} radius={[6, 6, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill={COLORS.collected} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-64" />}
        </div>

        {/* ── Bottom Row: Pie + Patients + Outstanding ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Collection Rate Donut */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-1">Collection Rate</h2>
            <p className="text-xs text-gray-400 mb-4">Overall collected vs outstanding</p>
            <div className="relative">
              {mounted ? <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill={COLORS.collected} />
                    <Cell fill="#fef3c7" />
                  </Pie>
                  <Tooltip formatter={(v) => fmtFull(Number(v))} />
                </PieChart>
              </ResponsiveContainer> : <div className="h-[200px]" />}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-3xl font-bold text-gray-900">{collectionRate}%</p>
                <p className="text-xs text-gray-400">collected</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-500">Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-200" />
                <span className="text-xs text-gray-500">Pending</span>
              </div>
            </div>
          </div>

          {/* New Patients Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-1">New Patients</h2>
            <p className="text-xs text-gray-400 mb-4">Monthly registrations</p>
            {patientChartData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">No data yet</div>
            ) : mounted ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={patientChartData}>
                  <defs>
                    <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.patients} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={COLORS.patients} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} width={25} />
                  <Tooltip content={<CustomTooltip isCurrency={false} />} cursor={{ stroke: COLORS.patients, strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="patients" name="Patients" stroke={COLORS.patients} strokeWidth={2.5} fill="url(#patientGrad)" dot={{ fill: COLORS.patients, r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="h-[200px]" />}
          </div>

          {/* Top Outstanding */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-1">Top Outstanding</h2>
            <p className="text-xs text-gray-400 mb-4">Patients with highest pending balance</p>
            {topOutstanding.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">All clear!</p>
                <p className="text-xs text-gray-400">No outstanding balances</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topOutstanding.map((p, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600 font-bold text-xs">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.op_number_formatted}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-amber-600 flex-shrink-0">{fmt(p.outstanding)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Daily Revenue Sparkline ── */}
        {dailyRevenue.length > 0 && mounted && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900">Daily Revenue — Last 30 Days</h2>
              <p className="text-xs text-gray-400 mt-0.5">Day-by-day collection trend</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dailyRevenue.map(d => ({ label: dayLabel(d.day), collected: Math.round(d.collected), billed: Math.round(d.billed) }))}>
                <defs>
                  <linearGradient id="billedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.billed} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={COLORS.billed} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="collectedGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.collected} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={COLORS.collected} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} interval={Math.floor(dailyRevenue.length / 6)} />
                <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={55} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'capitalize' }}>{v}</span>} />
                <Area type="monotone" dataKey="billed" name="Billed" stroke={COLORS.billed} strokeWidth={2} fill="url(#billedGrad)" dot={false} />
                <Area type="monotone" dataKey="collected" name="Collected" stroke={COLORS.collected} strokeWidth={2} fill="url(#collectedGrad2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

      </main>
    </div>
  );
}
