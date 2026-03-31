'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useGameStore } from '@/store/gameStore'

export default function WalletPage() {
  const { hero } = useGameStore()
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)

  if (!hero) return null

  const handleConnect = () => {
    tonConnectUI.openModal()
  }

  const handleDisconnect = () => {
    tonConnectUI.disconnect()
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">💎 Wallet</h1>
        <p className="text-sm text-slate-400">Manage your tokens</p>
      </div>

      {/* Token Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/50 to-slate-900 rounded-2xl p-6 border border-purple-500/30 mb-6"
      >
        <div className="text-center">
          <div className="text-6xl mb-3">💎</div>
          <p className="text-sm text-slate-400 mb-1">PIXEL Tokens</p>
          <p className="text-4xl font-bold text-white">{hero.pixelTokens.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">
            ≈ ${(hero.pixelTokens * 0.001).toFixed(2)} USD*
          </p>
        </div>
      </motion.div>

      {/* TON Connection */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🔷</span>
            </div>
            <div>
              <p className="font-bold text-white">TON Wallet</p>
              {wallet ? (
                <p className="text-xs text-green-400">Connected</p>
              ) : (
                <p className="text-xs text-slate-400">Not connected</p>
              )}
            </div>
          </div>
          <button
            onClick={wallet ? handleDisconnect : handleConnect}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              wallet
                ? 'bg-red-600/20 text-red-400'
                : 'bg-blue-600 text-white'
            }`}
          >
            {wallet ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </div>

      {/* Conversion Info */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-4">
        <h3 className="font-bold text-white mb-3">📈 Token Conversion</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Rate</span>
            <span className="text-white">1 TON = 1000 PIXEL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Min. Withdraw</span>
            <span className="text-white">100 PIXEL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Launch Date</span>
            <span className="text-purple-400">Q2 2026</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
        <p className="text-xs text-yellow-400">
          ⚠️ PIXEL tokens are currently in-game credits. After TGE launch, you will be able to convert them to real tokens on the TON blockchain.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowDeposit(true)}
          disabled={!wallet}
          className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold disabled:opacity-50"
        >
          💰 Deposit
        </button>
        <button
          onClick={() => setShowWithdraw(true)}
          disabled={!wallet || hero.pixelTokens < 100}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold disabled:opacity-50"
        >
          📤 Withdraw
        </button>
      </div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDeposit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeposit(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700"
            >
              <h2 className="text-xl font-bold mb-4 text-center">Deposit TON</h2>
              <p className="text-sm text-slate-400 text-center mb-4">
                Send TON to convert to PIXEL tokens
              </p>
              <div className="bg-slate-900 rounded-xl p-4 mb-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Rate</p>
                <p className="text-lg font-bold">1 TON = 1000 PIXEL</p>
              </div>
              <button
                onClick={() => {
                  // In real app, this would trigger TON transaction
                  setShowDeposit(false)
                }}
                className="w-full py-3 bg-green-600 rounded-xl font-bold mb-2"
              >
                Deposit TON
              </button>
              <button
                onClick={() => setShowDeposit(false)}
                className="w-full py-3 bg-slate-700 rounded-xl font-medium"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdraw && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWithdraw(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700"
            >
              <h2 className="text-xl font-bold mb-4 text-center">Withdraw PIXEL</h2>
              <div className="bg-yellow-500/10 rounded-xl p-3 mb-4">
                <p className="text-xs text-yellow-400 text-center">
                  ⚠️ Token withdrawal will be available after TGE launch
                </p>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 mb-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Available</p>
                <p className="text-2xl font-bold text-purple-400">{hero.pixelTokens} PIXEL</p>
              </div>
              <button
                disabled
                className="w-full py-3 bg-slate-700 rounded-xl font-bold opacity-50 mb-2"
              >
                Coming Soon
              </button>
              <button
                onClick={() => setShowWithdraw(false)}
                className="w-full py-3 bg-slate-700 rounded-xl font-medium"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
