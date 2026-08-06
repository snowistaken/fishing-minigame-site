'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import Poster from '../Poster/Poster'
import { sendContactMessage, type ContactState } from '@/app/contact-us/actions'
import { INQUIRY_TYPES, MAX_MESSAGE_LENGTH, SOCIAL_LINKS } from '@/lib/site'
import styles from './ContactUs.module.css'

const INITIAL: ContactState = { ok: false }

export default function ContactUs() {
  const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL)
  const turnstileRef = useRef<TurnstileInstance | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // Turnstile tokens are single-use, so after any failed submission the widget
  // may be holding a dead token (e.g. the server verified it, then Resend
  // errored). Reset on every error so a retry always carries a fresh one.
  useEffect(() => {
    if (state.error) turnstileRef.current?.reset()
  }, [state])

  // Without the site key the widget can't render and the server rejects every
  // submission (it fails closed) — so don't show a form that can only dead-end.
  if (!siteKey) {
    return (
      <div className={styles.confirmation}>
        <Poster pinIndex={0} tilt="-1deg">
          <p>
            The contact form isn’t available right now — reach out to us on{' '}
            {Object.entries(SOCIAL_LINKS).map(([name, url], i, all) => (
              <span key={name}>
                <a href={url}>{name}</a>
                {i < all.length - 1 ? ' or ' : ''}
              </span>
            ))}{' '}
            instead!
          </p>
        </Poster>
      </div>
    )
  }

  if (state.ok) {
    return (
      <div className={styles.confirmation} role="status">
        <Poster pinIndex={0} tilt="-1deg">
          <p>Thanks for reaching out — your message is on its way. We’ll get back to you soon!</p>
        </Poster>
      </div>
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

      {/* defaultValues echo the last submission back after an error — React
          resets form fields when an action completes, so without this a server
          error would erase everything the visitor typed. */}
      <label className={styles.field}>
        <span>Name</span>
        <input type="text" name="name" required autoComplete="name" defaultValue={state.values?.name} />
      </label>

      <label className={styles.field}>
        <span>Email</span>
        <input type="email" name="email" required autoComplete="email" defaultValue={state.values?.email} />
      </label>

      <label className={styles.field}>
        <span>I’m reaching out about…</span>
        <select name="inquiry" defaultValue={state.values?.inquiry ?? INQUIRY_TYPES[0]}>
          {INQUIRY_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>Message</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          defaultValue={state.values?.message}
        />
      </label>

      <Turnstile ref={turnstileRef} siteKey={siteKey} className={styles.turnstile} />

      {state.error && (
        <p className={styles.error} role="alert">{state.error}</p>
      )}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'Sending…' : 'Submit'}
      </button>
    </form>
  )
}
