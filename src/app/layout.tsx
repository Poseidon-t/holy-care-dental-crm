import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSetting } from '@/lib/db';
import { ThemeSelectorWrapper } from '@/components/ThemeSelectorWrapper';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Holy Care Dental CRM',
  description: 'Patient Management System for Holy Care Dental & Orthodontic Clinic',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = getSetting('theme') || 'classic';

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦷</text></svg>" />
      </head>
      <body className="min-h-screen">
        {children}
        <ThemeSelectorWrapper currentTheme={theme} />
      </body>
    </html>
  );
}
