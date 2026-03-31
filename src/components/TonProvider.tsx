'use client'

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { ReactNode } from 'react'

export function TonProvider({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl="https://your-app.vercel.app/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: 'https://your-app.vercel.app/',
      }}
    >
      {children}
    </TonConnectUIProvider>
  )
}
