import styles from './DialogBox.module.css'

export default function DialogBox({ children }) {
  return <div className={styles.dialogBox}>{children}</div>
}
