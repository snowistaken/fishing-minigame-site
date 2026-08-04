import DialogBox from '../DialogBox/DialogBox'
import EventPoster from '../EventPoster/EventPoster'
import type { FormattedCalendarEvent } from '@/lib/calendar'
import styles from './EventList.module.css'

interface EventListProps {
  title: string
  events: FormattedCalendarEvent[]
  /** Shown when there are no events (e.g. the calendar is empty or unreachable). */
  emptyMessage?: string
}

export default function EventList({ title, events, emptyMessage = 'Nothing to show yet.' }: EventListProps) {
  return (
    <DialogBox>
      <h2>{title}</h2>
      {events.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul className={styles.posters}>
          {events.map((event, index) => (
            <EventPoster key={event.id} event={event} index={index} />
          ))}
        </ul>
      )}
    </DialogBox>
  )
}
