import { useState, useRef, useLayoutEffect, useCallback } from 'react'

// Length of the line when no tab is targeted — just enough to show the hook.
const IDLE_LENGTH = 40

// Measures how long the fishing line must be to reach the target tab.
//
// The line hangs from the bottom of the anchor element (the cat sprite), so its
// length is simply the gap between there and the target tab's center. Measuring
// against the live DOM rather than deriving it from the sprite's proportions
// means the two can't drift apart.
//
// Attach the refs to the sidebar, the cat wrapper, and each tab, then feed
// lineLength into the line's --line-end custom property.
export function useFishingLine(targetIndex: number | null) {
  const [lineLength, setLineLength] = useState(IDLE_LENGTH)
  const sidebarRef = useRef<HTMLElement | null>(null)
  const anchorRef  = useRef<HTMLDivElement | null>(null)
  const tabRefs    = useRef<(HTMLAnchorElement | null)[]>([])

  const measure = useCallback(() => {
    const anchorEl = anchorRef.current

    if (targetIndex === null || !anchorEl) {
      setLineLength(IDLE_LENGTH)
      return
    }

    const tabEl = tabRefs.current[targetIndex]
    if (!tabEl) {
      setLineLength(IDLE_LENGTH)
      return
    }

    const anchorRect = anchorEl.getBoundingClientRect()
    const tabRect    = tabEl.getBoundingClientRect()
    setLineLength(Math.max(0, tabRect.top + tabRect.height / 2 - anchorRect.bottom))
  }, [targetIndex])

  // Re-measure on target change and whenever the sidebar's layout shifts
  // (viewport resize, or --wave-line-y settling after the header images load).
  useLayoutEffect(() => {
    measure()
    const sidebarEl = sidebarRef.current
    if (!sidebarEl) return
    const observer = new ResizeObserver(measure)
    observer.observe(sidebarEl)
    return () => observer.disconnect()
  }, [measure])

  return { sidebarRef, anchorRef, tabRefs, lineLength }
}
