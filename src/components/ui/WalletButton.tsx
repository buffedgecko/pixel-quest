'use client'

import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { motion } from 'framer-motion'

export default function WalletButton() {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  
  if (wallet) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => tonConnectUI.disconnect()}
        className="flex items-center gap-2 glass px-3 py-1.5 rounded-full text-sm"
      >
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="max-w-[80px] truncate font-mono text-xs">
          {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-4)}
        </span>
      </motion.button>
    )
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => tonConnectUI.connectWallet()}
      className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-3 py-1.5 rounded-full text-sm font-medium"
    >
      <span>🔗</span>
      <span>Connect</span>
    </motion.button>
  )
}
