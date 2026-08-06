import { BASE_URL, SOCIAL_LINKS } from './site'
import { isTbaLocation, type FormattedCalendarEvent } from './calendar'

const NAME = 'Fishing Minigame'
const SAME_AS = Object.values(SOCIAL_LINKS)

// The band itself. logoUrl is passed in absolute (built in the layout from the
// imported logo asset) since schema.org wants a full URL.
export function bandSchema(logoUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: NAME,
    url: BASE_URL,
    logo: logoUrl,
    image: logoUrl,
    genre: ['Video game music', 'Classical'],
    foundingLocation: {
      '@type': 'Place',
      name: 'Portland, OR',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Portland',
        addressRegion: 'OR',
        addressCountry: 'US',
      },
    },
    sameAs: SAME_AS,
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: NAME,
    url: BASE_URL,
  }
}

// One MusicEvent per calendar event, with the band as performer/organizer.
// Skips anything without a title or start date; omits location for TBA venues.
export function eventsSchema(events: FormattedCalendarEvent[]) {
  const band = { '@type': 'MusicGroup', name: NAME, url: BASE_URL }

  return events.flatMap((event) => {
    const startDate = event.start.dateTime ?? event.start.date
    if (!startDate || !event.summary) return []

    const location = event.location?.trim()
    const hasVenue = !!location && !isTbaLocation(location)

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        name: event.summary,
        startDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        performer: band,
        organizer: band,
        ...(hasVenue && {
          location: {
            '@type': 'Place',
            name: location.split(',')[0],
            address: location,
          },
        }),
      },
    ]
  })
}
