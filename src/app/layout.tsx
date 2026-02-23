import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSetting } from '@/lib/db';
import { ThemeSelectorWrapper } from '@/components/ThemeSelectorWrapper';
import { ChatWidget } from '@/components/ChatWidget';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://patient-rejoicing-production-8ead.up.railway.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Holy Care Dental & Orthodontic Clinic | Kavalkinaru, Tamil Nadu',
    template: '%s | Holy Care Dental & Orthodontic Clinic',
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
  creator: 'Holy Care Dental & Orthodontic Clinic',
  publisher: 'Holy Care Dental & Orthodontic Clinic',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Holy Care Dental & Orthodontic Clinic',
    title: 'Holy Care Dental & Orthodontic Clinic | Kavalkinaru',
    description:
      'Expert dental care by Dr. Pinky Vijay MDS. Orthodontics, implants, root canal, cosmetic dentistry & more in Kavalkinaru, Tamil Nadu.',
    images: [
      {
        url: '/images/clinic-exterior-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Holy Care Dental & Orthodontic Clinic - Kavalkinaru',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Holy Care Dental & Orthodontic Clinic',
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
      name: 'Holy Care Dental & Orthodontic Clinic',
      url: SITE_URL,
      telephone: '+917977257779',
      email: 'holycareortho@gmail.com',
      image: `${SITE_URL}/images/clinic-exterior-1.jpg`,
      logo: `${SITE_URL}/images/logo.jpg`,
      description:
        'Expert dental care in Kavalkinaru, Tamil Nadu. Offering orthodontics, root canal, dental implants, cosmetic dentistry, and pediatric dental care.',
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
      name: 'Holy Care Dental & Orthodontic Clinic',
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
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦷</text></svg>"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen">
        {children}
        <ThemeSelectorWrapper currentTheme={theme} />
        <ChatWidget />
      </body>
    </html>
  );
}
