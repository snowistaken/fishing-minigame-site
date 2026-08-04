import styles from './Footer.module.css'

const REPO_URL = 'https://github.com/snowistaken/fishing-minigame-site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <p>© {year} Fishing Minigame. All rights reserved.</p>
      <p>
        Site code is <a href={`${REPO_URL}/blob/main/LICENSE`}>MIT licensed</a>
        {' — '}
        <a href={REPO_URL}>view source on GitHub</a>
        {' — '}
        <a href="https://www.dafont.com/pixantiqua.font">PixAntiqua font by Gerhard Großmann</a>
      </p>
    </footer>
  )
}
