import AboutUs from '@/components/AboutUs/AboutUs'
import { fetchEvents, type FormattedCalendarEvent } from '@/lib/calendar'

export default async function Home() {
  let upcomingEvents: FormattedCalendarEvent[] = []
  let pastEvents: FormattedCalendarEvent[] = []

  try {
    ;[upcomingEvents, pastEvents] = await Promise.all([
      fetchEvents('upcoming'),
      fetchEvents('past'),
    ])
  } catch (error) {
    console.error('Calendar fetch failed:', error)
  }

  return <AboutUs upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
}
