'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'

export default function Page() {
  const router = useRouter()
  const { hasHero } = useGameStore()
  
  useEffect(() => {
    if (hasHero) {
      router.replace('/game')
    } else {
      router.replace('/create')
    }
  }, [hasHero, router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e]">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">⚔️</div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Pixel Quest</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
