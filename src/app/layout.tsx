import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSetting } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ThemeSelectorWrapper } from '@/components/ThemeSelectorWrapper';
import { ChatWidget } from '@/components/ChatWidget';
import { UpdateBanner } from '@/components/UpdateBanner';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.holycareortho.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ClinicFlow | Patient Management for Modern Clinics',
    template: '%s | ClinicFlow',
  },
  description:
    'Simple, powerful patient management system for clinics and solo doctors. Register patients, manage treatments, generate reports, and more. Start free today.',
  keywords: [
    'clinic management',
    'patient management system',
    'doctor software',
    'medical practice management',
    'patient records',
    'treatment management',
    'clinic software India',
    'healthcare SaaS',
  ],
  creator: 'ClinicFlow',
  publisher: 'ClinicFlow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'ClinicFlow',
    title: 'ClinicFlow | Patient Management for Modern Clinics',
    description:
      'Simple, powerful patient management system for clinics and solo doctors. Start free today.',
    images: [
      {
        url: '/images/clinic-exterior-1.jpg',
        width: 1200,
        height: 630,
        alt: 'ClinicFlow - Patient Management System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClinicFlow | Patient Management for Modern Clinics',
    description:
      'Simple, powerful patient management for clinics and solo doctors.',
    images: ['/images/clinic-exterior-1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#application`,
      name: 'ClinicFlow',
      url: SITE_URL,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      description:
        'Patient management system for clinics and solo doctors. Manage patient records, treatments, billing, and reports.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        description: 'Free plan with up to 50 patients',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'ClinicFlow',
      publisher: { '@id': `${SITE_URL}/#application` },
      inLanguage: 'en',
    },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let theme = 'classic';
  try {
    const session = await getSession();
    if (session?.clinicId) {
      theme = await getSetting(session.clinicId, 'theme') || 'classic';
    }
  } catch {
    // No session or DB error — use default theme
  }

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ClinicFlow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen">
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
        {children}
        <ThemeSelectorWrapper currentTheme={theme} />
        <ChatWidget />
        <UpdateBanner />
      </body>
    </html>
  );
}
