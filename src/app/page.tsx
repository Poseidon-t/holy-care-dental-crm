import Link from 'next/link';
import Image from 'next/image';

const SERVICES = [
  {
    icon: '😁',
    title: 'Braces & Aligners',
    titleTamil: 'பிரேஸ் & அலைனர்',
    description: 'Specialist orthodontic care with metal braces, ceramic braces, and clear aligners for a perfectly aligned smile.',
  },
  {
    icon: '🦷',
    title: 'Root Canal',
    titleTamil: 'ரூட் கனால்',
    description: 'Pain-free root canal procedures using advanced techniques to save your natural teeth.',
  },
  {
    icon: '✨',
    title: 'Teeth Whitening',
    titleTamil: 'பல் வெண்மையாக்கல்',
    description: 'Professional whitening treatments for a brighter, more confident smile.',
  },
  {
    icon: '🩺',
    title: 'Dental Implants',
    titleTamil: 'பல் பொருத்துதல்',
    description: 'Permanent tooth replacement solutions that look, feel, and function like natural teeth.',
  },
  {
    icon: '💎',
    title: 'Veneers & Bonding',
    titleTamil: 'வெனீர்ஸ் & பாண்டிங்',
    description: 'Cosmetic dental veneers and bonding to transform your smile with a natural look.',
  },
  {
    icon: '🏥',
    title: 'Crowns & Bridges',
    titleTamil: 'கிரீடங்கள் & பாலங்கள்',
    description: 'Custom-crafted dental crowns and bridges to restore damaged or missing teeth.',
  },
  {
    icon: '🔬',
    title: 'Extractions & Surgery',
    titleTamil: 'பல் பிடுங்குதல்',
    description: 'Safe tooth extractions including wisdom tooth impaction removal with minimal discomfort.',
  },
  {
    icon: '🪥',
    title: 'Fillings & Dentures',
    titleTamil: 'அடைப்பு & பல்பொருத்தி',
    description: 'Amalgam, GIC fillings, and custom-fit dentures for complete dental restoration.',
  },
];

const WORKING_HOURS = [
  { day: 'Monday - Friday', hours: '10:30 AM - 1:30 PM, 5:30 PM - 8:00 PM' },
  { day: 'Saturday & Sunday', hours: 'By Appointment Only' },
];

const GALLERY_IMAGES = [
  { src: '/images/clinic-exterior-1.jpg', alt: 'Holy Care Dental Clinic - Exterior View', caption: 'Our Clinic' },
  { src: '/images/clinic-interior-glass.jpg', alt: 'Modern waiting area with dental artwork', caption: 'Waiting Area' },
  { src: '/images/dental-chair.jpg', alt: 'State-of-the-art dental treatment room', caption: 'Treatment Room' },
  { src: '/images/dr-pinky-checkup.jpg', alt: 'Dr. Pinky Vijay performing dental care at a community camp', caption: 'Community Care' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Navigation */}
      <nav className="bg-[#faf7f2]/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦷</span>
              <span className="font-bold text-primary-700 text-lg hidden sm:inline">Holy Care Dental</span>
              <span className="font-bold text-primary-700 text-lg sm:hidden">Holy Care</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-medium text-stone-600 hover:text-primary-600 transition-colors">Services</a>
              <a href="#about" className="text-sm font-medium text-stone-600 hover:text-primary-600 transition-colors">About</a>
              <a href="#gallery" className="text-sm font-medium text-stone-600 hover:text-primary-600 transition-colors">Gallery</a>
              <a href="#results" className="text-sm font-medium text-stone-600 hover:text-primary-600 transition-colors">Results</a>
              <a href="#contact" className="text-sm font-medium text-stone-600 hover:text-primary-600 transition-colors">Contact</a>
            </div>
            <a href="tel:+917977257779" className="bg-primary-600 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors min-h-[44px] inline-flex items-center">
              Call Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Clinic Photo */}
      <section className="relative overflow-hidden">
        {/* Background: warm earthy gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5c3d2e] via-[#6d4830] to-[#8b6344]" />
        <div className="absolute inset-0">
          <Image
            src="/images/clinic-exterior-1.jpg"
            alt="Holy Care Dental Clinic"
            fill
            className="object-cover opacity-15"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#3d2517]/80 via-[#5c3d2e]/60 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Specialist in Braces &amp; Aligners
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your Smile,<br />
                <span className="text-amber-200">Our Passion</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-orange-100 leading-relaxed max-w-xl tamil">
                உங்கள் புன்னகை, எங்கள் அர்ப்பணிப்பு
              </p>
              <p className="mt-4 text-base md:text-lg text-orange-100/80 leading-relaxed max-w-xl">
                Expert dental and orthodontic care with a gentle touch. From routine check-ups to advanced braces and aligners, we&apos;re here to give you a healthy, beautiful smile.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="tel:+917977257779" className="bg-white text-primary-700 px-8 py-4 rounded-xl text-base font-semibold hover:bg-amber-50 transition-colors text-center shadow-lg shadow-black/20">
                  Call for Appointment
                </a>
                <a href="#services" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-white/10 transition-colors text-center">
                  View Services
                </a>
              </div>
            </div>

            {/* Hero image card */}
            <div className="hidden md:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border-4 border-white/20">
                <Image
                  src="/images/clinic-interior-glass.jpg"
                  alt="Holy Care Dental Clinic - Modern interior with dental logo"
                  width={600}
                  height={450}
                  className="object-cover w-full h-[400px]"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-white font-bold text-lg">Holy Care Dental &amp; Orthodontics Clinic</p>
                  <p className="text-white/80 text-sm">Kavalkinaru, Tamil Nadu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white">MDS</div>
                <div className="text-sm text-orange-200 mt-1">Specialist Qualified</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">10,000+</div>
                <div className="text-sm text-orange-200 mt-1">Happy Patients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">Braces</div>
                <div className="text-sm text-orange-200 mt-1">&amp; Aligners Expert</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">A-34195</div>
                <div className="text-sm text-orange-200 mt-1">Registered Practitioner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[#faf7f2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Our Services</h2>
            <p className="mt-2 text-stone-500 tamil">எங்கள் சேவைகள்</p>
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
              Comprehensive dental care under one roof — from preventive treatments to advanced orthodontics, implants, and cosmetic dentistry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="font-bold text-stone-900 text-lg">{service.title}</h3>
                <p className="text-xs text-primary-500 tamil mt-0.5">{service.titleTamil}</p>
                <p className="text-sm text-stone-500 mt-3 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Real Photo */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Doctor photo */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/images/dr-pinky-checkup.jpg"
                  alt="Dr. Pinky Vijay performing a dental check-up at a community health camp"
                  width={600}
                  height={500}
                  className="object-cover w-full h-[450px]"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-4 md:right-4 bg-white rounded-2xl shadow-lg p-4 border border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-sm">Dr. Pinky Vijay</p>
                    <p className="text-xs text-primary-600">MDS, Orthodontics</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-400 rounded-2xl -z-10 opacity-20" />
            </div>

            {/* Content */}
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">About the Doctor</p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">
                Dedicated to Your<br />Dental Health
              </h2>
              <p className="text-stone-500 tamil mb-6">உங்கள் பல் ஆரோக்கியத்திற்கு அர்ப்பணிக்கப்பட்டது</p>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  <strong>Dr. Pinky Vijay</strong> is a highly qualified orthodontist with an <strong>MDS in Orthodontics and Dentofacial Orthopedics</strong> (BDS, (Mum), MDS (Orthodontics)). As a specialist in braces and aligners, she brings expertise, precision, and a compassionate approach to every patient.
                </p>
                <p>
                  At Holy Care Dental &amp; Orthodontic Clinic, we believe every patient deserves personalized, high-quality dental care. Our clinic is equipped with modern technology and follows the highest standards of sterilization and safety. Dr. Pinky also actively participates in community dental health camps, bringing dental care to those in need.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-[#faf7f2] rounded-xl p-4">
                  <div className="text-2xl mb-1">🎓</div>
                  <p className="font-semibold text-stone-900 text-sm">MDS Qualified</p>
                  <p className="text-xs text-stone-500 mt-0.5">Orthodontics specialist</p>
                </div>
                <div className="bg-[#faf7f2] rounded-xl p-4">
                  <div className="text-2xl mb-1">😁</div>
                  <p className="font-semibold text-stone-900 text-sm">Braces Expert</p>
                  <p className="text-xs text-stone-500 mt-0.5">Braces &amp; aligners specialist</p>
                </div>
                <div className="bg-[#faf7f2] rounded-xl p-4">
                  <div className="text-2xl mb-1">🏥</div>
                  <p className="font-semibold text-stone-900 text-sm">Modern Clinic</p>
                  <p className="text-xs text-stone-500 mt-0.5">Advanced equipment</p>
                </div>
                <div className="bg-[#faf7f2] rounded-xl p-4">
                  <div className="text-2xl mb-1">💝</div>
                  <p className="font-semibold text-stone-900 text-sm">Community Service</p>
                  <p className="text-xs text-stone-500 mt-0.5">Free dental health camps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Gallery */}
      <section id="gallery" className="py-20 bg-[#faf7f2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Take a Look</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Our Clinic</h2>
            <p className="mt-2 text-stone-500 tamil">எங்கள் மருத்துவமனை</p>
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
              A modern, clean, and welcoming environment designed for your comfort and care.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((img) => (
              <div key={img.src} className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="object-cover w-full h-52 lg:h-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Community service banner */}
          <div className="mt-8">
            <div className="relative rounded-2xl overflow-hidden shadow-md group">
              <Image
                src="/images/community-service-2.jpg"
                alt="Dr. Pinky Vijay and team at a community dental health camp"
                width={1200}
                height={400}
                className="object-cover w-full h-72 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                <p className="text-white font-bold text-xl">Community Dental Health Camps</p>
                <p className="text-white/80 text-sm mt-1">Dr. Pinky Vijay actively conducts free dental health camps, bringing quality dental care to the community.</p>
                <p className="text-white/70 text-sm tamil mt-1">இலவச பல் மருத்துவ முகாம்கள்</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Results */}
      <section id="results" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Real Results</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Smile Transformations</h2>
            <p className="mt-2 text-stone-500 tamil">புன்னகை மாற்றங்கள்</p>
            <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
              See the difference expert orthodontic treatment makes. These are real patients treated by Dr. Pinky Vijay.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Case 1 */}
            <div className="bg-[#faf7f2] rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/images/before-after-1.jpg"
                  alt="Orthodontic braces treatment - Before and After"
                  width={600}
                  height={500}
                  className="object-cover w-full"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-lg">Orthodontic Braces Treatment</h3>
                <p className="text-sm text-stone-500 mt-1">Complex tooth alignment corrected with fixed braces</p>
                <div className="mt-3 flex gap-2">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">Braces</span>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">Alignment</span>
                </div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-[#faf7f2] rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/images/before-after-2.jpg"
                  alt="Cephalometric X-ray showing jaw alignment - Before and After orthodontic treatment"
                  width={600}
                  height={500}
                  className="object-cover w-full"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-lg">Jaw &amp; Bite Correction</h3>
                <p className="text-sm text-stone-500 mt-1">Cephalometric X-ray showing significant jaw alignment improvement with orthodontic treatment</p>
                <div className="mt-3 flex gap-2">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">Orthodontics</span>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">Jaw Alignment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Working Hours & Contact */}
      <section id="hours" className="py-20 bg-[#faf7f2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Visit Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Working Hours &amp; Location</h2>
            <p className="mt-2 text-stone-500 tamil">வேலை நேரம் &amp; இடம்</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Working Hours */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">🕐</div>
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Working Hours</h3>
                  <p className="text-sm text-stone-500 tamil">வேலை நேரம்</p>
                </div>
              </div>
              <div className="space-y-4">
                {WORKING_HOURS.map((item) => (
                  <div key={item.day} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
                    <span className="font-medium text-stone-700">{item.day}</span>
                    <span className="text-stone-500 text-sm text-right">{item.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
                <strong>Emergency?</strong> Call us at <a href="tel:+917977257779" className="underline font-semibold">+91 79772 57779</a>. We prioritize dental emergencies.
              </div>
            </div>

            {/* Contact Card */}
            <div id="contact" className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">📍</div>
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Find Us</h3>
                  <p className="text-sm text-stone-500 tamil">எங்களைக் கண்டறியவும்</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#faf7f2] rounded-lg flex items-center justify-center text-lg flex-shrink-0">🏥</div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">Holy Care Dental &amp; Orthodontic Clinic</p>
                    <p className="text-sm text-stone-500 mt-0.5">8/277, Rachel Enclave, Kavalkinaru Main Road</p>
                    <p className="text-sm text-stone-500">Kavalkinaru - 627105</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#faf7f2] rounded-lg flex items-center justify-center text-lg flex-shrink-0">📞</div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">Phone</p>
                    <a href="tel:+917977257779" className="text-sm text-primary-600 font-semibold mt-0.5 block hover:text-primary-700">
                      +91 79772 57779
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#faf7f2] rounded-lg flex items-center justify-center text-lg flex-shrink-0">👩‍⚕️</div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">Dr. Pinky Vijay MDS</p>
                    <p className="text-sm text-stone-500 mt-0.5">Orthodontics &amp; Dentofacial Orthopedics</p>
                    <p className="text-sm text-stone-500">Reg. No: A-34195</p>
                  </div>
                </div>
              </div>

              {/* Google Maps embed */}
              <div className="mt-6 rounded-xl overflow-hidden h-44">
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

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/clinic-exterior-1.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[#3d2517]/90" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #f5d0b0 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready for a Healthier Smile?</h2>
          <p className="text-amber-200 mt-2 tamil text-lg">ஆரோக்கியமான புன்னகைக்கு தயாரா?</p>
          <p className="mt-4 text-orange-100 text-lg max-w-2xl mx-auto">
            Schedule your visit today. Whether it&apos;s a routine check-up, braces, or a complete smile makeover, we&apos;re here to help.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+917977257779" className="bg-white text-primary-700 px-8 py-4 rounded-xl text-base font-semibold hover:bg-amber-50 transition-colors shadow-lg inline-flex items-center justify-center gap-2">
              <span>📞</span> Call +91 79772 57779
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🦷</span>
                <span className="font-bold text-white text-lg">Holy Care Dental</span>
              </div>
              <p className="text-sm leading-relaxed">
                Quality dental &amp; orthodontic care for the entire family. Specialist in braces and aligners. Your trusted dental clinic in Kavalkinaru.
              </p>
              <p className="mt-3">
                <a href="tel:+917977257779" className="text-primary-400 hover:text-primary-300 font-semibold text-sm">
                  +91 79772 57779
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#services" className="block hover:text-white transition-colors">Services</a>
                <a href="#about" className="block hover:text-white transition-colors">About Doctor</a>
                <a href="#gallery" className="block hover:text-white transition-colors">Clinic Gallery</a>
                <a href="#results" className="block hover:text-white transition-colors">Treatment Results</a>
                <a href="#hours" className="block hover:text-white transition-colors">Working Hours</a>
                <a href="#contact" className="block hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Clinic</h4>
              <div className="text-sm space-y-2">
                <p>8/277, Rachel Enclave</p>
                <p>Kavalkinaru Main Road</p>
                <p>Kavalkinaru - 627105</p>
                <p className="mt-3 text-xs text-stone-500">Dr. Pinky Vijay MDS | Reg. No: A-34195</p>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} Holy Care Dental &amp; Orthodontic Clinic. All rights reserved.
            </p>
            <Link
              href="/login"
              className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
