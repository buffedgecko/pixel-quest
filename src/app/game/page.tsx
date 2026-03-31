'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, calculateHeroStats, MONSTER_DATA } from '@/store/gameStore'

export default function BattlePage() {
  const {
    hero,
    currentMonster,
    spawnMonster,
    attackMonster,
    isAutoBattle,
    toggleAutoBattle,
    battleLog,
    totalKills,
    bossKills,
    tokens,
  } = useGameStore()
  
  const [isAttacking, setIsAttacking] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [lastReward, setLastReward] = useState({ crystal: 0, exp: 0 })
  
  // Spawn monster on mount
  useEffect(() => {
    if (!currentMonster) {
      spawnMonster()
    }
  }, [currentMonster, spawnMonster])
  
  // Auto battle
  useEffect(() => {
    if (isAutoBattle && currentMonster && hero?.hp && hero.hp > 0) {
      const interval = setInterval(() => {
        handleAttack()
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isAutoBattle, currentMonster, hero?.hp])
  
  const handleAttack = useCallback(() => {
    if (!currentMonster || !hero || hero.hp <= 0 || isAttacking) return
    
    setIsAttacking(true)
    setLastReward({ crystal: currentMonster.crystalReward, exp: currentMonster.expReward })
    attackMonster()
    
    setTimeout(() => {
      setShowResult(true)
      setIsAttacking(false)
      setTimeout(() => setShowResult(false), 1500)
    }, 500)
  }, [currentMonster, hero, isAttacking, attackMonster])
  
  if (!hero) return null
  
  const heroStats = calculateHeroStats(hero)
  
  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="glass rounded-xl p-3 flex justify-between items-center">
        <div className="flex gap-4 text-sm">
          <span>⚔️ {totalKills}</span>
          <span>👹 {bossKills}</span>
        </div>
        <div className="text-sm text-gray-400">
          Earned: 💎 {tokens.totalEarned.toLocaleString()}
        </div>
      </div>
      
      {/* Hero Status */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={isAttacking ? { x: [0, 50, 0] } : { y: [0, -5, 0] }}
            transition={{ duration: isAttacking ? 0.3 : 2, repeat: Infinity }}
            className="text-5xl"
          >
            {MONSTER_DATA[hero.class as keyof typeof MONSTER_DATA]?.emoji || '🦸'}
          </motion.div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="font-bold">{hero.name}</span>
              <span className="text-primary">Lv.{hero.level}</span>
            </div>
            {/* HP Bar */}
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-green-500"
                style={{ width: `${(hero.hp / hero.maxHp) * 100}%` }}
                animate={{ opacity: hero.hp < hero.maxHp * 0.3 ? [1, 0.5, 1] : 1 }}
                transition={{ duration: 0.5, repeat: hero.hp < hero.maxHp * 0.3 ? Infinity : 0 }}
              />
            </div>
            {/* EXP Bar */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${(hero.exp / hero.expToNext) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>HP: {hero.hp}/{hero.maxHp}</span>
              <span>EXP: {hero.exp}/{hero.expToNext}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Battle Arena */}
      <div className="relative glass rounded-2xl p-6 min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentMonster ? (
            <motion.div
              key={currentMonster.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: isAttacking ? [0, -20, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0, y: -50 }}
              className="text-center"
            >
              <motion.div
                animate={currentMonster.isBoss ? { 
                  scale: [1, 1.1, 1],
                  filter: ['drop-shadow(0 0 10px #f59e0b)', 'drop-shadow(0 0 30px #f59e0b)', 'drop-shadow(0 0 10px #f59e0b)']
                } : { y: [0, -5, 0] }}
                transition={{ duration: currentMonster.isBoss ? 1 : 2, repeat: Infinity }}
                className={`text-7xl mb-2 ${currentMonster.isBoss ? 'text-yellow-400' : ''}`}
              >
                {currentMonster.emoji}
              </motion.div>
              <div className="font-bold text-lg">{currentMonster.name}</div>
              <div className="text-sm text-gray-400">Lv.{currentMonster.level}</div>
              
              {/* Monster HP */}
              <div className="mt-3 w-48">
                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${currentMonster.isBoss ? 'bg-gradient-to-r from-yellow-500 to-red-500' : 'bg-red-500'}`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${(currentMonster.hp / currentMonster.maxHp) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  HP: {currentMonster.hp.toLocaleString()} / {currentMonster.maxHp.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400"
            >
              <div className="text-4xl mb-2">🔍</div>
              <p>Finding next opponent...</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Battle Result */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-xl font-bold text-green-400 mb-2">Victory!</div>
                <div className="text-sm">
                  <div className="text-primary">+{lastReward.crystal} 💎</div>
                  <div className="text-secondary">+{lastReward.exp} EXP</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Battle Log */}
      {battleLog.length > 0 && (
        <div className="glass rounded-xl p-3 max-h-32 overflow-y-auto">
          <div className="text-xs text-gray-400 mb-2">Battle Log</div>
          <div className="space-y-1">
            {battleLog.slice(-5).map((log) => (
              <div key={log.id} className={`text-xs ${log.attacker === 'hero' ? 'text-primary' : 'text-red-400'}`}>
                {log.attacker === 'hero' ? '⚔️' : '👹'} {log.attacker === 'hero' ? 'Hero' : 'Monster'} 
                {log.isCrit ? ' CRIT!' : ''} dealt {log.damage} damage
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          onClick={handleAttack}
          disabled={!currentMonster || hero.hp <= 0 || isAttacking}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`py-4 rounded-xl font-bold text-lg
            ${currentMonster && hero.hp > 0
              ? 'bg-gradient-to-r from-primary to-secondary' 
              : 'bg-gray-700 cursor-not-allowed'}`}
        >
          {isAttacking ? '⚔️ Attacking...' : '⚔️ Attack'}
        </motion.button>
        
        <motion.button
          onClick={toggleAutoBattle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`py-4 rounded-xl font-bold text-lg glass
            ${isAutoBattle ? 'border-2 border-primary bg-primary/20' : ''}`}
        >
          {isAutoBattle ? '🛑 Stop' : '🔄 Auto'}
        </motion.button>
      </div>
      
      {/* Hero Died */}
      <AnimatePresence>
        {hero.hp <= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <div className="text-center glass rounded-2xl p-8">
              <div className="text-6xl mb-4">💀</div>
              <h2 className="text-2xl font-bold mb-2">Hero Fallen!</h2>
              <p className="text-gray-400 mb-6">Your hero needs rest...</p>
              <button
                onClick={() => {
                  useGameStore.getState().updateHero({ hp: hero.maxHp })
                  spawnMonster()
                }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary font-bold"
              >
                Revive (Full HP)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
