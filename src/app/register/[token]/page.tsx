'use client';

import { useState, useEffect } from 'react';
import PatientForm from '@/components/PatientForm';

export default function RemoteRegistrationPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function validateLink() {
      try {
        const response = await fetch(`/api/links/${token}`);
        const data = await response.json();
        if (data.valid) {
          setIsValid(true);
        } else {
          setIsValid(false);
          setError(data.error || 'This link is invalid or has already been used');
        }
      } catch {
        setIsValid(false);
        setError('Failed to validate the registration link');
      }
    }
    validateLink();
  }, [token]);

  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100">
        <div className="card text-center py-12">
          <svg className="animate-spin h-10 w-10 mx-auto mb-4 text-primary-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-600">Validating your registration link...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 p-4">
        <div className="card text-center max-w-md w-full py-12">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Link</h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-gray-500 text-sm mt-4 tamil">
            இந்த இணைப்பு செல்லாதது அல்லது ஏற்கனவே பயன்படுத்தப்பட்டது
          </p>
        </div>
      </div>
    );
  }

  return <PatientForm mode="remote" linkToken={token} />;
}
