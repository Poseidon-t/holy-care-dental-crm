'use client';

import { useState, useEffect } from 'react';

interface Patient {
  id: number;
  op_number_formatted: string;
  invoice_number_formatted: string;
  xray_id_formatted: string;
  created_at: string;
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

export default function PrintableReportPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [totalBilling, setTotalBilling] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/patients/${id}`);
        const data = await response.json();
        if (response.ok) {
          setPatient(data.patient);
          setTreatments(data.treatments);
          setTotalBilling(data.totalBilling);
        }
      } catch (error) {
        console.error('Failed to fetch patient data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading report...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Patient not found</p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap');

        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; font-size: 11pt; }
          .report-container { padding: 0 !important; max-width: none !important; box-shadow: none !important; }
          @page { margin: 1.5cm; size: A4; }
          .page-break { page-break-before: always; }
        }

        .report-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .tamil-text {
          font-family: 'Noto Sans Tamil', sans-serif;
        }

        .report-header {
          text-align: center;
          border-bottom: 3px double #1e40af;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .report-section {
          margin-bottom: 20px;
        }

        .report-section h3 {
          background: #eff6ff;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: 700;
          color: #1e40af;
          border-left: 4px solid #2563eb;
          margin-bottom: 12px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 0 12px;
        }

        .info-item label {
          font-size: 11px;
          color: #6b7280;
          display: block;
        }

        .info-item p {
          font-size: 13px;
          font-weight: 500;
          margin: 2px 0 0;
        }

        .info-full { grid-column: span 2; }

        .medical-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          padding: 0 12px;
        }

        .medical-item {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .medical-yes { background: #fef2f2; color: #991b1b; }
        .medical-no { background: #f9fafb; color: #6b7280; }

        .treatment-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        .treatment-table th {
          background: #eff6ff;
          padding: 8px 12px;
          text-align: left;
          font-weight: 600;
          color: #1e40af;
          border: 1px solid #dbeafe;
        }

        .treatment-table td {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
        }

        .treatment-table .amount { text-align: right; }

        .treatment-total {
          background: #eff6ff;
          font-weight: 700;
          color: #1e40af;
        }

        .signature-block {
          display: inline-block;
          margin: 12px 24px;
          text-align: center;
        }

        .signature-block img {
          max-height: 80px;
          border-bottom: 1px solid #000;
          padding-bottom: 4px;
        }

        .signature-block p {
          font-size: 11px;
          color: #6b7280;
          margin-top: 4px;
        }

        .report-footer {
          text-align: center;
          font-size: 10px;
          color: #9ca3af;
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          margin-top: 24px;
        }

        .ids-bar {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-bottom: 16px;
          padding: 8px;
          background: #f8fafc;
          border-radius: 6px;
        }

        .ids-bar span {
          font-size: 12px;
          font-weight: 600;
          color: #1e40af;
        }
      `}</style>

      {/* Action Buttons */}
      <div className="no-print bg-surface-alt py-3 px-4 flex gap-3 items-center justify-center sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => window.print()}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Print Report
        </button>
        <a
          href={`/dashboard/patient/${patient.id}`}
          className="bg-card text-body px-6 py-2 rounded-lg font-medium hover:bg-surface-alt border border-line transition-colors"
        >
          Back to Patient
        </a>
        <a
          href="/dashboard"
          className="bg-card text-body px-6 py-2 rounded-lg font-medium hover:bg-surface-alt border border-line transition-colors"
        >
          Dashboard
        </a>
      </div>

      <div className="report-container" style={{ padding: '32px' }}>
        {/* Clinic Header */}
        <div className="report-header">
          <img src="/images/logo.png" alt="Holy Care Dental" style={{ width: '48px', height: '48px', marginBottom: '8px', display: 'inline-block' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1e40af', margin: '0 0 4px' }}>
            HOLY CARE DENTAL &amp; ORTHODONTICS CLINIC
          </h1>
          <p style={{ fontSize: '13px', color: '#374151', margin: '2px 0' }}>
            <strong>Dr. Pinky Vijay MDS</strong> | Orthodontics &amp; Dentofacial Orthopedics
          </p>
          <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0' }}>Reg. No: A-34195</p>
          <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0' }}>
            8/277, Rachel Enclave, Kavalkinaru Main Road, Kavalkinaru - 627105
          </p>
        </div>

        {/* ID Numbers */}
        <div className="ids-bar">
          <span>O.P. No: {patient.op_number_formatted}</span>
          <span>Invoice No: {patient.invoice_number_formatted}</span>
          <span>X-ray ID: {patient.xray_id_formatted}</span>
        </div>

        {/* Personal Information */}
        <div className="report-section">
          <h3>Patient Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Name</label>
              <p>{patient.name}</p>
            </div>
            <div className="info-item">
              <label>Age / Sex</label>
              <p>{patient.age} years / {patient.sex}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{patient.phone}</p>
            </div>
            <div className="info-item">
              <label>Occupation</label>
              <p>{patient.occupation || '-'}</p>
            </div>
            <div className="info-item info-full">
              <label>Address</label>
              <p>{patient.address || '-'}</p>
            </div>
            <div className="info-item info-full">
              <label>Chief Complaint <span className="tamil-text" style={{ fontSize: '10px', color: '#9ca3af' }}>(முக்கிய வலுவையின் நோயாகும்)</span></label>
              <p>{patient.chief_complaint || '-'}</p>
            </div>
            <div className="info-item info-full">
              <label>Registration Date</label>
              <p>{new Date(patient.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="report-section">
          <h3>Medical History <span className="tamil-text" style={{ fontSize: '11px', fontWeight: 400, color: '#6b7280' }}>(மருத்துவ வரலாறு)</span></h3>
          <div className="medical-grid">
            {MEDICAL_CONDITIONS.map((condition) => {
              const value = patient[condition.key as keyof Patient] as number;
              return (
                <div key={condition.key} className={`medical-item ${value ? 'medical-yes' : 'medical-no'}`}>
                  {value ? '✗' : '✓'} {condition.english}
                  <span className="tamil-text" style={{ fontSize: '10px', marginLeft: '4px' }}>({condition.tamil})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Information */}
        <div className="report-section">
          <h3>Clinical Notes</h3>
          <div className="info-grid">
            <div className="info-item info-full">
              <label>Previous Dental History</label>
              <p>{patient.previous_dental_history || '-'}</p>
            </div>
            <div className="info-item info-full">
              <label>Diagnosis</label>
              <p>{patient.diagnosis || '-'}</p>
            </div>
            <div className="info-item info-full">
              <label>Treatment Plan</label>
              <p>{patient.treatment_plan || '-'}</p>
            </div>
          </div>
        </div>

        {/* Signatures - Registration */}
        {(patient.patient_signature || patient.dentist_signature) && (
          <div className="report-section" style={{ textAlign: 'center' }}>
            {patient.patient_signature && (
              <div className="signature-block">
                <img src={patient.patient_signature} alt="Patient Signature" />
                <p>Patient Signature</p>
              </div>
            )}
            {patient.dentist_signature && (
              <div className="signature-block">
                <img src={patient.dentist_signature.replace('.jpg', '.png')} alt="Dentist Signature" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                <p>Dentist Signature</p>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        {treatments.length > 0 && (
          <>
            <hr style={{ border: 'none', borderTop: '2px solid #1e40af', margin: '24px 0' }} />

            {/* Treatment Records */}
            <div className="report-section">
              <h3>Treatment Records &amp; Billing</h3>
              <table className="treatment-table">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Date</th>
                    <th>Description</th>
                    <th className="amount" style={{ width: '20%' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((t) => (
                    <tr key={t.id}>
                      <td>
                        {new Date(t.appointment_date).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td>{t.description}</td>
                      <td className="amount">₹ {t.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="treatment-total">
                    <td colSpan={2}>Grand Total</td>
                    <td className="amount">₹ {totalBilling.toLocaleString('en-IN')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Treatment Signatures */}
            {treatments.some(t => t.signature) && (
              <div className="report-section" style={{ textAlign: 'center' }}>
                {treatments.filter(t => t.signature).slice(-1).map(t => (
                  <div key={t.id} className="signature-block">
                    <img src={t.signature} alt="Treatment Signature" />
                    <p>Authorized Signature</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="report-footer">
          <p>Report generated on {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p>Holy Care Dental &amp; Orthodontics Clinic | Kavalkinaru - 627105</p>
        </div>
      </div>
    </>
  );
}
