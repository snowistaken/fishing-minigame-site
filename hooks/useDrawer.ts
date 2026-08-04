import { useState, useEffect } from 'react'
import { useRootFlag } from './useRootFlag'

// Owns the mobile nav drawer's open state. Publishes it as data-drawer-open on
// the document root so CSS elsewhere (page content shift, scroll lock) can react
// without prop-drilling, and closes on Escape.
export function useDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  useRootFlag('data-drawer-open', isOpen)

  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return {
    isOpen,
    open:   () => setIsOpen(true),
    close:  () => setIsOpen(false),
    toggle: () => setIsOpen(current => !current),
  }
}
