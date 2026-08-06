// Canonical origin for the deployed site. Used by metadata, robots, and sitemap
// so the domain lives in exactly one place.
export const BASE_URL = 'https://fishingminigame.com'

// Verified Resend sender for the contact form. Any local-part on the verified
// domain works — the mailbox itself doesn't need to exist. The recipient is
// env-driven (CONTACT_TO_EMAIL) so it can change without a deploy.
export const CONTACT_FROM = 'Fishing Minigame <no-reply@fishingminigame.com>'

// The band's public profiles. Shared by the schema.org sameAs data and the
// contact form's fallback (shown when the form itself can't run).
export const SOCIAL_LINKS = {
  Instagram: 'https://www.instagram.com/fishing.minigame',
  Bluesky: 'https://bsky.app/profile/fishing-minigame.bsky.social',
} as const

// Inquiry categories for the contact form's reason dropdown. Shared by the form
// (the <option>s) and the server action (validation) so the two can't drift.
export const INQUIRY_TYPES = [
  'Booking FMG for a gig',
  'Having FMG record for my game/project/etc.',
  'Having FMG arrange music for my game/project/etc.',
  'Other',
] as const

// Longest contact message we accept. Shared by the form (the textarea's
// maxLength, which is a convenience) and the server action (which enforces it),
// so the browser hint and the real limit can't disagree.
export const MAX_MESSAGE_LENGTH = 5000
