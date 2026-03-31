'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, SHOP_ITEMS, type ShopItem } from '@/store/gameStore'

export default function ShopPage() {
  const { hero, buyItem } = useGameStore()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showPurchase, setShowPurchase] = useState(false)
  const [purchasedItem, setPurchasedItem] = useState<ShopItem | null>(null)

  if (!hero) return null

  const categories = [
    { id: 'all', label: 'All', emoji: '📦' },
    { id: 'equipment', label: 'Equipment', emoji: '⚔️' },
    { id: 'consumable', label: 'Items', emoji: '🧪' },
  ]

  const filteredItems = selectedCategory === 'all' 
    ? SHOP_ITEMS 
    : SHOP_ITEMS.filter(item => item.category === selectedCategory)

  const handleBuy = (item: ShopItem) => {
    if (hero.gold >= item.price) {
      buyItem(item.id)
      setPurchasedItem(item)
      setShowPurchase(true)
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">🛒 Shop</h1>
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1">
          <span>🪙</span>
          <span className="font-bold text-yellow-400">{hero.gold.toLocaleString()}</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const canAfford = hero.gold >= item.price
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800/50 rounded-xl p-3 border border-slate-700"
            >
              <div className="text-3xl text-center mb-2">{item.emoji}</div>
              <h3 className="font-bold text-sm text-center">{item.name}</h3>
              <p className="text-xs text-slate-400 text-center mb-2 line-clamp-2">{item.description}</p>
              
              <button
                onClick={() => handleBuy(item)}
                disabled={!canAfford}
                className={`w-full py-2 rounded-lg text-sm font-medium ${
                  canAfford
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-500'
                }`}
              >
                🪙 {item.price.toLocaleString()}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchase && purchasedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPurchase(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl p-6 text-center max-w-sm w-full border border-slate-700"
            >
              <div className="text-6xl mb-4">{purchasedItem.emoji}</div>
              <h2 className="text-xl font-bold mb-2">Purchased!</h2>
              <p className="text-slate-400 mb-4">{purchasedItem.name}</p>
              <button
                onClick={() => setShowPurchase(false)}
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
