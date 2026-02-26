import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSetting } from '@/lib/db';
import { ThemeSelectorWrapper } from '@/components/ThemeSelectorWrapper';
import { ChatWidget } from '@/components/ChatWidget';
import { UpdateBanner } from '@/components/UpdateBanner';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://www.holycareortho.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Holy Care Dental & Orthodontics Clinic | Kavalkinaru, Tamil Nadu',
    template: '%s | Holy Care Dental & Orthodontics Clinic',
  },
  description:
    'Expert dental care in Kavalkinaru, Tamil Nadu. Dr. Pinky Vijay MDS offers orthodontics, root canal, dental implants, teeth whitening, pediatric dentistry & more. Book your appointment today.',
  keywords: [
    'dentist Kavalkinaru',
    'dental clinic Tamil Nadu',
    'orthodontist near me',
    'root canal treatment',
    'dental implants',
    'teeth whitening',
    'pediatric dentist',
    'Holy Care Dental',
    'Dr Pinky Vijay',
    'braces',
    'aligners',
    'பல் மருத்துவர்',
    'பல் சிகிச்சை',
  ],
  authors: [{ name: 'Dr. Pinky Vijay', url: SITE_URL }],
  creator: 'Holy Care Dental & Orthodontics Clinic',
  publisher: 'Holy Care Dental & Orthodontics Clinic',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Holy Care Dental & Orthodontics Clinic',
    title: 'Holy Care Dental & Orthodontics Clinic | Kavalkinaru',
    description:
      'Expert dental care by Dr. Pinky Vijay MDS. Orthodontics, implants, root canal, cosmetic dentistry & more in Kavalkinaru, Tamil Nadu.',
    images: [
      {
        url: '/images/clinic-exterior-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Holy Care Dental & Orthodontics Clinic - Kavalkinaru',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Holy Care Dental & Orthodontics Clinic',
    description:
      'Expert dental care by Dr. Pinky Vijay MDS in Kavalkinaru, Tamil Nadu.',
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
      '@type': ['Dentist', 'MedicalBusiness'],
      '@id': `${SITE_URL}/#organization`,
      name: 'Holy Care Dental & Orthodontics Clinic',
      url: SITE_URL,
      telephone: '+917977257779',
      email: 'holycareortho@gmail.com',
      image: `${SITE_URL}/images/clinic-exterior-1.jpg`,
      logo: `${SITE_URL}/images/logo.png`,
      description:
        'Expert dental care in Kavalkinaru, Tamil Nadu & Mumbai, Maharashtra. Offering orthodontics, root canal, dental implants, cosmetic dentistry, and pediatric dental care.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '8/277, Rachel Enclave, Kavalkinaru Main Road',
        addressLocality: 'Kavalkinaru',
        addressRegion: 'Tamil Nadu',
        postalCode: '627105',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 8.4395,
        longitude: 77.4025,
      },
      department: {
        '@type': ['Dentist', 'MedicalBusiness'],
        name: 'Holy Care Dental Clinic - Mumbai',
        telephone: '+918655632732',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Shop no. 10, Nilkamal Co-op. Housing Society, 60 Feet Road, Matunga Labour Camp, Dharavi',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          postalCode: '400019',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 19.0437,
          longitude: 72.8544,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:30',
          closes: '13:30',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '17:30',
          closes: '20:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '10:30',
          closes: '13:30',
        },
      ],
      medicalSpecialty: [
        'Orthodontics',
        'Endodontics',
        'Prosthodontics',
        'Periodontics',
        'PediatricDentistry',
      ],
      founder: {
        '@type': 'Person',
        name: 'Dr. Pinky Vijay',
        jobTitle: 'MDS - Orthodontics & Dentofacial Orthopedics',
        description:
          'Dental surgeon with MDS specialization in Orthodontics & Dentofacial Orthopedics. Registration No: A-34195.',
      },
      priceRange: '$$',
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: { '@type': 'GeoCoordinates', latitude: 8.4395, longitude: 77.4025 },
        geoRadius: '50000',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Holy Care Dental & Orthodontics Clinic',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: ['en', 'ta'],
    },
  ],
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
