'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import fisImg from '@/assets/fis.png'
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
const TAB_CLOSE_DELAY_MS = 600

export default function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tappedIndex,  setTappedIndex]  = useState<number | null>(null)
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

  return (
    <>
      <button
        className={styles.drawerToggle}
        aria-expanded={drawer.isOpen}
        aria-controls="site-navigation"
        aria-label={drawer.isOpen ? 'Close navigation' : 'Open navigation'}
        onClick={drawer.toggle}
      >
        <img src={fisImg.src} alt="" />
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
