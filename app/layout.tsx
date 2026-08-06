import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Sidebar from '@/components/Sidebar/Sidebar'
import MusicNotes from '@/components/MusicNotes/MusicNotes'
import ScrollEffects from '@/components/ScrollEffects/ScrollEffects'
import JsonLd from '@/components/JsonLd/JsonLd'
import fmgLogo from '@/assets/fmg_logo_transparent_crop.png'
import { BASE_URL } from '@/lib/site'
import { bandSchema, websiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Fishing Minigame',
    template: '%s — Fishing Minigame',
  },
  description:
    'Fishing Minigame is a classical music band / ensemble based in Portland, OR. Based on the string trio format, they play original arrangements of Video Game music and offer recording and arrangement services for game developers and composers.',
  openGraph: {
    title: 'Fishing Minigame',
    description: 'Upcoming concerts, band members, and contact info.',
    type: 'website',
    url: BASE_URL,
    siteName: 'Fishing Minigame',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fishing Minigame',
    description: 'Upcoming concerts, band members, and contact info.',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const logoUrl = new URL(fmgLogo.src, BASE_URL).toString()

  return (
    <html lang="en">
      <body>
        <JsonLd data={bandSchema(logoUrl)} />
        <JsonLd data={websiteSchema()} />

        <div className="app-layout">
          <ScrollEffects />

          <main className="app-main">
            <MusicNotes />
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
