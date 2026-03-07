'use client';

import { useState, useRef } from 'react';

interface TreatmentEntry {
  id: number;
  appointment_date: string;
  description: string;
  amount: string;
  amount_paid: string;
}

interface ClinicData {
  doctor_name?: string | null;
}

interface TreatmentFormProps {
  patientId: number;
  patientName: string;
  opNumber: string;
  onSuccess?: () => void;
  clinic?: ClinicData;
}

export default function TreatmentForm({ patientId, patientName, opNumber, onSuccess, clinic }: TreatmentFormProps) {
  const [entries, setEntries] = useState<TreatmentEntry[]>([
    { id: 1, appointment_date: new Date().toISOString().split('T')[0], description: '', amount: '', amount_paid: '' },
  ]);
  const signature = '/images/dr-pinky-signature.png';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const nextIdRef = useRef(2);

  const addRow = () => {
    const id = nextIdRef.current++;
    setEntries(prev => [
      ...prev,
      { id, appointment_date: new Date().toISOString().split('T')[0], description: '', amount: '', amount_paid: '' },
    ]);
  };

  const removeRow = (id: number) => {
    if (entries.length <= 1) return;
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const updateEntry = (id: number, field: keyof TreatmentEntry, value: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const grandTotal = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validEntries = entries.filter(e => e.description.trim());
    if (validEntries.length === 0) {
      setError('At least one treatment entry with description is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/treatments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          treatments: validEntries.map(e => ({
            appointment_date: e.appointment_date,
            description: e.description,
            amount: parseFloat(e.amount) || 0,
            amount_paid: parseFloat(e.amount_paid) || 0,
          })),
          signature,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save treatments');

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold font-heading text-primary-700 mb-2">Treatment Records Saved</h2>
        <p className="text-body mb-6">
          Treatment records for {patientName} ({opNumber}) have been saved successfully.
        </p>
        <div className="flex gap-4 justify-center">
          <a href={`/dashboard/patient/${patientId}`} className="btn-primary">
            View Patient Details
          </a>
          <a href="/dashboard" className="btn-secondary">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
          <h2 className="text-lg font-bold font-heading text-primary-700">
            Treatment Record &amp; Billing
            <span className="tamil text-sm font-normal text-muted ml-2">(சிகிச்சை பதிவு &amp; பில்லிங்)</span>
          </h2>
          <div className="text-sm text-body">
            <span className="font-semibold">{patientName}</span> | {opNumber}
          </div>
        </div>

        {/* Treatment Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-50">
                <th className="text-left p-3 text-sm font-semibold text-primary-700 rounded-tl-lg">
                  Appointment Date<br />
                  <span className="tamil text-xs font-normal text-muted">சந்திப்பு தேதி</span>
                </th>
                <th className="text-left p-3 text-sm font-semibold text-primary-700">
                  Description<br />
                  <span className="tamil text-xs font-normal text-muted">விவரம்</span>
                </th>
                <th className="text-left p-3 text-sm font-semibold text-primary-700 w-28">
                  Cost (₹)<br />
                  <span className="tamil text-xs font-normal text-muted">செலவு</span>
                </th>
                <th className="text-left p-3 text-sm font-semibold text-primary-700 w-28">
                  Paid (₹)<br />
                  <span className="tamil text-xs font-normal text-muted">செலுத்தியது</span>
                </th>
                <th className="p-3 w-12 rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-line">
                  <td className="p-2">
                    <input
                      type="date"
                      className="input-field"
                      value={entry.appointment_date}
                      onChange={e => updateEntry(entry.id, 'appointment_date', e.target.value)}
                      required
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="input-field"
                      value={entry.description}
                      onChange={e => updateEntry(entry.id, 'description', e.target.value)}
                      placeholder="Treatment description"
                      required
                    />
                  </td>
                  <td className="p-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-faint font-medium">₹</span>
                      <input
                        type="number"
                        className="input-field pl-8"
                        value={entry.amount}
                        onChange={e => updateEntry(entry.id, 'amount', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-faint font-medium">₹</span>
                      <input
                        type="number"
                        className="input-field pl-8"
                        value={entry.amount_paid}
                        onChange={e => updateEntry(entry.id, 'amount_paid', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </td>
                  <td className="p-2">
                    {entries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(entry.id)}
                        className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Remove row"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <button
          type="button"
          onClick={addRow}
          className="mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors min-h-[44px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Row
        </button>

        {/* Grand Total */}
        <div className="flex justify-end mt-4 pt-4 border-t-2 border-primary-200">
          <div className="flex gap-6 items-center">
            <div className="text-right">
              <span className="text-xs text-muted block">Total Cost</span>
              <span className="text-lg font-bold text-primary-700">₹ {grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted block">Total Paid</span>
              <span className="text-lg font-bold text-green-600">₹ {entries.reduce((s, e) => s + (parseFloat(e.amount_paid) || 0), 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted block">Balance</span>
              <span className={`text-lg font-bold ${(grandTotal - entries.reduce((s, e) => s + (parseFloat(e.amount_paid) || 0), 0)) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹ {(grandTotal - entries.reduce((s, e) => s + (parseFloat(e.amount_paid) || 0), 0)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Signature — Auto-filled */}
      <div className="card">
        <h3 className="text-sm font-semibold text-heading mb-3">
          Doctor Signature <span className="tamil text-xs font-normal text-muted ml-1">(மருத்துவர் கையொப்பம்)</span>
        </h3>
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <img src="/images/dr-pinky-signature.png" alt="Doctor Signature" className="h-12 object-contain" />
          <div>
            <p className="text-sm font-medium text-green-700 flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              {clinic?.doctor_name || 'Doctor'}
            </p>
            <p className="text-xs text-green-600 mt-0.5">Signature will be auto-applied on save</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-4 justify-end">
        <a href={`/dashboard/patient/${patientId}`} className="btn-secondary">
          Cancel
        </a>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : (
            'Save Treatment Records'
          )}
        </button>
      </div>
    </form>
  );
}
