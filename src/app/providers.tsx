'use client'

import { ReactNode } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl="/tonconnect-manifest.json"
    >
      {children}
    </TonConnectUIProvider>
  )
}
