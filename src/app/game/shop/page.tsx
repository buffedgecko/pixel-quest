'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, SHOP_ITEMS, generateEquipment } from '@/store/gameStore'
import type { ShopItem } from '@/types/game'

type Category = 'all' | 'egg' | 'equipment' | 'potion' | 'special'

export default function ShopPage() {
  const { tokens, spendCrystal, addCrystal, addToInventory, addTransaction, hero } = useGameStore()
  const [category, setCategory] = useState<Category>('all')
  const [purchaseItem, setPurchaseItem] = useState<ShopItem | null>(null)
  
  const filteredItems = category === 'all' 
    ? SHOP_ITEMS 
    : SHOP_ITEMS.filter(item => item.category === category)
  
  const handlePurchase = (item: ShopItem) => {
    const price = item.crystalPrice || Math.floor(item.price / 10)
    
    if (tokens.crystal < price) {
      return
    }
    
    if (spendCrystal(price)) {
      // Generate reward
      if (item.category === 'egg' && item.rarity) {
        const equipment = generateEquipment(item.rarity)
        addToInventory({
          id: `inv_${Date.now()}`,
          itemId: equipment.id,
          type: 'equipment',
          quantity: 1,
          data: equipment,
        })
      } else if (item.category === 'special') {
        // Add special item to inventory
        addToInventory({
          id: `inv_${Date.now()}`,
          itemId: item.id,
          type: 'special',
          quantity: 1,
          data: item,
        })
      }
      
      addTransaction('spend', price, `Purchased ${item.name}`)
      setPurchaseItem(item)
      
      setTimeout(() => setPurchaseItem(null), 2000)
    }
  }
  
  const categories: Category[] = ['all', 'egg', 'potion', 'special']
  
  return (
    <div className="space-y-4">
      {/* Balance */}
      <div className="glass rounded-xl p-4 flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-400">Your Balance</div>
          <div className="text-2xl font-bold text-primary">💎 {tokens.crystal.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Total Earned</div>
          <div className="text-lg text-secondary">{tokens.totalEarned.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition
              ${category === cat 
                ? 'bg-primary text-white' 
                : 'glass hover:bg-white/10'}`}
          >
            {cat === 'all' ? '📦 All' : 
             cat === 'egg' ? '🥚 Eggs' :
             cat === 'potion' ? '🧪 Potions' : '✨ Special'}
          </button>
        ))}
      </div>
      
      {/* Items */}
      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const price = item.crystalPrice || Math.floor(item.price / 10)
          const canAfford = tokens.crystal >= price
          
          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`glass rounded-xl p-4 ${item.rarity ? `rarity-${item.rarity}-bg border` : ''}`}
            >
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">{item.emoji}</div>
                <div className={`font-bold ${item.rarity ? `rarity-${item.rarity}` : ''}`}>
                  {item.name}
                </div>
                {item.rarity && (
                  <div className={`text-xs rarity-${item.rarity}`}>
                    {item.rarity.toUpperCase()}
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-400 text-center mb-3 min-h-[2rem]">
                {item.description}
              </p>
              
              <button
                onClick={() => handlePurchase(item)}
                disabled={!canAfford}
                className={`w-full py-2 rounded-lg text-sm font-bold transition
                  ${canAfford 
                    ? 'bg-gradient-to-r from-primary to-secondary' 
                    : 'bg-gray-700 cursor-not-allowed'}`}
              >
                💎 {price.toLocaleString()}
              </button>
            </motion.div>
          )
        })}
      </div>
      
      {/* Purchase Success Modal */}
      <AnimatePresence>
        {purchaseItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="text-6xl mb-4">{purchaseItem.emoji}</div>
              <h3 className="text-xl font-bold mb-2">Purchase Successful!</h3>
              <p className="text-gray-400">{purchaseItem.name}</p>
              {purchaseItem.category === 'egg' && (
                <p className="text-sm text-primary mt-2">Check your inventory! 🎁</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
