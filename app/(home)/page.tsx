import AboutUs from '@/components/AboutUs/AboutUs'
import JsonLd from '@/components/JsonLd/JsonLd'
import { fetchEvents, type FormattedCalendarEvent } from '@/lib/calendar'
import { eventsSchema } from '@/lib/schema'

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

  const events = eventsSchema(upcomingEvents)

  return (
    <>
      <h1 className="sr-only">Fishing Minigame — Video Game Music String Trio</h1>
      {events.length > 0 && <JsonLd data={events} />}
      <AboutUs upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
    </>
  )
}
