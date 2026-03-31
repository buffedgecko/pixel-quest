'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useGameStore } from '@/store/gameStore'
import { format } from 'date-fns'

export default function WalletPage() {
  const { tokens, transactions, totalKills, bossKills, hero } = useGameStore()
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  const [showConvert, setShowConvert] = useState(false)
  
  const recentTransactions = transactions.slice(0, 10)
  
  return (
    <div className="space-y-4">
      {/* Token Balance */}
      <div className="glass rounded-2xl p-6 text-center">
        <div className="text-6xl mb-4 animate-pulse-glow">💎</div>
        <h2 className="text-3xl font-bold text-primary mb-1">
          {tokens.crystal.toLocaleString()}
        </h2>
        <p className="text-gray-400">CRYSTAL</p>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xl font-bold text-secondary">
              {tokens.totalEarned.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total Earned</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xl font-bold text-accent">
              {tokens.totalConverted.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Converted</div>
          </div>
        </div>
      </div>
      
      {/* Token Conversion Info */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">🪙</div>
          <div>
            <h3 className="font-bold">$PIXEL Token</h3>
            <p className="text-sm text-gray-400">Coming at Launch</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-400">Your Crystals</div>
              <div className="text-2xl font-bold text-primary">{tokens.crystal}</div>
            </div>
            <div className="text-3xl">→</div>
            <div className="text-right">
              <div className="text-sm text-gray-400">$PIXEL Tokens</div>
              <div className="text-2xl font-bold text-secondary">{tokens.crystal}</div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">
            Conversion rate: <span className="text-primary font-bold">1 Crystal = 1 $PIXEL</span>
          </p>
          <p className="text-xs text-gray-500">
            Token launch date will be announced soon
          </p>
        </div>
      </div>
      
      {/* TON Wallet Connection */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-bold mb-3">🔗 TON Wallet</h3>
        
        {wallet ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <div className="font-medium text-green-400">Connected</div>
                <div className="text-xs text-gray-400 font-mono">
                  {wallet.account.address.slice(0, 8)}...{wallet.account.address.slice(-6)}
                </div>
              </div>
            </div>
            <button
              onClick={() => tonConnectUI.disconnect()}
              className="w-full mt-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-3">
              Connect TON wallet to receive $PIXEL tokens at launch
            </p>
            <button
              onClick={() => tonConnectUI.connectWallet()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary font-bold"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
      
      {/* Stats */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-bold mb-3">📊 Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{totalKills}</div>
            <div className="text-xs text-gray-400">Monsters Slain</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{bossKills}</div>
            <div className="text-xs text-gray-400">Bosses Defeated</div>
          </div>
          {hero && (
            <>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">{hero.level}</div>
                <div className="text-xs text-gray-400">Hero Level</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-secondary">{hero.exp}</div>
                <div className="text-xs text-gray-400">Total EXP</div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Transaction History */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-bold mb-3">📜 Transaction History</h3>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                <div className={`text-xl ${tx.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'earn' ? '📈' : '📉'}
                </div>
                <div className="flex-1">
                  <div className="text-sm">{tx.description}</div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(tx.timestamp), 'MMM d, HH:mm')}
                  </div>
                </div>
                <div className={`font-bold ${tx.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'earn' ? '+' : '-'}{tx.amount} 💎
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-4">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  )
}
