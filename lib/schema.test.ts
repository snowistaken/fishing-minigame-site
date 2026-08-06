import { describe, it, expect } from 'vitest'
import { bandSchema, websiteSchema, eventsSchema } from './schema'
import { BASE_URL } from './site'
import type { FormattedCalendarEvent } from './calendar'

// Minimal valid event; each test overrides just the field under test.
function makeEvent(overrides: Partial<FormattedCalendarEvent> = {}): FormattedCalendarEvent {
  return {
    id: 'evt-1',
    summary: 'Show at the Meadery',
    location: 'Oran Mor, 8011 SE 13th Ave, Portland, OR 97202, USA',
    start: { dateTime: '2026-06-20T15:30:00-07:00' },
    displayDate: 'Jun 20, 2026, 3:30 PM',
    ...overrides,
  }
}

describe('bandSchema', () => {
  it('describes the band as a MusicGroup at the canonical URL', () => {
    const schema = bandSchema('https://example.com/logo.png')

    expect(schema['@type']).toBe('MusicGroup')
    expect(schema.url).toBe(BASE_URL)
  })

  it('uses the passed-in absolute logo URL for both logo and image', () => {
    const logoUrl = 'https://example.com/logo.png'
    const schema = bandSchema(logoUrl)

    expect(schema.logo).toBe(logoUrl)
    expect(schema.image).toBe(logoUrl)
  })
})

describe('websiteSchema', () => {
  it('describes the site as a WebSite at the canonical URL', () => {
    const schema = websiteSchema()

    expect(schema['@type']).toBe('WebSite')
    expect(schema.url).toBe(BASE_URL)
  })
})

describe('eventsSchema', () => {
  it('returns one MusicEvent per valid event', () => {
    const schemas = eventsSchema([makeEvent({ id: 'a' }), makeEvent({ id: 'b' })])

    expect(schemas).toHaveLength(2)
    expect(schemas[0]['@type']).toBe('MusicEvent')
  })

  it('lists the band as both performer and organizer', () => {
    const [schema] = eventsSchema([makeEvent()])

    expect(schema.performer).toMatchObject({ '@type': 'MusicGroup', url: BASE_URL })
    expect(schema.organizer).toMatchObject({ '@type': 'MusicGroup', url: BASE_URL })
  })

  it('skips events with no title', () => {
    expect(eventsSchema([makeEvent({ summary: undefined })])).toEqual([])
  })

  it('skips events with no start date', () => {
    expect(eventsSchema([makeEvent({ start: {} })])).toEqual([])
  })

  it('falls back to an all-day `date` when there is no `dateTime`', () => {
    const [schema] = eventsSchema([makeEvent({ start: { date: '2026-06-20' } })])

    expect(schema.startDate).toBe('2026-06-20')
  })

  it('keeps valid events when a neighbouring one is skipped', () => {
    const schemas = eventsSchema([
      makeEvent({ id: 'bad', summary: undefined }),
      makeEvent({ id: 'good', summary: 'Real Show' }),
    ])

    expect(schemas).toHaveLength(1)
    expect(schemas[0].name).toBe('Real Show')
  })

  it('uses the venue name (text before the first comma) as the place name', () => {
    const [schema] = eventsSchema([
      makeEvent({ location: 'High Limit Room, 720 SE Hawthorne Blvd, Portland, OR' }),
    ])

    expect(schema.location).toMatchObject({
      '@type': 'Place',
      name: 'High Limit Room',
      address: 'High Limit Room, 720 SE Hawthorne Blvd, Portland, OR',
    })
  })

  it('omits location for a TBA venue rather than emitting a bogus Place', () => {
    const [schema] = eventsSchema([makeEvent({ location: 'TBA' })])

    expect(schema.location).toBeUndefined()
    expect(schema.name).toBe('Show at the Meadery')
  })

  it.each(['tba', ' TBA ', 'Tba'])('treats %j as TBA regardless of case or padding', location => {
    const [schema] = eventsSchema([makeEvent({ location })])

    expect(schema.location).toBeUndefined()
  })

  it('omits location when the event has none at all', () => {
    const [schema] = eventsSchema([makeEvent({ location: undefined })])

    expect(schema.location).toBeUndefined()
  })

  it('returns an empty array for no events, so callers can skip rendering', () => {
    expect(eventsSchema([])).toEqual([])
  })
})
