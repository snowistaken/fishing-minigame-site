import type { CSSProperties, ReactNode } from 'react'
import pinGreen  from '@/assets/pin_green.png'
import pinYellow from '@/assets/pin_yellow.png'
import pinRed    from '@/assets/pin_red.png'
import pinPurp   from '@/assets/pin_purp.png'
import styles from './Poster.module.css'

// The pin colour steps through this list; callers pass an index so neighbouring
// posters never share a colour.
const PINS = [pinGreen, pinYellow, pinRed, pinPurp]

interface PosterProps {
  children: ReactNode
  /** Position in the pin-colour cycle. */
  pinIndex?: number
  /** Tilt of the slip, e.g. '-0.6deg'. */
  tilt?: string
  /** Element to render as — 'li' inside a list, 'div' on its own. */
  as?: 'div' | 'li'
  /** Extra class on the paper, e.g. for outer spacing. */
  className?: string
}

export default function Poster({ children, pinIndex = 0, tilt = '0deg', as: Tag = 'div', className }: PosterProps) {
  const pin = PINS[pinIndex % PINS.length]

  return (
    <Tag
      className={className ? `${styles.poster} ${className}` : styles.poster}
      style={{ '--tilt': tilt } as CSSProperties}
    >
      <img src={pin.src} alt="" className={styles.pin} />
      {children}
    </Tag>
  )
}
