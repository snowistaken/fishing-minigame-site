import DialogBox from '../DialogBox/DialogBox'
import type { FormattedCalendarEvent } from '@/lib/calendar'

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
        events.map(event => (
          <div key={event.id}>
            <p>{event.summary}</p>
            <p>{event.location}</p>
            <p>{event.displayDate}</p>
          </div>
        ))
      )}
    </DialogBox>
  )
}
