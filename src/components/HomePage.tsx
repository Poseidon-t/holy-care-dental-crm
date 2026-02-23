'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SPECIALTIES = [
  {
    image: '/images/specialty-orthodontics.jpg',
    title: 'Orthodontics & Smile Correction',
    titleTamil: 'பல் சீரமைப்பு & புன்னகை திருத்தம்',
    items: ['Metal & Ceramic Braces', 'Clear Aligners', 'Smile Designing', 'Jaw Alignment', 'Dentofacial Orthopedics for Children'],
  },
  {
    image: '/images/specialty-rootcanal.jpg',
    title: 'Root Canal & Conservative Dentistry',
    titleTamil: 'ரூட் கனால் & பாதுகாப்பு பல் சிகிச்சை',
    items: ['Single Sitting RCT', 'Re-RCT', 'Tooth Colored Fillings', 'Cosmetic Restorations'],
  },
  {
    image: '/images/specialty-implants.jpg',
    title: 'Implants, Crowns & Dentures',
    titleTamil: 'பல் பொருத்துதல், கிரீடங்கள் & பல்பொருத்தி',
    items: ['Dental Implants', 'Zirconia & Ceramic Crowns', 'Bridges', 'Complete & Partial Dentures', 'Full Mouth Rehabilitation'],
  },
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
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
        <path d="M24 4l-2.5 6H14l6 4.5L17.5 21 24 17l6.5 4-2.5-6.5 6-4.5h-7.5L24 4z" fill="currentColor" opacity="0.15"/>
        <path d="M24 6l-1.8 4.4H17l4.3 3.2-1.8 4.7L24 15l4.5 3.3-1.8-4.7L31 10.4h-5.2L24 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="12" y="22" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 28h24" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 28v12M28 28v12" stroke="currentColor" strokeWidth="1.2" opacity="0.4"/>
        <circle cx="24" cy="34" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M24 36.5V40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Advanced Orthodontic Care',
    desc: 'Precision braces, aligners & dentofacial orthopaedics for perfect smiles.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
        <path d="M8 24c0-8 7-16 16-16s16 8 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="14" y="20" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="21" y="20" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="28" y="20" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="13" y1="24" x2="35" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <rect x="15.5" y="22.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.2"/>
        <rect x="22.5" y="22.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.2"/>
        <rect x="29.5" y="22.5" width="3" height="3" rx="0.75" fill="currentColor" opacity="0.2"/>
        <path d="M12 32c2 4 6 8 12 8s10-4 12-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
  {
    title: 'Modern Equipment',
    desc: 'Digital X-rays, RVG sensors & sterilized instruments for accurate diagnosis.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
        <rect x="10" y="8" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="12" width="20" height="14" rx="1.5" fill="currentColor" opacity="0.1"/>
        <path d="M20 33v5M28 33v5M16 38h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="24" cy="19" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M22 19l1.5 1.5L27 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Clean & Comfortable Clinic',
    desc: 'Hospital-grade hygiene standards in a calm, welcoming environment.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
        <path d="M24 4l1.5 3.5L29 6l-1 3.8 3.8-.2-2.5 2.8 3.2 2.2-3.6 1.2 1.8 3.4-3.7-1.2L24 22l-3-3.7-3.7 1.2 1.8-3.4-3.6-1.2 3.2-2.2L16.2 9.6l3.8.2L19 6l3.5 1.5L24 4z" fill="currentColor" opacity="0.12"/>
        <path d="M24 8v3M30 10l-2 2M18 10l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 20h20a4 4 0 014 4v14a4 4 0 01-4 4H14a4 4 0 01-4-4V24a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M10 26h28" stroke="currentColor" strokeWidth="1.2" opacity="0.3"/>
        <path d="M24 30v6M21 33h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Affordable & Transparent Pricing',
    desc: 'Upfront costs, no hidden charges — quality dental care within your budget.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
        <rect x="6" y="14" width="36" height="22" rx="4" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="6" y="14" width="36" height="6" fill="currentColor" opacity="0.1"/>
        <circle cx="24" cy="29" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M24 26v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M22 27.5h3.5a1.25 1.25 0 010 2.5H22.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M22 30h3.5a1.25 1.25 0 010 2.5H22" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="12" cy="29" r="1.5" fill="currentColor" opacity="0.3"/>
        <circle cx="36" cy="29" r="1.5" fill="currentColor" opacity="0.3"/>
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

const WORKING_HOURS = [
  { day: 'Monday \u2013 Friday', hours: '10:30 AM \u2013 1:30 PM, 5:30 PM \u2013 8:00 PM' },
  { day: 'Saturday', hours: '10:30 AM \u2013 1:30 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

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
  { href: '#contact', label: 'Contact' },
];

export default function HomePage({ theme }: { theme: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPremium = theme === 'premium';

  return (
    <div className="min-h-screen bg-surface">
      {/* ─── Navigation ─── */}
      <nav className="bg-[var(--color-nav-bg)] backdrop-blur-md sticky top-0 z-50 border-b border-line">
        <div className={`${isPremium ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.jpg" alt="Holy Care Dental" width={36} height={36} className="w-9 h-9" />
              <span className="font-bold font-heading text-heading text-lg hidden sm:inline">Holy Care Dental</span>
              <span className="font-bold font-heading text-heading text-lg sm:hidden">Holy Care</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-[13px] font-medium text-muted hover:text-primary-700 transition-colors tracking-wide uppercase">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <a href="tel:+917977257779" className={`${isPremium ? 'bg-surface-deep text-ondeep rounded-full' : 'bg-[var(--color-btn-dark)] text-ondeep rounded-lg'} px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2`}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <span className="hidden sm:inline">Call Now</span>
              </a>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-body hover:text-heading transition-colors"
                aria-label="Toggle menu"
              >
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
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-sm font-medium text-body hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      {isPremium ? (
        /* ═══ PREMIUM HERO — Centered Dentologie-style ═══ */
        <section className="bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 md:pt-24 md:pb-12 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-heading leading-tight animate-fade-in-up">
              <em>Confident</em> Smiles,{' '}
              <span className="text-primary-600">Begin Here</span>
            </h1>
            <p className="mt-6 md:mt-8 text-lg md:text-xl text-muted max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
              Advanced orthodontic &amp; complete dental care by MDS specialists in Kavalkinaru &ndash; Vadakankulam.
            </p>
            <p className="mt-2 text-sm text-faint tamil animate-fade-in-up animation-delay-100">
              நம்பிக்கையான புன்னகை இங்கே தொடங்குகிறது
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-200">
              <a href="tel:+917977257779" className="bg-surface-deep text-ondeep px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                Book Appointment
              </a>
              <a href="#specialties" className="border border-line-strong text-heading px-8 py-3.5 rounded-full text-sm font-medium hover:bg-surface-alt transition-colors inline-flex items-center justify-center">
                View Specialities
              </a>
            </div>
          </div>
          {/* Large hero image */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 animate-fade-in-up animation-delay-300">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/clinic-exterior-1.jpg"
                alt="Holy Care Dental & Orthodontic Clinic"
                width={1200}
                height={600}
                className="object-cover w-full h-[280px] sm:h-[360px] md:h-[460px]"
                priority
              />
            </div>
          </div>
        </section>
      ) : (
        /* ═══ DEFAULT HERO — Split Layout ═══ */
        <section className="relative overflow-hidden bg-surface">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-3.5 py-1.5 mb-5">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                  <span className="text-primary-700 text-xs font-semibold uppercase tracking-wider">MDS Specialist Dental Care</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold font-heading text-heading leading-[1.15]">
                  Confident Smiles<br />
                  <span className="text-primary-600">Begin Here</span>
                </h1>
                <p className="mt-2 text-sm text-primary-500/70 tamil">
                  நம்பிக்கையான புன்னகை இங்கே தொடங்குகிறது
                </p>
                <p className="mt-4 text-body text-[15px] leading-relaxed max-w-md">
                  Advanced orthodontic &amp; complete dental care by MDS specialists. Braces, aligners, implants, root canal &amp; more.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a href="tel:+917977257779" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors text-center inline-flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    Book Appointment
                  </a>
                  <a href="#specialties" className="border-2 border-line-strong text-heading px-6 py-3 rounded-xl text-sm font-medium hover:bg-surface-alt transition-colors text-center">
                    View Specialities
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
                  <Image
                    src="/images/clinic-exterior-1.jpg"
                    alt="Holy Care Dental & Orthodontic Clinic - Exterior"
                    width={600}
                    height={750}
                    className="object-cover w-full h-[360px] md:h-[460px]"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 left-4 md:-left-6 bg-card rounded-xl shadow-lg p-3 border border-line">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center">
                      <span className="text-yellow-500 text-base">&#9733;</span>
                    </div>
                    <div>
                      <p className="font-bold text-heading text-sm">5.0 Rating</p>
                      <p className="text-[11px] text-muted">Google Reviews</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-3 right-4 md:-right-4 bg-card rounded-xl shadow-lg p-3 border border-line">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center text-primary-700">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-heading text-sm">10,000+</p>
                      <p className="text-[11px] text-muted">Happy Patients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-y border-line bg-surface-alt">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-sm">
                <span><strong className="text-primary-600 font-bold">MDS</strong> <span className="text-muted">Specialist</span></span>
                <span className="text-line-strong hidden sm:inline">|</span>
                <span><strong className="text-primary-600 font-bold">10,000+</strong> <span className="text-muted">Patients</span></span>
                <span className="text-line-strong hidden sm:inline">|</span>
                <span><strong className="text-primary-600 font-bold">Braces</strong> <span className="text-muted">&amp; Aligners Expert</span></span>
                <span className="text-line-strong hidden sm:inline">|</span>
                <span><strong className="text-primary-600 font-bold">A-34195</strong> <span className="text-muted">Registered</span></span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── About + MDS ─── */}
      <section id="about" className={`${isPremium ? 'py-16 md:py-24' : 'py-14 md:py-20'} bg-surface`}>
        <div className={`${isPremium ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
          {isPremium && (
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-heading leading-tight">
                Dental Care,{' '}
                <em>Thoughtfully</em> Designed
              </h2>
              <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
                Led by Dr. Pinky Vijay (MDS Orthodontics), our clinic combines specialist expertise with a warm, welcoming environment.
              </p>
              <p className="mt-2 text-sm text-faint tamil">உங்கள் பல் ஆரோக்கியம், எங்கள் முன்னுரிமை</p>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className={`${isPremium ? 'rounded-3xl' : 'rounded-2xl'} overflow-hidden`}>
                <Image
                  src="/images/dr-pinky-checkup.jpg"
                  alt="Dr. Pinky Vijay performing a dental check-up"
                  width={600}
                  height={500}
                  className={`object-cover w-full ${isPremium ? 'h-[420px]' : 'h-[380px]'}`}
                />
              </div>
              <div className={`absolute -bottom-5 right-4 bg-card ${isPremium ? 'rounded-2xl' : 'rounded-xl'} shadow-lg p-3.5 border border-line`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10l-10-5L2 10l10 5 10-5z" /><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-heading text-sm">Dr. Pinky Vijay</p>
                    <p className="text-xs text-primary-600 font-medium">MDS, Orthodontics</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {!isPremium && (
                <>
                  <p className="text-primary-600 font-semibold text-xs uppercase tracking-widest mb-3">About Us</p>
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-heading leading-snug">
                    Your Dental Health,<br />Our Priority
                  </h2>
                  <p className="text-faint tamil text-sm mt-1 mb-5">உங்கள் பல் ஆரோக்கியம், எங்கள் முன்னுரிமை</p>
                </>
              )}
              <div className={`space-y-3 text-body text-[15px] leading-relaxed ${isPremium ? '' : ''}`}>
                <p>
                  <strong className="text-heading">Holy Care Dental and Orthodontic Clinic</strong> is a modern dental care center in Kavalkinaru &ndash; Vadakankulam offering advanced orthodontic and complete dental treatments under expert MDS specialists.
                </p>
                <p>
                  Led by <strong className="text-heading">Dr. Pinky Vijay</strong> (BDS, MDS Orthodontics &amp; Dentofacial Orthopedics), our clinic combines precision treatment, a hygienic environment, personalized care, and advanced technology.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: 'Precision Treatment', sub: 'Accurate, expert care', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
                  { label: 'Hygienic Environment', sub: 'Sterilization standards', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                  { label: 'Personalized Care', sub: 'Individual plans', d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
                  { label: 'Advanced Technology', sub: 'Modern equipment', d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
                ].map((v) => (
                  <div key={v.label} className={`flex items-start gap-2.5 p-3 ${isPremium ? 'rounded-2xl' : 'rounded-xl'} bg-surface-alt border border-line`}>
                    <div className={`w-8 h-8 ${isPremium ? 'rounded-full' : 'rounded-lg'} bg-primary-100 flex items-center justify-center text-primary-700 flex-shrink-0 mt-0.5`}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={v.d} /></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-heading text-sm leading-tight">{v.label}</p>
                      <p className="text-xs text-muted mt-0.5">{v.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold text-faint uppercase tracking-wider mb-2">MDS Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {MDS_SPECIALIZATIONS.map((spec) => (
                    <span key={spec} className={`bg-primary-50 text-primary-800 px-3 py-1.5 ${isPremium ? 'rounded-full' : 'rounded-lg'} text-xs font-medium border border-primary-100`}>
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Specialities ─── */}
      <section id="specialties" className={`${isPremium ? 'py-16 md:py-24' : 'py-14 md:py-20'} bg-surface-alt`}>
        <div className={`${isPremium ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={`text-center ${isPremium ? 'mb-14' : 'mb-10'}`}>
            {!isPremium && <p className="text-primary-600 font-semibold text-xs uppercase tracking-widest mb-2">What We Offer</p>}
            <h2 className={`${isPremium ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'} font-bold font-heading text-heading`}>
              {isPremium ? (
                <>Our <em>Specialities</em></>
              ) : (
                'Our Specialities'
              )}
            </h2>
            <p className="mt-1 text-faint tamil text-sm">எங்கள் சிறப்புகள்</p>
            <p className={`${isPremium ? 'mt-4 text-base' : 'mt-3 text-sm'} text-muted max-w-xl mx-auto`}>
              Comprehensive dental care under one roof &mdash; from advanced orthodontics and implants to pediatric dentistry and oral surgery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPECIALTIES.map((specialty) => (
              <div
                key={specialty.title}
                className={`bg-card ${isPremium ? 'rounded-3xl' : 'rounded-2xl'} overflow-hidden border border-line hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50 transition-all duration-300 group`}
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={specialty.image}
                    alt={specialty.title}
                    width={400}
                    height={160}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <h3 className="absolute bottom-3 left-4 right-4 font-bold text-white text-[15px] drop-shadow-lg leading-tight">{specialty.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-[11px] text-primary-500 tamil">{specialty.titleTamil}</p>
                  <ul className="mt-2.5 space-y-1.5">
                    {specialty.items.map((item) => (
                      <li key={item} className="text-[13px] text-muted flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-primary-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
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

      {/* ─── Why Choose Us ─── */}
      <section className={`${isPremium ? 'py-16 md:py-24' : 'py-14 md:py-20'} bg-surface`}>
        <div className={`${isPremium ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={`text-center ${isPremium ? 'mb-14' : 'mb-10'}`}>
            {!isPremium && <p className="text-primary-600 font-semibold text-xs uppercase tracking-widest mb-2">Why Us</p>}
            <h2 className={`${isPremium ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'} font-bold font-heading text-heading`}>
              {isPremium ? (
                <>Why Choose <em>Holy Care?</em></>
              ) : (
                'Why Choose Holy Care?'
              )}
            </h2>
            <p className="mt-1 text-faint tamil text-sm">ஏன் ஹோலி கேர்?</p>
          </div>
          {isPremium ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {WHY_CHOOSE_US.map((item) => (
                <div key={item.title} className="group text-center px-5 py-8 rounded-3xl bg-card border border-line hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 mb-5 group-hover:bg-primary-100 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-heading text-sm leading-snug mb-2">{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {WHY_CHOOSE_US.map((item) => (
                <div key={item.title} className="group text-center px-4 py-6 rounded-2xl bg-card border border-line hover:border-primary-200 hover:shadow-lg transition-all duration-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 mb-4 group-hover:bg-primary-100 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-heading text-sm leading-snug mb-1.5">{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Google Reviews ─── */}
      <section id="reviews" className={`${isPremium ? 'py-16 md:py-24' : 'py-14 md:py-20'} bg-surface-alt`}>
        <div className={`${isPremium ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={`text-center ${isPremium ? 'mb-14' : 'mb-10'}`}>
            {!isPremium && <p className="text-primary-600 font-semibold text-xs uppercase tracking-widest mb-2">Patient Reviews</p>}
            <h2 className={`${isPremium ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'} font-bold font-heading text-heading`}>
              {isPremium ? (
                <>What Our <em>Patients</em> Say</>
              ) : (
                'What Our Patients Say'
              )}
            </h2>
            <p className="mt-1 text-faint tamil text-sm">எங்கள் நோயாளிகள் என்ன சொல்கிறார்கள்</p>
            <div className={`mt-3 inline-flex items-center gap-2 bg-card px-3 py-1.5 ${isPremium ? 'rounded-full' : 'rounded-full'} border border-line-strong text-sm`}>
              <span className="text-yellow-500">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <span className="font-semibold text-body text-xs">5.0 on Google</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GOOGLE_REVIEWS.map((review) => (
              <div key={review.name} className={`bg-card ${isPremium ? 'rounded-2xl p-6' : 'rounded-xl p-5'} border border-line hover:shadow-md transition-shadow`}>
                <div className="flex items-center gap-1 mb-2.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xs">&#9733;</span>
                  ))}
                </div>
                <p className={`${isPremium ? 'text-base' : 'text-sm'} text-body leading-relaxed`}>&ldquo;{review.text}&rdquo;</p>
                <div className="mt-3 pt-3 border-t border-line-subtle flex items-center gap-2.5">
                  <div className={`w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-800 font-bold text-xs`}>
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-heading text-sm truncate">{review.name}</p>
                    <p className="text-xs text-faint">{review.date}</p>
                  </div>
                  <svg className="w-4 h-4 text-[#4285F4] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Before & After ─── */}
      <section id="results" className={`${isPremium ? 'py-16 md:py-24' : 'py-14 md:py-20'} bg-surface`}>
        <div className={`${isPremium ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={`text-center ${isPremium ? 'mb-14' : 'mb-10'}`}>
            {!isPremium && <p className="text-primary-600 font-semibold text-xs uppercase tracking-widest mb-2">Real Results</p>}
            <h2 className={`${isPremium ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'} font-bold font-heading text-heading`}>
              {isPremium ? (
                <>Smile <em>Transformations</em></>
              ) : (
                'Smile Transformations'
              )}
            </h2>
            <p className="mt-1 text-faint tamil text-sm">புன்னகை மாற்றங்கள்</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={`bg-surface-alt ${isPremium ? 'rounded-3xl' : 'rounded-2xl'} overflow-hidden border border-line hover:shadow-lg transition-all group`}>
              <div className="relative overflow-hidden">
                <Image
                  src="/images/before-after-1.jpg"
                  alt="Orthodontic braces treatment - Before and After"
                  width={600}
                  height={500}
                  className="object-cover w-full group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold font-heading text-heading">Orthodontic Braces Treatment</h3>
                <p className="text-sm text-muted mt-1">Complex tooth alignment corrected with fixed braces</p>
                <div className="mt-2.5 flex gap-2">
                  <span className={`bg-surface-deep text-ondeep px-2.5 py-0.5 ${isPremium ? 'rounded-full' : 'rounded-full'} text-xs font-medium`}>Braces</span>
                  <span className={`bg-surface-deep text-ondeep px-2.5 py-0.5 ${isPremium ? 'rounded-full' : 'rounded-full'} text-xs font-medium`}>Alignment</span>
                </div>
              </div>
            </div>

            <div className={`bg-surface-alt ${isPremium ? 'rounded-3xl' : 'rounded-2xl'} overflow-hidden border border-line hover:shadow-lg transition-all group`}>
              <div className="relative overflow-hidden">
                <Image
                  src="/images/before-after-2.jpg"
                  alt="Cephalometric X-ray - Before and After orthodontic treatment"
                  width={600}
                  height={500}
                  className="object-cover w-full group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold font-heading text-heading">Jaw &amp; Bite Correction</h3>
                <p className="text-sm text-muted mt-1">Significant jaw alignment improvement with orthodontic treatment</p>
                <div className="mt-2.5 flex gap-2">
                  <span className="bg-surface-deep text-ondeep px-2.5 py-0.5 rounded-full text-xs font-medium">Orthodontics</span>
                  <span className="bg-surface-deep text-ondeep px-2.5 py-0.5 rounded-full text-xs font-medium">Jaw Alignment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Clinic Gallery ─── */}
      <section id="gallery" className={`${isPremium ? 'py-16 md:py-24' : 'py-14 md:py-20'} bg-surface-alt`}>
        <div className={`${isPremium ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={`text-center ${isPremium ? 'mb-14' : 'mb-10'}`}>
            {!isPremium && <p className="text-primary-600 font-semibold text-xs uppercase tracking-widest mb-2">Take a Look</p>}
            <h2 className={`${isPremium ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'} font-bold font-heading text-heading`}>
              {isPremium ? (
                <>Our <em>Clinic</em></>
              ) : (
                'Our Clinic'
              )}
            </h2>
            <p className="mt-1 text-faint tamil text-sm">எங்கள் மருத்துவமனை</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {GALLERY_IMAGES.map((img) => (
              <div key={img.src} className={`group relative ${isPremium ? 'rounded-2xl' : 'rounded-xl'} overflow-hidden aspect-[4/3]`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="absolute bottom-2.5 left-3 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">{img.caption}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className={`relative ${isPremium ? 'rounded-2xl' : 'rounded-xl'} overflow-hidden group aspect-[3/1]`}>
              <Image
                src="/images/community-service-2.jpg"
                alt="Dr. Pinky Vijay and team at a community dental health camp"
                width={1200}
                height={400}
                className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-bold text-lg">Community Dental Health Camps</p>
                <p className="text-white/70 text-sm mt-1 max-w-xl">Dr. Pinky Vijay actively conducts free dental health camps, bringing quality care to the community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Hours & Contact ─── */}
      <section id="hours" className={`${isPremium ? 'py-16 md:py-24' : 'py-14 md:py-20'} bg-surface`}>
        <div className={`${isPremium ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={`text-center ${isPremium ? 'mb-14' : 'mb-10'}`}>
            {!isPremium && <p className="text-primary-600 font-semibold text-xs uppercase tracking-widest mb-2">Visit Us</p>}
            <h2 className={`${isPremium ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'} font-bold font-heading text-heading`}>
              {isPremium ? (
                <>Clinic Timings <em>&amp; Location</em></>
              ) : (
                'Clinic Timings & Location'
              )}
            </h2>
            <p className="mt-1 text-faint tamil text-sm">கிளினிக் நேரம் &amp; இடம்</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Working Hours */}
            <div className={`bg-surface-alt ${isPremium ? 'rounded-2xl' : 'rounded-xl'} p-6 border border-line`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 bg-primary-100 ${isPremium ? 'rounded-full' : 'rounded-lg'} flex items-center justify-center text-primary-700`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <h3 className="font-bold font-heading text-heading">Clinic Timings</h3>
                  <p className="text-xs text-faint tamil">கிளினிக் நேரம்</p>
                </div>
              </div>
              <div className="space-y-3">
                {WORKING_HOURS.map((item) => (
                  <div key={item.day} className="flex items-center justify-between py-2.5 border-b border-line last:border-0">
                    <span className="font-medium text-heading text-sm">{item.day}</span>
                    <span className={`text-sm ${item.hours === 'Closed' ? 'text-red-500 font-medium' : 'text-muted'}`}>{item.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-amber-50 rounded-lg p-3.5 text-sm text-amber-800 border border-amber-100">
                <strong>Emergency?</strong> Call us at <a href="tel:+917977257779" className="underline font-bold">079772 57779</a>
              </div>
            </div>

            {/* Contact */}
            <div id="contact" className={`bg-surface-alt ${isPremium ? 'rounded-2xl' : 'rounded-xl'} p-6 border border-line`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 bg-primary-100 ${isPremium ? 'rounded-full' : 'rounded-lg'} flex items-center justify-center text-primary-700`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div>
                  <h3 className="font-bold font-heading text-heading">Find Us</h3>
                  <p className="text-xs text-faint tamil">எங்களைக் கண்டறியவும்</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <svg className="w-4 h-4 text-faint mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 22V12h6v10" /></svg>
                  <div>
                    <p className="font-medium text-heading text-sm">Holy Care Dental &amp; Orthodontic Clinic</p>
                    <p className="text-sm text-muted">Kavalkinaru &ndash; Vadakankulam, Tamil Nadu</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <svg className="w-4 h-4 text-faint mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <a href="tel:+917977257779" className="text-sm text-primary-700 font-semibold hover:text-primary-800">079772 57779</a>
                </div>

                <div className="flex gap-3">
                  <svg className="w-4 h-4 text-faint mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                  <a href="mailto:holycareortho@gmail.com" className="text-sm text-primary-700 font-semibold hover:text-primary-800">holycareortho@gmail.com</a>
                </div>

                <div className="flex gap-3">
                  <svg className="w-4 h-4 text-faint mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <div>
                    <p className="font-medium text-heading text-sm">Dr. Pinky Vijay MDS</p>
                    <p className="text-xs text-muted">Orthodontics &amp; Dentofacial Orthopedics &middot; Reg. A-34195</p>
                  </div>
                </div>
              </div>

              <div className={`mt-5 ${isPremium ? 'rounded-2xl' : 'rounded-lg'} overflow-hidden h-36 border border-line-strong`}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.5!2d77.39!3d8.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOCtyNSUyNy4wJTIyTiA3NyUyMzknMjcuMCUyMkU!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Holy Care Dental Clinic Location"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      {isPremium ? (
        <section className="py-16 md:py-24 bg-surface-deep relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/dental-chair.jpg" alt="" fill className="object-cover" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-ondeep leading-tight">
              Ready for a <em>Healthier</em> Smile?
            </h2>
            <p className="text-primary-400 mt-2 tamil text-sm">ஆரோக்கியமான புன்னகைக்கு தயாரா?</p>
            <p className="mt-4 text-lg text-faint max-w-lg mx-auto">
              Schedule your visit today. Whether it&apos;s a routine check-up, braces, or a complete smile makeover.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+917977257779" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-full text-sm font-bold transition-colors inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                Call 079772 57779
              </a>
              <a href="mailto:holycareortho@gmail.com" className="border border-white/20 text-ondeep px-8 py-3.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                Email Us
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-14 relative overflow-hidden bg-surface-deep">
          <div className="absolute inset-0 opacity-20">
            <Image src="/images/dental-chair.jpg" alt="" fill className="object-cover" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-ondeep">Ready for a Healthier Smile?</h2>
            <p className="text-primary-400 mt-1 tamil text-sm">ஆரோக்கியமான புன்னகைக்கு தயாரா?</p>
            <p className="mt-3 text-faint text-sm max-w-lg mx-auto">
              Schedule your visit today. Whether it&apos;s a routine check-up, braces, or a complete smile makeover &mdash; we&apos;re here to help.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+917977257779" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                Call 079772 57779
              </a>
              <a href="mailto:holycareortho@gmail.com" className="border border-white/20 text-ondeep px-6 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                Email Us
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ─── Footer ─── */}
      <footer className="bg-surface-deepest text-faint py-10">
        <div className={`${isPremium ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src="/images/logo.jpg" alt="Holy Care Dental" width={28} height={28} className="w-7 h-7 brightness-200" />
                <span className="font-bold font-heading text-ondeep text-sm">Holy Care Dental</span>
              </div>
              <p className="text-xs leading-relaxed text-muted">
                Quality dental &amp; orthodontic care for the entire family. Specialist in braces and aligners. Kavalkinaru &ndash; Vadakankulam.
              </p>
              <div className="mt-3 space-y-1">
                <a href="tel:+917977257779" className="text-primary-400 hover:text-primary-300 font-semibold text-xs block">079772 57779</a>
                <a href="mailto:holycareortho@gmail.com" className="text-primary-400 hover:text-primary-300 text-xs block">holycareortho@gmail.com</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold font-heading text-ondeep text-sm mb-3">Quick Links</h4>
              <div className="space-y-1.5 text-xs">
                {NAV_LINKS.map((link) => (
                  <a key={link.href} href={link.href} className="block text-muted hover:text-ondeep transition-colors">{link.label}</a>
                ))}
                <a href="#results" className="block text-muted hover:text-ondeep transition-colors">Results</a>
                <a href="#hours" className="block text-muted hover:text-ondeep transition-colors">Timings</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold font-heading text-ondeep text-sm mb-3">Clinic</h4>
              <div className="text-xs space-y-1.5 text-muted">
                <p>Holy Care Dental &amp; Orthodontic Clinic</p>
                <p>Kavalkinaru &ndash; Vadakankulam</p>
                <p>Tamil Nadu</p>
                <p className="pt-2 text-[11px] text-faint">Dr. Pinky Vijay MDS | Reg. No: A-34195</p>
              </div>
            </div>
          </div>

          <div className="border-t border-line mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-faint">
              &copy; {new Date().getFullYear()} Holy Care Dental &amp; Orthodontic Clinic. All rights reserved.
            </p>
            <Link href="/login" className="text-[11px] text-muted hover:text-faint transition-colors">
              Staff Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
