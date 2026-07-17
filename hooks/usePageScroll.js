import { useEffect } from 'react'

export function usePageScroll() {
  useEffect(() => {
    function onScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
      document.documentElement.style.setProperty('--scroll-progress', progress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}
