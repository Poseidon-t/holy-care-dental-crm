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
  amount_paid: number;
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

type EditableFields = {
  name: string;
  age: number;
  sex: string;
  address: string;
  phone: string;
  occupation: string;
  chief_complaint: string;
  previous_dental_history: string;
  diagnosis: string;
  treatment_plan: string;
  [key: string]: string | number;
};

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

  // Edit mode state (patient form)
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditableFields | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [isSavingPDF, setIsSavingPDF] = useState(false);

  // Treatment edit/delete state
  const [editingTreatmentId, setEditingTreatmentId] = useState<number | null>(null);
  const [treatmentEditData, setTreatmentEditData] = useState<{ appointment_date: string; description: string; amount: number; amount_paid: number } | null>(null);
  const [savingTreatmentId, setSavingTreatmentId] = useState<number | null>(null);
  const [confirmDeleteTreatmentId, setConfirmDeleteTreatmentId] = useState<number | null>(null);

  function startEditingTreatment(t: Treatment) {
    setEditingTreatmentId(t.id);
    setTreatmentEditData({
      appointment_date: t.appointment_date.slice(0, 10),
      description: t.description,
      amount: t.amount,
      amount_paid: t.amount_paid || 0,
    });
  }

  function cancelEditingTreatment() {
    setEditingTreatmentId(null);
    setTreatmentEditData(null);
  }

  async function saveTreatment(id: number) {
    if (!treatmentEditData) return;
    setSavingTreatmentId(id);
    try {
      const res = await fetch(`/api/treatments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treatmentEditData),
      });
      if (res.ok) {
        const updated = treatments.map(t =>
          t.id === id ? { ...t, ...treatmentEditData } : t
        );
        setTreatments(updated);
        setTotalBilling(updated.reduce((s, t) => s + t.amount, 0));
        setEditingTreatmentId(null);
        setTreatmentEditData(null);
      }
    } catch { /* ignore */ } finally {
      setSavingTreatmentId(null);
    }
  }

  async function deleteTreatment(id: number) {
    try {
      const res = await fetch(`/api/treatments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = treatments.filter(t => t.id !== id);
        setTreatments(updated);
        setTotalBilling(updated.reduce((s, t) => s + t.amount, 0));
      }
    } catch { /* ignore */ } finally {
      setConfirmDeleteTreatmentId(null);
    }
  }

  function startEditing() {
    if (!patient) return;
    setEditData({
      name: patient.name,
      age: patient.age,
      sex: patient.sex,
      address: patient.address || '',
      phone: patient.phone,
      occupation: patient.occupation || '',
      chief_complaint: patient.chief_complaint || '',
      previous_dental_history: patient.previous_dental_history || '',
      diagnosis: patient.diagnosis || '',
      treatment_plan: patient.treatment_plan || '',
      // Medical conditions
      ...Object.fromEntries(
        MEDICAL_CONDITIONS.map(c => [c.key, patient[c.key as keyof Patient] as number])
      ),
    });
    setIsEditing(true);
    setSaveError('');
  }

  function cancelEditing() {
    setIsEditing(false);
    setEditData(null);
    setSaveError('');
  }

  async function saveEdits() {
    if (!editData || !patient) return;
    setIsSaving(true);
    setSaveError('');

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        // Update local patient state with edited data
        setPatient(prev => prev ? { ...prev, ...editData } : prev);
        setIsEditing(false);
        setEditData(null);
      } else {
        const data = await response.json();
        setSaveError(data.error || 'Failed to save changes');
      }
    } catch {
      setSaveError('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function updateField(field: string, value: string | number) {
    setEditData(prev => prev ? { ...prev, [field]: value } : prev);
  }

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
        await saveAsPDF(signatureValue);
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

  async function saveAsPDF(overrideDentistSig?: string) {
    if (!patient) return;
    setIsSavingPDF(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const PW = 210, M = 14, CW = PW - 2 * M;
      let y = 14;

      const checkPage = (need = 20) => {
        if (y + need > 282) { doc.addPage(); y = 14; }
      };

      const sectionTitle = (title: string) => {
        checkPage(12);
        doc.setFontSize(9.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 80, 160);
        doc.text(title, M, y);
        y += 3.5;
        doc.setDrawColor(180, 200, 230); doc.setLineWidth(0.3);
        doc.line(M, y, PW - M, y);
        y += 4;
      };

      const imgBase64 = async (src: string): Promise<string | null> => {
        if (!src) return null;
        if (src.startsWith('data:')) return src;
        try {
          const r = await fetch(src);
          const b = await r.blob();
          return await new Promise<string | null>((res) => {
            const rd = new FileReader();
            rd.onload = () => res(rd.result as string);
            rd.onerror = () => res(null);
            rd.readAsDataURL(b);
          });
        } catch { return null; }
      };

      // ── Clinic Header ──
      doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(180, 110, 20);
      doc.text('HOLY CARE DENTAL & ORTHODONTICS CLINIC', PW / 2, y, { align: 'center' });
      y += 6;
      doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
      doc.text('Dr. Pinky Vijay MDS  |  Orthodontics & Dentofacial Orthopedics', PW / 2, y, { align: 'center' });
      y += 4.5;
      doc.text('Reg. No.: A-34195  |  Ph: +91 79772 57779', PW / 2, y, { align: 'center' });
      y += 4.5;
      doc.text('8/277, Rachel Enclave, Kavalkinaru Main Road, Kavalkinaru - 627105', PW / 2, y, { align: 'center' });
      y += 5;
      doc.setDrawColor(180, 110, 20); doc.setLineWidth(0.6);
      doc.line(M, y, PW - M, y);
      y += 5;

      // ── Form Title ──
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 30, 30);
      doc.text('PATIENT REGISTRATION FORM', PW / 2, y, { align: 'center' });
      y += 8;

      // ── IDs ──
      const idCW = CW / 3;
      doc.setFillColor(240, 245, 255);
      doc.roundedRect(M, y - 3, CW, 13, 1.5, 1.5, 'F');
      [
        { label: 'O.P. No.', val: patient.op_number_formatted },
        { label: 'Invoice No.', val: patient.invoice_number_formatted },
        { label: 'X-ray ID', val: patient.xray_id_formatted },
      ].forEach((item, i) => {
        const cx = M + i * idCW + idCW / 2;
        doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120);
        doc.text(item.label, cx, y + 1, { align: 'center' });
        doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 80, 160);
        doc.text(item.val, cx, y + 8, { align: 'center' });
      });
      y += 16;

      // ── Personal Information ──
      sectionTitle('Personal Information');
      doc.setFontSize(8.5); doc.setTextColor(50, 50, 50);
      const halfW = CW / 2 - 5;
      const pairs: [string, string, string, string][] = [
        ['Name', patient.name, 'Age', String(patient.age)],
        ['Sex', patient.sex, 'Phone', patient.phone],
        ['Occupation', patient.occupation || '\u2014', 'Method', patient.submission_method],
      ];
      pairs.forEach(([l1, v1, l2, v2]) => {
        checkPage(6);
        doc.setFont('helvetica', 'bold'); doc.text(l1 + ':', M, y);
        doc.setFont('helvetica', 'normal');
        const lines1 = doc.splitTextToSize(v1, halfW - 20);
        doc.text(lines1, M + 22, y);
        doc.setFont('helvetica', 'bold'); doc.text(l2 + ':', M + halfW + 5, y);
        doc.setFont('helvetica', 'normal'); doc.text(v2, M + halfW + 5 + 22, y);
        y += Math.max(lines1.length, 1) * 5;
      });
      checkPage(8);
      doc.setFont('helvetica', 'bold'); doc.text('Address:', M, y);
      doc.setFont('helvetica', 'normal');
      const addrLines = doc.splitTextToSize(patient.address || '\u2014', CW - 22);
      doc.text(addrLines, M + 22, y);
      y += Math.max(addrLines.length, 1) * 5;
      checkPage(8);
      doc.setFont('helvetica', 'bold'); doc.text('Chief Complaint:', M, y);
      doc.setFont('helvetica', 'normal');
      const ccLines = doc.splitTextToSize(patient.chief_complaint || '\u2014', CW - 38);
      doc.text(ccLines, M + 38, y);
      y += Math.max(ccLines.length, 1) * 5 + 3;

      // ── Medical History ──
      sectionTitle('Medical History');
      doc.setFontSize(8);
      const condCW = CW / 2;
      MEDICAL_CONDITIONS.forEach((cond, i) => {
        const col = i % 2;
        if (col === 0) { checkPage(6); if (i > 0) y += 5; }
        const x = M + col * condCW;
        const positive = !!(patient[cond.key as keyof Patient]);
        if (positive) {
          doc.setFillColor(255, 235, 235);
          doc.rect(x, y - 3.5, condCW - 2, 5, 'F');
          doc.setTextColor(190, 40, 40); doc.setFont('helvetica', 'bold');
          doc.text('[YES] ' + cond.english, x + 2, y);
        } else {
          doc.setTextColor(80, 80, 80); doc.setFont('helvetica', 'normal');
          doc.text('[NO]   ' + cond.english, x + 2, y);
        }
      });
      y += 8;

      // ── Clinical Information ──
      sectionTitle('Clinical Information');
      doc.setFontSize(8.5);
      [
        { label: 'Previous Dental History', val: patient.previous_dental_history || '\u2014' },
        { label: 'Diagnosis', val: patient.diagnosis || '\u2014' },
        { label: 'Treatment Plan', val: patient.treatment_plan || '\u2014' },
      ].forEach(({ label, val }) => {
        checkPage(12);
        doc.setFont('helvetica', 'bold'); doc.setTextColor(50, 50, 50); doc.text(label + ':', M, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(val, CW - 4);
        doc.text(lines, M + 4, y);
        y += lines.length * 4.5 + 4;
      });

      // ── Signatures ──
      checkPage(55);
      sectionTitle('Signatures');
      const sigW = CW / 2 - 5;
      const sigH = 30;
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(60, 60, 60);
      doc.text('Patient Signature', M, y);
      doc.text('Dentist Signature', M + sigW + 10, y);
      y += 4;
      doc.setDrawColor(190, 190, 190); doc.setLineWidth(0.3);
      doc.rect(M, y, sigW, sigH);
      doc.rect(M + sigW + 10, y, sigW, sigH);

      if (patient.patient_signature) {
        const img = await imgBase64(patient.patient_signature);
        if (img) { try { doc.addImage(img, 'PNG', M + 2, y + 2, sigW - 4, sigH - 4, '', 'FAST'); } catch { /* skip */ } }
      }
      const dSrc = (overrideDentistSig || patient.dentist_signature)?.replace('.jpg', '.png') || '';
      if (dSrc) {
        const img = await imgBase64(dSrc);
        if (img) { try { doc.addImage(img, 'PNG', M + sigW + 12, y + 4, sigW - 4, sigH - 8, '', 'FAST'); } catch { /* skip */ } }
      }
      y += sigH + 6;

      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(40, 130, 40);
      const approvedDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Approved by ${clinic?.doctor_name || 'Dr. Pinky Vijay MDS'} on ${approvedDate}`, M, y);

      // ── Save ──
      const safeName = patient.name.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_');
      doc.save(`${patient.op_number_formatted}_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsSavingPDF(false);
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
          <div className="text-4xl mb-4">&#x274C;</div>
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
            <div className="flex gap-2 flex-shrink-0 flex-wrap mt-2 sm:mt-0">
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
            className={`px-3 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${
              activeTab === 'registration'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-muted hover:text-body'
            }`}
          >
            Registration Form
          </button>
          <button
            onClick={() => setActiveTab('treatments')}
            className={`px-3 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${
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
            {/* Edit Controls */}
            <div className="flex items-center justify-between">
              <div />
              {!isEditing ? (
                <button
                  onClick={startEditing}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line-strong text-sm font-medium text-heading hover:bg-surface-alt transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Patient
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {saveError && (
                    <span className="text-red-600 text-sm mr-2">{saveError}</span>
                  )}
                  <button
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-lg border border-line-strong text-sm font-medium text-muted hover:text-heading hover:bg-surface-alt transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdits}
                    disabled={isSaving}
                    className="btn-primary text-sm inline-flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* IDs */}
            <div className="card">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
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
              {isEditing && editData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Name</label>
                    <input className="input-field" value={editData.name} onChange={e => updateField('name', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-field">Age</label>
                    <input className="input-field" type="number" min="0" max="150" value={editData.age} onChange={e => updateField('age', parseInt(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="label-field">Sex</label>
                    <select className="input-field" value={editData.sex} onChange={e => updateField('sex', e.target.value)}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Phone</label>
                    <input className="input-field" value={editData.phone} onChange={e => updateField('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-field">Occupation</label>
                    <input className="input-field" value={editData.occupation} onChange={e => updateField('occupation', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-field">Submission Method</label>
                    <p className="font-medium capitalize mt-1">{patient.submission_method}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-field">Address</label>
                    <input className="input-field" value={editData.address} onChange={e => updateField('address', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-field">Chief Complaint</label>
                    <textarea className="input-field min-h-[80px]" value={editData.chief_complaint as string} onChange={e => updateField('chief_complaint', e.target.value)} />
                  </div>
                </div>
              ) : (
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
              )}
            </div>

            {/* Medical History */}
            <div className="card">
              <h3 className="text-lg font-bold font-heading text-primary-700 mb-4 pb-2 border-b">Medical History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {MEDICAL_CONDITIONS.map((condition) => {
                  const value = isEditing && editData
                    ? editData[condition.key] as number
                    : patient[condition.key as keyof Patient] as number;
                  return (
                    <div
                      key={condition.key}
                      className={`flex items-center gap-2 p-2 rounded ${
                        isEditing ? 'cursor-pointer hover:bg-surface' : ''
                      } ${value ? 'bg-red-50' : 'bg-surface-alt'}`}
                      onClick={isEditing ? () => updateField(condition.key, value ? 0 : 1) : undefined}
                    >
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={!!value}
                          onChange={() => updateField(condition.key, value ? 0 : 1)}
                          className="w-4 h-4 accent-red-500"
                        />
                      ) : (
                        <span className={value ? 'text-red-500' : 'text-green-500'}>{value ? '!' : '\u2713'}</span>
                      )}
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
              {isEditing && editData ? (
                <div className="space-y-4">
                  <div>
                    <label className="label-field">Previous Dental History</label>
                    <textarea className="input-field min-h-[80px]" value={editData.previous_dental_history as string} onChange={e => updateField('previous_dental_history', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-field">Diagnosis</label>
                    <textarea className="input-field min-h-[80px]" value={editData.diagnosis as string} onChange={e => updateField('diagnosis', e.target.value)} />
                  </div>
                  <div>
                    <label className="label-field">Treatment Plan</label>
                    <textarea className="input-field min-h-[80px]" value={editData.treatment_plan as string} onChange={e => updateField('treatment_plan', e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div><span className="text-sm text-muted">Previous Dental History:</span><p className="font-medium mt-1">{patient.previous_dental_history || '-'}</p></div>
                  <div><span className="text-sm text-muted">Diagnosis:</span><p className="font-medium mt-1">{patient.diagnosis || '-'}</p></div>
                  <div><span className="text-sm text-muted">Treatment Plan:</span><p className="font-medium mt-1">{patient.treatment_plan || '-'}</p></div>
                </div>
              )}
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
                    <div className="flex flex-col gap-2">
                      <img src={patient.dentist_signature.replace('.jpg', '.png')} alt="Doctor Signature" className="h-16 object-contain" />
                      <span className="text-xs text-green-600 inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Approved{clinic?.doctor_name ? ` by ${clinic.doctor_name}` : ''}
                      </span>
                      <button
                        onClick={() => saveAsPDF()}
                        disabled={isSavingPDF}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60 transition-colors self-start"
                      >
                        {isSavingPDF ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Generating PDF...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Save as PDF
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="border-2 border-dashed border-amber-200 bg-amber-50 rounded-lg p-4 flex flex-col items-center justify-center gap-3 min-h-[8rem]">
                        <span className="text-sm text-amber-600 font-medium">Awaiting doctor approval</span>
                        <div className="flex gap-2 flex-wrap justify-center">
                          <button
                            onClick={startEditing}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line-strong text-sm font-medium text-heading bg-white hover:bg-surface-alt transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit Form
                          </button>
                          <button
                            onClick={approveWithSignature}
                            disabled={isApproving}
                            className="btn-primary text-sm inline-flex items-center gap-2"
                          >
                            {isApproving ? 'Approving & Saving PDF...' : (
                              <>
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Approve, Sign &amp; Save PDF
                              </>
                            )}
                          </button>
                        </div>
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
                <div className="text-4xl mb-2">&#x1F4CB;</div>
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
                      <th className="text-right p-4 text-sm font-semibold text-primary-700 whitespace-nowrap">Cost</th>
                      <th className="text-right p-4 text-sm font-semibold text-primary-700 whitespace-nowrap">Paid</th>
                      <th className="text-right p-4 text-sm font-semibold text-primary-700 whitespace-nowrap">Balance</th>
                      <th className="text-right p-4 text-sm font-semibold text-primary-700 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatments.map((t) => (
                      <tr key={t.id} className="border-b border-line-subtle">
                        {editingTreatmentId === t.id && treatmentEditData ? (
                          <>
                            <td className="p-2">
                              <input
                                type="date"
                                className="input-field text-sm py-1.5"
                                value={treatmentEditData.appointment_date}
                                onChange={e => setTreatmentEditData(d => d ? { ...d, appointment_date: e.target.value } : d)}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                className="input-field text-sm py-1.5 w-full"
                                value={treatmentEditData.description}
                                onChange={e => setTreatmentEditData(d => d ? { ...d, description: e.target.value } : d)}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                className="input-field text-sm py-1.5 text-right w-24"
                                value={treatmentEditData.amount}
                                onChange={e => setTreatmentEditData(d => d ? { ...d, amount: Number(e.target.value) } : d)}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                className="input-field text-sm py-1.5 text-right w-24"
                                value={treatmentEditData.amount_paid}
                                onChange={e => setTreatmentEditData(d => d ? { ...d, amount_paid: Number(e.target.value) } : d)}
                              />
                            </td>
                            <td className="p-2 text-right text-sm font-medium whitespace-nowrap">
                              &#x20B9; {((treatmentEditData.amount || 0) - (treatmentEditData.amount_paid || 0)).toLocaleString('en-IN')}
                            </td>
                            <td className="p-2 text-right whitespace-nowrap">
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => saveTreatment(t.id)}
                                  disabled={savingTreatmentId === t.id}
                                  className="text-xs font-medium px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors min-h-[36px]"
                                >
                                  {savingTreatmentId === t.id ? '...' : 'Save'}
                                </button>
                                <button
                                  onClick={cancelEditingTreatment}
                                  className="text-xs font-medium px-3 py-2 rounded-lg border border-line-strong text-muted hover:text-heading hover:bg-surface-alt transition-colors min-h-[36px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-4 text-sm whitespace-nowrap">
                              {new Date(t.appointment_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="p-4 text-sm">{t.description}</td>
                            <td className="p-4 text-sm text-right font-medium whitespace-nowrap">&#x20B9; {t.amount.toLocaleString('en-IN')}</td>
                            <td className="p-4 text-sm text-right font-medium whitespace-nowrap text-green-600">&#x20B9; {(t.amount_paid || 0).toLocaleString('en-IN')}</td>
                            <td className={`p-4 text-sm text-right font-medium whitespace-nowrap ${(t.amount - (t.amount_paid || 0)) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              &#x20B9; {(t.amount - (t.amount_paid || 0)).toLocaleString('en-IN')}
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => startEditingTreatment(t)}
                                  className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1.5 rounded hover:bg-primary-50 transition-colors"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                {confirmDeleteTreatmentId === t.id ? (
                                  <div className="flex gap-1 items-center">
                                    <button
                                      onClick={() => deleteTreatment(t.id)}
                                      className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-1.5 rounded transition-colors"
                                    >Yes</button>
                                    <button
                                      onClick={() => setConfirmDeleteTreatmentId(null)}
                                      className="text-xs text-muted hover:text-heading px-2 py-1.5 rounded hover:bg-surface-alt transition-colors"
                                    >No</button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmDeleteTreatmentId(t.id)}
                                    className="text-xs text-red-400 hover:text-red-600 font-medium px-2 py-1.5 rounded hover:bg-red-50 transition-colors"
                                    title="Delete"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-primary-50 border-t-2 border-primary-200">
                      <td colSpan={2} className="p-4 text-sm font-bold text-primary-700">Grand Total</td>
                      <td className="p-4 text-right font-bold text-primary-700">
                        &#x20B9; {totalBilling.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-right font-bold text-green-600">
                        &#x20B9; {treatments.reduce((s, t) => s + (t.amount_paid || 0), 0).toLocaleString('en-IN')}
                      </td>
                      <td className={`p-4 text-right font-bold ${(totalBilling - treatments.reduce((s, t) => s + (t.amount_paid || 0), 0)) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        &#x20B9; {(totalBilling - treatments.reduce((s, t) => s + (t.amount_paid || 0), 0)).toLocaleString('en-IN')}
                      </td>
                      <td></td>
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
