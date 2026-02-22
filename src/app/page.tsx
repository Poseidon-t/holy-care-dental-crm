import Link from 'next/link';
import Image from 'next/image';

const SPECIALTIES = [
  {
    icon: '😁',
    title: 'Orthodontics & Smile Correction',
    titleTamil: 'பல் சீரமைப்பு & புன்னகை திருத்தம்',
    items: ['Metal & Ceramic Braces', 'Clear Aligners', 'Smile Designing', 'Jaw Alignment', 'Dentofacial Orthopedics for Children'],
  },
  {
    icon: '🦷',
    title: 'Root Canal & Conservative Dentistry',
    titleTamil: 'ரூட் கனால் & பாதுகாப்பு பல் சிகிச்சை',
    items: ['Single Sitting RCT', 'Re-RCT', 'Tooth Colored Fillings', 'Cosmetic Restorations'],
  },
  {
    icon: '🩺',
    title: 'Implants, Crowns & Dentures',
    titleTamil: 'பல் பொருத்துதல், கிரீடங்கள் & பல்பொருத்தி',
    items: ['Dental Implants', 'Zirconia & Ceramic Crowns', 'Bridges', 'Complete & Partial Dentures', 'Full Mouth Rehabilitation'],
  },
  {
    icon: '🪥',
    title: 'Gum Treatments',
    titleTamil: 'ஈறு சிகிச்சைகள்',
    items: ['Scaling & Polishing', 'Gum Disease Treatment', 'Flap Surgery', 'Laser Gum Procedures'],
  },
  {
    icon: '🔬',
    title: 'Oral Surgery',
    titleTamil: 'வாய் அறுவை சிகிச்சை',
    items: ['Wisdom Tooth Removal', 'Surgical Extractions', 'Minor Oral Surgeries', 'Cyst Removal'],
  },
  {
    icon: '👶',
    title: 'Pediatric Dentistry',
    titleTamil: 'குழந்தை பல் சிகிச்சை',
    items: ['Preventive Dental Care', 'Fluoride Therapy', 'Habit Breaking Appliances', 'Child-Friendly Treatments'],
  },
];

const MDS_SPECIALIZATIONS = [
  'MDS \u2013 Orthodontics & Dentofacial Orthopedics',
  'MDS \u2013 Conservative Dentistry & Endodontics',
  'MDS \u2013 Prosthodontics',
  'MDS \u2013 Periodontology',
  'MDS \u2013 Public Health Dentistry',
];

const WHY_CHOOSE_US = [
  { icon: '🎓', title: 'Specialized MDS Doctors', description: 'Expert care from qualified MDS specialists' },
  { icon: '😁', title: 'Advanced Orthodontic Care', description: 'Latest braces, aligners, and smile correction techniques' },
  { icon: '🔬', title: 'Modern Equipment', description: 'State-of-the-art dental technology and tools' },
  { icon: '🏥', title: 'Clean & Comfortable Clinic', description: 'Hygienic, welcoming environment for every patient' },
  { icon: '💰', title: 'Affordable & Transparent Pricing', description: 'No hidden costs, fair pricing for all treatments' },
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
    text: 'I recently visited Holy Dental Services for some dental work and had a great experience. Dr. Pinky was professional and took the time to explain everything clearly. The staff was friendly, and the clinic was clean and well-maintained. I felt confident in the care I received and highly recommend Holy Dental Services for quality dental care',
  },
  {
    name: 'Sudha Jegan',
    rating: 5,
    date: 'a year ago',
    text: "I've never been to a dental clinic with such advanced technology and equipment. Dr. pinky explained everything very clearly and made me feel at ease during my procedure. The wait period was minimal. I had a great experience at this dental clinic.",
  },
  {
    name: 'Robin B',
    rating: 5,
    date: 'a year ago',
    text: 'I wanted to take a moment to thank Dr.Pinky for care and the professionalism during my root canal procedure. Your expertise made the process much more comfortable than I expected, and I truly appreciate for your kindness to patient. I recommend all of you to go and visit without any hesitation, if your suffering from tooth ache.',
  },
  {
    name: 'Michael Nadar',
    rating: 5,
    date: '11 months ago',
    text: "At the age of 70+ I saw the smile back on my father's face. All credit goes to Dr. Pinky for the Dental treatment. Thank you Dr. Pinky.",
  },
  {
    name: 'Selvi Amaladasan',
    rating: 5,
    date: 'a year ago',
    text: 'Excellent treatment provided!!! Good Ambience. Friendly Doctor. I went for RCT treatment. The cost of the treatment was reasonable.',
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
  { src: '/images/dr-pinky-checkup.jpg', alt: 'Dr. Pinky Vijay performing dental care at a community camp', caption: 'Community Care' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-yellow-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.jpg" alt="Holy Care Dental" width={36} height={36} className="w-9 h-9" />
              <span className="font-bold text-primary-800 text-lg hidden sm:inline">Holy Care Dental</span>
              <span className="font-bold text-primary-800 text-lg sm:hidden">Holy Care</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors">About</a>
              <a href="#specialties" className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors">Specialities</a>
              <a href="#reviews" className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors">Reviews</a>
              <a href="#gallery" className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors">Gallery</a>
              <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors">Contact</a>
            </div>
            <a href="tel:+917977257779" className="bg-primary-800 text-white px-5 py-3 rounded-lg text-sm font-bold hover:bg-primary-900 transition-colors min-h-[44px] inline-flex items-center shadow-lg shadow-primary-800/20">
              Call Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-yellow-500 to-amber-400" />
        <div className="absolute inset-0">
          <Image
            src="/images/clinic-exterior-1.jpg"
            alt="Holy Care Dental Clinic"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-700/80 via-yellow-600/40 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-6 font-medium border border-white/20">
                <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                Specialized Orthodontic & Complete Dental Care
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Confident Smiles<br />
                <span className="text-yellow-200">Begin Here</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-yellow-100 leading-relaxed max-w-xl tamil">
                நம்பிக்கையான புன்னகை இங்கே தொடங்குகிறது
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Braces & Aligners', 'Smile Correction', 'Root Canal', 'Implants & Crowns', 'Child & Family Dentistry'].map((item) => (
                  <span key={item} className="bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm border border-white/20">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="tel:+917977257779" className="bg-white text-primary-700 px-8 py-4 rounded-xl text-base font-bold hover:bg-yellow-50 transition-colors text-center shadow-lg shadow-black/10">
                  Call for Appointment
                </a>
                <a href="#specialties" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-white/10 transition-colors text-center backdrop-blur-sm">
                  View Specialities
                </a>
              </div>
            </div>

            {/* Hero image card */}
            <div className="hidden md:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border-2 border-white/15">
                <Image
                  src="/images/clinic-interior-glass.jpg"
                  alt="Holy Care Dental Clinic - Modern interior with dental logo"
                  width={600}
                  height={450}
                  className="object-cover w-full h-[400px]"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-900/80 to-transparent p-6">
                  <p className="text-white font-bold text-lg">Holy Care Dental &amp; Orthodontics Clinic</p>
                  <p className="text-yellow-200 text-sm">Kavalkinaru &ndash; Vadakankulam, Tamil Nadu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-yellow-700/60 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">MDS</div>
                <div className="text-sm text-yellow-100 mt-1">Specialist Qualified</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">10,000+</div>
                <div className="text-sm text-yellow-100 mt-1">Happy Patients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">Braces</div>
                <div className="text-sm text-yellow-100 mt-1">&amp; Aligners Expert</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">A-34195</div>
                <div className="text-sm text-yellow-100 mt-1">Registered Practitioner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Doctor photo */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/dr-pinky-checkup.jpg"
                  alt="Dr. Pinky Vijay performing a dental check-up at a community health camp"
                  width={600}
                  height={500}
                  className="object-cover w-full h-[450px]"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-4 md:right-4 bg-white rounded-2xl shadow-xl p-4 border border-yellow-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Dr. Pinky Vijay</p>
                    <p className="text-xs text-primary-600 font-semibold">MDS, Orthodontics</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-400 rounded-2xl -z-10 opacity-20" />
            </div>

            {/* Content */}
            <div>
              <p className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-2">About Us</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Your Dental Health,<br />Our Priority
              </h2>
              <p className="text-gray-400 tamil mb-6">உங்கள் பல் ஆரோக்கியம், எங்கள் முன்னுரிமை</p>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Holy Care Dental and Orthodontic Clinic</strong> is a modern dental care center in Kavalkinaru &ndash; Vadakankulam offering advanced orthodontic and complete dental treatments under expert MDS specialists.
                </p>
                <p>
                  Led by <strong className="text-gray-900">Dr. Pinky Vijay</strong> (BDS (Mum), MDS Orthodontics &amp; Dentofacial Orthopedics), our clinic combines precision treatment, a hygienic environment, personalized care, and advanced technology. Our goal is to give every patient a healthy, confident smile.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                  <div className="text-2xl mb-1">🎯</div>
                  <p className="font-bold text-gray-900 text-sm">Precision Treatment</p>
                  <p className="text-xs text-gray-500 mt-0.5">Accurate, expert dental care</p>
                </div>
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                  <div className="text-2xl mb-1">🧼</div>
                  <p className="font-bold text-gray-900 text-sm">Hygienic Environment</p>
                  <p className="text-xs text-gray-500 mt-0.5">Highest sterilization standards</p>
                </div>
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                  <div className="text-2xl mb-1">💝</div>
                  <p className="font-bold text-gray-900 text-sm">Personalized Care</p>
                  <p className="text-xs text-gray-500 mt-0.5">Individual treatment plans</p>
                </div>
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                  <div className="text-2xl mb-1">🔬</div>
                  <p className="font-bold text-gray-900 text-sm">Advanced Technology</p>
                  <p className="text-xs text-gray-500 mt-0.5">Modern equipment &amp; tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialities Section */}
      <section id="specialties" className="py-20 bg-yellow-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-2">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Specialities</h2>
            <p className="mt-2 text-gray-500 tamil">எங்கள் சிறப்புகள்</p>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Comprehensive dental care under one roof &mdash; from advanced orthodontics and implants to pediatric dentistry and oral surgery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPECIALTIES.map((specialty) => (
              <div
                key={specialty.title}
                className="bg-white rounded-2xl p-6 border border-yellow-100 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
                  {specialty.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{specialty.title}</h3>
                <p className="text-xs text-primary-500 tamil mt-0.5">{specialty.titleTamil}</p>
                <ul className="mt-3 space-y-1.5">
                  {specialty.items.map((item) => (
                    <li key={item} className="text-sm text-gray-500 flex items-start gap-2">
                      <span className="text-primary-400 mt-0.5 flex-shrink-0">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MDS Specializations */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-2">Expert Team</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our MDS Specializations</h2>
            <p className="mt-2 text-gray-500 tamil">எங்கள் MDS சிறப்புகள்</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {MDS_SPECIALIZATIONS.map((spec) => (
              <div
                key={spec}
                className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-3 text-sm font-medium text-primary-800 flex items-center gap-2"
              >
                <span className="text-primary-500">🎓</span>
                {spec}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-yellow-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-2">Why Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Holy Care?</h2>
            <p className="mt-2 text-gray-500 tamil">ஏன் ஹோலி கேர்?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-yellow-100 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-700 font-bold text-sm uppercase tracking-wider mb-2">Patient Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Patients Say</h2>
            <p className="mt-2 text-gray-500 tamil">எங்கள் நோயாளிகள் என்ன சொல்கிறார்கள்</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full border border-primary-100">
              <span className="text-yellow-500 text-lg">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <span className="text-sm font-semibold text-gray-700">5.0 on Google</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GOOGLE_REVIEWS.map((review) => (
              <div key={review.name} className="bg-yellow-50/50 rounded-2xl p-6 border border-yellow-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-sm">&#9733;</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center text-primary-800 font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                  <svg className="w-5 h-5 text-blue-500 ml-auto" viewBox="0 0 24 24" fill="currentColor">
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

      {/* Clinic Gallery */}
      <section id="gallery" className="py-20 bg-yellow-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-2">Take a Look</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Clinic</h2>
            <p className="mt-2 text-gray-500 tamil">எங்கள் மருத்துவமனை</p>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              A modern, clean, and welcoming environment designed for your comfort and care.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((img) => (
              <div key={img.src} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="object-cover w-full h-52 lg:h-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-900/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Community service banner */}
          <div className="mt-8">
            <div className="relative rounded-2xl overflow-hidden shadow-lg group">
              <Image
                src="/images/community-service-2.jpg"
                alt="Dr. Pinky Vijay and team at a community dental health camp"
                width={1200}
                height={400}
                className="object-cover w-full h-72 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-900/80 to-transparent p-8">
                <p className="text-white font-bold text-xl">Community Dental Health Camps</p>
                <p className="text-yellow-100 text-sm mt-1">Dr. Pinky Vijay actively conducts free dental health camps, bringing quality dental care to the community.</p>
                <p className="text-yellow-200 text-sm tamil mt-1">இலவச பல் மருத்துவ முகாம்கள்</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Results */}
      <section id="results" className="py-20 bg-yellow-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-2">Real Results</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Smile Transformations</h2>
            <p className="mt-2 text-gray-500 tamil">புன்னகை மாற்றங்கள்</p>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              See the difference expert orthodontic treatment makes. These are real patients treated by Dr. Pinky Vijay.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Case 1 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-yellow-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="relative overflow-hidden">
                <Image
                  src="/images/before-after-1.jpg"
                  alt="Orthodontic braces treatment - Before and After"
                  width={600}
                  height={500}
                  className="object-cover w-full group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg">Orthodontic Braces Treatment</h3>
                <p className="text-sm text-gray-500 mt-1">Complex tooth alignment corrected with fixed braces</p>
                <div className="mt-3 flex gap-2">
                  <span className="bg-primary-800 text-white px-3 py-1 rounded-full text-xs font-bold">Braces</span>
                  <span className="bg-primary-800 text-white px-3 py-1 rounded-full text-xs font-bold">Alignment</span>
                </div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-yellow-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="relative overflow-hidden">
                <Image
                  src="/images/before-after-2.jpg"
                  alt="Cephalometric X-ray showing jaw alignment - Before and After orthodontic treatment"
                  width={600}
                  height={500}
                  className="object-cover w-full group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg">Jaw &amp; Bite Correction</h3>
                <p className="text-sm text-gray-500 mt-1">Cephalometric X-ray showing significant jaw alignment improvement with orthodontic treatment</p>
                <div className="mt-3 flex gap-2">
                  <span className="bg-primary-800 text-white px-3 py-1 rounded-full text-xs font-bold">Orthodontics</span>
                  <span className="bg-primary-800 text-white px-3 py-1 rounded-full text-xs font-bold">Jaw Alignment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Working Hours & Contact */}
      <section id="hours" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-2">Visit Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Clinic Timings &amp; Location</h2>
            <p className="mt-2 text-gray-500 tamil">கிளினிக் நேரம் &amp; இடம்</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Working Hours */}
            <div className="bg-yellow-50/50 rounded-2xl p-8 border border-yellow-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center text-2xl text-white">🕐</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Clinic Timings</h3>
                  <p className="text-sm text-gray-500 tamil">கிளினிக் நேரம்</p>
                </div>
              </div>
              <div className="space-y-4">
                {WORKING_HOURS.map((item) => (
                  <div key={item.day} className="flex items-center justify-between py-3 border-b border-yellow-100 last:border-0">
                    <span className="font-semibold text-gray-800">{item.day}</span>
                    <span className={`text-sm text-right ${item.hours === 'Closed' ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{item.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-amber-50 rounded-xl p-4 text-sm text-amber-800 border border-amber-200">
                <strong>Emergency?</strong> Call us at <a href="tel:+917977257779" className="underline font-bold">079772 57779</a>. We prioritize dental emergencies.
              </div>
            </div>

            {/* Contact Card */}
            <div id="contact" className="bg-yellow-50/50 rounded-2xl p-8 border border-yellow-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center text-2xl text-white">📍</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Find Us</h3>
                  <p className="text-sm text-gray-500 tamil">எங்களைக் கண்டறியவும்</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">🏥</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Holy Care Dental &amp; Orthodontic Clinic</p>
                    <p className="text-sm text-gray-500 mt-0.5">Kavalkinaru &ndash; Vadakankulam</p>
                    <p className="text-sm text-gray-500">Tamil Nadu</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📞</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Phone</p>
                    <a href="tel:+917977257779" className="text-sm text-primary-600 font-bold mt-0.5 block hover:text-primary-700">
                      079772 57779
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📧</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Email</p>
                    <a href="mailto:holycareortho@gmail.com" className="text-sm text-primary-600 font-bold mt-0.5 block hover:text-primary-700">
                      holycareortho@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">👩‍⚕️</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Dr. Pinky Vijay MDS</p>
                    <p className="text-sm text-gray-500 mt-0.5">Orthodontics &amp; Dentofacial Orthopedics</p>
                    <p className="text-sm text-gray-500">Reg. No: A-34195</p>
                  </div>
                </div>
              </div>

              {/* Google Maps embed */}
              <div className="mt-6 rounded-xl overflow-hidden h-44 border border-yellow-100">
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-amber-400" />
        <div className="absolute inset-0">
          <Image
            src="/images/clinic-exterior-1.jpg"
            alt=""
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready for a Healthier Smile?</h2>
          <p className="text-yellow-200 mt-2 tamil text-lg">ஆரோக்கியமான புன்னகைக்கு தயாரா?</p>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            Schedule your visit today. Whether it&apos;s a routine check-up, braces, or a complete smile makeover, we&apos;re here to help.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+917977257779" className="bg-white text-primary-700 px-8 py-4 rounded-xl text-base font-bold hover:bg-yellow-50 transition-colors shadow-lg shadow-black/10 inline-flex items-center justify-center gap-2">
              <span>📞</span> Call 079772 57779
            </a>
            <a href="mailto:holycareortho@gmail.com" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-white/10 transition-colors text-center backdrop-blur-sm inline-flex items-center justify-center gap-2">
              <span>📧</span> Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/images/logo.jpg" alt="Holy Care Dental" width={32} height={32} className="w-8 h-8 brightness-200" />
                <span className="font-bold text-white text-lg">Holy Care Dental</span>
              </div>
              <p className="text-sm leading-relaxed">
                Quality dental &amp; orthodontic care for the entire family. Specialist in braces and aligners. Your trusted dental clinic in Kavalkinaru &ndash; Vadakankulam.
              </p>
              <div className="mt-3 space-y-1">
                <a href="tel:+917977257779" className="text-primary-400 hover:text-primary-300 font-bold text-sm block">
                  079772 57779
                </a>
                <a href="mailto:holycareortho@gmail.com" className="text-primary-400 hover:text-primary-300 text-sm block">
                  holycareortho@gmail.com
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#about" className="block hover:text-white transition-colors">About Us</a>
                <a href="#specialties" className="block hover:text-white transition-colors">Specialities</a>
                <a href="#reviews" className="block hover:text-white transition-colors">Patient Reviews</a>
                <a href="#gallery" className="block hover:text-white transition-colors">Clinic Gallery</a>
                <a href="#results" className="block hover:text-white transition-colors">Treatment Results</a>
                <a href="#hours" className="block hover:text-white transition-colors">Clinic Timings</a>
                <a href="#contact" className="block hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Clinic</h4>
              <div className="text-sm space-y-2">
                <p>Holy Care Dental &amp; Orthodontic Clinic</p>
                <p>Kavalkinaru &ndash; Vadakankulam</p>
                <p>Tamil Nadu</p>
                <p className="mt-3 text-xs text-gray-500">Dr. Pinky Vijay MDS | Reg. No: A-34195</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} Holy Care Dental &amp; Orthodontic Clinic. All rights reserved.
            </p>
            <Link
              href="/login"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
