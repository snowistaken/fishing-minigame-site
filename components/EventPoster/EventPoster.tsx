import { isTbaLocation, type FormattedCalendarEvent } from '@/lib/calendar'
import Poster from '../Poster/Poster'
import styles from './EventPoster.module.css'

// The tilt cycles by the poster's position within its own board; the pin colour
// steps once per poster across the whole page (pinIndex is threaded from AboutUs
// so neighbours never share a colour and a later board continues the sequence).
const TILTS = ['-0.6deg', '0.5deg', '-0.4deg', '0.6deg']

interface EventPosterProps {
  event: FormattedCalendarEvent
  /** Position within this board; drives the tilt. */
  index: number
  /** Position in the page-wide colour cycle; drives the pin colour. */
  pinIndex: number
}

export default function EventPoster({ event, index, pinIndex }: EventPosterProps) {
  const tilt = TILTS[index % TILTS.length]

  // A TBA venue shows as plain text rather than linking to a pointless map search.
  const isTba = isTbaLocation(event.location)

  return (
    <Poster as="li" pinIndex={pinIndex} tilt={tilt}>
      <p className={styles.summary}>{event.summary}</p>
      {event.location && (
        <p className={styles.location}>
          {isTba ? (
            event.location
          ) : (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {event.location}
            </a>
          )}
        </p>
      )}
      <p className={styles.date}>{event.displayDate}</p>
    </Poster>
  )
}
