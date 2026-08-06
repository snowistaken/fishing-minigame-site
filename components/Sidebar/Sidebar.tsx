'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import fisImg from '@/assets/fis.png'
import menuFishImg from '@/assets/menu_fish.png'
import fishercatIdleImg from '@/assets/fishercat_idle.png'
import fishercatActivatedImg from '@/assets/fishercat_activated.png'
import { useDrawer } from '@/hooks/useDrawer'
import { useFishingLine } from '@/hooks/useFishingLine'
import { useRootFlag } from '@/hooks/useRootFlag'
import styles from './Sidebar.module.css'

interface Tab {
  label: string
  id:    string
  url:   string
}

const TABS: Tab[] = [
  { label: 'Home',          id: 'home',          url: '/' },
  { label: 'Meet the Band', id: 'meet-the-band', url: '/meet-the-band' },
  { label: 'Contact Us',    id: 'contact-us',    url: '/contact-us' },
]

// On mobile, a tapped tab reels the line down to it and holds the drawer open
// this long before sliding it shut — enough for the line to drop, the cat to
// react, and the destination page to render underneath.
const TAB_CLOSE_DELAY_MS = 450

export default function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tappedIndex,  setTappedIndex]  = useState<number | null>(null)
  const [opening,      setOpening]      = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const drawer   = useDrawer()
  const pathname = usePathname()

  // The line follows the hovered tab, the just-tapped tab (mobile), or rests on
  // the current page's tab.
  const activeIndex = TABS.findIndex(tab => tab.url === pathname)
  const lineTargetIndex = hoveredIndex ?? tappedIndex ?? (activeIndex !== -1 ? activeIndex : null)

  const { sidebarRef, anchorRef, tabRefs, lineLength } = useFishingLine(lineTargetIndex)

  // Swaps the cat to its "activated" sprite while a tab is hovered or (on mobile)
  // freshly tapped (CSS in Sidebar.module.css keys off this attribute).
  useRootFlag('data-tab-hovered', hoveredIndex !== null || tappedIndex !== null)

  // Parts the header clouds (Header.module.css) from the moment the menu starts
  // opening — before the scroll-to-top — so returning to the top doesn't fly them
  // back in and then out again. Stays set right through until the drawer closes.
  useRootFlag('data-clouds-parted', opening || drawer.isOpen)

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  // On the mobile drawer, don't close instantly: let the <Link> navigation start,
  // drop the line to the tapped tab with the cat reeling, then slide the drawer
  // away once the destination has had a moment to render. On desktop the drawer
  // is never open, so tabs just navigate (hover already animates line and cat).
  function handleTabTap(index: number) {
    if (!drawer.isOpen) return

    setTappedIndex(index)
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => {
      drawer.close()
      setTappedIndex(null)
    }, TAB_CLOSE_DELAY_MS)
  }

  // The drawer is a fixed overlay whose cat only lines up with the header's water
  // line when the page is at the top. So on open, glide gently to the top first,
  // then slide the drawer in once the scroll settles — the boat lands on the
  // surface, and the two motions read as one sequence rather than a jump.
  function handleMenuToggle() {
    if (drawer.isOpen) {
      drawer.close()
      return
    }

    if (opening) return // already gliding to the top from a prior tap

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (window.scrollY <= 1 || reduceMotion) {
      window.scrollTo({ top: 0 })
      drawer.open()
      return
    }

    // Part the clouds and glide to the top; slide the drawer in once we arrive.
    setOpening(true)

    let opened = false
    let fallback: ReturnType<typeof setTimeout>
    const openAtTop = () => {
      if (opened) return
      opened = true
      clearTimeout(fallback)
      window.removeEventListener('scrollend', openAtTop)
      // Guarantee we're at the top before opening (in case the glide was
      // interrupted or scrollend never fires), so the cat lands on the surface.
      if (window.scrollY > 1) window.scrollTo({ top: 0 })
      setOpening(false)
      drawer.open()
    }
    // scrollend opens the drawer the instant the glide settles; the timeout is a
    // rAF-independent safety net for browsers without scrollend.
    window.addEventListener('scrollend', openAtTop, { once: true })
    fallback = setTimeout(openAtTop, 800)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <button
        className={styles.drawerToggle}
        aria-expanded={drawer.isOpen}
        aria-controls="site-navigation"
        aria-label={drawer.isOpen ? 'Close navigation' : 'Open navigation'}
        onClick={handleMenuToggle}
      >
        <img src={menuFishImg.src} alt="" />
      </button>

      {drawer.isOpen && <div className={styles.backdrop} onClick={drawer.close} />}

      <aside
        id="site-navigation"
        className={`${styles.sidebar} ${drawer.isOpen ? styles.sidebarOpen : ''}`}
        ref={sidebarRef}
      >
        <div className={styles.fishercatWrap} ref={anchorRef}>
          <img
            src={fishercatIdleImg.src}
            alt="Fishercat in a boat, waiting for a fish to bite"
            className={`${styles.fishercat} ${styles.fishercatIdle}`}
          />
          <img
            src={fishercatActivatedImg.src}
            alt="Fishercat in a boat, excited about a biting fish"
            className={`${styles.fishercat} ${styles.fishercatActivated}`}
          />

          {/* Nested in the wrapper so it hangs from the sprite's own line. */}
          <div className={styles.sidebarLine} style={{ height: `${lineLength}px` }} />
        </div>

        <nav className={styles.sidebarNav}>
          {TABS.map((tab, i) => (
            <Link
              key={tab.id}
              href={tab.url}
              ref={el => { tabRefs.current[i] = el }}
              className={`${styles.sidebarTab} ${lineTargetIndex === i ? styles.sidebarTabActive : ''}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleTabTap(i)}
            >
              <img src={fisImg.src} alt="" className={styles.sidebarFishIcon} />
              <span>{tab.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
