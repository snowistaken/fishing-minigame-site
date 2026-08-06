import DialogBox from '../DialogBox/DialogBox'
import EventList from '../EventList/EventList'
import Poster from '../Poster/Poster'
import type { FormattedCalendarEvent } from '@/lib/calendar'
import styles from './AboutUs.module.css'

interface AboutUsProps {
  upcomingEvents?: FormattedCalendarEvent[]
  pastEvents?: FormattedCalendarEvent[]
  /** Calendar fetch failed for this range — show "couldn't load" instead of the
      "no shows" copy, so an outage doesn't read as the band having no gigs. */
  upcomingErrored?: boolean
  pastErrored?: boolean
}

export default function AboutUs({
  upcomingEvents = [],
  pastEvents = [],
  upcomingErrored = false,
  pastErrored = false,
}: AboutUsProps) {
  return (
    <section>
      <DialogBox>
        <h2>Welcome to our website!</h2>
        <Poster className={styles.introPoster} pinIndex={1} tilt="-0.5deg">
          <p>
            We are a violin, cello, and piano group focusing on original
            genre-bending covers of pop culture music from video games, movies, and
            beyond (that sometimes also features concertina!). Founded in Portland,
            OR by three classical musicians with an interest in exploring the
            classical and folk traditions that inspired many modern composers,
            Fishing Minigame aims to find new and exciting ways to play music that
            we all know and love.
          </p>
        </Poster>
      </DialogBox>
      <EventList
        title="Upcoming Events"
        events={upcomingEvents}
        emptyMessage={
          upcomingErrored
            ? 'Couldn’t load events right now — try again in a bit!'
            : 'No upcoming shows right now — check back soon!'
        }
        pinOffset={0}
      />
      <EventList
        title="Past Events"
        events={pastEvents}
        emptyMessage={
          pastErrored
            ? 'Couldn’t load past shows right now — try again in a bit!'
            : 'No past shows to show yet.'
        }
        pinOffset={upcomingEvents.length}
      />
    </section>
  )
}
