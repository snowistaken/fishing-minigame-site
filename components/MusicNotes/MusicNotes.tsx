import type { CSSProperties } from 'react'
import placeholderNote from '@/assets/placeholder_music_note.png'
import styles from './MusicNotes.module.css'

// Placeholder until the real note art lands. The effect supports several note
// types — add assets here and each note cycles through them by index.
const NOTE_ASSETS = [placeholderNote]

// A subtle, steady trickle rising from the critters — enough to make you wonder
// what's down there, not a swarm.
const NOTE_COUNT = 12

// Deterministic pseudo-random in [0, 1) from a seed, so the server and client
// render identical notes (no hydration mismatch) while still looking scattered.
function rand(seed: number): number {
  const x = Math.sin(seed) * 43758.5453
  return x - Math.floor(x)
}

export default function MusicNotes() {
  return (
    <div className={styles.field} aria-hidden="true">
      {Array.from({ length: NOTE_COUNT }, (_, i) => {
        const r = (p: number) => rand(i * 10 + p)
        const asset = NOTE_ASSETS[i % NOTE_ASSETS.length]

        const startX   = 72 + r(1) * 22        // % — clustered near the critters (right side)
        const driftX   = -(8 + r(2) * 68)      // cqw — fan out leftward across the page as it rises
        const size     = 22 + r(3) * 20        // px
        const duration = 17 + r(4) * 12        // s
        const delay    = -r(5) * 29            // s — negative so notes start pre-distributed along the rise
        const opacity  = 0.38 + r(6) * 0.22    // peak opacity (kept low — ambient, not loud)
        const sway     = 5 + r(7) * 9          // px — gentle horizontal wobble

        const style = {
          '--start-x':  `${startX.toFixed(2)}%`,
          '--drift-x':  `${driftX.toFixed(1)}cqw`,
          '--size':     `${size.toFixed(1)}px`,
          '--duration': `${duration.toFixed(1)}s`,
          '--delay':    `${delay.toFixed(1)}s`,
          '--opacity':  opacity.toFixed(2),
          '--sway':     `${sway.toFixed(1)}px`,
        } as CSSProperties

        return <img key={i} src={asset.src} alt="" className={styles.note} style={style} />
      })}
    </div>
  )
}
