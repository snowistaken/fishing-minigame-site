import Link from 'next/link'
import DialogBox from '@/components/DialogBox/DialogBox'
import Poster from '@/components/Poster/Poster'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <DialogBox>
      <h1>Page not found</h1>
      <Poster className={styles.notice} pinIndex={3} tilt="-0.5deg">
        <p>Nothing’s biting at this address — whatever was here must’ve gotten away.</p>
        <p>
          <Link href="/" className={styles.homeLink}>Swim back home</Link>
        </p>
      </Poster>
    </DialogBox>
  )
}
