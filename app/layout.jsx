import './globals.css'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/footer.jsx'
import Sidebar from '../components/Sidebar/Sidebar.tsx'
import ScrollEffects from '../components/ScrollEffects/ScrollEffects.jsx'

export const metadata = {
  title: 'Fishing Minigame',
  description:
    'Fishing Minigame is a classical music band / ensemble based in Portland, OR. Based on the string trio format, they play original arrangements of Video Game music and offer recording and arrangement services for game developers and composers.',
  openGraph: {
    title: 'Fishing Minigame',
    description: 'Upcoming concerts, band members, and contact info.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <ScrollEffects />

          <main className="app-main">
            <Header />

            <div className="app-content">
              <Sidebar />
              <div className="app-content__pages">{children}</div>
            </div>

            <div className="critters" />
            <div className="lake-bottom">
              <Footer />
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
