import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchEvents, type CalendarEvent } from './calendar'

// fetchEvents is the only export, so these drive it through mocked fetch/env
// rather than reaching into the module's internals.
function mockCalendarResponse(items: CalendarEvent[] | undefined, ok = true, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => ({ items }),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: 'evt-1',
    summary: 'Show',
    location: 'Somewhere, Portland, OR',
    start: { dateTime: '2026-06-20T22:30:00Z' },
    ...overrides,
  }
}

/** The single query string fetchEvents built, for asserting on request shape. */
function requestedUrl(fetchMock: ReturnType<typeof vi.fn>): URL {
  return new URL(fetchMock.mock.calls[0][0] as string)
}

beforeEach(() => {
  vi.stubEnv('CALENDAR_ID', 'band@group.calendar.google.com')
  vi.stubEnv('CALENDAR_API_KEY', 'test-key')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('fetchEvents — configuration', () => {
  it('throws a helpful error when the calendar env vars are missing', async () => {
    vi.stubEnv('CALENDAR_ID', '')
    mockCalendarResponse([])

    await expect(fetchEvents('upcoming')).rejects.toThrow(/CALENDAR_ID/)
  })

  it('throws when the calendar API responds with an error status', async () => {
    mockCalendarResponse([], false, 403)

    await expect(fetchEvents('upcoming')).rejects.toThrow(/403/)
  })

  it('returns an empty list when the payload has no items', async () => {
    mockCalendarResponse(undefined)

    await expect(fetchEvents('upcoming')).resolves.toEqual([])
  })
})

describe('fetchEvents — request shape', () => {
  it('url-encodes the calendar id into the path', async () => {
    const fetchMock = mockCalendarResponse([])
    await fetchEvents('upcoming')

    expect(requestedUrl(fetchMock).pathname).toContain(
      encodeURIComponent('band@group.calendar.google.com'),
    )
  })

  it('asks the API to expand recurring events and sort by start time', async () => {
    const fetchMock = mockCalendarResponse([])
    await fetchEvents('upcoming')

    const params = requestedUrl(fetchMock).searchParams
    expect(params.get('singleEvents')).toBe('true')
    expect(params.get('orderBy')).toBe('startTime')
    expect(params.get('key')).toBe('test-key')
  })

  it('caches responses so the calendar is not hit on every request', async () => {
    const fetchMock = mockCalendarResponse([])
    await fetchEvents('upcoming')

    const [, init] = fetchMock.mock.calls[0]
    expect((init as { next?: { revalidate?: number } }).next?.revalidate).toBeGreaterThan(0)
  })

  it('queries forward in time for upcoming events', async () => {
    const fetchMock = mockCalendarResponse([])
    await fetchEvents('upcoming')

    const params = requestedUrl(fetchMock).searchParams
    const now = Date.now()
    expect(new Date(params.get('timeMin')!).getTime()).toBeLessThanOrEqual(now)
    expect(new Date(params.get('timeMax')!).getTime()).toBeGreaterThan(now)
  })

  it('queries backward in time for past events', async () => {
    const fetchMock = mockCalendarResponse([])
    await fetchEvents('past')

    const params = requestedUrl(fetchMock).searchParams
    const now = Date.now()
    expect(new Date(params.get('timeMin')!).getTime()).toBeLessThan(now)
    expect(new Date(params.get('timeMax')!).getTime()).toBeLessThanOrEqual(now)
  })
})

describe('fetchEvents — past-event windowing', () => {
  // The API returns past events oldest-first; the UI wants the most recent
  // handful, newest-first.
  const many = Array.from({ length: 25 }, (_, i) =>
    makeEvent({ id: `evt-${i}`, summary: `Show ${i}` }),
  )

  it('keeps only the most recent events', async () => {
    mockCalendarResponse(many)
    const events = await fetchEvents('past')

    expect(events).toHaveLength(10)
    expect(events.map(e => e.summary)).toContain('Show 24')
    expect(events.map(e => e.summary)).not.toContain('Show 0')
  })

  it('returns them newest-first', async () => {
    mockCalendarResponse(many)
    const events = await fetchEvents('past')

    expect(events[0].summary).toBe('Show 24')
    expect(events.at(-1)!.summary).toBe('Show 15')
  })

  it('handles fewer past events than the display limit', async () => {
    mockCalendarResponse([makeEvent({ id: 'a', summary: 'Only Show' })])
    const events = await fetchEvents('past')

    expect(events.map(e => e.summary)).toEqual(['Only Show'])
  })

  it('leaves upcoming events in the API order', async () => {
    mockCalendarResponse([
      makeEvent({ id: 'a', summary: 'Soonest' }),
      makeEvent({ id: 'b', summary: 'Later' }),
    ])
    const events = await fetchEvents('upcoming')

    expect(events.map(e => e.summary)).toEqual(['Soonest', 'Later'])
  })
})

describe('fetchEvents — display date formatting', () => {
  it('renders timed events in the band’s Pacific timezone', async () => {
    // 22:30 UTC on Jun 20 is 3:30 PM Pacific the same day.
    mockCalendarResponse([makeEvent({ start: { dateTime: '2026-06-20T22:30:00Z' } })])
    const [event] = await fetchEvents('upcoming')

    expect(event.displayDate).toMatch(/Jun 20, 2026/)
    expect(event.displayDate).toMatch(/3:30/)
    expect(event.displayDate).toMatch(/PM/)
  })

  it('does not roll the date forward for a late-evening Pacific show', async () => {
    // 03:00 UTC Jun 21 is still 8:00 PM Pacific on Jun 20 — a naive UTC format
    // would show the wrong day here.
    mockCalendarResponse([makeEvent({ start: { dateTime: '2026-06-21T03:00:00Z' } })])
    const [event] = await fetchEvents('upcoming')

    expect(event.displayDate).toMatch(/Jun 20, 2026/)
  })

  it('formats all-day events from the `date` field', async () => {
    mockCalendarResponse([makeEvent({ start: { date: '2026-06-20' } })])
    const [event] = await fetchEvents('upcoming')

    expect(event.displayDate).toMatch(/Jun \d{2}, 2026/)
  })

  it('falls back to "Date TBA" when the event has no start date', async () => {
    mockCalendarResponse([makeEvent({ start: {} })])
    const [event] = await fetchEvents('upcoming')

    expect(event.displayDate).toBe('Date TBA')
  })

  it('preserves the original event fields alongside the display date', async () => {
    mockCalendarResponse([makeEvent({ id: 'evt-9', summary: 'Show', location: 'Venue, Portland' })])
    const [event] = await fetchEvents('upcoming')

    expect(event).toMatchObject({ id: 'evt-9', summary: 'Show', location: 'Venue, Portland' })
  })
})
