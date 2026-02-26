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
    default: 'Holy Care Dental & Orthodontics',
    template: '%s | Holy Care Dental',
  },
  description:
    'Holy Care Dental & Orthodontics — Quality dental care in Tirunelveli and Kavalkinaru. Braces, aligners, dental implants, root canals, and more by Dr. Ruby BDS.',
  keywords: [
    'dental clinic Tirunelveli',
    'orthodontist Tirunelveli',
    'dental implants',
    'braces',
    'root canal treatment',
    'Holy Care Dental',
    'dentist Kavalkinaru',
    'Dr Ruby dentist',
  ],
  creator: 'Holy Care Dental',
  publisher: 'Holy Care Dental',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Holy Care Dental & Orthodontics',
    title: 'Holy Care Dental & Orthodontics',
    description:
      'Quality dental care in Tirunelveli and Kavalkinaru. Braces, aligners, implants, root canals, and more.',
    images: [
      {
        url: '/images/clinic-exterior-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Holy Care Dental & Orthodontics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Holy Care Dental & Orthodontics',
    description:
      'Quality dental care in Tirunelveli and Kavalkinaru.',
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
      name: 'Holy Care Dental & Orthodontics',
      url: SITE_URL,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      description:
        'Holy Care Dental & Orthodontics — Quality dental care in Tirunelveli and Kavalkinaru.',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Holy Care Dental',
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
        <meta name="apple-mobile-web-app-title" content="Holy Care" />
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
