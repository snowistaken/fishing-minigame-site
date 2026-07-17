const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars'

const REVALIDATE_SECONDS = 3600

function buildCalendarUrl(maxResults, timeMin, timeMax) {
  const calendarId = process.env.CALENDAR_ID
  const apiKey     = process.env.CALENDAR_API_KEY

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

async function fetchEvents(maxResults, timeMin, timeMax) {
  const url = buildCalendarUrl(maxResults, timeMin, timeMax)
  const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
  if (!response.ok) throw new Error(`Calendar API returned ${response.status}`)
  const data = await response.json()
  return data.items ?? []
}

export function getUpcomingEvents(maxResults = 10) {
  const now = new Date().toISOString()
  const farFuture = new Date(8.64e15).toISOString()
  return fetchEvents(maxResults, now, farFuture)
}

export function getPastEvents(maxResults = 10) {
  const now = new Date().toISOString()
  return fetchEvents(maxResults, '2000-01-01T00:00:00Z', now)
}
