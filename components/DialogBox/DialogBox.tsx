import type { ReactNode } from 'react'
import styles from './DialogBox.module.css'

export default function DialogBox({ children }: { children: ReactNode }) {
  return <div className={styles.dialogBox}>{children}</div>
}
