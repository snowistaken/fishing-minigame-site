import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendContactMessage, type ContactState } from './actions'
import { INQUIRY_TYPES, MAX_MESSAGE_LENGTH } from '@/lib/site'

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  headerGet: vi.fn<(name: string) => string | null>(() => null),
}))

vi.mock('resend', () => ({
  // A class, since the action calls `new Resend(apiKey)`.
  Resend: class {
    emails = { send: mocks.send }
  },
}))

vi.mock('next/headers', () => ({
  headers: async () => ({ get: mocks.headerGet }),
}))

const IDLE: ContactState = { ok: false }

/** A submission that passes every check, with per-test overrides. */
function makeFormData(fields: Record<string, string> = {}): FormData {
  const data = new FormData()
  const defaults: Record<string, string> = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    inquiry: INQUIRY_TYPES[0],
    message: 'Would love to book you for a show.',
    'cf-turnstile-response': 'valid-token',
  }
  for (const [key, value] of Object.entries({ ...defaults, ...fields })) {
    // An explicit empty string still gets set, so required-field cases work.
    data.set(key, value)
  }
  return data
}

/** Stubs Cloudflare's siteverify endpoint. */
function mockTurnstile(success: boolean) {
  const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ success }) })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'turnstile-secret')
  vi.stubEnv('RESEND_API_KEY', 'resend-key')
  vi.stubEnv('CONTACT_TO_EMAIL', 'band@example.com')
  mocks.send.mockResolvedValue({ data: { id: 'email-1' }, error: null })
  mocks.headerGet.mockReturnValue(null)
  mockTurnstile(true)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('honeypot', () => {
  it('reports success without sending when the decoy field is filled', async () => {
    const result = await sendContactMessage(IDLE, makeFormData({ website: 'spam.example' }))

    // Fake success: a bot shouldn't learn that it was caught.
    expect(result).toEqual({ ok: true })
    expect(mocks.send).not.toHaveBeenCalled()
  })

  it('short-circuits before spending a Turnstile verification', async () => {
    const fetchMock = mockTurnstile(true)
    await sendContactMessage(IDLE, makeFormData({ website: 'spam.example' }))

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('ignores a whitespace-only decoy value from a real submission', async () => {
    const result = await sendContactMessage(IDLE, makeFormData({ website: '   ' }))

    expect(result.ok).toBe(true)
    expect(mocks.send).toHaveBeenCalled()
  })

  it('logs a breadcrumb so a false positive is recoverable from the logs', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    await sendContactMessage(
      IDLE,
      makeFormData({ website: 'autofilled.example', email: 'real.person@example.com' }),
    )

    expect(log).toHaveBeenCalledWith(expect.stringContaining('[contact] honeypot'))
    expect(log).toHaveBeenCalledWith(expect.stringContaining('real.person@example.com'))
    log.mockRestore()
  })
})

describe('Turnstile verification', () => {
  it('rejects the submission when the token fails verification', async () => {
    mockTurnstile(false)
    const result = await sendContactMessage(IDLE, makeFormData())

    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/human/i)
    expect(mocks.send).not.toHaveBeenCalled()
  })

  it('rejects when no token is supplied at all', async () => {
    const result = await sendContactMessage(IDLE, makeFormData({ 'cf-turnstile-response': '' }))

    expect(result.ok).toBe(false)
    expect(mocks.send).not.toHaveBeenCalled()
  })

  it('fails closed when the server secret is not configured', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '')
    const result = await sendContactMessage(IDLE, makeFormData())

    expect(result.ok).toBe(false)
    expect(mocks.send).not.toHaveBeenCalled()
  })

  it('fails closed when the verification request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const result = await sendContactMessage(IDLE, makeFormData())

    expect(result.ok).toBe(false)
    expect(mocks.send).not.toHaveBeenCalled()
  })

  it('forwards the visitor IP so Cloudflare can weigh it', async () => {
    mocks.headerGet.mockReturnValue('203.0.113.5, 70.41.3.18')
    const fetchMock = mockTurnstile(true)
    await sendContactMessage(IDLE, makeFormData())

    const body = fetchMock.mock.calls[0][1].body as URLSearchParams
    // Only the client-most entry of the X-Forwarded-For chain.
    expect(body.get('remoteip')).toBe('203.0.113.5')
    expect(body.get('secret')).toBe('turnstile-secret')
  })
})

describe('field validation', () => {
  it.each(['name', 'email', 'message'])('rejects a submission missing %s', async field => {
    const result = await sendContactMessage(IDLE, makeFormData({ [field]: '' }))

    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/fill in every field/i)
    expect(mocks.send).not.toHaveBeenCalled()
  })

  it('rejects fields that are only whitespace', async () => {
    const result = await sendContactMessage(IDLE, makeFormData({ name: '   ' }))

    expect(result.ok).toBe(false)
    expect(mocks.send).not.toHaveBeenCalled()
  })

  it('validates before spending the single-use Turnstile token, so a typo does not burn it', async () => {
    // If this ordering regresses, a user who typos their email gets their token
    // redeemed by the failed attempt and the retry is rejected as "not human".
    const fetchMock = mockTurnstile(true)
    const result = await sendContactMessage(IDLE, makeFormData({ email: 'not-an-email' }))

    expect(result.ok).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('echoes the submitted values back on a validation error, so the form can restore them', async () => {
    // React resets form fields after every action; without the echo, a typo'd
    // email would erase the visitor's whole message.
    const result = await sendContactMessage(
      IDLE,
      makeFormData({ email: 'not-an-email', message: 'A long, laboured-over message.' }),
    )

    expect(result.values).toMatchObject({
      email: 'not-an-email',
      message: 'A long, laboured-over message.',
    })
  })

  it('echoes values back when the send itself fails', async () => {
    mocks.send.mockResolvedValue({ data: null, error: { message: 'rejected' } })
    const result = await sendContactMessage(IDLE, makeFormData({ message: 'Keep me.' }))

    expect(result.ok).toBe(false)
    expect(result.values?.message).toBe('Keep me.')
  })

  it('does not echo values on success — the form is replaced, not restored', async () => {
    const result = await sendContactMessage(IDLE, makeFormData())

    expect(result.ok).toBe(true)
    expect(result.values).toBeUndefined()
  })

  it.each(['not-an-email', 'missing@domain', 'no-at-sign.com', 'spaces in@example.com'])(
    'rejects the malformed address %j',
    async email => {
      const result = await sendContactMessage(IDLE, makeFormData({ email }))

      expect(result.ok).toBe(false)
      expect(result.error).toMatch(/valid email/i)
      expect(mocks.send).not.toHaveBeenCalled()
    },
  )

  it('rejects a message longer than the allowed limit', async () => {
    const message = 'x'.repeat(MAX_MESSAGE_LENGTH + 1)
    const result = await sendContactMessage(IDLE, makeFormData({ message }))

    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/too long/i)
    expect(mocks.send).not.toHaveBeenCalled()
  })

  it('accepts a message exactly at the limit', async () => {
    const message = 'x'.repeat(MAX_MESSAGE_LENGTH)
    const result = await sendContactMessage(IDLE, makeFormData({ message }))

    expect(result.ok).toBe(true)
  })
})

describe('inquiry type allowlist', () => {
  it.each(INQUIRY_TYPES)('preserves the known inquiry type %j', async inquiry => {
    await sendContactMessage(IDLE, makeFormData({ inquiry }))

    expect(mocks.send.mock.calls[0][0].subject).toContain(inquiry)
  })

  it('coerces an unrecognised inquiry type to "Other" instead of trusting it', async () => {
    await sendContactMessage(IDLE, makeFormData({ inquiry: '<script>alert(1)</script>' }))

    const { subject } = mocks.send.mock.calls[0][0]
    expect(subject).toContain('Other')
    expect(subject).not.toContain('script')
  })
})

describe('sending', () => {
  it('sends from the verified domain to the configured inbox', async () => {
    await sendContactMessage(IDLE, makeFormData())

    const payload = mocks.send.mock.calls[0][0]
    expect(payload.from).toContain('no-reply@fishingminigame.com')
    expect(payload.to).toEqual(['band@example.com'])
  })

  it('sets reply-to to the submitter so replies reach them, not the no-reply box', async () => {
    await sendContactMessage(IDLE, makeFormData({ email: 'fan@example.com' }))

    expect(mocks.send.mock.calls[0][0].replyTo).toBe('fan@example.com')
  })

  it('includes the submitter’s name, address and message in the body', async () => {
    await sendContactMessage(
      IDLE,
      makeFormData({ name: 'Ada', email: 'ada@example.com', message: 'Hello there' }),
    )

    const { text } = mocks.send.mock.calls[0][0]
    expect(text).toContain('Ada')
    expect(text).toContain('ada@example.com')
    expect(text).toContain('Hello there')
  })

  it('reports failure without claiming success when Resend errors', async () => {
    mocks.send.mockResolvedValue({ data: null, error: { message: 'rejected' } })
    const result = await sendContactMessage(IDLE, makeFormData())

    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/went wrong/i)
  })

  it.each(['CONTACT_TO_EMAIL', 'RESEND_API_KEY'])(
    'refuses to send when %s is not configured',
    async key => {
      vi.stubEnv(key, '')
      const result = await sendContactMessage(IDLE, makeFormData())

      expect(result.ok).toBe(false)
      expect(mocks.send).not.toHaveBeenCalled()
    },
  )

  it('never leaks the API key or recipient into the visitor-facing error', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    const result = await sendContactMessage(IDLE, makeFormData())

    expect(result.error).not.toContain('resend-key')
    expect(result.error).not.toContain('band@example.com')
  })

  it('logs a searchable breadcrumb on success for the Netlify function logs', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    await sendContactMessage(IDLE, makeFormData({ email: 'fan@example.com' }))

    expect(log).toHaveBeenCalledWith(expect.stringContaining('[contact]'))
    expect(log).toHaveBeenCalledWith(expect.stringContaining('fan@example.com'))
    log.mockRestore()
  })
})
