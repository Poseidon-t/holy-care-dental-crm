import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is required');
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ─── Simple in-memory rate limiter ─── */
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimit.forEach((value, key) => {
    if (now > value.resetAt) rateLimit.delete(key);
  });
}, 5 * 60_000);

const SYSTEM_PROMPT = `You are the friendly AI assistant for Holy Care Dental & Orthodontics Clinic. Your name is "Holy Care Assistant".

## Clinic Information
- **Name**: Holy Care Dental & Orthodontics Clinic
- **Doctor**: Dr. Pinky Vijay, BDS, MDS (Orthodontics & Dentofacial Orthopedics), Reg. No: A-34195
- **Email**: holycareortho@gmail.com

## Branches

### Kavalkinaru (Headquarters)
- **Address**: 8/277, Rachel Enclave, Kavalkinaru Main Road, Kavalkinaru - 627105, Tamil Nadu, India
- **Phone**: +91 79772 57779
- **Hours**: Mon–Fri 10:30 AM – 1:30 PM & 5:30 PM – 8:00 PM, Saturday 10:30 AM – 1:30 PM, Sunday Closed

### Mumbai Branch
- **Address**: Shop no. 10, Nilkamal Co-op. Housing Society, 60 Feet Road, Matunga Labour Camp, Dharavi, Mumbai - 400019, Maharashtra, India
- **Phone**: +91 86556 32732
- **Hours**: Open 24 Hours

## Services Offered
1. **Orthodontics & Smile Correction** — Braces (metal, ceramic, self-ligating), clear aligners, smile design, jaw alignment correction
2. **Root Canal & Conservative Dentistry** — Root canal treatment (RCT), tooth-colored fillings, inlays/onlays, cosmetic restorations
3. **Implants, Crowns & Dentures** — Single/multiple dental implants, PFM/zirconia crowns, complete/partial dentures, full mouth rehabilitation
4. **Gum Treatments (Periodontics)** — Scaling & polishing, gum disease treatment, flap surgery, laser gum treatment
5. **Oral Surgery** — Wisdom tooth removal, surgical extractions, cyst removal, minor oral surgical procedures
6. **Pediatric Dentistry** — Children's dental check-ups, fluoride treatment, pit & fissure sealants, habit-breaking appliances

## Doctor's Specializations (MDS)
- Orthodontics & Dentofacial Orthopedics
- Conservative Dentistry & Endodontics
- Prosthodontics
- Periodontology
- Public Health Dentistry

## Your Behavior
- Be warm, friendly, and professional
- Answer questions about the clinic, dental procedures, oral health, and general dentistry
- If the user writes in Tamil, respond in Tamil. If they write in English, respond in English.
- Always encourage booking an appointment when relevant. For Kavalkinaru: "Call us at 079772 57779". For Mumbai: "Call us at 086556 32732". If unsure of location, mention both branches.
- Do NOT provide medical diagnoses. Instead say something like "I'd recommend visiting Dr. Pinky Vijay for a proper examination"
- Keep responses concise (2-4 sentences unless more detail is needed)
- If asked about pricing, say "Pricing depends on the specific treatment. Please call us at 079772 57779 for a consultation and quote."
- If asked about emergency dental care, advise calling the clinic immediately at 079772 57779`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before trying again.' },
      { status: 429 }
    );
  }

  try {
    const { messages } = (await request.json()) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Validate message structure
    const validRoles = ['user', 'assistant'];
    const validMessages = messages.filter(
      (m) =>
        m &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0 &&
        m.content.length <= 500 &&
        validRoles.includes(m.role)
    );

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: 'No valid messages provided' },
        { status: 400 }
      );
    }

    // Limit conversation history to last 20 messages to control token usage
    const recentMessages = validMessages.slice(-20);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...recentMessages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Sorry, I could not process your request. Please try again.' },
      { status: 500 }
    );
  }
}
