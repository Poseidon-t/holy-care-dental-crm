import type { Metadata } from 'next';
import SaasLandingPage from '@/components/SaasLandingPage';

export const metadata: Metadata = {
  title: 'ClinicFlow | Patient Management for Modern Clinics',
  description:
    'Simple, powerful patient management system for clinics and solo doctors across India. Register patients, manage treatments, generate reports. Start free today.',
  openGraph: {
    title: 'ClinicFlow | Patient Management for Modern Clinics',
    description:
      'Simple, powerful patient management for clinics and solo doctors. Start free today.',
    type: 'website',
  },
};

export default function Page() {
  return <SaasLandingPage />;
}
