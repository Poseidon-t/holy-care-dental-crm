'use client';

import { useState, useEffect } from 'react';
import type { ClinicInfo } from '@/components/ClinicHeader';

interface Patient {
  id: number;
  op_number: number;
  op_number_formatted: string;
  invoice_number_formatted: string;
  xray_id_formatted: string;
  created_at: string;
  submission_method: string;
  name: string;
  age: number;
  sex: string;
  address: string;
  phone: string;
  occupation: string;
  chief_complaint: string;
  jaundice: number;
  high_blood_pressure: number;
  heart_diseases: number;
  bleeding_disorders: number;
  hemophilia: number;
  allergy: number;
  anemia: number;
  fits: number;
  asthma_rs_disorders: number;
  thyroid: number;
  diabetes: number;
  kidney_diseases: number;
  pregnancy_lactating: number;
  previous_dental_history: string;
  diagnosis: string;
  treatment_plan: string;
  consent_agreed: number;
  patient_signature: string;
  dentist_signature: string;
}

interface Treatment {
  id: number;
  appointment_date: string;
  description: string;
  amount: number;
  signature: string;
}

const MEDICAL_CONDITIONS = [
  { key: 'jaundice', english: 'Jaundice', tamil: 'மஞ்சள் காமாலை' },
  { key: 'high_blood_pressure', english: 'High Blood Pressure', tamil: 'இரத்த அழுத்தம்' },
  { key: 'heart_diseases', english: 'Heart diseases', tamil: 'இருதய சார்ந்த நோய்கள்' },
  { key: 'bleeding_disorders', english: "Bleeding disorder's", tamil: 'இரத்த சம்பந்தமான நோய்கள்' },
  { key: 'hemophilia', english: 'Hemophilia', tamil: 'இரத்தம் நீர்த்துமை நோய்கம்' },
  { key: 'allergy', english: 'Allergy', tamil: 'ஒவ்வாமை' },
  { key: 'anemia', english: 'Anemia', tamil: 'இரத்த சோகை' },
  { key: 'fits', english: 'Fits', tamil: 'வலிப்பு' },
  { key: 'asthma_rs_disorders', english: 'Asthma (or) RS Disorders', tamil: 'ஆஸ்துமா (அ) நுரையீரல் சம்பந்தமான நிச்சயை' },
  { key: 'thyroid', english: 'Thyroid', tamil: 'தைராய்டு நிச்சயை' },
  { key: 'diabetes', english: 'Diabetes', tamil: 'சர்க்கரை நோய்கள்' },
  { key: 'kidney_diseases', english: 'Kidney Diseases', tamil: 'சிறுநீரக நிச்சயை' },
  { key: 'pregnancy_lactating', english: 'Pregnancy or lactating', tamil: 'கர்ப்பம் அல்லது பாலூட்டுதல்' },
];

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [totalBilling, setTotalBilling] = useState(0);
  const [clinic, setClinic] = useState<ClinicInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'registration' | 'treatments'>('registration');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState('');

  async function approveWithSignature() {
    setIsApproving(true);
    setApproveError('');
    try {
      const signatureValue = '/images/dr-pinky-signature.png';
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dentist_signature: signatureValue }),
      });
      if (response.ok) {
        setPatient(prev => prev ? { ...prev, dentist_signature: signatureValue } : prev);
      } else {
        const data = await response.json();
        setApproveError(data.error || 'Failed to approve');
      }
    } catch {
      setApproveError('Failed to approve. Please try again.');
    } finally {
      setIsApproving(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientRes, clinicRes] = await Promise.all([
          fetch(`/api/patients/${id}`),
          fetch('/api/clinic'),
        ]);
        const patientData = await patientRes.json();
        const clinicData = await clinicRes.json();

        if (patientRes.ok) {
          setPatient(patientData.patient);
          setTreatments(patientData.treatments);
          setTotalBilling(patientData.totalBilling);
        } else {
          setError(patientData.error || 'Patient not found');
        }
        if (clinicData.clinic) setClinic(clinicData.clinic);
      } catch {
        setError('Failed to fetch patient data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

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

  if (error || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600 font-medium">{error || 'Patient not found'}</p>
          <a href="/dashboard" className="btn-primary mt-4 inline-block">Back to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-line-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-heading text-heading">{patient.name}</h1>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold">
                  {patient.op_number_formatted}
                </span>
              </div>
              <p className="text-sm text-muted mt-1">
                {patient.phone} | {patient.sex}, {patient.age} years |
                Registered: {new Date(patient.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <a
                href={`/report/${patient.id}`}
                target="_blank"
                rel="noopener"
                className="btn-secondary text-sm"
              >
                Report
              </a>
              <a href={`/dashboard/treatment/${patient.id}`} className="btn-primary text-sm">
                + Treatment
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <a href="/dashboard" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </a>

        {/* Tabs */}
        <div className="flex border-b border-line-strong mt-4 mb-6">
          <button
            onClick={() => setActiveTab('registration')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${
              activeTab === 'registration'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-muted hover:text-body'
            }`}
          >
            Registration Form
          </button>
          <button
            onClick={() => setActiveTab('treatments')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${
              activeTab === 'treatments'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-muted hover:text-body'
            }`}
          >
            Treatment Records ({treatments.length})
          </button>
        </div>

        {/* Registration Tab */}
        {activeTab === 'registration' && (
          <div className="space-y-6">
            {/* IDs */}
            <div className="card">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-xs text-muted block">O.P. No.</span>
                  <span className="font-bold text-primary-700 text-lg">{patient.op_number_formatted}</span>
                </div>
                <div>
                  <span className="text-xs text-muted block">Invoice No.</span>
                  <span className="font-bold text-primary-700 text-lg">{patient.invoice_number_formatted}</span>
                </div>
                <div>
                  <span className="text-xs text-muted block">X-ray ID No.</span>
                  <span className="font-bold text-primary-700 text-lg">{patient.xray_id_formatted}</span>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="card">
              <h3 className="text-lg font-bold font-heading text-primary-700 mb-4 pb-2 border-b">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="text-sm text-muted">Name:</span><p className="font-medium">{patient.name}</p></div>
                <div><span className="text-sm text-muted">Age:</span><p className="font-medium">{patient.age}</p></div>
                <div><span className="text-sm text-muted">Sex:</span><p className="font-medium">{patient.sex}</p></div>
                <div><span className="text-sm text-muted">Phone:</span><p className="font-medium">{patient.phone}</p></div>
                <div><span className="text-sm text-muted">Occupation:</span><p className="font-medium">{patient.occupation || '-'}</p></div>
                <div><span className="text-sm text-muted">Submission Method:</span><p className="font-medium capitalize">{patient.submission_method}</p></div>
                <div className="md:col-span-2"><span className="text-sm text-muted">Address:</span><p className="font-medium">{patient.address || '-'}</p></div>
                <div className="md:col-span-2"><span className="text-sm text-muted">Chief Complaint:</span><p className="font-medium">{patient.chief_complaint || '-'}</p></div>
              </div>
            </div>

            {/* Medical History */}
            <div className="card">
              <h3 className="text-lg font-bold font-heading text-primary-700 mb-4 pb-2 border-b">Medical History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {MEDICAL_CONDITIONS.map((condition) => {
                  const value = patient[condition.key as keyof Patient] as number;
                  return (
                    <div key={condition.key} className={`flex items-center gap-2 p-2 rounded ${value ? 'bg-red-50' : 'bg-surface-alt'}`}>
                      <span className={value ? 'text-red-500' : 'text-green-500'}>{value ? '!' : '✓'}</span>
                      <span className={`text-sm ${value ? 'text-red-700 font-medium' : 'text-body'}`}>
                        {condition.english}
                        <span className="tamil text-xs text-faint ml-1">({condition.tamil})</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Info */}
            <div className="card">
              <h3 className="text-lg font-bold font-heading text-primary-700 mb-4 pb-2 border-b">Additional Information</h3>
              <div className="space-y-4">
                <div><span className="text-sm text-muted">Previous Dental History:</span><p className="font-medium mt-1">{patient.previous_dental_history || '-'}</p></div>
                <div><span className="text-sm text-muted">Diagnosis:</span><p className="font-medium mt-1">{patient.diagnosis || '-'}</p></div>
                <div><span className="text-sm text-muted">Treatment Plan:</span><p className="font-medium mt-1">{patient.treatment_plan || '-'}</p></div>
              </div>
            </div>

            {/* Signatures */}
            <div className="card">
              <h3 className="text-lg font-bold font-heading text-primary-700 mb-4 pb-2 border-b">Signatures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Signature */}
                <div>
                  <span className="text-sm text-muted block mb-2">Patient Signature:</span>
                  {patient.patient_signature ? (
                    <img src={patient.patient_signature} alt="Patient Signature" className="border rounded-lg max-h-32" />
                  ) : (
                    <div className="border-2 border-dashed border-line-strong rounded-lg h-32 flex items-center justify-center">
                      <span className="text-sm text-faint">Not yet signed</span>
                    </div>
                  )}
                </div>

                {/* Dentist Signature */}
                <div>
                  <span className="text-sm text-muted block mb-2">Dentist Signature:</span>
                  {patient.dentist_signature ? (
                    <div>
                      <img src={patient.dentist_signature.replace('.jpg', '.png')} alt="Doctor Signature" className="h-16 object-contain" />
                      <span className="text-xs text-green-600 mt-1 inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Approved{clinic?.doctor_name ? ` by ${clinic.doctor_name}` : ''}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="border-2 border-dashed border-amber-200 bg-amber-50 rounded-lg h-32 flex flex-col items-center justify-center gap-2">
                        <span className="text-sm text-amber-600 font-medium">Awaiting doctor approval</span>
                        <button
                          onClick={approveWithSignature}
                          disabled={isApproving}
                          className="btn-primary text-sm inline-flex items-center gap-2"
                        >
                          {isApproving ? 'Approving...' : (
                            <>
                              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                              Approve &amp; Sign
                            </>
                          )}
                        </button>
                      </div>
                      {approveError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-sm mt-2">
                          {approveError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Treatments Tab */}
        {activeTab === 'treatments' && (
          <div className="space-y-6">
            {treatments.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-muted">No treatment records yet</p>
                <a href={`/dashboard/treatment/${patient.id}`} className="btn-primary mt-4 inline-block">
                  Add First Treatment
                </a>
              </div>
            ) : (
              <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-50 border-b border-primary-100">
                      <th className="text-left p-4 text-sm font-semibold text-primary-700 whitespace-nowrap">Date</th>
                      <th className="text-left p-4 text-sm font-semibold text-primary-700">Description</th>
                      <th className="text-right p-4 text-sm font-semibold text-primary-700 whitespace-nowrap">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatments.map((t) => (
                      <tr key={t.id} className="border-b border-line-subtle">
                        <td className="p-4 text-sm">
                          {new Date(t.appointment_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="p-4 text-sm">{t.description}</td>
                        <td className="p-4 text-sm text-right font-medium">₹ {t.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-primary-50 border-t-2 border-primary-200">
                      <td colSpan={2} className="p-4 text-sm font-bold text-primary-700">Grand Total</td>
                      <td className="p-4 text-right text-lg font-bold text-primary-700">
                        ₹ {totalBilling.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
