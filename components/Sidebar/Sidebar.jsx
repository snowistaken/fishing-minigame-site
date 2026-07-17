'use client'

import { useState, useRef, useLayoutEffect } from 'react'
import Link from 'next/link'
import fisImg from '../../assets/fis.png'
import './Sidebar.css'

const TABS = [
  { label: 'Home',          id: 'home', url: '/' },
  { label: 'Meet the Band', id: 'meet-the-band', url: '/meet-the-band' },
  { label: 'Contact Us',    id: 'contact-us', url: '/contact-us' },
]

export default function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [lineLength, setLineLength] = useState(40)
  const tabRefs    = useRef([])
  const sidebarRef = useRef(null)

  useLayoutEffect(() => {
    const tabEl     = tabRefs.current[hoveredIndex]
    const sidebarEl = sidebarRef.current

    if (hoveredIndex === null || !tabEl || !sidebarEl) {
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
    <aside className="sidebar" ref={sidebarRef}>

      <div
        className="sidebar__line"
        style={{
          top:     `-5px`,
          height:  `${lineLength}px`,
          opacity: lineLength > 0 ? 1 : 0,
        }}
      />

      <nav className="sidebar__nav">
        {TABS.map((tab, i) => (
          <Link
            key={tab.id}
            href={tab.url}
            ref={el => tabRefs.current[i] = el}
            className={`sidebar__tab${hoveredIndex === i ? ' sidebar__tab--active' : ''}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img src={fisImg.src} alt="" className="sidebar__fish-icon" />
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>

    </aside>
  )
}
