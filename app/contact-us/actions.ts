'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { CONTACT_FROM, INQUIRY_TYPES, MAX_MESSAGE_LENGTH } from '@/lib/site'

export type ContactState = {
  ok: boolean
  error?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Cloudflare Turnstile server-side check. Tokens are single-use and short-lived
// (~300s), so a valid token also rules out replays and instant auto-submits —
// which is why we don't also carry a separate timing nonce.
async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token) return false

  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: an off-screen field people never see. If it's filled, quietly
  // pretend success so the bot doesn't learn it was caught.
  if (String(formData.get('website') ?? '').trim()) return { ok: true }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || null
  const token = String(formData.get('cf-turnstile-response') ?? '')
  if (!(await verifyTurnstile(token, ip))) {
    return { ok: false, error: 'Couldn’t verify you’re human — please try again.' }
  }

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const rawInquiry = String(formData.get('inquiry') ?? '')
  const inquiry = (INQUIRY_TYPES as readonly string[]).includes(rawInquiry) ? rawInquiry : 'Other'

  if (!name || !email || !message) return { ok: false, error: 'Please fill in every field.' }
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Please enter a valid email address.' }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `That message is a bit too long. (Limit ${MAX_MESSAGE_LENGTH} characters)` }
  }

  const to = process.env.CONTACT_TO_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!to || !apiKey) {
    console.error('[contact] missing CONTACT_TO_EMAIL or RESEND_API_KEY')
    return { ok: false, error: 'The form isn’t set up right now — please email us directly.' }
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: CONTACT_FROM,
    to: [to],
    replyTo: email,
    subject: `[Contact] ${inquiry} — ${name}`,
    text: `Inquiry: ${inquiry}\nName: ${name}\nEmail: ${email}\n\n${message}`,
  })

  if (error) {
    console.error('[contact] Resend error:', error)
    return { ok: false, error: 'Something went wrong sending your message — please try again.' }
  }

  // Breadcrumb for the Netlify function logs so a submission is findable later.
  console.log(`[contact] ${email} · ${inquiry} · ${new Date().toISOString()}`)
  return { ok: true }
}
