'use client'

import { motion } from 'framer-motion'
import { useGameStore, HERO_CLASS_DATA, calculateHeroStats } from '@/store/gameStore'

export default function HeroPage() {
  const { hero } = useGameStore()

  if (!hero) return null

  const heroStats = calculateHeroStats(hero)
  const heroData = HERO_CLASS_DATA[hero.class]
  const xpToLevel = hero.level * 100

  const stats = [
    { label: 'HP', value: heroStats.maxHp, color: 'bg-red-500' },
    { label: 'Attack', value: heroStats.attack, color: 'bg-orange-500' },
    { label: 'Defense', value: heroStats.defense, color: 'bg-blue-500' },
    { label: 'Speed', value: heroStats.speed, color: 'bg-yellow-500' },
  ]

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 mb-6"
      >
        {/* Hero Avatar */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl mb-3"
          >
            {heroData?.emoji}
          </motion.div>
          <h2 className="text-2xl font-bold text-white">{hero.name}</h2>
          <p className="text-purple-400">{heroData?.name}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-yellow-400">⭐</span>
            <span className="text-white font-bold">Level {hero.level}</span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Experience</span>
            <span>{hero.exp}/{xpToLevel}</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(hero.exp / xpToLevel) * 100}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-slate-800/50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                <span className="font-bold text-white">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Resources */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <div>
              <p className="text-xs text-slate-400">PIXEL Tokens</p>
              <p className="font-bold text-purple-400">{hero.pixelTokens.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <div>
              <p className="text-xs text-slate-400">Gold</p>
              <p className="font-bold text-yellow-400">{hero.gold.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Stats */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="font-bold text-white mb-3">📊 Battle Statistics</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-400">{hero.battleWins}</p>
            <p className="text-xs text-slate-400">Wins</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">{hero.battleLosses}</p>
            <p className="text-xs text-slate-400">Losses</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">
              {hero.battleWins + hero.battleLosses > 0 
                ? Math.round((hero.battleWins / (hero.battleWins + hero.battleLosses)) * 100) 
                : 0}%
            </p>
            <p className="text-xs text-slate-400">Win Rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
