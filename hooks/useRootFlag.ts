import { useLayoutEffect } from 'react'

// Mirrors a boolean onto an attribute on <html>, so CSS anywhere on the page can
// react to it without prop-drilling — used for the fishercat sprite swap and the
// mobile drawer's page-wide effects.
export function useRootFlag(attribute: string, isActive: boolean) {
  useLayoutEffect(() => {
    document.documentElement.toggleAttribute(attribute, isActive)
    return () => document.documentElement.removeAttribute(attribute)
  }, [attribute, isActive])
}
