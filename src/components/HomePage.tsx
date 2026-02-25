'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* ═══════════════════════════════════════════════
   Data Constants
   ═══════════════════════════════════════════════ */

const FEATURED_SERVICES = [
  {
    image: '/images/specialty-braces.jpg',
    title: 'Orthodontics & Braces',
    desc: 'Metal & ceramic braces, clear aligners, smile designing, and jaw alignment for the perfect smile.',
    bg: '#1a5c57',
    light: false,
  },
  {
    image: '/images/specialty-rootcanal.jpg',
    title: 'Root Canal Treatment',
    desc: 'Painless single-sitting RCT, re-RCT, tooth-colored fillings, and cosmetic restorations.',
    bg: '#e8a87c',
    light: true,
  },
  {
    image: '/images/specialty-implants.jpg',
    title: 'Dental Implants & Crowns',
    desc: 'Dental implants, zirconia & ceramic crowns, bridges, and full mouth rehabilitation.',
    bg: '#b8d4e3',
    light: true,
  },
];

const OTHER_SERVICES = [
  {
    image: '/images/specialty-gum.jpg',
    title: 'Gum Treatments',
    titleTamil: 'ஈறு சிகிச்சைகள்',
    items: ['Scaling & Polishing', 'Gum Disease Treatment', 'Flap Surgery', 'Laser Gum Procedures'],
  },
  {
    image: '/images/specialty-surgery.jpg',
    title: 'Oral Surgery',
    titleTamil: 'வாய் அறுவை சிகிச்சை',
    items: ['Wisdom Tooth Removal', 'Surgical Extractions', 'Minor Oral Surgeries', 'Cyst Removal'],
  },
  {
    image: '/images/specialty-pediatric.jpg',
    title: 'Pediatric Dentistry',
    titleTamil: 'குழந்தை பல் சிகிச்சை',
    items: ['Preventive Dental Care', 'Fluoride Therapy', 'Habit Breaking Appliances', 'Child-Friendly Treatments'],
  },
  {
    image: '/images/specialty-orthodontics.jpg',
    title: 'Cosmetic Dentistry',
    titleTamil: 'அழகியல் பல் சிகிச்சை',
    items: ['Teeth Whitening', 'Veneers', 'Smile Makeover', 'Tooth Reshaping'],
  },
  {
    image: '/images/specialty-implants.jpg',
    title: 'Full Mouth Rehab',
    titleTamil: 'முழு வாய் புனரமைப்பு',
    items: ['Complete Dentures', 'Partial Dentures', 'Implant-Supported', 'Bite Reconstruction'],
  },
];

const MDS_SPECIALIZATIONS = [
  'Orthodontics & Dentofacial Orthopedics',
  'Conservative Dentistry & Endodontics',
  'Prosthodontics',
  'Periodontology',
  'Public Health Dentistry',
];

const WHY_CHOOSE_US = [
  {
    title: 'Specialized MDS Doctors',
    desc: 'Postgraduate specialists across orthodontics, endodontics, prosthodontics & more.',
    bg: '#1a5c57',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <path d="M24 6l-1.8 4.4H17l4.3 3.2-1.8 4.7L24 15l4.5 3.3-1.8-4.7L31 10.4h-5.2L24 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="12" y="22" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 28h24" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="24" cy="34" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M24 36.5V40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Advanced Orthodontic Care',
    desc: 'Precision braces, aligners & dentofacial orthopaedics for perfect smiles.',
    bg: '#e8a87c',
    light: true,
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <path d="M8 24c0-8 7-16 16-16s16 8 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="14" y="20" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="21" y="20" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="28" y="20" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="13" y1="24" x2="35" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Modern Equipment',
    desc: 'Digital X-rays, RVG sensors & sterilized instruments for accurate diagnosis.',
    bg: '#4a7c9b',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <rect x="10" y="8" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M20 33v5M28 33v5M16 38h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="24" cy="19" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M22 19l1.5 1.5L27 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Clean & Comfortable',
    desc: 'Hospital-grade hygiene standards in a calm, welcoming environment.',
    bg: '#5b8a6f',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <path d="M24 8v3M30 10l-2 2M18 10l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 20h20a4 4 0 014 4v14a4 4 0 01-4 4H14a4 4 0 01-4-4V24a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M10 26h28" stroke="currentColor" strokeWidth="1.2" opacity="0.4"/>
        <path d="M24 30v6M21 33h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Affordable Pricing',
    desc: 'Upfront costs, no hidden charges — quality dental care within your budget.',
    bg: '#8b6f47',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <rect x="6" y="14" width="36" height="22" rx="4" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="24" cy="25" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M24 22v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M22 23.5h3.5a1.25 1.25 0 010 2.5H22.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M22 26h3.5a1.25 1.25 0 010 2.5H22" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const GOOGLE_REVIEWS = [
  {
    name: 'Vibisha',
    rating: 5,
    date: '3 months ago',
    text: 'Was a wholesome experience. The doctor was so kind and generous. Great clinic',
  },
  {
    name: 'Sutherson S',
    rating: 5,
    date: 'a year ago',
    text: 'Had a great experience with my root canal at Holy Cross Dental Care. The environment was clean, the staff was caring, and the surgery was done professionally with clear guidance. Highly recommend!',
  },
  {
    name: 'Arun Balaji',
    rating: 5,
    date: 'a year ago',
    text: 'I recently visited Holy Dental Services for some dental work and had a great experience. Dr. Pinky was professional and took the time to explain everything clearly. The staff was friendly, and the clinic was clean and well-maintained.',
  },
  {
    name: 'Sudha Jegan',
    rating: 5,
    date: 'a year ago',
    text: "I've never been to a dental clinic with such advanced technology and equipment. Dr. pinky explained everything very clearly and made me feel at ease during my procedure.",
  },
  {
    name: 'Robin B',
    rating: 5,
    date: 'a year ago',
    text: 'I wanted to take a moment to thank Dr.Pinky for care and the professionalism during my root canal procedure. Your expertise made the process much more comfortable than I expected.',
  },
  {
    name: 'Michael Nadar',
    rating: 5,
    date: '11 months ago',
    text: "At the age of 70+ I saw the smile back on my father's face. All credit goes to Dr. Pinky for the Dental treatment. Thank you Dr. Pinky.",
  },
];

const TRUST_STATS = [
  {
    value: '5,000+',
    label: 'Happy Patients',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: '5.0',
    label: 'Google Rating',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    value: '8+',
    label: 'Years Experience',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    value: '7,000+',
    label: 'Procedures Done',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

function GoogleGLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

const GALLERY_IMAGES = [
  { src: '/images/clinic-exterior-1.jpg', alt: 'Holy Care Dental Clinic - Exterior View', caption: 'Our Clinic' },
  { src: '/images/clinic-interior-glass.jpg', alt: 'Modern waiting area with dental artwork', caption: 'Waiting Area' },
  { src: '/images/dental-chair.jpg', alt: 'State-of-the-art dental treatment room', caption: 'Treatment Room' },
  { src: '/images/dr-pinky-checkup.jpg', alt: 'Dr. Pinky Vijay performing dental care', caption: 'Community Care' },
];

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#specialties', label: 'Specialities' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#hours', label: 'Contact' },
  { href: '/knowledge', label: 'Knowledge' },
];

/* ═══════════════════════════════════════════════
   Navigation
   ═══════════════════════════════════════════════ */

function Navigation({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  return (
    <nav className="bg-[var(--color-nav-bg)] backdrop-blur-md sticky top-0 z-50 border-b border-line/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Holy Care Dental & Orthodontics Clinic" width={36} height={36} className="w-9 h-9" />
            <div>
              <span className="font-bold font-heading text-heading text-lg hidden sm:inline leading-tight block">Holy Care Dental & Orthodontics</span>
              <span className="font-bold font-heading text-heading text-lg sm:hidden leading-tight block">Holy Care</span>
              <span className="text-xs text-body font-semibold tracking-wide hidden sm:block mt-0.5">Kavalkinaru, Tamil Nadu &middot; Mumbai, Maharashtra</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-[13px] font-medium text-muted hover:text-heading transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-body hover:text-heading transition-colors" aria-label="Toggle menu">
              {menuOpen ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-line bg-surface shadow-lg">
          <div className="px-4 py-2 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block px-3 py-3 rounded-lg text-sm font-medium text-body hover:bg-primary-50 hover:text-primary-700 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════
   Footer
   ═══════════════════════════════════════════════ */

function Footer() {
  const footerLinks = [
    { href: '#about', label: 'About' },
    { href: '#specialties', label: 'Specialities' },
    { href: '#reviews', label: 'Reviews' },
    { href: '#results', label: 'Results' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#hours', label: 'Contact' },
    { href: '#hours', label: 'Timings' },
    { href: '/knowledge', label: 'Knowledge' },
  ];

  return (
    <footer className="bg-surface-deepest text-faint pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/images/logo.png" alt="Holy Care Dental & Orthodontics Clinic" width={36} height={36} className="w-9 h-9 brightness-200" />
              <div>
                <span className="font-bold font-heading text-ondeep text-base block leading-tight">Holy Care Dental</span>
                <span className="text-xs text-muted">& Orthodontics Clinic</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted max-w-xs">
              Quality dental &amp; orthodontic care for the entire family. Specialist in braces and aligners.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a href="tel:+917977257779" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-muted hover:text-ondeep hover:bg-white/20 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </a>
              <a href="mailto:holycareortho@gmail.com" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-muted hover:text-ondeep hover:bg-white/20 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links — two columns */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold font-heading text-ondeep text-sm mb-4">Quick Links</h4>
            <div className="space-y-2.5 text-sm">
              {footerLinks.slice(0, 4).map((link) => (
                <a key={link.label} href={link.href} className="block text-muted hover:text-ondeep transition-colors">{link.label}</a>
              ))}
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold font-heading text-ondeep text-sm mb-4 md:invisible">More</h4>
            <div className="space-y-2.5 text-sm">
              {footerLinks.slice(4).map((link) => (
                <a key={link.label} href={link.href} className="block text-muted hover:text-ondeep transition-colors">{link.label}</a>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="col-span-2 md:col-span-4">
            <h4 className="font-semibold font-heading text-ondeep text-sm mb-4">Our Locations</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted">
              <div className="bg-white/5 rounded-xl p-3.5">
                <p className="text-ondeep font-semibold text-xs uppercase tracking-wider mb-1.5">Kavalkinaru (HQ)</p>
                <p className="text-xs leading-relaxed">Tamil Nadu 627105</p>
                <a href="tel:+917977257779" className="text-primary-400 hover:text-primary-300 text-xs font-medium mt-1.5 block">079772 57779</a>
              </div>
              <div className="bg-white/5 rounded-xl p-3.5">
                <p className="text-ondeep font-semibold text-xs uppercase tracking-wider mb-1.5">Mumbai</p>
                <p className="text-xs leading-relaxed">Dharavi, Maharashtra 400019</p>
                <a href="tel:+918655632732" className="text-primary-400 hover:text-primary-300 text-xs font-medium mt-1.5 block">086556 32732</a>
              </div>
            </div>
            <p className="mt-3 text-xs text-faint">Dr. Pinky Vijay MDS | Reg. No: A-34195</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-faint">&copy; {new Date().getFullYear()} Holy Care Dental &amp; Orthodontics Clinic. All rights reserved.</p>
          <Link href="/login" className="text-xs text-muted hover:text-faint transition-colors">Staff Login</Link>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   Main Component — Dentologie-style Layout (Default)
   ═══════════════════════════════════════════════ */

export default function HomePage({ theme }: { theme: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Suppress unused var warning — theme drives CSS variables via data-theme attribute
  void theme;

  return (
    <div className="min-h-screen bg-surface">
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* ─── 1. Hero — Centered serif heading ─── */}
      <section className="bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 md:pt-24 md:pb-10 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-heading leading-[1.15] animate-fade-in-up">
            A better <strong className="font-bold">dental</strong> experience,
            <br />
            by <em>design.</em>
          </h1>
          <div className="mt-4 flex justify-center gap-6 text-base text-muted animate-fade-in-up animation-delay-100">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />Kavalkinaru, Tamil Nadu</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />Mumbai, Maharashtra</div>
          </div>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100">
            Expert care from MDS specialist dentists, delivering the best patient experience across two locations.
          </p>
          <div className="mt-6 md:mt-8 flex items-center justify-center gap-2 animate-fade-in-up animation-delay-300">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-lg">&#9733;</span>
              ))}
            </div>
            <span className="text-muted text-sm font-medium">5.0 rating on Google Reviews</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up animation-delay-300">
            <Image src="/images/clinic-interior-glass.jpg" alt="Holy Care Dental & Orthodontics Clinic Interior" width={1400} height={600} className="object-cover w-full h-[280px] sm:h-[380px] md:h-[500px]" priority />
          </div>
        </div>
      </section>

      {/* ─── 2. Featured Services — Colored card grid (Dentologie-style) ─── */}
      <section id="specialties" className="py-16 md:py-24 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-heading">
              Dental Services at <em>Holy Care</em>
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              We&apos;re your go-to for general dentistry, orthodontics, and restorative care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-3xl overflow-hidden flex flex-col justify-between min-h-[420px] p-7 md:p-8 group hover:shadow-2xl transition-all duration-300"
                style={{ backgroundColor: service.bg }}
              >
                <div>
                  <h3 className={`text-xl md:text-2xl font-bold font-heading leading-tight ${service.light ? 'text-[#1a1a1a]' : 'text-white'}`}>
                    {service.title}
                  </h3>
                  <p className={`mt-3 text-sm leading-relaxed ${service.light ? 'text-[#1a1a1a]/70' : 'text-white/80'}`}>
                    {service.desc}
                  </p>
                </div>
                <div className="mt-6">
                  <div className="rounded-2xl overflow-hidden">
                    <Image src={service.image} alt={service.title} width={400} height={250} className="object-cover w-full h-[200px] group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. Social Proof — Trust Stats + Google Reviews ─── */}
      <section id="reviews" className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-heading">
              Trusted by <em>Patients</em>
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              Real experiences from real patients. See why families trust Holy Care Dental.
            </p>
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-14 md:mb-20">
            {TRUST_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-2xl border border-line p-5 md:p-6 text-center hover:shadow-lg hover:border-line-strong transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600 mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold font-heading text-heading">{stat.value}</div>
                <div className="text-sm text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Google Rating Badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-3 bg-card rounded-2xl border border-line px-6 py-4 shadow-sm">
              <GoogleGLogo className="w-8 h-8" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-heading text-heading">5.0</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-base">&#9733;</span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted">Based on Google Reviews</span>
              </div>
            </div>
          </div>

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {GOOGLE_REVIEWS.map((review) => (
              <div
                key={review.name}
                className="bg-card rounded-2xl border border-line p-6 hover:shadow-lg hover:border-line-strong transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-heading text-sm">{review.name}</p>
                      <p className="text-xs text-faint">{review.date}</p>
                    </div>
                  </div>
                  <GoogleGLogo className="w-5 h-5 flex-shrink-0" />
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">&#9733;</span>
                  ))}
                </div>
                <p className="text-body text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10 md:mt-12">
            <a
              href="https://maps.google.com/maps?q=Holy+care+dental+and+orthodontic+Clinic+Kavalkinaru+Tamil+Nadu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-heading hover:opacity-70 transition-opacity"
            >
              <GoogleGLogo className="w-4 h-4" />
              See All Reviews on Google
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 4. Why Choose Us — Colored accent cards ─── */}
      <section className="py-16 md:py-24 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-heading">
              Why Choose <em>Holy Care?</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {WHY_CHOOSE_US.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl p-6 md:p-7 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: item.bg }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${item.light ? 'bg-black/10 text-[#1a1a1a]' : 'bg-white/15 text-white'}`}>
                  {item.icon}
                </div>
                <h3 className={`font-semibold text-sm leading-snug mb-2 ${item.light ? 'text-[#1a1a1a]' : 'text-white'}`}>{item.title}</h3>
                <p className={`text-xs leading-relaxed ${item.light ? 'text-[#1a1a1a]/70' : 'text-white/70'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. About — "A Fresh Approach" style ─── */}
      <section id="about" className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/images/dr-pinky-checkup.jpg" alt="Dr. Pinky Vijay performing dental care" width={600} height={500} className="object-cover w-full h-[420px]" />
              </div>
              <div className="absolute -bottom-5 right-4 bg-card rounded-2xl shadow-lg p-4 border border-line">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-alt rounded-full flex items-center justify-center text-heading">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10l-10-5L2 10l10 5 10-5z" /><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-heading text-sm">Dr. Pinky Vijay</p>
                    <p className="text-xs text-muted font-medium">MDS, Orthodontics &middot; Kavalkinaru</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-line">
                  <div className="w-10 h-10 bg-surface-alt rounded-full flex items-center justify-center text-heading">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10l-10-5L2 10l10 5 10-5z" /><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-heading text-sm">Dr. Ruby</p>
                    <p className="text-xs text-muted font-medium">Dentist &middot; Mumbai</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-heading leading-tight">
                A Fresh Approach to <em>Dentistry</em>
              </h2>
              <div className="mt-6 space-y-4 text-body text-base leading-relaxed">
                <p>
                  Holy Care Dental is redefining what it means to go to the dentist. Whether you need a cleaning, braces, or a crown, our MDS specialist team delivers high-quality care in a warm, welcoming environment.
                </p>
                <p>
                  Led by <strong className="text-heading">Dr. Pinky Vijay</strong> (BDS, MDS &mdash; Orthodontics &amp; Dentofacial Orthopedics), our clinic combines precision treatment with personalized care and advanced technology. She is a former Assistant Professor, actively involved in academic excellence and clinical training. In addition to leading the clinic, she serves as a Consultant Orthodontist in various reputed clinics across Nagarcoil and Valliyur, bringing her expertise to a wider community.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {MDS_SPECIALIZATIONS.map((spec) => (
                  <span key={spec} className="bg-surface-alt text-heading px-4 py-2 rounded-full text-xs font-medium border border-line">
                    {spec}
                  </span>
                ))}
              </div>
              <a href="#specialties" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-heading hover:opacity-70 transition-opacity">
                Our Services
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Other Services — Horizontal scroll ─── */}
      <section className="py-16 md:py-24 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-heading">
                Other <em>Services</em>
              </h2>
              <p className="mt-3 text-lg text-muted">More specialized care for every need.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {OTHER_SERVICES.map((service) => (
              <div key={service.title} className="bg-card rounded-3xl overflow-hidden border border-line hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <Image src={service.image} alt={service.title} width={300} height={200} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold font-heading text-heading text-base">{service.title}</h3>
                  <ul className="mt-2 space-y-1.5 flex-1">
                    {service.items.slice(0, 3).map((item) => (
                      <li key={item} className="text-sm text-muted flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-heading mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. Before & After ─── */}
      <section id="results" className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-heading">
              Smile <em>Transformations</em>
            </h2>
            <p className="mt-4 text-lg text-muted max-w-xl mx-auto">Real results from our orthodontic and restorative treatments.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-2xl overflow-hidden border border-line hover:shadow-xl transition-all group">
              <div className="relative overflow-hidden h-48 sm:h-56">
                <Image src="/images/before-after-1.jpg" alt="Orthodontic braces treatment results" fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="font-bold font-heading text-heading text-sm">Braces Treatment</h3>
                <p className="text-xs text-muted mt-0.5">Alignment corrected with fixed braces</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden border border-line hover:shadow-xl transition-all group">
              <div className="relative overflow-hidden h-48 sm:h-56">
                <Image src="/images/before-after-2.jpg" alt="Jaw alignment treatment results" fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="font-bold font-heading text-heading text-sm">Jaw &amp; Bite Correction</h3>
                <p className="text-xs text-muted mt-0.5">Jaw alignment with orthodontic treatment</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden border border-line hover:shadow-xl transition-all group">
              <div className="relative overflow-hidden h-48 sm:h-56">
                <Image src="/images/before-after-3.jpg" alt="Teeth alignment before and after treatment" fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="font-bold font-heading text-heading text-sm">Teeth Alignment</h3>
                <p className="text-xs text-muted mt-0.5">Crowded teeth transformed into aligned smile</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden border border-line hover:shadow-xl transition-all group">
              <div className="relative overflow-hidden h-48 sm:h-56">
                <Image src="/images/before-after-4.jpg" alt="Upper and lower arch alignment results" fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="font-bold font-heading text-heading text-sm">Full Arch Alignment</h3>
                <p className="text-xs text-muted mt-0.5">Upper and lower arch complete makeover</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Gallery — Clinic photos ─── */}
      <section id="gallery" className="py-16 md:py-24 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-heading">
              Our <em>Clinic</em>
            </h2>
            <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
              Easy check-in, short waits, and a clean, comfortable environment. Come experience the Holy Care difference.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((img) => (
              <div key={img.src} className="group relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image src={img.src} alt={img.alt} width={400} height={300} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="absolute bottom-3 left-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">{img.caption}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="relative rounded-3xl overflow-hidden group aspect-[3/1]">
              <Image src="/images/community-service-2.jpg" alt="Community dental health camp" width={1200} height={400} className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-white font-bold text-xl font-heading">Community Dental Health Camps</p>
                <p className="text-white/70 text-sm mt-1.5 max-w-xl">Dr. Pinky Vijay actively conducts free dental health camps, bringing quality care to the community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. Find Us — Hours & Contact ─── */}
      <section id="hours" className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-heading">
              Find <em>Us</em>
            </h2>
            <div className="mt-4 flex justify-center gap-6 text-base text-muted">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />Kavalkinaru, Tamil Nadu</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />Mumbai, Maharashtra</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Kavalkinaru Branch */}
            <div className="bg-card rounded-3xl overflow-hidden border border-line shadow-sm hover:shadow-lg transition-shadow">
              <div className="bg-surface-deep px-7 py-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="bg-white/20 text-ondeep text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">HQ</span>
                    <h3 className="font-bold font-heading text-ondeep text-xl">Kavalkinaru</h3>
                  </div>
                  <p className="text-ondeep/70 text-xs mt-1">Tamil Nadu 627105</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-ondeep">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    <span className="text-sm font-bold">5.0</span>
                  </div>
                  <p className="text-ondeep/60 text-[10px] mt-0.5">56 Reviews</p>
                </div>
              </div>
              <div className="p-7 space-y-5">
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-heading text-sm">Dr. Pinky Vijay MDS</p>
                    <p className="text-xs text-muted mt-0.5">Orthodontics &amp; Dentofacial Orthopedics &middot; Reg. A-34195</p>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div>
                    <p className="font-medium text-heading text-sm">Kavalkinaru Rd, Kavalkinaru</p>
                    <p className="text-xs text-muted mt-0.5">Tamil Nadu 627105, India</p>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <div className="text-sm">
                    <p className="text-heading font-medium">Mon&ndash;Fri: 10:30 AM &ndash; 1:30 PM, 5:30 &ndash; 8 PM</p>
                    <p className="text-muted mt-0.5">Sat: 10:30 AM &ndash; 1:30 PM &middot; Sun: Closed</p>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <a href="tel:+917977257779" className="text-sm text-heading font-semibold hover:opacity-70 self-center">079772 57779</a>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                  </div>
                  <a href="mailto:holycareortho@gmail.com" className="text-sm text-heading font-semibold hover:opacity-70 self-center">holycareortho@gmail.com</a>
                </div>
              </div>
              <div className="px-7 pb-7 flex gap-3">
                <a href="https://maps.google.com/maps?q=Holy+care+dental+and+orthodontic+Clinic+Kavalkinaru+Tamil+Nadu" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-line bg-surface-alt text-heading text-sm font-semibold hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  Directions
                </a>
              </div>
            </div>

            {/* Mumbai Branch */}
            <div className="bg-card rounded-3xl overflow-hidden border border-line shadow-sm hover:shadow-lg transition-shadow">
              <div className="bg-surface-deep px-7 py-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="bg-white/20 text-ondeep text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Branch</span>
                    <h3 className="font-bold font-heading text-ondeep text-xl">Mumbai</h3>
                  </div>
                  <p className="text-ondeep/70 text-xs mt-1">Maharashtra 400019</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-ondeep">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    <span className="text-sm font-bold">5.0</span>
                  </div>
                  <p className="text-ondeep/60 text-[10px] mt-0.5">66 Reviews</p>
                </div>
              </div>
              <div className="p-7 space-y-5">
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-heading text-sm">Dr. Ruby</p>
                    <p className="text-xs text-muted mt-0.5">Dentist</p>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div>
                    <p className="font-medium text-heading text-sm">Shop 10, Nilkamal Co-op. Housing Society</p>
                    <p className="text-xs text-muted mt-0.5">60 Feet Road, Matunga Labour Camp, Dharavi, Mumbai 400019</p>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <div className="text-sm">
                    <p className="text-heading font-medium">Mon&ndash;Sat: 9 AM &ndash; 9 PM</p>
                    <p className="text-muted mt-0.5">Sun: Closed</p>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <a href="tel:+918655632732" className="text-sm text-heading font-semibold hover:opacity-70 self-center">086556 32732</a>
                </div>
              </div>
              <div className="px-7 pb-7 flex gap-3">
                <a href="https://maps.google.com/maps?q=Holy+care+dental+clinic+Dharavi+Mumbai+400019" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-line bg-surface-alt text-heading text-sm font-semibold hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10. CTA ─── */}
      <section className="py-16 md:py-24 bg-surface-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/dental-chair.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-ondeep leading-tight">
            Ready for a <em>healthier</em> smile?
          </h2>
          <p className="mt-4 text-lg text-faint max-w-lg mx-auto">
            Schedule your visit today. Whether it&apos;s a routine check-up, braces, or a complete smile makeover.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+917977257779" className="bg-card text-heading px-8 py-3.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 shadow-lg">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              Call 079772 57779
            </a>
            <a href="mailto:holycareortho@gmail.com" className="border border-white/30 text-ondeep px-8 py-3.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
              Email Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
