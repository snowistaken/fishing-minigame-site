// Canonical origin for the deployed site. Used by metadata, robots, and sitemap
// so the domain lives in exactly one place.
export const BASE_URL = 'https://fishingminigame.com'

// Verified Resend sender for the contact form. Any local-part on the verified
// domain works — the mailbox itself doesn't need to exist. The recipient is
// env-driven (CONTACT_TO_EMAIL) so it can change without a deploy.
export const CONTACT_FROM = 'Fishing Minigame <no-reply@fishingminigame.com>'

// Inquiry categories for the contact form's reason dropdown. Shared by the form
// (the <option>s) and the server action (validation) so the two can't drift.
export const INQUIRY_TYPES = [
  'Booking FMG for a gig',
  'Having FMG record for my game/project/etc.',
  'Having FMG arrange music for my game/project/etc.',
  'Other',
] as const
