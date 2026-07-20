import DialogBox from '../DialogBox/DialogBox.jsx'
import './AboutUs.css'

export default function AboutUs({ upcomingEvents = [], pastEvents = [] }) {
  return (
    <section className="about-us">
      <DialogBox>
        <h2>Upcoming Events</h2>
        {upcomingEvents.map(event => (
          <div key={event.id}>
            <p>{event.summary}</p>
            <p>{event.location}</p>
            <p>{new Date(event.start.dateTime || event.start.date).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</p>
          </div>
        ))}
      </DialogBox>
      <DialogBox>
        <h2>Past Events</h2>
        {pastEvents.map(event => (
          <div key={event.id}>
            <p>{event.summary}</p>
            <p>{event.location}</p>
            <p>{new Date(event.start.dateTime || event.start.date)
              .toLocaleString('en-US', {
                timeZone: 'America/Los_Angeles',
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>
          </div>
        ))}
      </DialogBox>
    </section>
  )
}
