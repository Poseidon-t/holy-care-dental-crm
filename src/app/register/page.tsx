'use client';

import { useState, useEffect } from 'react';
import PatientForm from '@/components/PatientForm';
import type { ClinicInfo } from '@/components/ClinicHeader';

function formatNumbersLocal(num: number) {
  return {
    opNumber: `OP-${String(num).padStart(3, '0')}`,
    invoiceNumber: `INV-${String(num).padStart(3, '0')}`,
    xrayId: `XRAY-${String(num).padStart(3, '0')}`,
  };
}

export default function TabletRegistrationPage() {
  const [autoNumbers, setAutoNumbers] = useState<{ opNumber: string; invoiceNumber: string; xrayId: string } | null>(null);
  const [clinic, setClinic] = useState<ClinicInfo | undefined>(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsRes, clinicRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/clinic'),
        ]);
        const patientsData = await patientsRes.json();
        const clinicData = await clinicRes.json();

        const nextNum = (patientsData.patients?.length || 0) + 1;
        setAutoNumbers(formatNumbersLocal(nextNum));
        if (clinicData.clinic) setClinic(clinicData.clinic);
      } catch {
        setAutoNumbers(formatNumbersLocal(1));
      }
    }
    fetchData();
  }, []);

  return (
    <PatientForm
      mode="tablet"
      autoNumbers={autoNumbers || undefined}
      clinic={clinic}
    />
  );
}
