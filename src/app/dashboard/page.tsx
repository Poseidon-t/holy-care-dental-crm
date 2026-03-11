'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { InstallPrompt } from '@/components/InstallPrompt';

interface Patient {
  id: number;
  op_number: number;
  op_number_formatted: string;
  name: string;
  phone: string;
  created_at: string;
  total_billing: number;
  dentist_signature: string;
}

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadReport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/patients');
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `holycare-patients-${date}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const deletePatient = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPatients(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete patient:', error);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

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

  useEffect(() => {
    if (!showQrModal) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowQrModal(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showQrModal]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(registerUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const downloadQr = async () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

    const qrImg = new Image();
    qrImg.src = svgBase64;
    await new Promise(res => { qrImg.onload = res; });

    // Draw QR to canvas
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = 400;
    qrCanvas.height = 400;
    const qrCtx = qrCanvas.getContext('2d')!;
    qrCtx.fillStyle = '#ffffff';
    qrCtx.fillRect(0, 0, 400, 400);
    qrCtx.drawImage(qrImg, 0, 0, 400, 400);
    const qrDataUrl = qrCanvas.toDataURL('image/png');

    // Load logo
    let logoDataUrl: string | null = null;
    try {
      const logoResp = await fetch('/images/logo.png');
      const logoBlob = await logoResp.blob();
      logoDataUrl = await new Promise(res => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(logoBlob);
      });
    } catch { /* no logo */ }

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageW = 210;
    let y = 15;

    // Logo
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', pageW / 2 - 12, y, 24, 24);
      y += 28;
    }

    // Clinic name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(44, 82, 100);
    doc.text('HOLY CARE DENTAL &', pageW / 2, y, { align: 'center' });
    y += 8;
    doc.text('ORTHODONTICS CLINIC', pageW / 2, y, { align: 'center' });
    y += 9;

    // Doctor & specialization
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Dr. Pinky Vijay MDS', pageW / 2, y, { align: 'center' });
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('Orthodontics & Dentofacial Orthopedics', pageW / 2, y, { align: 'center' });
    y += 5;

    // Reg & phone
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Reg. No: A-34195  |  Ph: +91 79772 57779', pageW / 2, y, { align: 'center' });
    y += 5;

    // Address
    doc.text('8/277, Rachel Enclave, Kavalkinaru Main Road, Kavalkinaru - 627105', pageW / 2, y, { align: 'center' });
    y += 10;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, pageW - 20, y);
    y += 10;

    // QR label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(44, 82, 100);
    doc.text('Patient Registration', pageW / 2, y, { align: 'center' });
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Scan to fill your registration form', pageW / 2, y, { align: 'center' });
    y += 8;

    // QR code centered
    const qrSize = 80;
    doc.addImage(qrDataUrl, 'PNG', pageW / 2 - qrSize / 2, y, qrSize, qrSize);
    y += qrSize + 8;

    // URL below QR
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(registerUrl, pageW / 2, y, { align: 'center' });

    doc.save('holy-care-clinic-qr.pdf');
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-line-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Holy Care" className="w-9 h-9" />
            <div>
              <h1 className="text-xl font-bold font-heading text-primary-700">Holy Care Dental CRM</h1>
              <p className="text-xs text-muted">Dr. Pinky Vijay MDS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchPatients} disabled={isLoading} title="Refresh" className="text-body hover:text-primary-700 p-2.5 rounded-lg hover:bg-primary-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50">
              <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button onClick={handleLogout} className="text-sm text-body hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors min-h-[44px]">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <InstallPrompt />
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              className="input-field"
              placeholder="Search by name, OP number, or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search patients"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="date"
              className="input-field w-auto"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              aria-label="Filter from date"
            />
            <input
              type="date"
              className="input-field w-auto"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              aria-label="Filter to date"
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
          <button
            onClick={downloadReport}
            disabled={isExporting}
            className="btn-secondary"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin w-5 h-5 mr-2 text-primary-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report
              </>
            )}
          </button>
        </div>

        {/* Patient Table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Patients list">
              <thead>
                <tr className="bg-primary-50 border-b border-primary-100">
                  <th className="text-left p-4 text-sm font-semibold text-primary-700">OP No.</th>
                  <th className="text-left p-4 text-sm font-semibold text-primary-700">Name</th>
                  <th className="text-left p-4 text-sm font-semibold text-primary-700 hidden sm:table-cell">Phone</th>
                  <th className="text-left p-4 text-sm font-semibold text-primary-700 hidden md:table-cell">Registration Date</th>
                  <th className="text-right p-4 text-sm font-semibold text-primary-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-faint">
                      <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-primary-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading patients...
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-faint">
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
                      <td className="p-4 font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          {patient.name}
                          {patient.dentist_signature ? (
                            <span className="text-green-500" title="Approved by doctor">
                              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </span>
                          ) : (
                            <span className="text-amber-400" title="Awaiting doctor approval">
                              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-body hidden sm:table-cell">{patient.phone}</td>
                      <td className="p-4 text-body hidden md:table-cell">
                        {new Date(patient.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <a
                            href={`/dashboard/patient/${patient.id}`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors min-h-[44px] inline-flex items-center"
                            aria-label={`View ${patient.name}`}
                          >
                            View
                          </a>
                          <a
                            href={`/dashboard/treatment/${patient.id}`}
                            className="text-sm text-green-600 hover:text-green-700 font-medium px-3 py-2 rounded-lg hover:bg-green-50 transition-colors min-h-[44px] inline-flex items-center"
                            aria-label={`Add treatment for ${patient.name}`}
                          >
                            + Treatment
                          </a>
                          {confirmDeleteId === patient.id ? (
                            <div className="flex gap-1 items-center">
                              <span className="text-xs text-red-600 font-medium hidden sm:inline">Delete?</span>
                              <button
                                onClick={() => deletePatient(patient.id)}
                                disabled={deletingId === patient.id}
                                className="text-xs text-white bg-red-600 hover:bg-red-700 font-medium px-2 py-2 rounded-lg transition-colors min-h-[44px] inline-flex items-center"
                              >
                                {deletingId === patient.id ? '...' : 'Yes'}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-xs text-muted hover:text-body font-medium px-2 py-2 rounded-lg hover:bg-surface-alt transition-colors min-h-[44px] inline-flex items-center"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(patient.id)}
                              className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors min-h-[44px] inline-flex items-center"
                              aria-label={`Delete ${patient.name}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowQrModal(false)} role="dialog" aria-modal="true" aria-label="Patient Registration QR Code">
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
                    fgColor="#000000"
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
