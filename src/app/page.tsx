'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { ClientLayout } from './ClientLayout'

export default function HomePage() {
  return (
    <ClientLayout>
      <HomeContent />
    </ClientLayout>
  )
}

function HomeContent() {
  const router = useRouter()
  const { hero } = useGameStore()

  useEffect(() => {
    // Redirect to game if hero exists
    if (hero) {
      router.replace('/game/')
    }
  }, [hero, router])

  if (hero) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-6xl mb-4"
        >
          ⚔️
        </motion.div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
          PIXEL QUEST
        </h1>
        <p className="text-slate-400 mb-8">Idle RPG Adventure</p>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/create/')}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
        >
          🎮 Start Adventure
        </motion.button>

        <p className="text-xs text-slate-500 mt-6">
          Earn PIXEL tokens while playing!
        </p>
      </motion.div>
    </div>
  )
}
