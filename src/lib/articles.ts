export interface Article {
  slug: string;
  title: string;
  language: 'en' | 'ta';
  metaDescription: string;
  publishDate: string;
  readingTime: string;
  category: string;
  tags: string[];
  author: string;
  heroImage: string;
  content: string;
}

export const articles: Article[] = [
  // ═══════════════════════════════════════════════
  // Article 1: Root Canal Treatment
  // ═══════════════════════════════════════════════
  {
    slug: 'root-canal-treatment-what-to-expect',
    title: 'Root Canal Treatment: What to Expect',
    language: 'en',
    metaDescription:
      'Complete guide to root canal treatment (RCT). Learn about the procedure, recovery, costs, and what to expect at each stage. Expert advice from Holy Care Dental Clinic.',
    publishDate: '2026-01-15',
    readingTime: '7 min read',
    category: 'Treatment Guide',
    tags: ['root canal', 'endodontics', 'dental treatment', 'tooth pain', 'RCT'],
    author: 'Dr. Pinky Vijay',
    heroImage: '/images/specialty-rootcanal.jpg',
    content: `
<h2>What Is a Root Canal Treatment?</h2>
<p>A root canal treatment (RCT) is a dental procedure designed to save a tooth that is badly infected or decayed. Despite its reputation, modern root canal treatment is a comfortable, routine procedure that relieves pain rather than causing it. At Holy Care Dental Clinic, Dr. Pinky Vijay performs root canal treatments using advanced techniques that make the experience as smooth as possible.</p>
<p>The procedure involves removing the infected pulp tissue from inside the tooth, cleaning and disinfecting the root canals, and then filling and sealing the space to prevent future infection.</p>

<h2>When Do You Need a Root Canal?</h2>
<p>You may need a root canal if you experience any of the following symptoms:</p>
<ul>
<li><strong>Severe toothache</strong> — persistent, throbbing pain that worsens when you bite down or apply pressure</li>
<li><strong>Prolonged sensitivity</strong> — lingering pain when consuming hot or cold foods and beverages, even after the stimulus is removed</li>
<li><strong>Darkened tooth</strong> — a tooth that has become grey or dark, indicating nerve damage</li>
<li><strong>Swollen gums</strong> — tenderness, swelling, or a small bump (abscess) on the gum near the affected tooth</li>
<li><strong>Cracked or chipped tooth</strong> — damage that exposes the inner pulp to bacteria</li>
</ul>
<p>If you notice any of these signs, it is important to visit your dentist promptly. Delaying treatment can lead to the infection spreading, bone loss, or even tooth loss.</p>

<h2>The Root Canal Procedure: Step by Step</h2>

<h3>Step 1: Diagnosis and X-Ray</h3>
<p>Your dentist will examine the tooth and take an X-ray to assess the extent of infection and the shape of the root canals. This helps plan the treatment precisely.</p>

<h3>Step 2: Local Anaesthesia</h3>
<p>The area around the tooth is numbed with local anaesthesia. You will feel no pain during the procedure. For patients with dental anxiety, we ensure you are completely comfortable before proceeding.</p>

<h3>Step 3: Accessing the Pulp Chamber</h3>
<p>A small opening is made in the crown of the tooth to access the infected pulp chamber. This is done carefully to preserve as much natural tooth structure as possible.</p>

<h3>Step 4: Cleaning and Shaping</h3>
<p>Using specialised instruments, the infected pulp tissue is removed from the chamber and root canals. The canals are then cleaned, shaped, and disinfected using antimicrobial solutions to eliminate all bacteria.</p>

<h3>Step 5: Filling the Canals</h3>
<p>The cleaned canals are filled with a biocompatible material called gutta-percha, which seals the space and prevents reinfection. A temporary filling is placed on top.</p>

<h3>Step 6: Crown Placement</h3>
<p>In most cases, a tooth that has undergone root canal treatment needs a dental crown for protection. The crown restores the tooth's strength, shape, and appearance, allowing it to function normally for years to come.</p>

<h2>Recovery and Aftercare</h2>
<p>After the procedure, you may experience mild tenderness for a few days, which can be managed with over-the-counter pain relievers. Here are some aftercare tips:</p>
<ul>
<li>Avoid chewing on the treated side until the permanent crown is placed</li>
<li>Maintain good oral hygiene — brush twice daily and floss regularly</li>
<li>Take any prescribed medications as directed</li>
<li>Attend your follow-up appointment for crown placement</li>
<li>Avoid very hard or sticky foods on the treated tooth</li>
</ul>

<h2>How Long Does a Root Canal Last?</h2>
<p>With proper care and a well-fitted crown, a root canal treated tooth can last a lifetime. Regular dental check-ups and good oral hygiene are essential to ensure the long-term success of the treatment.</p>

<h2>Root Canal vs. Tooth Extraction</h2>
<p>Many patients wonder whether it is better to extract the tooth or save it with a root canal. In almost all cases, saving your natural tooth is the preferred option. Natural teeth provide better chewing efficiency, maintain jawbone structure, and prevent neighbouring teeth from shifting. Extraction, while sometimes necessary, requires replacement options like implants or bridges, which add cost and complexity.</p>

<blockquote>At Holy Care Dental Clinic, we believe in preserving your natural teeth whenever possible. Our conservative approach focuses on saving teeth through expert root canal treatment.</blockquote>

<h2>Book Your Consultation</h2>
<p>If you are experiencing tooth pain or suspect you may need a root canal, do not wait. Early treatment prevents complications and saves your tooth. Contact Holy Care Dental & Orthodontics Clinic at <strong>079772 57779</strong> to schedule your appointment with Dr. Pinky Vijay.</p>
`,
  },

  // ═══════════════════════════════════════════════
  // Article 2: Dental Implants
  // ═══════════════════════════════════════════════
  {
    slug: 'complete-guide-to-dental-implants',
    title: 'Complete Guide to Dental Implants',
    language: 'en',
    metaDescription:
      'Everything you need to know about dental implants — types, procedure, costs, benefits, and recovery. Expert guide from Holy Care Dental Clinic, Kavalkinaru.',
    publishDate: '2026-01-22',
    readingTime: '8 min read',
    category: 'Treatment Guide',
    tags: ['dental implants', 'tooth replacement', 'prosthodontics', 'missing teeth'],
    author: 'Dr. Pinky Vijay',
    heroImage: '/images/specialty-implants.jpg',
    content: `
<h2>What Are Dental Implants?</h2>
<p>Dental implants are titanium posts that are surgically placed into the jawbone to serve as artificial tooth roots. Once the implant integrates with the bone (a process called osseointegration), a custom-made crown is attached, creating a replacement tooth that looks, feels, and functions like a natural tooth.</p>
<p>Dental implants are widely considered the gold standard for replacing missing teeth. Unlike dentures or bridges, implants do not rely on adjacent teeth for support and help preserve jawbone health.</p>

<h2>Types of Dental Implants</h2>

<h3>Endosteal Implants</h3>
<p>The most common type, these are placed directly into the jawbone. They are typically shaped like small screws, cylinders, or plates. Once healed, a second surgery is performed to connect a post to the original implant, followed by crown placement.</p>

<h3>Subperiosteal Implants</h3>
<p>These are placed under the gum but above the jawbone. They are used for patients who do not have enough healthy jawbone and cannot or do not want to undergo bone augmentation procedures.</p>

<h3>All-on-4 / All-on-6 Implants</h3>
<p>A full-arch solution where an entire set of teeth is supported by just four to six strategically placed implants. This is an excellent option for patients who have lost most or all of their teeth and want a fixed, permanent solution.</p>

<h2>Who Is a Good Candidate?</h2>
<p>Most adults with good general health are candidates for dental implants. The ideal candidate has:</p>
<ul>
<li><strong>Adequate jawbone density</strong> — sufficient bone to support the implant (bone grafting can help if not)</li>
<li><strong>Healthy gums</strong> — free from periodontal disease</li>
<li><strong>Good overall health</strong> — no uncontrolled chronic conditions that impair healing</li>
<li><strong>Non-smoker</strong> — smoking significantly reduces implant success rates</li>
<li><strong>Commitment to oral hygiene</strong> — willingness to maintain proper care</li>
</ul>

<h2>The Implant Procedure</h2>

<h3>Phase 1: Consultation and Planning</h3>
<p>A comprehensive examination including X-rays and possibly 3D imaging is performed. Your dentist creates a detailed treatment plan based on your jawbone condition, the number of teeth to be replaced, and your overall oral health.</p>

<h3>Phase 2: Implant Placement</h3>
<p>The titanium implant is surgically placed into the jawbone under local anaesthesia. The procedure is surprisingly comfortable, and most patients report less discomfort than expected.</p>

<h3>Phase 3: Healing (Osseointegration)</h3>
<p>Over the next 3 to 6 months, the implant fuses with the jawbone through osseointegration. During this time, a temporary tooth can be placed so you are never without a tooth.</p>

<h3>Phase 4: Abutment and Crown</h3>
<p>Once healed, an abutment (connector piece) is attached to the implant, followed by a custom-made porcelain or zirconia crown that matches your natural teeth perfectly.</p>

<h2>Benefits of Dental Implants</h2>
<ul>
<li><strong>Natural appearance</strong> — implants look and feel like your own teeth</li>
<li><strong>Durability</strong> — with proper care, implants can last 25+ years or a lifetime</li>
<li><strong>Bone preservation</strong> — stimulate the jawbone, preventing the bone loss that occurs with missing teeth</li>
<li><strong>No damage to adjacent teeth</strong> — unlike bridges, implants do not require grinding down neighbouring teeth</li>
<li><strong>Improved speech and eating</strong> — stable, secure teeth that do not slip or click</li>
<li><strong>Convenience</strong> — no adhesives, no removal for cleaning, no soaking overnight</li>
</ul>

<h2>Implants vs. Bridges vs. Dentures</h2>
<p>While bridges and dentures are effective tooth replacement options, they come with limitations. Bridges require grinding healthy adjacent teeth, and dentures can slip and cause discomfort. Dental implants preserve bone, protect neighbouring teeth, and provide the most natural result. However, they do require a longer treatment timeline and a higher initial investment.</p>

<h2>Caring for Your Dental Implants</h2>
<p>Dental implants require the same care as natural teeth:</p>
<ul>
<li>Brush twice daily with a soft-bristle toothbrush</li>
<li>Floss daily, including around the implant</li>
<li>Visit your dentist for regular check-ups every 6 months</li>
<li>Avoid chewing extremely hard objects (ice, hard candy, bottle caps)</li>
<li>If you grind your teeth, use a night guard</li>
</ul>

<blockquote>Dental implants are an investment in your quality of life. At Holy Care Dental Clinic, we use premium implant systems and meticulous surgical techniques to ensure lasting results.</blockquote>

<h2>Get Started Today</h2>
<p>If you are missing one or more teeth and want to explore dental implants, schedule a consultation at Holy Care Dental & Orthodontics Clinic. Dr. Pinky Vijay will assess your needs and create a personalised treatment plan. Call us at <strong>079772 57779</strong>.</p>
`,
  },

  // ═══════════════════════════════════════════════
  // Article 3: Cavity Prevention (Tamil)
  // ═══════════════════════════════════════════════
  {
    slug: 'pal-sotthai-thaduppathu-eppadi',
    title: 'பல் சொத்தை தடுப்பது எப்படி?',
    language: 'ta',
    metaDescription:
      'பல் சொத்தையை தடுப்பதற்கான முழுமையான வழிகாட்டி. பல் சிதைவின் காரணங்கள், அறிகுறிகள் மற்றும் தடுப்பு முறைகள் பற்றி அறிந்து கொள்ளுங்கள்.',
    publishDate: '2026-01-28',
    readingTime: '6 min read',
    category: 'Preventive Care',
    tags: ['பல் சொத்தை', 'cavity prevention', 'dental care', 'oral hygiene', 'பல் பராமரிப்பு'],
    author: 'Dr. Pinky Vijay',
    heroImage: '/images/specialty-pediatric.jpg',
    content: `
<h2>பல் சொத்தை என்றால் என்ன?</h2>
<p>பல் சொத்தை (Dental Cavity / Dental Caries) என்பது பல்லின் கடினமான வெளிப்புற அடுக்கான எனாமலில் ஏற்படும் சிதைவு ஆகும். வாயில் உள்ள பாக்டீரியாக்கள் உணவில் உள்ள சர்க்கரையை அமிலமாக மாற்றுகின்றன. இந்த அமிலம் படிப்படியாக பல்லின் எனாமலை அரிக்கிறது, இதனால் துளைகள் (cavities) உருவாகின்றன.</p>
<p>சரியான நேரத்தில் சிகிச்சை அளிக்கப்படாவிட்டால், சொத்தை ஆழமாகச் சென்று பல்லின் நரம்பை பாதிக்கும், இது கடுமையான வலி மற்றும் தொற்றுக்கு வழிவகுக்கும்.</p>

<h2>பல் சொத்தையின் காரணங்கள்</h2>
<ul>
<li><strong>சரியான முறையில் பல் துலக்காதது</strong> — தினமும் இரண்டு முறை பல் துலக்காவிட்டால் பாக்டீரியா குவிகிறது</li>
<li><strong>இனிப்பு மற்றும் அமில உணவுகள்</strong> — சாக்லேட், மிட்டாய், கூல் டிரிங்க்ஸ், பழச்சாறுகள் ஆகியவை அமில உற்பத்தியை அதிகரிக்கின்றன</li>
<li><strong>தொடர்ச்சியான சிற்றுண்டி</strong> — அடிக்கடி சாப்பிடுவது பாக்டீரியாவுக்கு தொடர்ச்சியான உணவு அளிக்கிறது</li>
<li><strong>உலர்ந்த வாய்</strong> — உமிழ்நீர் குறைவு இயற்கையான பாதுகாப்பை குறைக்கிறது</li>
<li><strong>பல் மருத்துவரை தவிர்ப்பது</strong> — வழக்கமான சோதனைகள் இல்லாமல் ஆரம்ப நிலை சொத்தை கண்டறியப்படாது</li>
</ul>

<h2>பல் சொத்தையின் அறிகுறிகள்</h2>
<ul>
<li>பல்லில் வெள்ளை, பழுப்பு அல்லது கருப்பு நிற புள்ளிகள்</li>
<li>சூடான அல்லது குளிர்ந்த உணவு அருந்தும் போது வலி</li>
<li>இனிப்பு சாப்பிடும் போது கூச்சம்</li>
<li>கடிக்கும் போது வலி</li>
<li>பல்லில் கண்ணுக்கு தெரியும் துளைகள்</li>
<li>மோசமான மூச்சு நாற்றம்</li>
</ul>

<h2>பல் சொத்தையை தடுப்பதற்கான 8 வழிகள்</h2>

<h3>1. சரியான முறையில் பல் துலக்குங்கள்</h3>
<p>ஒவ்வொரு நாளும் காலையிலும் இரவிலும் குறைந்தது 2 நிமிடங்கள் பல் துலக்குங்கள். ஃப்ளோரைடு கலந்த பற்பசையை பயன்படுத்துங்கள். மென்மையான பிரஷ்ஷை பயன்படுத்தி, வட்ட இயக்கத்தில் துலக்குங்கள்.</p>

<h3>2. ஃப்ளாஸிங் செய்யுங்கள்</h3>
<p>தினமும் ஒரு முறையாவது பற்களுக்கு இடையே ஃப்ளாஸ் செய்யுங்கள். பிரஷ் செய்ய முடியாத இடங்களில் உள்ள உணவுத் துகள்களையும் பாக்டீரியாவையும் இது அகற்றுகிறது.</p>

<h3>3. சர்க்கரை நிறைந்த உணவுகளை குறையுங்கள்</h3>
<p>கூல் டிரிங்க்ஸ், மிட்டாய், கேக் போன்ற இனிப்பு உணவுகளை குறைத்துக்கொள்ளுங்கள். தாகத்திற்கு தண்ணீர் குடிப்பது சிறந்தது.</p>

<h3>4. தண்ணீர் அதிகமாக குடியுங்கள்</h3>
<p>தண்ணீர் வாயில் உள்ள உணவுத் துகள்களை அகற்ற உதவுகிறது மற்றும் உமிழ்நீர் உற்பத்தியை ஊக்குவிக்கிறது. ஒவ்வொரு உணவுக்குப் பிறகும் வாயை கொப்பளிக்கவும்.</p>

<h3>5. ஃப்ளோரைடு பயன்படுத்துங்கள்</h3>
<p>ஃப்ளோரைடு எனாமலை வலுப்படுத்துகிறது மற்றும் ஆரம்ப நிலை சிதைவை மீட்டெடுக்க உதவுகிறது. ஃப்ளோரைடு பற்பசை மற்றும் வாய்கொப்பளிக்கும் நீரை பயன்படுத்துங்கள்.</p>

<h3>6. ஆரோக்கியமான உணவு முறை</h3>
<p>கால்சியம் நிறைந்த பால், தயிர், பாலாடைக்கட்டி, பச்சை காய்கறிகள் மற்றும் நார்ச்சத்து நிறைந்த உணவுகள் பற்களை வலுப்படுத்துகின்றன.</p>

<h3>7. வழக்கமான பல் பரிசோதனை</h3>
<p>ஒவ்வொரு 6 மாதங்களுக்கும் ஒரு முறை பல் மருத்துவரை சந்தியுங்கள். வழக்கமான சுத்தம் செய்தல் (scaling) மற்றும் பரிசோதனை ஆரம்ப நிலையிலேயே பிரச்சனைகளை கண்டறிய உதவுகிறது.</p>

<h3>8. பிட் அண்ட் ஃபிஷர் சீலண்ட்கள்</h3>
<p>குழந்தைகளின் பின் பற்களில் சீலண்ட் பூசுவது சொத்தையை தடுக்க மிகவும் பயனுள்ளது. இது ஒரு மெல்லிய பாதுகாப்பு அடுக்கை உருவாக்குகிறது.</p>

<h2>சொத்தை ஏற்பட்டால் என்ன செய்வது?</h2>
<p>சொத்தையின் ஆரம்ப நிலையில், ஃப்ளோரைடு சிகிச்சை மூலம் மீட்டெடுக்கலாம். சொத்தை ஆழமாக இருந்தால், பல் நிரப்புதல் (filling) செய்யப்படும். மிகவும் ஆழமான சொத்தைக்கு ரூட் கனால் சிகிச்சை தேவைப்படலாம்.</p>

<blockquote>சொத்தையை தடுப்பது சிகிச்சையளிப்பதை விட எளிது மற்றும் மலிவானது. உங்கள் பற்களை பாதுகாக்க இன்றே நடவடிக்கை எடுங்கள்!</blockquote>

<h2>அப்பாய்ண்ட்மெண்ட் பெறுங்கள்</h2>
<p>பல் சொத்தை பற்றிய கவலைகள் இருந்தால், Holy Care Dental & Orthodontics Clinic-ல் Dr. Pinky Vijay அவர்களை சந்தியுங்கள். எங்களை <strong>079772 57779</strong> என்ற எண்ணில் தொடர்பு கொள்ளுங்கள்.</p>
`,
  },

  // ═══════════════════════════════════════════════
  // Article 4: Wisdom Teeth
  // ═══════════════════════════════════════════════
  {
    slug: 'when-to-get-wisdom-teeth-removed',
    title: 'When Should You Get Your Wisdom Teeth Removed?',
    language: 'en',
    metaDescription:
      'Learn when wisdom tooth removal is necessary, what the procedure involves, recovery tips, and warning signs. Expert guide from Holy Care Dental Clinic.',
    publishDate: '2026-02-05',
    readingTime: '6 min read',
    category: 'Oral Surgery',
    tags: ['wisdom teeth', 'tooth extraction', 'oral surgery', 'impacted teeth'],
    author: 'Dr. Pinky Vijay',
    heroImage: '/images/specialty-surgery.jpg',
    content: `
<h2>What Are Wisdom Teeth?</h2>
<p>Wisdom teeth, also known as third molars, are the last set of teeth to emerge, typically between the ages of 17 and 25. Most people have four wisdom teeth — one in each corner of the mouth. While some people's wisdom teeth come in normally and cause no issues, many people experience problems that require removal.</p>

<h2>Why Do Wisdom Teeth Cause Problems?</h2>
<p>The human jaw has evolved to be smaller over time, which often means there is not enough room for wisdom teeth to emerge properly. When this happens, the teeth may become:</p>
<ul>
<li><strong>Impacted</strong> — trapped beneath the gum line or jawbone, unable to fully emerge</li>
<li><strong>Partially erupted</strong> — only partially breaking through the gum, creating a flap that traps food and bacteria</li>
<li><strong>Misaligned</strong> — growing at an angle, pressing against neighbouring teeth</li>
<li><strong>Crowding</strong> — pushing other teeth out of alignment, potentially undoing orthodontic work</li>
</ul>

<h2>Signs You May Need Removal</h2>
<p>Not all wisdom teeth need to be removed. However, you should consult your dentist if you experience:</p>
<ul>
<li><strong>Pain or swelling</strong> at the back of your jaw</li>
<li><strong>Red, swollen, or bleeding gums</strong> around the wisdom tooth area</li>
<li><strong>Difficulty opening your mouth</strong> fully</li>
<li><strong>Bad breath or an unpleasant taste</strong> despite good oral hygiene</li>
<li><strong>Recurring infections</strong> (pericoronitis) around a partially erupted tooth</li>
<li><strong>Damage to adjacent teeth</strong> — cavities or root resorption on neighbouring molars</li>
<li><strong>Cyst formation</strong> — fluid-filled sac developing around an impacted tooth</li>
</ul>

<h2>The Removal Procedure</h2>

<h3>Before the Procedure</h3>
<p>Your dentist will take X-rays (often a panoramic X-ray or OPG) to evaluate the position of the wisdom teeth, their proximity to nerves, and the complexity of the extraction. Based on this assessment, you will be informed about what to expect.</p>

<h3>During the Procedure</h3>
<p>Wisdom tooth removal is performed under local anaesthesia. For impacted teeth, a small incision is made in the gum, and sometimes a small amount of bone may need to be removed. The tooth may be sectioned into smaller pieces for easier removal. The entire procedure typically takes 30 to 60 minutes.</p>

<h3>After the Procedure</h3>
<p>You will receive detailed aftercare instructions. A gauze pad is placed over the extraction site to control bleeding. Most patients can return to normal activities within 2 to 3 days.</p>

<h2>Recovery Tips</h2>
<ul>
<li><strong>First 24 hours</strong> — bite on gauze, avoid spitting or using a straw (to prevent dry socket), apply ice packs externally</li>
<li><strong>Diet</strong> — soft foods only for 3-5 days (yoghurt, soup, mashed potatoes, smoothies). Avoid hot, spicy, or crunchy foods</li>
<li><strong>Pain management</strong> — take prescribed pain medications as directed. Over-the-counter painkillers usually suffice</li>
<li><strong>Oral hygiene</strong> — gently rinse with warm salt water after 24 hours. Avoid brushing the extraction site for the first day</li>
<li><strong>Rest</strong> — avoid strenuous exercise for 2-3 days to minimise swelling and bleeding</li>
<li><strong>No smoking</strong> — smoking delays healing and increases the risk of dry socket</li>
</ul>

<h2>What Is Dry Socket?</h2>
<p>Dry socket (alveolar osteitis) occurs when the blood clot at the extraction site is dislodged or dissolves before the wound heals. This exposes the underlying bone and nerves, causing intense pain. It occurs in about 2-5% of extractions and is more common with lower wisdom teeth. Following aftercare instructions carefully significantly reduces this risk.</p>

<h2>Preventive Removal: Should You Remove Healthy Wisdom Teeth?</h2>
<p>This is a topic of ongoing debate in dentistry. Some dentists recommend preventive removal of wisdom teeth in the late teens to avoid future complications, as the procedure is easier and recovery faster in younger patients. Others prefer a watch-and-wait approach, only removing them if problems develop. Your dentist will advise based on your specific situation.</p>

<blockquote>At Holy Care Dental Clinic, we take a conservative approach — we only recommend extraction when it is clearly beneficial to the patient's long-term oral health.</blockquote>

<h2>Book a Consultation</h2>
<p>If your wisdom teeth are causing discomfort or you want a professional assessment, visit Holy Care Dental & Orthodontics Clinic. Call <strong>079772 57779</strong> to schedule an appointment with Dr. Pinky Vijay.</p>
`,
  },

  // ═══════════════════════════════════════════════
  // Article 5: Children's Dental Care (Tamil)
  // ═══════════════════════════════════════════════
  {
    slug: 'kuzhanthaigalin-pal-paramarippu',
    title: 'குழந்தைகளின் பல் பராமரிப்பு வழிகாட்டி',
    language: 'ta',
    metaDescription:
      'குழந்தைகளின் பல் ஆரோக்கியத்தை பாதுகாப்பதற்கான முழுமையான வழிகாட்டி. பல் முளைப்பது முதல் பள்ளி வயது வரை அனைத்து தகவல்களும்.',
    publishDate: '2026-02-10',
    readingTime: '7 min read',
    category: 'Pediatric Dentistry',
    tags: ['குழந்தை பல் பராமரிப்பு', 'pediatric dentistry', 'children dental care', 'baby teeth'],
    author: 'Dr. Pinky Vijay',
    heroImage: '/images/specialty-pediatric.jpg',
    content: `
<h2>குழந்தைகளின் பல் பராமரிப்பு ஏன் முக்கியம்?</h2>
<p>பெற்றோர்கள் பலர் "பால் பற்கள் எப்படியும் விழுந்துவிடும், அதற்கு ஏன் கவலைப்பட வேண்டும்?" என்று நினைக்கிறார்கள். ஆனால் பால் பற்கள் மிகவும் முக்கியமானவை. அவை குழந்தைகளுக்கு சரியாக சாப்பிட, பேச மற்றும் புன்னகைக்க உதவுகின்றன. மேலும், நிரந்தர பற்கள் சரியான இடத்தில் வருவதற்கான இட ஒதுக்கீட்டாளர்களாக செயல்படுகின்றன.</p>
<p>குழந்தை பருவத்திலிருந்தே சரியான பல் பராமரிப்பு பழக்கங்களை கற்றுக்கொடுப்பது, வாழ்நாள் முழுவதும் ஆரோக்கியமான பற்களை உறுதி செய்கிறது.</p>

<h2>பல் முளைப்பு: என்ன எதிர்பார்க்கலாம்?</h2>
<p>குழந்தைகளுக்கு பொதுவாக 6 மாதங்களில் முதல் பல் முளைக்கும். 3 வயதிற்குள் 20 பால் பற்கள் அனைத்தும் வரும்.</p>
<ul>
<li><strong>6-10 மாதங்கள்</strong> — கீழ் முன் பற்கள் (central incisors) முதலில் வரும்</li>
<li><strong>8-12 மாதங்கள்</strong> — மேல் முன் பற்கள் வரும்</li>
<li><strong>12-16 மாதங்கள்</strong> — முதல் கடைவாய்ப் பற்கள் (molars)</li>
<li><strong>16-20 மாதங்கள்</strong> — கோரைப் பற்கள் (canines)</li>
<li><strong>20-30 மாதங்கள்</strong> — இரண்டாம் கடைவாய்ப் பற்கள்</li>
</ul>

<h3>பல் முளைக்கும் போது செய்ய வேண்டியவை</h3>
<ul>
<li>சுத்தமான, குளிர்ந்த ஈரமான துணியால் ஈறுகளை மெதுவாக துடைக்கலாம்</li>
<li>குளிர்ந்த teething ring கொடுக்கலாம்</li>
<li>அதிக வலி இருந்தால் பல் மருத்துவரை அணுகுங்கள்</li>
</ul>

<h2>வயதுக்கேற்ற பல் துலக்கும் வழிகாட்டி</h2>

<h3>0-1 வயது: ஈறு பராமரிப்பு</h3>
<p>பல் முளைக்கும் முன்பே, ஒவ்வொரு உணவுக்குப் பிறகும் மெல்லிய ஈரமான துணியால் குழந்தையின் ஈறுகளை துடையுங்கள். முதல் பல் முளைத்ததும், குழந்தைகளுக்கான மென்மையான பிரஷ்ஷை பயன்படுத்தத் தொடங்குங்கள்.</p>

<h3>1-3 வயது: ஆரம்ப பல் துலக்கல்</h3>
<p>அரிசி அளவு ஃப்ளோரைடு பற்பசையுடன் தினமும் இரண்டு முறை துலக்குங்கள். பெற்றோர்கள் மட்டுமே துலக்க வேண்டும். குழந்தை பற்பசையை விழுங்காமல் பார்த்துக்கொள்ளுங்கள்.</p>

<h3>3-6 வயது: பயிற்சி காலம்</h3>
<p>பட்டாணி அளவு பற்பசை பயன்படுத்தலாம். குழந்தைகளை தாங்களே துலக்க ஊக்குவியுங்கள், ஆனால் பெற்றோர்கள் கண்காணிக்க வேண்டும் மற்றும் இறுதியாக மீண்டும் துலக்கி முடிக்க வேண்டும்.</p>

<h3>6+ வயது: சுயமாக துலக்குதல்</h3>
<p>குழந்தைகள் சுயமாக துலக்கத் தொடங்கலாம், ஆனால் 8 வயது வரை பெற்றோர்கள் கண்காணிக்க வேண்டும். ஃப்ளாஸிங்கையும் இந்த வயதில் அறிமுகப்படுத்தலாம்.</p>

<h2>குழந்தைகளின் பொதுவான பல் பிரச்சனைகள்</h2>

<h3>பால் பற்களில் சொத்தை</h3>
<p>இது மிகவும் பொதுவான பிரச்சனை. பாட்டில் கொடுத்து தூங்க வைப்பது, இனிப்பு பானங்கள், மற்றும் சரியான துலக்கல் இல்லாதது ஆகியவை முக்கிய காரணங்கள். பால் பற்களில் சொத்தை வந்தால் கூட சிகிச்சை அளிக்க வேண்டும், ஏனெனில் இது வலி, தொற்று மற்றும் நிரந்தர பற்களின் வளர்ச்சியை பாதிக்கலாம்.</p>

<h3>விரல் சூப்புதல் மற்றும் பாசிஃபையர் பழக்கம்</h3>
<p>3-4 வயதிற்குப் பிறகும் விரல் சூப்புதல் தொடர்ந்தால், பற்கள் மற்றும் தாடை எலும்பின் வளர்ச்சியில் மாற்றங்கள் ஏற்படலாம். பழக்கத்தை நிறுத்துவதற்கான habit-breaking appliances உள்ளன.</p>

<h3>பல் அடிபடுதல்</h3>
<p>குழந்தைகள் விளையாடும் போது பல் அடிபடுவது பொதுவானது. பல் உடைந்தாலோ விழுந்தாலோ உடனடியாக பல் மருத்துவரை அணுகுங்கள்.</p>

<h2>முதல் பல் மருத்துவ வருகை</h2>
<p>American Academy of Pediatric Dentistry (AAPD) பரிந்துரைப்படி, குழந்தையின் முதல் பல் முளைத்த 6 மாதங்களுக்குள் அல்லது 1 வயதிற்குள் முதல் பல் மருத்துவ வருகையை மேற்கொள்ள வேண்டும். இது:</p>
<ul>
<li>ஈறுகள் மற்றும் பற்களின் ஆரோக்கியத்தை மதிப்பீடு செய்ய உதவுகிறது</li>
<li>பெற்றோர்களுக்கு சரியான பராமரிப்பு முறைகளை கற்றுக்கொடுக்கிறது</li>
<li>பிரச்சனைகளை ஆரம்பத்திலேயே கண்டறிய உதவுகிறது</li>
<li>குழந்தைக்கு பல் மருத்துவமனை சூழலை பழக்கப்படுத்துகிறது</li>
</ul>

<h2>ஆரோக்கியமான பற்களுக்கான உணவு பழக்கங்கள்</h2>
<ul>
<li>பால், தயிர், பாலாடைக்கட்டி — கால்சியம் நிறைந்தவை</li>
<li>பழங்கள் மற்றும் காய்கறிகள் — நார்ச்சத்து மற்றும் வைட்டமின்கள்</li>
<li>தண்ணீர் — சிறந்த பானம்</li>
<li>கூல் டிரிங்க்ஸ், ஜூஸ் பாக்ஸ், மிட்டாய் ஆகியவற்றை குறையுங்கள்</li>
</ul>

<blockquote>குழந்தைகளுக்கு பல் பராமரிப்பை வேடிக்கையாக மாற்றுங்கள்! வண்ணமயமான பிரஷ்கள், பாடல்கள் மற்றும் பரிசுகள் மூலம் அவர்களை ஊக்குவியுங்கள்.</blockquote>

<h2>எங்களை அணுகுங்கள்</h2>
<p>உங்கள் குழந்தையின் பல் ஆரோக்கியத்தை பாதுகாக்க, Holy Care Dental & Orthodontics Clinic-ல் Dr. Pinky Vijay அவர்களை சந்தியுங்கள். குழந்தைகளுக்கான சிறப்பு பல் பராமரிப்பு சிகிச்சைகள் வழங்கப்படுகின்றன. <strong>079772 57779</strong> என்ற எண்ணில் அழைக்கவும்.</p>
`,
  },

  // ═══════════════════════════════════════════════
  // Article 6: Teeth Whitening
  // ═══════════════════════════════════════════════
  {
    slug: 'teeth-whitening-professional-vs-home',
    title: 'Teeth Whitening: Professional vs At-Home Options',
    language: 'en',
    metaDescription:
      'Compare professional teeth whitening with at-home options. Learn about procedures, costs, safety, and results. Expert advice from Holy Care Dental Clinic.',
    publishDate: '2026-02-18',
    readingTime: '7 min read',
    category: 'Cosmetic Dentistry',
    tags: ['teeth whitening', 'cosmetic dentistry', 'smile makeover', 'dental bleaching'],
    author: 'Dr. Pinky Vijay',
    heroImage: '/images/specialty-orthodontics.jpg',
    content: `
<h2>Why Do Teeth Become Discoloured?</h2>
<p>A bright, white smile is something most people desire, but over time, teeth naturally lose their brightness. Understanding why teeth become discoloured helps you choose the right whitening approach.</p>

<h3>Extrinsic Stains (Surface)</h3>
<p>These stains affect the outer enamel layer and are caused by:</p>
<ul>
<li><strong>Coffee, tea, and red wine</strong> — the most common culprits</li>
<li><strong>Tobacco use</strong> — smoking and chewing tobacco cause deep yellow-brown stains</li>
<li><strong>Coloured foods</strong> — berries, tomato sauce, soy sauce, curry</li>
<li><strong>Poor oral hygiene</strong> — plaque and tartar buildup causes yellowing</li>
</ul>

<h3>Intrinsic Stains (Internal)</h3>
<p>These stains originate from within the tooth structure:</p>
<ul>
<li><strong>Ageing</strong> — enamel thins over time, revealing the yellow dentin beneath</li>
<li><strong>Medications</strong> — tetracycline antibiotics during childhood, certain antihistamines</li>
<li><strong>Fluorosis</strong> — excessive fluoride exposure during tooth development</li>
<li><strong>Trauma</strong> — injury to a tooth can cause it to darken</li>
<li><strong>Genetics</strong> — some people naturally have thicker or whiter enamel</li>
</ul>

<h2>Professional Teeth Whitening</h2>
<p>Professional whitening, performed at a dental clinic, is the fastest and most effective way to brighten your smile. Here is what you need to know:</p>

<h3>In-Office Whitening</h3>
<p>This is the gold standard of teeth whitening. The procedure involves:</p>
<ul>
<li>A thorough cleaning to remove surface stains and plaque</li>
<li>Application of a gum barrier to protect soft tissues</li>
<li>Application of a high-concentration whitening gel (typically 25-40% hydrogen peroxide)</li>
<li>Activation with a special light or laser (in some systems)</li>
<li>Multiple application cycles during a single visit</li>
</ul>
<p><strong>Results:</strong> Teeth can become 3-8 shades whiter in a single 60-90 minute session.</p>
<p><strong>Duration:</strong> Results typically last 1-3 years with proper maintenance.</p>

<h3>Take-Home Professional Kits</h3>
<p>Your dentist creates custom-fitted whitening trays and provides professional-grade whitening gel (10-22% carbamide peroxide). You wear the trays for a specified time each day (usually 30 minutes to overnight) for 1-2 weeks.</p>
<p><strong>Results:</strong> Gradual whitening over 1-2 weeks, typically 3-6 shades lighter.</p>
<p><strong>Advantage:</strong> You can touch up at home anytime using the same trays.</p>

<h2>At-Home Whitening Options</h2>

<h3>Whitening Toothpastes</h3>
<p>These contain mild abrasives and low concentrations of peroxide or other whitening agents. They can remove minor surface stains but will not change the intrinsic colour of your teeth. Best for maintenance after professional whitening.</p>

<h3>Whitening Strips</h3>
<p>Over-the-counter strips coated with peroxide gel (typically 6-14% hydrogen peroxide). They are applied directly to the teeth for 30 minutes daily for 1-2 weeks. Results are moderate — typically 1-3 shades lighter.</p>

<h3>Whitening Rinses</h3>
<p>Mouthwashes containing hydrogen peroxide. Due to the brief contact time, these produce minimal whitening results but can help maintain brightness after professional treatment.</p>

<h2>Professional vs At-Home: Comparison</h2>

<h3>Effectiveness</h3>
<p>Professional whitening is significantly more effective, producing dramatic results in one session. At-home products produce gradual, modest improvements over weeks.</p>

<h3>Safety</h3>
<p>Professional treatment is monitored by your dentist, ensuring gum protection and appropriate concentrations. Over-the-counter products, if misused, can cause uneven whitening, gum irritation, or enamel damage.</p>

<h3>Cost</h3>
<p>Professional whitening has a higher upfront cost but delivers superior, longer-lasting results. At-home products are cheaper per unit but may require repeated purchases.</p>

<h3>Customisation</h3>
<p>Your dentist can address specific concerns (e.g., a single dark tooth, uneven staining) and adjust the treatment accordingly. Over-the-counter products offer one-size-fits-all solutions.</p>

<h2>Who Should Avoid Teeth Whitening?</h2>
<p>Teeth whitening is not suitable for everyone:</p>
<ul>
<li>Children under 16 years of age</li>
<li>Pregnant or breastfeeding women</li>
<li>People with severe tooth sensitivity or worn enamel</li>
<li>Those with gum disease (must be treated first)</li>
<li>People with dental restorations (crowns, veneers, fillings) in the visible area — these do not respond to whitening agents</li>
</ul>

<h2>Maintaining Your White Smile</h2>
<ul>
<li>Brush twice daily and floss once daily</li>
<li>Rinse your mouth after consuming staining foods or drinks</li>
<li>Use a straw for coffee, tea, and coloured beverages</li>
<li>Avoid tobacco products</li>
<li>Visit your dentist for regular cleanings every 6 months</li>
<li>Touch up with professional take-home trays every 6-12 months</li>
</ul>

<blockquote>A whiter smile boosts confidence and makes a great first impression. At Holy Care Dental Clinic, we offer safe, effective professional whitening treatments tailored to your needs.</blockquote>

<h2>Ready for a Brighter Smile?</h2>
<p>Schedule a whitening consultation at Holy Care Dental & Orthodontics Clinic. Dr. Pinky Vijay will assess your teeth, discuss your goals, and recommend the best whitening approach for you. Call us at <strong>079772 57779</strong>.</p>
`,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllArticles(): Article[] {
  return articles;
}

export function getRelatedArticles(currentSlug: string, limit = 3): Article[] {
  return articles.filter((a) => a.slug !== currentSlug).slice(0, limit);
}
