'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

interface Patient {
  id: number;
  op_number: number;
  op_number_formatted: string;
  name: string;
  phone: string;
  created_at: string;
  total_billing: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const registerUrl = typeof window !== 'undefined' ? `${window.location.origin}/register` : '';

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);

      const response = await fetch(`/api/patients?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPatients(data.patients);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setIsLoading(false);
    }
  }, [search, dateFrom, dateTo]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(registerUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const downloadQr = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement('a');
      a.download = 'holy-care-clinic-qr.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-line-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦷</span>
            <div>
              <h1 className="text-xl font-bold font-heading text-primary-700">Holy Care Dental CRM</h1>
              <p className="text-xs text-muted">Dr. Pinky Vijay MDS</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-sm text-body hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors min-h-[44px]">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              className="input-field"
              placeholder="Search by name, OP number, or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="date"
              className="input-field w-auto"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              title="From date"
            />
            <input
              type="date"
              className="input-field w-auto"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              title="To date"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <a href="/register" className="btn-primary" target="_blank" rel="noopener">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            New Patient (Tablet)
          </a>
          <button
            onClick={() => setShowQrModal(true)}
            className="btn-secondary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Registration QR Code
          </button>
        </div>

        {/* Patient Table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary-50 border-b border-primary-100">
                  <th className="text-left p-4 text-sm font-semibold text-primary-700">OP No.</th>
                  <th className="text-left p-4 text-sm font-semibold text-primary-700">Name</th>
                  <th className="text-left p-4 text-sm font-semibold text-primary-700 hidden sm:table-cell">Phone</th>
                  <th className="text-left p-4 text-sm font-semibold text-primary-700 hidden md:table-cell">Registration Date</th>
                  <th className="text-right p-4 text-sm font-semibold text-primary-700 hidden sm:table-cell">Total Billing</th>
                  <th className="text-right p-4 text-sm font-semibold text-primary-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-faint">
                      <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-primary-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading patients...
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-faint">
                      <div className="text-4xl mb-2">📋</div>
                      No patients found
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="border-b border-line-subtle hover:bg-primary-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-primary-600">{patient.op_number_formatted}</span>
                      </td>
                      <td className="p-4 font-medium">{patient.name}</td>
                      <td className="p-4 text-body hidden sm:table-cell">{patient.phone}</td>
                      <td className="p-4 text-body hidden md:table-cell">
                        {new Date(patient.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-right font-semibold hidden sm:table-cell">
                        ₹ {patient.total_billing.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <a
                            href={`/dashboard/patient/${patient.id}`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors min-h-[44px] inline-flex items-center"
                          >
                            View
                          </a>
                          <a
                            href={`/dashboard/treatment/${patient.id}`}
                            className="text-sm text-green-600 hover:text-green-700 font-medium px-3 py-2 rounded-lg hover:bg-green-50 transition-colors min-h-[44px] inline-flex items-center"
                          >
                            + Treatment
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        {!isLoading && patients.length > 0 && (
          <div className="mt-4 text-sm text-muted text-center">
            Showing {patients.length} patient{patients.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* QR Code Modal */}
        {showQrModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowQrModal(false)}>
            <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6 my-auto" onClick={e => e.stopPropagation()}>
              <div className="text-center">
                <h3 className="text-lg font-bold font-heading text-heading mb-1">Patient Registration QR Code</h3>
                <p className="text-sm text-muted mb-4">
                  Print and display in your clinic. Any patient can scan to fill the registration form.
                </p>

                <div ref={qrRef} className="bg-surface p-4 rounded-xl border-2 border-line inline-block mb-5">
                  <QRCodeSVG
                    value={registerUrl}
                    size={220}
                    level="M"
                    includeMargin={false}
                    bgColor="#FFFFFF"
                    fgColor="#1e3a5f"
                  />
                </div>

                <div className="flex items-center gap-2 bg-surface-alt rounded-lg p-2 mb-5">
                  <input
                    type="text"
                    readOnly
                    value={registerUrl}
                    className="flex-1 bg-transparent text-xs text-body outline-none truncate"
                  />
                  <button
                    onClick={copyLink}
                    className="text-xs font-medium px-4 py-2.5 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors whitespace-nowrap min-h-[44px]"
                  >
                    {linkCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={downloadQr}
                    className="flex-1 btn-secondary text-sm justify-center"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download QR
                  </button>
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="flex-1 btn-primary text-sm justify-center"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
