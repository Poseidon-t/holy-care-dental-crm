'use client';

import { useState, useEffect } from 'react';

interface ClinicData {
  name: string;
  doctor_name: string;
  specialization: string;
  registration_number: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState<ClinicData>({
    name: '',
    doctor_name: '',
    specialization: '',
    registration_number: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Load existing clinic data
  useEffect(() => {
    async function loadClinic() {
      try {
        const res = await fetch('/api/clinic');
        const data = await res.json();
        if (data.clinic) {
          setForm({
            name: data.clinic.name || '',
            doctor_name: data.clinic.doctor_name || '',
            specialization: data.clinic.specialization || '',
            registration_number: data.clinic.registration_number || '',
            phone: data.clinic.phone || '',
            email: data.clinic.email || '',
            address: data.clinic.address || '',
            city: data.clinic.city || '',
            state: data.clinic.state || '',
            pincode: data.clinic.pincode || '',
          });
          if (data.clinic.logo_url) setLogoPreview(data.clinic.logo_url);
        }
      } catch {
        // New clinic, use defaults
      } finally {
        setIsLoading(false);
      }
    }
    loadClinic();
  }, []);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be under 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await fetch('/api/clinic/logo', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setLogoPreview(data.logo_url);
        setError('');
      } else {
        setError(data.error || 'Failed to upload logo');
      }
    } catch {
      setError('Failed to upload logo');
    }
  };

  const saveAndNext = async () => {
    setError('');
    setIsSaving(true);

    try {
      const res = await fetch('/api/clinic', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      if (step < 3) {
        setStep(step + 1);
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <svg className="animate-spin h-10 w-10 text-primary-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-heading text-primary-700">Set Up Your Clinic</h1>
          <p className="text-sm text-muted mt-1">Complete these steps to get started</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s < step ? 'bg-green-500 text-white' :
                s === step ? 'bg-primary-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {s < step ? (
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : s}
              </div>
              {s < 3 && <div className={`w-12 h-1 rounded ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card">
          {/* Step 1: Clinic Identity */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold font-heading text-heading mb-1">Clinic Identity</h2>
              <p className="text-sm text-muted mb-6">Upload your logo and confirm your clinic name.</p>

              <div className="space-y-4">
                {/* Logo Upload */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-xl bg-surface-alt border-2 border-dashed border-line flex items-center justify-center overflow-hidden flex-shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Clinic Logo" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <label className="btn-secondary text-sm cursor-pointer inline-block">
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      Upload Logo
                    </label>
                    <p className="text-xs text-muted mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>

                <div>
                  <label className="label-field">Clinic Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.name}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="My Dental Clinic"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Doctor & Contact Details */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold font-heading text-heading mb-1">Doctor & Contact Details</h2>
              <p className="text-sm text-muted mb-6">This information appears on patient reports and forms.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Doctor Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.doctor_name}
                      onChange={e => updateField('doctor_name', e.target.value)}
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div>
                    <label className="label-field">Specialization</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.specialization}
                      onChange={e => updateField('specialization', e.target.value)}
                      placeholder="Orthodontics, General Dentistry..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Registration Number</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.registration_number}
                      onChange={e => updateField('registration_number', e.target.value)}
                      placeholder="A-12345"
                    />
                  </div>
                  <div>
                    <label className="label-field">Phone</label>
                    <input
                      type="tel"
                      className="input-field"
                      value={form.phone}
                      onChange={e => updateField('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-field">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="clinic@example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address & Review */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold font-heading text-heading mb-1">Address & Review</h2>
              <p className="text-sm text-muted mb-6">Your clinic address and final review.</p>

              <div className="space-y-4">
                <div>
                  <label className="label-field">Street Address</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    value={form.address}
                    onChange={e => updateField('address', e.target.value)}
                    placeholder="123, Main Road, Landmark"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label-field">City</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.city}
                      onChange={e => updateField('city', e.target.value)}
                      placeholder="Chennai"
                    />
                  </div>
                  <div>
                    <label className="label-field">State</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.state}
                      onChange={e => updateField('state', e.target.value)}
                      placeholder="Tamil Nadu"
                    />
                  </div>
                  <div>
                    <label className="label-field">Pincode</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.pincode}
                      onChange={e => updateField('pincode', e.target.value)}
                      placeholder="600001"
                    />
                  </div>
                </div>

                {/* Review Summary */}
                <div className="bg-surface-alt rounded-xl p-4 mt-4">
                  <h3 className="text-sm font-semibold text-heading mb-3">Review Your Setup</h3>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
                    <div>
                      <span className="text-muted">Clinic:</span>
                      <p className="font-medium">{form.name || '-'}</p>
                    </div>
                    <div>
                      <span className="text-muted">Doctor:</span>
                      <p className="font-medium">{form.doctor_name || '-'}</p>
                    </div>
                    <div>
                      <span className="text-muted">Specialization:</span>
                      <p className="font-medium">{form.specialization || '-'}</p>
                    </div>
                    <div>
                      <span className="text-muted">Phone:</span>
                      <p className="font-medium">{form.phone || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted">Address:</span>
                      <p className="font-medium">
                        {[form.address, form.city, form.state, form.pincode].filter(Boolean).join(', ') || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mt-4">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-line">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="btn-secondary text-sm">
                Back
              </button>
            ) : (
              <a href="/dashboard" className="text-sm text-muted hover:text-body">
                Skip for now
              </a>
            )}

            <button onClick={saveAndNext} disabled={isSaving} className="btn-primary">
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : step === 3 ? (
                'Finish Setup'
              ) : (
                'Next'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
