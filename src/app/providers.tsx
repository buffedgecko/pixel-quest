'use client'

import { ReactNode, useEffect, useMemo } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Initialize Telegram WebApp
    if (typeof window !== 'undefined' && (window as any).Telegram) {
      const tg = (window as any).Telegram.WebApp
      if (tg) {
        tg.ready()
        tg.expand()
      }
    }
  }, [])

  const manifestUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/tonconnect-manifest.json` as const
    }
    return '/tonconnect-manifest.json' as const
  }, [])

  const twaReturnUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin as `${string}://${string}`
    }
    return undefined
  }, [])

  return (
    <TonConnectUIProvider 
      manifestUrl={manifestUrl}
      actionsConfiguration={{
        twaReturnUrl,
      }}
    >
      {children}
    </TonConnectUIProvider>
  )
}
