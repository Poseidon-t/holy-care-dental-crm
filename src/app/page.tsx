import type { Metadata } from 'next';
import { getSetting } from '@/lib/db';
import HomePage from '@/components/HomePage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Holy Care Dental & Orthodontics Clinic | Kavalkinaru, Tamil Nadu',
  description:
    'Expert dental care by Dr. Pinky Vijay MDS in Kavalkinaru, Tamil Nadu. Offering orthodontics, root canal treatment, dental implants, teeth whitening, gum treatment, pediatric dentistry & more. Book your appointment today.',
  openGraph: {
    title: 'Holy Care Dental & Orthodontics Clinic | Kavalkinaru',
    description:
      'Expert dental care by Dr. Pinky Vijay MDS. Orthodontics, implants, root canal, cosmetic dentistry & more.',
    type: 'website',
    images: [
      {
        url: '/images/clinic-exterior-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Holy Care Dental & Orthodontics Clinic',
      },
    ],
  },
};

export default function Page() {
  const theme = getSetting('theme') || 'classic';
  return <HomePage theme={theme} />;
}
