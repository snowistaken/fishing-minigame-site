import fmgLogo from '@/assets/fmg_logo_transparent_crop.png'
import cloudLeftImg from '@/assets/cloud_left.png'
import cloudRightImg from '@/assets/cloud_right.png'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`${styles.cloud} ${styles.cloudLeft}`}>
        <img src={cloudLeftImg.src} alt="" />
      </div>
      <div className={`${styles.cloud} ${styles.cloudRight}`}>
        <img src={cloudRightImg.src} alt="" />
      </div>

      <img src={fmgLogo.src} alt="Fishing Minigame Logo" className={styles.logo} />

      <div className={styles.waves} data-wave-strip />
    </header>
  )
}
