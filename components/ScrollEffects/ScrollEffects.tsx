'use client'

import { usePageScroll } from '@/hooks/usePageScroll'
import { useWaveLine } from '@/hooks/useWaveLine'

export default function ScrollEffects() {
  usePageScroll()
  useWaveLine()
  return null
}
