import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';

export const dynamic = 'force-dynamic';

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

export default async function Page() {
  return <HomePage theme="classic" />;
}
