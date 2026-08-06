import AboutUs from '@/components/AboutUs/AboutUs'
import JsonLd from '@/components/JsonLd/JsonLd'
import { fetchEventsSafe } from '@/lib/calendar'
import { eventsSchema } from '@/lib/schema'

export default async function Home() {
  // Safe fetches never throw, so one range failing still lets the other render.
  const [upcoming, past] = await Promise.all([
    fetchEventsSafe('upcoming'),
    fetchEventsSafe('past'),
  ])

  const events = eventsSchema(upcoming.events)

  return (
    <>
      <h1 className="sr-only">Fishing Minigame — Video Game Music String Trio</h1>
      {events.length > 0 && <JsonLd data={events} />}
      <AboutUs
        upcomingEvents={upcoming.events}
        pastEvents={past.events}
        upcomingErrored={upcoming.errored}
        pastErrored={past.errored}
      />
    </>
  )
}
