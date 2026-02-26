import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { query } from '@/lib/db';
import type { Clinic } from '@/lib/db';

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

function buildSystemPrompt(clinic: Clinic): string {
  const name = clinic.name;
  const doctor = clinic.doctor_name || 'the doctor';
  const specialization = clinic.specialization || '';
  const regNumber = clinic.registration_number || '';
  const phone = clinic.phone || '';
  const email = clinic.email || '';
  const address = clinic.address || '';
  const city = clinic.city || '';
  const state = clinic.state || '';

  return `You are the friendly AI assistant for ${name}. Your name is "${name} Assistant".

## Clinic Information
- **Name**: ${name}
${clinic.doctor_name ? `- **Doctor**: ${doctor}${specialization ? `, ${specialization}` : ''}${regNumber ? `, Reg. No: ${regNumber}` : ''}` : ''}
${email ? `- **Email**: ${email}` : ''}
${phone ? `- **Phone**: ${phone}` : ''}
${address ? `- **Address**: ${address}${city ? `, ${city}` : ''}${state ? `, ${state}` : ''}` : ''}

## Your Behavior
- Be warm, friendly, and professional
- Answer questions about the clinic, medical procedures, and health
- Always encourage booking an appointment when relevant${phone ? `. Say "Call us at ${phone}"` : ''}
- Do NOT provide medical diagnoses. Instead say something like "I'd recommend visiting ${doctor} for a proper examination"
- Keep responses concise (2-4 sentences unless more detail is needed)
- If asked about pricing, say "Pricing depends on the specific treatment.${phone ? ` Please call us at ${phone} for a consultation and quote.` : ' Please contact us for a consultation and quote.'}"
- If asked about emergency care, advise calling the clinic immediately${phone ? ` at ${phone}` : ''}`;
}

// Cache for clinic data used in chat
let cachedClinic: { data: Clinic; fetchedAt: number } | null = null;
const CACHE_TTL = 5 * 60_000; // 5 minutes

async function getFirstClinic(): Promise<Clinic | null> {
  if (cachedClinic && Date.now() - cachedClinic.fetchedAt < CACHE_TTL) {
    return cachedClinic.data;
  }
  const clinics = await query<Clinic>('SELECT * FROM clinics LIMIT 1');
  if (clinics.length > 0) {
    cachedClinic = { data: clinics[0], fetchedAt: Date.now() };
    return clinics[0];
  }
  return null;
}

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

    // Build dynamic system prompt from clinic data
    const clinic = await getFirstClinic();
    const systemPrompt = clinic
      ? buildSystemPrompt(clinic)
      : 'You are a friendly clinic assistant. Help users with their questions about the clinic.';

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
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
