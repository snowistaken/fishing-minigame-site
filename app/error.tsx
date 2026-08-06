'use client'

import { useEffect } from 'react'
import DialogBox from '@/components/DialogBox/DialogBox'
import Poster from '@/components/Poster/Poster'
import styles from './error.module.css'

// Route error boundary: rendered in place of the page when something below the
// root layout throws, so a crash keeps the site chrome instead of a blank page.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <DialogBox>
      <h1>Something went wrong</h1>
      <Poster className={styles.notice} pinIndex={2} tilt="0.5deg">
        <p>The line snapped on our end — sorry about that.</p>
        <p>
          <button type="button" className={styles.retry} onClick={reset}>
            Try again
          </button>
        </p>
      </Poster>
    </DialogBox>
  )
}
