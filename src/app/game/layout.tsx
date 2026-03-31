'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import WalletButton from '@/components/ui/WalletButton'

const navItems = [
  { path: '/game', icon: '⚔️', label: 'Battle' },
  { path: '/game/hero', icon: '🦸', label: 'Hero' },
  { path: '/game/shop', icon: '🏪', label: 'Shop' },
  { path: '/game/quest', icon: '📜', label: 'Quest' },
  { path: '/game/wallet', icon: '💎', label: 'Wallet' },
]

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { hasHero, tokens, hero } = useGameStore()
  
  // Redirect if no hero
  useEffect(() => {
    if (!hasHero) {
      router.replace('/create')
    }
  }, [hasHero, router])
  
  if (!hasHero) return null
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 glass border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold gradient-text">Pixel Quest</div>
          {hero && (
            <div className="text-sm text-gray-400">
              Lv.{hero.level} {HERO_CLASS_DATA[hero.class]?.emoji}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-3 py-1 rounded-full text-sm">
            💎 {tokens.crystal.toLocaleString()}
          </div>
          <WalletButton />
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex flex-col items-center py-2 px-4"
              >
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className={`text-2xl ${isActive ? '' : 'opacity-60'}`}
                >
                  {item.icon}
                </motion.div>
                <span className={`text-xs mt-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

// Import HERO_CLASS_DATA
import { HERO_CLASS_DATA } from '@/store/gameStore'
