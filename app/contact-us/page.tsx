import type { Metadata } from 'next'
import DialogBox from '@/components/DialogBox/DialogBox'
import ContactUs from '@/components/ContactUs/ContactUs'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Fishing Minigame about gigs, recording, and arranging services.',
}

export default function ContactUsPage() {
  return (
    <DialogBox>
      <h1>Contact Us</h1>
      <ContactUs />
    </DialogBox>
  )
}
