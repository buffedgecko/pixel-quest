'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { ClientLayout } from '../ClientLayout'

const navItems = [
  { path: '/game/', icon: '⚔️', label: 'Battle' },
  { path: '/game/hero/', icon: '🛡️', label: 'Hero' },
  { path: '/game/shop/', icon: '🛒', label: 'Shop' },
  { path: '/game/quest/', icon: '📜', label: 'Quest' },
  { path: '/game/wallet/', icon: '💎', label: 'Wallet' },
]

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>
      <GameContent>{children}</GameContent>
    </ClientLayout>
  )
}

function GameContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { hero, isLoading } = useGameStore()

  useEffect(() => {
    if (!hero && !isLoading) {
      router.replace('/create/')
    }
  }, [hero, isLoading, router])

  if (!hero) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-purple-400 animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur border-b border-slate-800 p-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{HERO_CLASS_DATA[hero.class]?.emoji}</span>
            <div>
              <p className="font-bold text-white text-sm">{hero.name}</p>
              <p className="text-xs text-slate-400">Lv.{hero.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span>💎</span>
              <span className="text-purple-400 font-bold">{hero.pixelTokens.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 z-30">
        <div className="flex justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center py-2 px-4 ${
                  isActive ? 'text-purple-400' : 'text-slate-500'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

// Import at top
import { HERO_CLASS_DATA } from '@/store/gameStore'
