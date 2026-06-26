'use client'

import { useEffect, useState, useCallback, useSyncExternalStore } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function getIsStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function subscribeToStandalone() {
  return () => {}
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installAccepted, setInstallAccepted] = useState(false)
  const isStandalone = useSyncExternalStore(subscribeToStandalone, getIsStandalone, () => false)
  const isInstalled = isStandalone || installAccepted

  // Register service worker on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope)
        })
        .catch((error) => {
          console.log('SW registration failed:', error)
        })
    }
  }, [])

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) return false

    try {
      await installPrompt.prompt()
      const result = await installPrompt.userChoice
      setInstallPrompt(null)

      if (result.outcome === 'accepted') {
        setInstallAccepted(true)
        return true
      }
      return false
    } catch {
      return false
    }
  }, [installPrompt])

  const canInstall = !!installPrompt && !isInstalled

  return {
    canInstall,
    isInstalled,
    install,
  }
}
