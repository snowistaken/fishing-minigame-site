import type { Metadata } from 'next'
import DialogBox from '@/components/DialogBox/DialogBox'

export const metadata: Metadata = {
  title: 'Meet the Band',
  description:
    'Meet the members of Fishing Minigame, a video game music string ensemble based in Portland, OR.',
}

export default function MeetTheBand() {
  return (
    <DialogBox>
      <h1>Meet the Band</h1>
      <p>Learn more about our band members!</p>
    </DialogBox>
  )
}
