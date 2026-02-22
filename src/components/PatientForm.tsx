'use client';

import { useState } from 'react';
import SignatureCanvas from './SignatureCanvas';
import ClinicHeader from './ClinicHeader';

interface PatientFormProps {
  mode: 'tablet' | 'remote';
  linkToken?: string;
  autoNumbers?: { opNumber: string; invoiceNumber: string; xrayId: string };
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

export default function PatientForm({ mode, linkToken, autoNumbers }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    address: '',
    phone: '',
    occupation: '',
    chief_complaint: '',
    ...Object.fromEntries(MEDICAL_CONDITIONS.map(c => [c.key, false])),
    previous_dental_history: '',
    diagnosis: '',
    treatment_plan: '',
    consent_agreed: false,
    patient_signature: '',
    dentist_signature: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) { setError('Patient name is required'); return; }
    if (!formData.age || parseInt(formData.age) <= 0) { setError('Valid age is required'); return; }
    if (!formData.sex) { setError('Sex is required'); return; }
    if (!formData.phone.trim()) { setError('Phone number is required'); return; }
    if (formData.phone.trim().length < 10) { setError('Please enter a valid phone number'); return; }
    if (!formData.consent_agreed) { setError('Consent must be agreed before submission'); return; }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          submission_method: mode,
          link_token: linkToken || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitted(true);

      // In tablet mode, auto-redirect after 5 seconds
      if (mode === 'tablet') {
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 p-4">
        <div className="card text-center max-w-lg w-full py-12">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-primary-700 mb-2">Thank You!</h2>
          {mode === 'tablet' ? (
            <>
              <p className="text-gray-600 text-lg">Please take a seat.</p>
              <p className="text-gray-600 text-lg tamil">தயவுசெய்து அமரவும்.</p>
              <p className="text-gray-400 text-sm mt-4">Form will reset in 5 seconds...</p>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-lg">Your information has been submitted successfully.</p>
              <p className="text-gray-600 text-lg tamil mt-1">உங்கள் தகவல் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card mb-6">
          <ClinicHeader />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auto-generated Numbers */}
          {autoNumbers && (
            <div className="card">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-xs text-gray-500 block">O.P. No.</span>
                  <span className="font-bold text-primary-700">{autoNumbers.opNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Invoice No.</span>
                  <span className="font-bold text-primary-700">{autoNumbers.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">X-ray ID No.</span>
                  <span className="font-bold text-primary-700">{autoNumbers.xrayId}</span>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="card">
            <h2 className="text-lg font-bold text-primary-700 mb-4 pb-2 border-b">
              Personal Information
              <span className="tamil text-sm font-normal text-gray-500 ml-2">(தனிப்பட்ட தகவல்)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label-field">
                  Name <span className="tamil text-gray-500">(பெயர்)</span>
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </div>

              <div>
                <label className="label-field">
                  Age <span className="tamil text-gray-500">(வயது)</span>
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.age}
                  onChange={e => updateField('age', e.target.value)}
                  placeholder="Age"
                  min="0"
                  max="150"
                  required
                />
              </div>

              <div>
                <label className="label-field">
                  Sex <span className="tamil text-gray-500">(பாலினம்)</span>
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  className="input-field"
                  value={formData.sex}
                  onChange={e => updateField('sex', e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male (ஆண்)</option>
                  <option value="Female">Female (பெண்)</option>
                  <option value="Other">Other (மற்றவை)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label-field">
                  Address <span className="tamil text-gray-500">(முகவரி)</span>
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={formData.address}
                  onChange={e => updateField('address', e.target.value)}
                  placeholder="Full address"
                />
              </div>

              <div>
                <label className="label-field">
                  Phone <span className="tamil text-gray-500">(தொலைபேசி)</span>
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  className="input-field"
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="10-digit phone number"
                  required
                />
              </div>

              <div>
                <label className="label-field">
                  Occupation <span className="tamil text-gray-500">(தொழில்)</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.occupation}
                  onChange={e => updateField('occupation', e.target.value)}
                  placeholder="Occupation"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label-field">
                  Chief Complaint <span className="tamil text-gray-500">(முக்கிய வலுவையின் நோயாகும்)</span>
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={formData.chief_complaint}
                  onChange={e => updateField('chief_complaint', e.target.value)}
                  placeholder="Describe the main dental complaint"
                />
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="card">
            <h2 className="text-lg font-bold text-primary-700 mb-4 pb-2 border-b">
              Medical History
              <span className="tamil text-sm font-normal text-gray-500 ml-2">(மருத்துவ வரலாறு)</span>
            </h2>

            <div className="space-y-3">
              {MEDICAL_CONDITIONS.map((condition) => (
                <div key={condition.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label className="flex-1 text-sm font-medium text-gray-700 cursor-pointer" htmlFor={condition.key}>
                    {condition.english}
                    <span className="tamil text-gray-500 ml-1 text-xs">({condition.tamil})</span>
                  </label>
                  <div className="flex items-center gap-4 ml-4">
                    <label className="flex items-center gap-1.5 cursor-pointer min-h-[44px] px-2">
                      <input
                        type="radio"
                        name={condition.key}
                        checked={formData[condition.key as keyof typeof formData] === true}
                        onChange={() => updateField(condition.key, true)}
                        className="w-5 h-5 text-primary-600"
                      />
                      <span className="text-sm font-medium text-green-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer min-h-[44px] px-2">
                      <input
                        type="radio"
                        name={condition.key}
                        checked={formData[condition.key as keyof typeof formData] === false}
                        onChange={() => updateField(condition.key, false)}
                        className="w-5 h-5 text-primary-600"
                      />
                      <span className="text-sm font-medium text-gray-500">No</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="card">
            <h2 className="text-lg font-bold text-primary-700 mb-4 pb-2 border-b">
              Additional Information
              <span className="tamil text-sm font-normal text-gray-500 ml-2">(கூடுதல் தகவல்)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="label-field">
                  Previous Dental History <span className="tamil text-gray-500">(முந்தைய பல் வரலாறு)</span>
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={formData.previous_dental_history}
                  onChange={e => updateField('previous_dental_history', e.target.value)}
                  placeholder="Any previous dental treatments or procedures"
                />
              </div>

              <div>
                <label className="label-field">
                  Diagnosis <span className="tamil text-gray-500">(நோயறிதல்)</span>
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={formData.diagnosis}
                  onChange={e => updateField('diagnosis', e.target.value)}
                  placeholder="Diagnosis"
                />
              </div>

              <div>
                <label className="label-field">
                  Treatment Plan <span className="tamil text-gray-500">(சிகிச்சை திட்டம்)</span>
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={formData.treatment_plan}
                  onChange={e => updateField('treatment_plan', e.target.value)}
                  placeholder="Proposed treatment plan"
                />
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="card">
            <h2 className="text-lg font-bold text-primary-700 mb-4 pb-2 border-b">
              Consent <span className="tamil text-sm font-normal text-gray-500 ml-2">(ஒப்புதல்)</span>
              <span className="text-red-500 ml-1">*</span>
            </h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                I hereby give consent to the dentist and those under his professional supervision to prescribe and
                perform whatever dental treatment, dental operation, anesthesia or other dental procedure which is
                deemed necessary (or) appropriate and mutually agreed upon.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mt-2 tamil">
                மேற்படி மருத்துவர் அவர்களும் அவர்களுடைய பார்வையிலுள்லவர்களும் வயங்களும் என்மீது
                செய்யப்படவேண்டிய சிகிச்சை முறைகள்,செயல் முறைகள்,மயக்கமருந்து புழங்குதல் என் மருத்தை
                செய்யும் பயன்படுகி முந்தை பதில தகவலைகளை தெரிவர்மாறும் முழு மன ரதான எமக்குகிறேன்.
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg min-h-[44px]">
              <input
                type="checkbox"
                checked={formData.consent_agreed}
                onChange={e => updateField('consent_agreed', e.target.checked)}
                className="w-6 h-6 text-primary-600 rounded"
              />
              <span className="font-medium text-gray-700">
                I agree to the above consent
                <span className="tamil text-gray-500 ml-1 text-sm">(நான் மேற்கூறிய ஒப்புதலுக்கு இணங்குகிறேன்)</span>
              </span>
            </label>
          </div>

          {/* Signatures */}
          <div className="card">
            <h2 className="text-lg font-bold text-primary-700 mb-4 pb-2 border-b">
              Signatures <span className="tamil text-sm font-normal text-gray-500 ml-2">(கையொப்பங்கள்)</span>
            </h2>

            <div className={`grid grid-cols-1 ${mode === 'tablet' ? 'md:grid-cols-2' : ''} gap-6`}>
              <SignatureCanvas
                label="Patient Signature"
                tamilLabel="நோயாளியின் கையொப்பம்"
                value={formData.patient_signature}
                onChange={val => updateField('patient_signature', val)}
              />
              {mode === 'tablet' && (
                <SignatureCanvas
                  label="Signature of Dentist"
                  tamilLabel="பல் மருத்துவரின் கையொப்பம்"
                  value={formData.dentist_signature}
                  onChange={val => updateField('dentist_signature', val)}
                />
              )}
              {mode === 'remote' && (
                <p className="text-sm text-gray-500 italic mt-2">
                  Doctor&apos;s signature will be added during your clinic visit.
                  <span className="tamil block text-xs mt-1">(மருத்துவரின் கையொப்பம் கிளினிக் வருகையின் போது சேர்க்கப்படும்)</span>
                </p>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-center pb-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-lg px-12 py-4"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                <>Submit Registration <span className="tamil ml-1">(பதிவு செய்)</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
