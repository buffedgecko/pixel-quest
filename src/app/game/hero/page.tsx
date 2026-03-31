'use client'

import { motion } from 'framer-motion'
import { useGameStore, HERO_CLASS_DATA, calculateHeroStats, EQUIPMENT_TEMPLATES } from '@/store/gameStore'

export default function HeroPage() {
  const { hero, inventory, equipItem, updateHero } = useGameStore()
  
  if (!hero) return null
  
  const heroStats = calculateHeroStats(hero)
  const classData = HERO_CLASS_DATA[hero.class]
  
  const equipmentSlots = ['weapon', 'armor', 'helmet', 'boots', 'accessory'] as const
  
  // Equipment in inventory
  const equipmentItems = inventory.filter(item => item.type === 'equipment')
  
  return (
    <div className="space-y-4">
      {/* Hero Card */}
      <div className="glass rounded-2xl p-6 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl mb-4"
          style={{ filter: `drop-shadow(0 0 20px ${classData.color})` }}
        >
          {classData.emoji}
        </motion.div>
        
        <h2 className="text-2xl font-bold">{hero.name}</h2>
        <p style={{ color: classData.color }} className="font-medium">{classData.name}</p>
        
        <div className="flex justify-center gap-4 mt-4">
          <div className="glass px-4 py-2 rounded-xl">
            <div className="text-2xl font-bold text-primary">{hero.level}</div>
            <div className="text-xs text-gray-400">Level</div>
          </div>
          <div className="glass px-4 py-2 rounded-xl">
            <div className="text-2xl font-bold text-secondary">{hero.exp}</div>
            <div className="text-xs text-gray-400">EXP</div>
          </div>
          <div className="glass px-4 py-2 rounded-xl">
            <div className="text-2xl font-bold text-accent">{hero.expToNext}</div>
            <div className="text-xs text-gray-400">Next</div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-bold mb-3">📊 Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm text-gray-400">HP</div>
            <div className="text-xl font-bold text-green-400">{heroStats.hp}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm text-gray-400">Attack</div>
            <div className="text-xl font-bold text-red-400">{heroStats.attack}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm text-gray-400">Defense</div>
            <div className="text-xl font-bold text-blue-400">{heroStats.defense}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm text-gray-400">Crit Rate</div>
            <div className="text-xl font-bold text-yellow-400">{Math.floor(heroStats.critRate * 100)}%</div>
          </div>
        </div>
      </div>
      
      {/* Equipment */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-bold mb-3">🛡️ Equipment</h3>
        <div className="space-y-2">
          {equipmentSlots.map((slot) => {
            const item = hero.equipment[slot]
            return (
              <div
                key={slot}
                className={`flex items-center gap-3 p-3 rounded-lg ${item ? `rarity-${item.rarity}-bg border` : 'bg-white/5'}`}
              >
                <div className="text-2xl">{item?.emoji || '➖'}</div>
                <div className="flex-1">
                  <div className={`font-medium ${item ? `rarity-${item.rarity}` : 'text-gray-400'}`}>
                    {item?.name || slot.charAt(0).toUpperCase() + slot.slice(1)}
                  </div>
                  {item && (
                    <div className="text-xs text-gray-400">
                      {item.attack > 0 && `ATK +${item.attack} `}
                      {item.defense > 0 && `DEF +${item.defense} `}
                      {item.critRate > 0 && `CRIT +${Math.floor(item.critRate * 100)}%`}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Inventory Equipment */}
      {equipmentItems.length > 0 && (
        <div className="glass rounded-xl p-4">
          <h3 className="font-bold mb-3">📦 Equipment Inventory</h3>
          <div className="space-y-2">
            {equipmentItems.map((invItem) => {
              const item = invItem.data as any
              return (
                <motion.button
                  key={invItem.id}
                  onClick={() => {
                    equipItem(item)
                    useGameStore.getState().removeFromInventory(invItem.id)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg rarity-${item.rarity}-bg border text-left`}
                >
                  <div className="text-2xl">{item.emoji}</div>
                  <div className="flex-1">
                    <div className={`font-medium rarity-${item.rarity}`}>{item.name}</div>
                    <div className="text-xs text-gray-400">
                      {item.attack > 0 && `ATK +${item.attack} `}
                      {item.defense > 0 && `DEF +${item.defense}`}
                    </div>
                  </div>
                  <div className="text-primary text-sm">Equip →</div>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
