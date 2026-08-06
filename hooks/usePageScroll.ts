import { useEffect } from 'react'

// Publishes how far down the page the user has scrolled (0..1) as
// --scroll-progress on the document root, for scroll-linked CSS (cloud fade).
export function usePageScroll() {
  useEffect(() => {
    let frame = 0

    // Coalesce to one measurement per animation frame: scroll can fire many
    // times a frame, and reading scrollHeight forces a synchronous layout, so
    // doing the read+write on every event would jank scroll-linked animation.
    function onScroll() {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
        document.documentElement.style.setProperty('--scroll-progress', String(progress))
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
}
