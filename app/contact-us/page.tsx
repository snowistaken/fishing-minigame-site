import type { Metadata } from 'next'
import DialogBox from '@/components/DialogBox/DialogBox'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Fishing Minigame about gigs, recording, and arranging services.',
}

export default function ContactUs() {
  return (
    <DialogBox>
      <h2>Contact Us</h2>
      <p>Get in touch with us!</p>
    </DialogBox>
  )
}
