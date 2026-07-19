import AboutUs from '@/components/AboutUs/AboutUs.jsx'
import { getUpcomingEvents, getPastEvents } from '@/lib/calendar.ts'

export default async function Home() {
  let upcomingEvents = []
  let pastEvents = []
  try {
    ;[upcomingEvents, pastEvents] = await Promise.all([
      getUpcomingEvents(),
      getPastEvents(),
    ])
  } catch (error) {
    console.error('Calendar fetch failed:', error)
  }

  return <AboutUs upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
}
