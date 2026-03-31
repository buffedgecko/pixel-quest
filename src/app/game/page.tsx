'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, MONSTERS, calculateHeroStats } from '@/store/gameStore'

export default function BattlePage() {
  const { hero, addBattleResult, updateHero } = useGameStore()
  const [isAutoBattle, setIsAutoBattle] = useState(true)
  const [currentMonster, setCurrentMonster] = useState(0)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [isInBattle, setIsInBattle] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null)
  const [enemyHp, setEnemyHp] = useState(0)
  const [heroHp, setHeroHp] = useState(0)

  const heroStats = hero ? calculateHeroStats(hero) : null
  const monster = MONSTERS[currentMonster]

  useEffect(() => {
    if (monster) {
      setEnemyHp(monster.hp)
    }
    if (heroStats) {
      setHeroHp(heroStats.maxHp)
    }
  }, [monster, heroStats])

  const startBattle = useCallback(() => {
    if (!hero || !heroStats || !monster) return

    setIsInBattle(true)
    setBattleLog([])
    setShowResult(false)
    setBattleResult(null)

    let heroCurrentHp = heroStats.maxHp
    let monsterCurrentHp = monster.hp
    const logs: string[] = []

    // Simulate battle
    const battleInterval = setInterval(() => {
      if (heroCurrentHp <= 0 || monsterCurrentHp <= 0) {
        clearInterval(battleInterval)
        
        const won = monsterCurrentHp <= 0
        setBattleResult(won ? 'win' : 'lose')
        setShowResult(true)
        setIsInBattle(false)

        // Add rewards
        if (won) {
          addBattleResult({
            monsterName: monster.name,
            xpGained: monster.xpReward,
            tokensGained: monster.tokenReward,
            won: true,
          })

          // Update hero
          const newXp = hero.exp + monster.xpReward
          const xpToLevel = hero.level * 100
          const leveledUp = newXp >= xpToLevel

          updateHero({
            exp: newXp % xpToLevel,
            level: leveledUp ? hero.level + 1 : hero.level,
            pixelTokens: hero.pixelTokens + monster.tokenReward,
            gold: hero.gold + monster.goldReward,
          })

          logs.push(`🏆 Victory! +${monster.tokenReward} PIXEL`)
        } else {
          logs.push('💀 Defeat! Heal your hero.')
        }

        setBattleLog(prev => [...prev, ...logs])
        return
      }

      // Hero attacks
      const heroDamage = Math.max(1, heroStats.attack - monster.defense + Math.floor(Math.random() * 10))
      monsterCurrentHp -= heroDamage
      logs.push(`⚔️ You dealt ${heroDamage} damage!`)
      setEnemyHp(Math.max(0, monsterCurrentHp))

      if (monsterCurrentHp <= 0) return

      // Monster attacks
      const monsterDamage = Math.max(1, monster.attack - heroStats.defense + Math.floor(Math.random() * 5))
      heroCurrentHp -= monsterDamage
      logs.push(`🔥 ${monster.name} dealt ${monsterDamage} damage!`)
      setHeroHp(Math.max(0, heroCurrentHp))

      setBattleLog(prev => [...prev, ...logs.slice(-2)])
      logs.length = 0
    }, 800)

    return () => clearInterval(battleInterval)
  }, [hero, heroStats, monster, addBattleResult, updateHero])

  // Auto-battle effect
  useEffect(() => {
    if (!isAutoBattle || isInBattle || showResult) return
    
    const timeout = setTimeout(() => {
      startBattle()
    }, 1000)

    return () => clearTimeout(timeout)
  }, [isAutoBattle, isInBattle, showResult, startBattle])

  if (!hero || !heroStats) return null

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Monster Selection */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">Select Monster</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MONSTERS.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setCurrentMonster(idx)}
              disabled={isInBattle}
              className={`flex-shrink-0 p-3 rounded-lg border transition-all ${
                currentMonster === idx
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-slate-700 bg-slate-800/50'
              } ${isInBattle ? 'opacity-50' : ''}`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <p className="text-xs text-white mt-1">{m.name}</p>
              <p className="text-xs text-slate-400">Lv.{m.level}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Battle Arena */}
      <div className="relative bg-slate-800/50 rounded-2xl p-4 border border-slate-700 mb-4">
        {/* Hero */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <motion.div
              animate={isInBattle ? { x: [0, 10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-5xl mb-2"
            >
              {HERO_CLASS_DATA[hero.class]?.emoji}
            </motion.div>
            <p className="text-sm font-bold">{hero.name}</p>
            <p className="text-xs text-slate-400">HP: {heroHp}/{heroStats.maxHp}</p>
            <div className="w-20 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(heroHp / heroStats.maxHp) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-2xl">⚔️</div>

          {/* Monster */}
          <div className="text-center">
            <motion.div
              animate={isInBattle ? { x: [0, -10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-5xl mb-2"
            >
              {monster?.emoji}
            </motion.div>
            <p className="text-sm font-bold">{monster?.name}</p>
            <p className="text-xs text-slate-400">HP: {enemyHp}/{monster?.hp}</p>
            <div className="w-20 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${(enemyHp / (monster?.hp || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Battle Log */}
        <div className="h-24 overflow-y-auto bg-slate-900/50 rounded-lg p-2 text-xs">
          {battleLog.map((log, idx) => (
            <p key={idx} className="text-slate-300">{log}</p>
          ))}
          {!isInBattle && battleLog.length === 0 && (
            <p className="text-slate-500 text-center">Ready for battle!</p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsAutoBattle(!isAutoBattle)}
          className={`flex-1 py-3 rounded-xl font-medium ${
            isAutoBattle 
              ? 'bg-green-600 text-white' 
              : 'bg-slate-700 text-slate-300'
          }`}
        >
          {isAutoBattle ? '🔄 Auto ON' : '⏸️ Auto OFF'}
        </button>
        <button
          onClick={startBattle}
          disabled={isInBattle}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white disabled:opacity-50"
        >
          {isInBattle ? '⚔️ Fighting...' : '⚔️ Battle'}
        </button>
      </div>

      {/* Battle Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl p-6 text-center max-w-sm w-full border border-slate-700"
            >
              <div className="text-6xl mb-4">
                {battleResult === 'win' ? '🏆' : '💀'}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {battleResult === 'win' ? 'Victory!' : 'Defeat!'}
              </h2>
              {battleResult === 'win' && (
                <div className="text-slate-300 mb-4">
                  <p>+{monster?.tokenReward} PIXEL</p>
                  <p>+{monster?.xpReward} XP</p>
                  <p>+{monster?.goldReward} Gold</p>
                </div>
              )}
              <button
                onClick={() => setShowResult(false)}
                className="w-full py-3 bg-purple-600 rounded-xl font-bold"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Import at top
import { HERO_CLASS_DATA } from '@/store/gameStore'
