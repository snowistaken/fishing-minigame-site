import AboutUs from '@/components/AboutUs/AboutUs.jsx'
import { fetchEvents } from '@/lib/calendar'

export default async function Home() {
  let upcomingEvents = []
  let pastEvents = []
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
