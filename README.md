# Fishing Minigame Site

This is the repo for FMG's website! FMG is a classical music group that does arrangements and covers of video game music. This repo is functionally useless to anyone but the group, but I plan to link this repo on the final site if anyone wants to see the code.

Note: All assets and components are currently in a very WIP state! Please bear that in mind.

You can view the production version of the site at: https://fishingminigame.com

## Stack

Next.js (App Router) · React · TypeScript · CSS Modules. Events come from the Google Calendar API (cached and revalidated hourly); the contact form is a Server Action that sends through Resend.

## Running locally

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values (see below)
3. `npm run dev`
4. Modify and mangle to your heart's content

### Environment variables

All of these live in `.env.local` for local dev, and in the Netlify site settings for production.

| Variable | What it's for |
| --- | --- |
| `CALENDAR_ID` | Google Calendar to pull events from |
| `CALENDAR_API_KEY` | Google Calendar API key |
| `RESEND_API_KEY` | Resend key for sending contact-form email |
| `CONTACT_TO_EMAIL` | Inbox that contact submissions are delivered to |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (public, used by the form) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret (server-side verification) |

Without the calendar vars the event boards render empty rather than erroring. The contact form **fails closed** — without the Turnstile keys, every submission is rejected.

For local dev, Cloudflare's always-pass test keys work on any hostname (a real site key is locked to `fishingminigame.com` and will error with `110200` on `localhost`):

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve a production build |
| `npm test` | Run the unit tests |
| `npm run test:watch` | Tests in watch mode |
| `npm run lint` | ESLint |

Tests cover the calendar data layer, the schema.org builders, and the contact form's validation and bot handling. Run `npx tsc --noEmit` for a type check.
