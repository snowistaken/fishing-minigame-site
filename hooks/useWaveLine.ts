import { useEffect } from 'react'

// Measures the vertical position of the header's wave strip relative to <main>
// and publishes it as --wave-line-y on the document root, so the sidebar cat can
// sit at the water line. Re-measures whenever the header changes size (image
// loads, viewport resize), since that shifts where the waves sit.
export function useWaveLine() {
  useEffect(() => {
    const main = document.querySelector('main')
    const header = document.querySelector('header')
    const waves = document.querySelector('[data-wave-strip]')
    if (!main || !header || !waves) return

    function measure() {
      const y = waves!.getBoundingClientRect().top - main!.getBoundingClientRect().top
      document.documentElement.style.setProperty('--wave-line-y', `${Math.round(y)}px`)
    }

    measure()
    // ResizeObserver catches header height shifts from late image loads;
    // the resize listener catches viewport changes (logo scales with vw).
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])
}
