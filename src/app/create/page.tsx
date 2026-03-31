'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useGameStore, HERO_CLASS_DATA, type HeroClass } from '@/store/gameStore'
import WalletButton from '@/components/ui/WalletButton'

export default function CreatePage() {
  const router = useRouter()
  const { createHero, isConnected } = useGameStore()
  const [step, setStep] = useState<'name' | 'class' | 'confirm'>('name')
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState<HeroClass | null>(null)
  
  const handleCreate = () => {
    if (name && selectedClass) {
      createHero(name, selectedClass)
      router.replace('/game')
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold gradient-text">⚔️ Pixel Quest</div>
        <WalletButton />
      </div>
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Create Your Hero</h1>
        <p className="text-gray-400">Choose your destiny</p>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {/* Step 1: Name */}
        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <label className="block text-sm text-gray-400 mb-2">Hero Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your hero name..."
                maxLength={20}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
              />
            </div>
            
            <button
              onClick={() => name.trim() && setStep('class')}
              disabled={!name.trim()}
              className="w-full py-4 rounded-xl font-bold text-lg transition
                ${name.trim() 
                  ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90' 
                  : 'bg-gray-700 cursor-not-allowed'}"
            >
              Continue
            </button>
          </motion.div>
        )}
        
        {/* Step 2: Class Selection */}
        {step === 'class' && (
          <motion.div
            key="class"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            {Object.entries(HERO_CLASS_DATA).map(([key, data]) => (
              <motion.button
                key={key}
                onClick={() => setSelectedClass(key as HeroClass)}
                className={`w-full p-4 rounded-xl text-left transition
                  ${selectedClass === key 
                    ? 'bg-primary/20 border-2 border-primary' 
                    : 'glass hover:bg-white/10'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{data.emoji}</span>
                  <div>
                    <div className="font-bold" style={{ color: data.color }}>{data.name}</div>
                    <div className="text-sm text-gray-400">{data.description}</div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span>HP: {data.baseHp}</span>
                      <span>ATK: {data.baseAttack}</span>
                      <span>DEF: {data.baseDefense}</span>
                      <span>CRIT: {Math.floor(data.baseCritRate * 100)}%</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep('name')}
                className="flex-1 py-4 rounded-xl glass font-bold"
              >
                Back
              </button>
              <button
                onClick={() => selectedClass && setStep('confirm')}
                disabled={!selectedClass}
                className={`flex-1 py-4 rounded-xl font-bold transition
                  ${selectedClass 
                    ? 'bg-gradient-to-r from-primary to-secondary' 
                    : 'bg-gray-700 cursor-not-allowed'}`}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Step 3: Confirm */}
        {step === 'confirm' && selectedClass && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center"
          >
            <div className="glass rounded-2xl p-8 mb-6">
              <div 
                className="text-8xl mb-4 animate-float"
                style={{ filter: `drop-shadow(0 0 20px ${HERO_CLASS_DATA[selectedClass].color})` }}
              >
                {HERO_CLASS_DATA[selectedClass].emoji}
              </div>
              <h2 className="text-2xl font-bold mb-1">{name}</h2>
              <p className="text-gray-400">{HERO_CLASS_DATA[selectedClass].name}</p>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-xl">
                <p className="text-sm text-gray-300">
                  Your journey begins now. Battle monsters, earn 💎 Crystals, 
                  and convert them to $PIXEL tokens at launch!
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep('class')}
                className="flex-1 py-4 rounded-xl glass font-bold"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary font-bold"
              >
                Start Adventure! ⚔️
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
