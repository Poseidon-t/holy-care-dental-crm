import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';

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
  return <HomePage theme="classic" />;
}
