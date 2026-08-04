import type { CSSProperties } from 'react'
import type { FormattedCalendarEvent } from '@/lib/calendar'
import pinGreen  from '@/assets/pin_green.png'
import pinYellow from '@/assets/pin_yellow.png'
import pinRed    from '@/assets/pin_red.png'
import pinPurp   from '@/assets/pin_purp.png'
import styles from './EventPoster.module.css'

// Pin colour is picked at random per poster; the tilt cycles through a subtle
// set by position. Together they make a column look hand-pinned rather than
// machine-stamped. (Server-rendered, so the random pick stays put per build.)
const PINS  = [pinGreen, pinYellow, pinRed, pinPurp]
const TILTS = ['-0.6deg', '0.5deg', '-0.4deg', '0.6deg']

interface EventPosterProps {
  event: FormattedCalendarEvent
  /** Position in the list; picks the pin colour and tilt. */
  index: number
}

export default function EventPoster({ event, index }: EventPosterProps) {
  const pin  = PINS[Math.floor(Math.random() * PINS.length)]
  const tilt = TILTS[index % TILTS.length]

  return (
    <li className={styles.poster} style={{ '--tilt': tilt } as CSSProperties}>
      <img src={pin.src} alt="" className={styles.pin} />
      <p className={styles.summary}>{event.summary}</p>
      {event.location && <p className={styles.location}>{event.location}</p>}
      <p className={styles.date}>{event.displayDate}</p>
    </li>
  )
}
