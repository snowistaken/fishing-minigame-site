'use client'

import { useState, useRef, useLayoutEffect } from 'react'
import Link from 'next/link'
import fisImg from '@/assets/fis.png'
import styles from './Sidebar.module.css'

interface Tab {
  label: string
  id:    string
  url:   string
}

const TABS: Tab[] = [
  { label: 'Home',          id: 'home', url: '/' },
  { label: 'Meet the Band', id: 'meet-the-band', url: '/meet-the-band' },
  { label: 'Contact Us',    id: 'contact-us', url: '/contact-us' },
]

export default function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [lineLength, setLineLength] = useState(40)
  const tabRefs    = useRef<(HTMLAnchorElement | null)[]>([])
  const sidebarRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const sidebarEl = sidebarRef.current

    if (hoveredIndex === null || !sidebarEl) {
        setLineLength(40)
        return
    }

    const tabEl = tabRefs.current[hoveredIndex]
    if (!tabEl) {
      setLineLength(40)
      return
    }

    const sidebarRect = sidebarEl.getBoundingClientRect()
    const tabRect     = tabEl.getBoundingClientRect()
    const tabMidY     = tabRect.top + tabRect.height / 2 - sidebarRect.top

    setLineLength(tabMidY)
  }, [hoveredIndex]);

  useLayoutEffect(() => {
    document.documentElement.toggleAttribute('data-tab-hovered', hoveredIndex !== null)
    return () => document.documentElement.removeAttribute('data-tab-hovered')
  }, [hoveredIndex]);

  return (
    <aside className={styles.sidebar} ref={sidebarRef}>

      <div
        className={styles.sidebarLine}
        style={{
          top:     `-5px`,
          height:  `${lineLength}px`,
          opacity: lineLength > 0 ? 1 : 0,
        }}
      />

      <nav className={styles.sidebarNav}>
        {TABS.map((tab, i) => (
          <Link
            key={tab.id}
            href={tab.url}
            ref={el => {tabRefs.current[i] = el}}
            className={`${styles.sidebarTab} ${hoveredIndex === i ? styles.sidebarTabActive : ''}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img src={fisImg.src} alt="" className={styles.sidebarFishIcon} />
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>

    </aside>
  )
}
