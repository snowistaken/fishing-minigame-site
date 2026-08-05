'use client'

import { useActionState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { sendContactMessage, type ContactState } from '@/app/contact-us/actions'
import { INQUIRY_TYPES } from '@/lib/site'
import styles from './ContactUs.module.css'

const INITIAL: ContactState = { ok: false }

export default function ContactUs() {
  const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  if (state.ok) {
    return (
      <p className={styles.success} role="status">
        Thanks for reaching out — your message is on its way. We’ll get back to you soon!
      </p>
    )
  }

  return (
    <form action={formAction} className={styles.form}>
      {/* Honeypot: hidden from people (off-screen, unfocusable), tempting to bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className={styles.field}>
        <span>Name</span>
        <input type="text" name="name" required autoComplete="name" />
      </label>

      <label className={styles.field}>
        <span>Email</span>
        <input type="email" name="email" required autoComplete="email" />
      </label>

      <label className={styles.field}>
        <span>I’m reaching out about…</span>
        <select name="inquiry" defaultValue={INQUIRY_TYPES[0]}>
          {INQUIRY_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>Message</span>
        <textarea name="message" required rows={5} maxLength={5000} />
      </label>

      {siteKey && <Turnstile siteKey={siteKey} className={styles.turnstile} />}

      {state.error && (
        <p className={styles.error} role="alert">{state.error}</p>
      )}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'Sending…' : 'Submit'}
      </button>
    </form>
  )
}
