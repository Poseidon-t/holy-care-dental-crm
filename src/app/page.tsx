import type { Metadata } from 'next';
import { getSetting } from '@/lib/db';
import HomePage from '@/components/HomePage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Holy Care Dental & Orthodontic Clinic | Kavalkinaru, Tamil Nadu',
  description:
    'Expert dental care by Dr. Pinky Vijay MDS in Kavalkinaru, Tamil Nadu. Offering orthodontics, root canal treatment, dental implants, teeth whitening, gum treatment, pediatric dentistry & more. Book your appointment today.',
  openGraph: {
    title: 'Holy Care Dental & Orthodontic Clinic | Kavalkinaru',
    description:
      'Expert dental care by Dr. Pinky Vijay MDS. Orthodontics, implants, root canal, cosmetic dentistry & more.',
    type: 'website',
    images: [
      {
        url: '/images/clinic-exterior-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Holy Care Dental & Orthodontic Clinic',
      },
    ],
  },
};

export default function Page() {
  let theme = getSetting('theme') || 'classic';
  // Handle legacy theme names
  if (theme === 'premium') theme = 'classic';
  return <HomePage theme={theme} />;
}
