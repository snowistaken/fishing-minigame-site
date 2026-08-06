import type { CSSProperties } from 'react'
import { isTbaLocation, type FormattedCalendarEvent } from '@/lib/calendar'
import pinGreen  from '@/assets/pin_green.png'
import pinYellow from '@/assets/pin_yellow.png'
import pinRed    from '@/assets/pin_red.png'
import pinPurp   from '@/assets/pin_purp.png'
import styles from './EventPoster.module.css'

// The pin colour steps through this list one poster at a time across the whole
// page (the index is threaded from AboutUs through EventList), so neighbours
// never share a colour and a later board continues where the previous one left
// off. The tilt cycles by the poster's position within its own board.
const PINS  = [pinGreen, pinYellow, pinRed, pinPurp]
const TILTS = ['-0.6deg', '0.5deg', '-0.4deg', '0.6deg']

interface EventPosterProps {
  event: FormattedCalendarEvent
  /** Position within this board; drives the tilt. */
  index: number
  /** Position in the page-wide colour cycle; drives the pin colour. */
  pinIndex: number
}

export default function EventPoster({ event, index, pinIndex }: EventPosterProps) {
  const pin  = PINS[pinIndex % PINS.length]
  const tilt = TILTS[index % TILTS.length]

  // A TBA venue shows as plain text rather than linking to a pointless map search.
  const isTba = isTbaLocation(event.location)

  return (
    <li className={styles.poster} style={{ '--tilt': tilt } as CSSProperties}>
      <img src={pin.src} alt="" className={styles.pin} />
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
    </li>
  )
}
