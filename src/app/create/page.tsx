'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useGameStore, HERO_CLASS_DATA, type HeroClass } from '@/store/gameStore'
import { ClientLayout } from '../ClientLayout'

export default function CreatePage() {
  return (
    <ClientLayout>
      <CreateContent />
    </ClientLayout>
  )
}

function CreateContent() {
  const router = useRouter()
  const { createHero } = useGameStore()
  const [step, setStep] = useState<'class' | 'name'>('class')
  const [selectedClass, setSelectedClass] = useState<HeroClass | null>(null)
  const [heroName, setHeroName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateHero = async () => {
    if (!selectedClass || !heroName.trim()) return
    
    setIsLoading(true)
    createHero(heroName.trim(), selectedClass)
    
    setTimeout(() => {
      router.push('/game/')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create Your Hero</h1>
          <p className="text-slate-400 text-sm">
            {step === 'class' ? 'Choose your class' : 'Name your hero'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'class' ? (
            <motion.div
              key="class"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {Object.entries(HERO_CLASS_DATA).map(([key, data]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedClass(key as HeroClass)
                    setStep('name')
                  }}
                  className={`w-full p-4 rounded-xl border transition-all ${
                    selectedClass === key
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{data.emoji}</span>
                    <div className="text-left">
                      <h3 className="font-bold text-white">{data.name}</h3>
                      <p className="text-xs text-slate-400">{data.description}</p>
                      <div className="flex gap-2 mt-1 text-xs">
                        <span className="text-red-400">HP: {data.baseHp}</span>
                        <span className="text-orange-400">ATK: {data.baseAttack}</span>
                        <span className="text-blue-400">SPD: {data.baseSpeed}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Selected Class */}
              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-5xl">{HERO_CLASS_DATA[selectedClass!].emoji}</span>
                <p className="text-slate-400 mt-2">{HERO_CLASS_DATA[selectedClass!].name}</p>
              </div>

              {/* Name Input */}
              <div>
                <input
                  type="text"
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                  placeholder="Enter hero name..."
                  maxLength={20}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('class')}
                  className="flex-1 py-3 bg-slate-700 rounded-xl text-white font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateHero}
                  disabled={!heroName.trim() || isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Hero'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
