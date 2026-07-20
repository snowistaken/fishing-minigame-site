const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars'

const REVALIDATE_SECONDS = 3600

export interface CalendarEvent {
  id: string
  summary?: string
  location?: string
  start: { dateTime?: string; date?: string }
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

async function fetchEvents(maxResults: number, timeMin: string, timeMax: string) {
  const url = buildCalendarUrl(maxResults, timeMin, timeMax)
  const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })

  if (!response.ok) throw new Error(`Calendar API returned ${response.status}`)

  const data = await response.json() as { items?: CalendarEvent[] }
  return data.items ?? []
}

export async function getUpcomingEvents(maxResults: number = 10):
  Promise<CalendarEvent[]> {
    const now = new Date().toISOString()
    const farFuture = new Date(8.64e15).toISOString()
    return fetchEvents(maxResults, now, farFuture)
}

export async function getPastEvents(maxResults: number = 10):
  Promise<CalendarEvent[]> {
    const now = new Date().toISOString()
    return (await fetchEvents(maxResults, '2000-01-01T00:00:00Z', now)).reverse()
}
