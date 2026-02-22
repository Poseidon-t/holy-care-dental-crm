'use client';

import { useState, useEffect } from 'react';
import TreatmentForm from '@/components/TreatmentForm';

export default function AddTreatmentPage({ params }: { params: { patientId: string } }) {
  const { patientId } = params;
  const [patient, setPatient] = useState<{ id: number; name: string; op_number_formatted: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await fetch(`/api/patients/${patientId}`);
        const data = await response.json();
        if (response.ok) {
          setPatient({
            id: data.patient.id,
            name: data.patient.name,
            op_number_formatted: data.patient.op_number_formatted,
          });
        } else {
          setError(data.error || 'Patient not found');
        }
      } catch {
        setError('Failed to fetch patient data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchPatient();
  }, [patientId]);

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
      <header className="bg-surface shadow-sm border-b border-line-strong">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold font-heading text-heading">Add Treatment Record</h1>
              <p className="text-sm text-muted mt-1">
                For {patient.name} ({patient.op_number_formatted})
              </p>
            </div>
            <a href="/dashboard" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TreatmentForm
          patientId={patient.id}
          patientName={patient.name}
          opNumber={patient.op_number_formatted}
        />
      </main>
    </div>
  );
}
