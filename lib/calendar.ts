const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars'

const REVALIDATE_SECONDS = 3600
const DISPLAY_COUNT = 10

export type EventRange = 'upcoming' | 'past'

export interface CalendarEvent {
  id: string
  summary?: string
  location?: string
  start: { dateTime?: string; date?: string }
}

export interface FormattedCalendarEvent extends CalendarEvent {
  displayDate: string
}

function buildCalendarUrl(maxResults: number, timeMin: string, timeMax: string) {
  const calendarId = process.env.CALENDAR_ID
  const apiKey     = process.env.CALENDAR_API_KEY

  if (!calendarId || !apiKey) {
    throw new Error('Missing CALENDAR_ID or CALENDAR_API_KEY environment variable')
  }

  const params = new URLSearchParams({
    key: apiKey,
    timeMin,
    timeMax,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: String(maxResults),
  })

  return `${CALENDAR_API_BASE}/${encodeURIComponent(calendarId)}/events?${params}`
}

function buildQueryDateRange(type: EventRange): { timeMin: string; timeMax: string, maxResults: number } {
  const now = new Date()

  if (type === 'upcoming') {
    return { timeMin: now.toISOString(), timeMax: new Date(8.64e15).toISOString(), maxResults: DISPLAY_COUNT }
  } else {
    return { timeMin: '2000-01-01T00:00:00Z', timeMax: now.toISOString(), maxResults: 250 }
  }
}

// Helpful for when I want to format the location to link to maps
function formatEvent(event: CalendarEvent): FormattedCalendarEvent {
  const rawDate = event.start.dateTime ?? event.start.date ?? ''

  return {
    ...event,
    displayDate: rawDate ? new Date(rawDate)
      .toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        dateStyle: 'medium',
        timeStyle: 'short'
      }) : 'Date TBA'
  }
}

export async function fetchEvents(type: EventRange): 
  Promise<FormattedCalendarEvent[]> {
    const { timeMin, timeMax, maxResults } = buildQueryDateRange(type)
    const url = buildCalendarUrl(maxResults, timeMin, timeMax)

    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })

    if (!response.ok) throw new Error(`Calendar API returned ${response.status}`)

    const data = await response.json() as { items?: CalendarEvent[] }

    const calendarItems = data.items ?? []
    const slicedEvents = type === 'past' ? calendarItems.slice(-DISPLAY_COUNT).reverse() : calendarItems

    return slicedEvents.map(formatEvent)
}
