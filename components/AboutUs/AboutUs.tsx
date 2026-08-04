import EventList from '../EventList/EventList'
import type { FormattedCalendarEvent } from '@/lib/calendar'

interface AboutUsProps {
  upcomingEvents?: FormattedCalendarEvent[]
  pastEvents?: FormattedCalendarEvent[]
}

export default function AboutUs({ upcomingEvents = [], pastEvents = [] }: AboutUsProps) {
  return (
    <section>
      <EventList
        title="Upcoming Events"
        events={upcomingEvents}
        emptyMessage="No upcoming shows right now — check back soon!"
      />
      <EventList
        title="Past Events"
        events={pastEvents}
        emptyMessage="No past shows to show yet."
      />
    </section>
  )
}
