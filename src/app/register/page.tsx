'use client';

import { useState, useEffect } from 'react';
import PatientForm from '@/components/PatientForm';

function formatNumbersLocal(num: number) {
  return {
    opNumber: `OP-${String(num).padStart(3, '0')}`,
    invoiceNumber: `INV-${String(num).padStart(3, '0')}`,
    xrayId: `XRAY-${String(num).padStart(3, '0')}`,
  };
}

export default function TabletRegistrationPage() {
  const [autoNumbers, setAutoNumbers] = useState<{ opNumber: string; invoiceNumber: string; xrayId: string } | null>(null);

  useEffect(() => {
    async function fetchNumbers() {
      try {
        const response = await fetch('/api/patients');
        const data = await response.json();
        const nextNum = (data.patients?.length || 0) + 1;
        setAutoNumbers(formatNumbersLocal(nextNum));
      } catch {
        setAutoNumbers(formatNumbersLocal(1));
      }
    }
    fetchNumbers();
  }, []);

  return (
    <PatientForm
      mode="tablet"
      autoNumbers={autoNumbers || undefined}
    />
  );
}
