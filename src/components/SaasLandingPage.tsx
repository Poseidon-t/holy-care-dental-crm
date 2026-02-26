'use client';

import Link from 'next/link';

const FEATURES = [
  {
    title: 'Patient Registration',
    description: 'Digital forms with QR codes. Patients fill their own details on a tablet or phone.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    title: 'Treatment Records',
    description: 'Track appointments, treatments, and billing for every patient in one place.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    title: 'Printable Reports',
    description: 'Professional patient reports with your clinic branding, ready to print or share.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
      </svg>
    ),
  },
  {
    title: 'Custom Branding',
    description: 'Your logo, clinic name, and doctor details on every form and report.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    title: 'QR Code Registration',
    description: 'Generate a QR code for your clinic. Patients scan and fill their registration form.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
      </svg>
    ),
  },
  {
    title: 'Works on Any Device',
    description: 'Use on desktop, tablet, or phone. Install as an app for quick access.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
];

const STEPS = [
  { step: '1', title: 'Sign Up', description: 'Create your free account in 30 seconds' },
  { step: '2', title: 'Set Up Clinic', description: 'Add your logo, details, and branding' },
  { step: '3', title: 'Start Managing', description: 'Register patients and track treatments' },
];

export default function SaasLandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span className="font-bold font-heading text-heading text-lg">ClinicFlow</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-muted hover:text-heading font-medium px-3 py-2">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary text-sm px-5">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-500" />
            Free for up to 50 patients
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-heading leading-tight">
            Patient Management
            <br />
            <span className="text-primary-600">for Modern Clinics</span>
          </h1>
          <p className="text-lg md:text-xl text-muted mt-6 max-w-2xl mx-auto leading-relaxed">
            Simple, powerful software to register patients, track treatments, and generate reports.
            Built for doctors and small clinics across India.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/signup" className="btn-primary text-lg px-8 py-3.5">
              Start Free Today
            </Link>
            <Link href="/pricing" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
              View Pricing
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <p className="text-xs text-faint mt-4">No credit card required. Set up in under 5 minutes.</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-surface-alt">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-heading">
              Everything You Need to Run Your Clinic
            </h2>
            <p className="text-muted mt-3 max-w-xl mx-auto">
              No complex setup. No training needed. Just sign up and start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold font-heading text-heading">{feature.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-heading">
              Up and Running in 5 Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold font-heading text-heading">{item.title}</h3>
                <p className="text-sm text-muted mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 md:py-24 bg-surface-alt">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-heading">
              Simple Pricing
            </h2>
            <p className="text-muted mt-3">Start free. Upgrade when your clinic grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="card border-2 border-line">
              <h3 className="text-xl font-bold font-heading">Free</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">₹0</span>
                <span className="text-muted">/forever</span>
              </div>
              <p className="text-sm text-muted mt-2">Up to 50 patients. All core features.</p>
              <Link href="/signup" className="btn-secondary w-full mt-6 text-center">
                Start Free
              </Link>
            </div>

            <div className="card border-2 border-primary-500 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-primary-600 px-4 py-1 rounded-full">
                Most Popular
              </span>
              <h3 className="text-xl font-bold font-heading">Annual</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">₹4,999</span>
                <span className="text-muted">/year</span>
              </div>
              <p className="text-sm text-muted mt-2">Unlimited patients. Priority support.</p>
              <Link href="/signup" className="btn-primary w-full mt-6 text-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-heading">
            Ready to Simplify Your Clinic?
          </h2>
          <p className="text-lg text-muted mt-4 max-w-xl mx-auto">
            Join clinics and doctors across India who use ClinicFlow to manage their patients effortlessly.
          </p>
          <Link href="/signup" className="btn-primary text-lg px-10 py-4 mt-8 inline-block">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-surface-deep)] text-[var(--color-text-on-deep)] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span className="font-bold font-heading text-lg">ClinicFlow</span>
            </div>
            <div className="flex items-center gap-6 text-sm opacity-70">
              <Link href="/pricing" className="hover:opacity-100">Pricing</Link>
              <Link href="/login" className="hover:opacity-100">Sign In</Link>
              <Link href="/signup" className="hover:opacity-100">Sign Up</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs opacity-50">
            &copy; {new Date().getFullYear()} ClinicFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
