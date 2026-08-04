'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import fisImg from '@/assets/fis.png'
import fishercatIdleImg from '@/assets/fishercat_idle.png'
import fishercatActivatedImg from '@/assets/fishercat_activated.png'
import { useDrawer } from '@/hooks/useDrawer'
import { useFishingLine } from '@/hooks/useFishingLine'
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

export default function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const drawer   = useDrawer()
  const pathname = usePathname()

  // The line follows the hovered tab, or rests on the current page's tab.
  const activeIndex = TABS.findIndex(tab => tab.url === pathname)
  const lineTargetIndex = hoveredIndex ?? (activeIndex !== -1 ? activeIndex : null)

  const { sidebarRef, anchorRef, tabRefs, lineLength } = useFishingLine(lineTargetIndex)

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
              onClick={drawer.close}
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
