'use client'

import { usePageScroll } from '../hooks/usePageScroll'

// Tiny client component whose only job is running the scroll hook.
// Keeping it separate means the page itself can stay a server component.
export default function ScrollEffects() {
  usePageScroll()
  return null
}
