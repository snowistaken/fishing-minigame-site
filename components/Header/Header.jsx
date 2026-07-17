import fmgLogo from '../../assets/fmg_logo_transparent_crop.png'
import cloudLeftImg from '../../assets/cloud_left.png'
import cloudRightImg from '../../assets/cloud_right.png'
import fishercatIdleImg from '../../assets/fishercat_idle.png'
import fishercatActivatedImg from '../../assets/fishercat_activated.png'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <img
        src={fishercatIdleImg.src}
        alt="Fishercat in a boat, waiting for a fish to bite"
        className="header__fishercat header__fishercat--idle"
      />
      <img
        src={fishercatActivatedImg.src}
        alt="Fishercat in a boat, excited about a biting fish"
        className="header__fishercat header__fishercat--activated"
      />

      <div className="header__cloud header__cloud--left">
        <img src={cloudLeftImg.src} alt="" />
      </div>
      <div className="header__cloud header__cloud--right">
        <img src={cloudRightImg.src} alt="" />
      </div>

      <img src={fmgLogo.src} alt="Fishing Minigame Logo" className="header__logo" />

      <div className="header__waves" />
    </header>
  )
}
