import DialogBox from '../DialogBox/DialogBox'
import EventPoster from '../EventPoster/EventPoster'
import type { FormattedCalendarEvent } from '@/lib/calendar'
import styles from './EventList.module.css'

interface EventListProps {
  title: string
  events: FormattedCalendarEvent[]
  /** Shown when there are no events (e.g. the calendar is empty or unreachable). */
  emptyMessage?: string
  /** Starting offset into the page-wide pin-colour cycle, so a later board
      continues the colour sequence instead of restarting it. */
  pinOffset?: number
}

export default function EventList({ title, events, emptyMessage = 'Nothing to show yet.', pinOffset = 0 }: EventListProps) {
  return (
    <DialogBox>
      <h2>{title}</h2>
      {events.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul className={styles.posters}>
          {events.map((event, index) => (
            <EventPoster key={event.id} event={event} index={index} pinIndex={pinOffset + index} />
          ))}
        </ul>
      )}
    </DialogBox>
  )
}
