import fmgLogo from '@/assets/fmg_logo_transparent_crop.png'
import cloudLeftImg from '@/assets/cloud_left.png'
import cloudRightImg from '@/assets/cloud_right.png'
import fishercatIdleImg from '@/assets/fishercat_idle.png'
import fishercatActivatedImg from '@/assets/fishercat_activated.png'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
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

      <div className={`${styles.cloud} ${styles.cloudLeft}`}>
        <img src={cloudLeftImg.src} alt="" />
      </div>
      <div className={`${styles.cloud} ${styles.cloudRight}`}>
        <img src={cloudRightImg.src} alt="" />
      </div>

      <img src={fmgLogo.src} alt="Fishing Minigame Logo" className={styles.logo} />

      <div className={styles.waves} />
    </header>
  )
}
