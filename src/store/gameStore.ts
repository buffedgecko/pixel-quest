export { type Monster, type ShopItem, type Quest } from '@/types/game'
export { type HeroClass } from '@/types/game'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Hero, HeroClass, Monster, ShopItem, Quest, InventoryItem, Transaction, TokenBalance, BattleLogEntry, EquipmentItem } from '@/types/game'

// Hero Class Data
export const HERO_CLASS_DATA: Record<HeroClass, {
  name: string
  emoji: string
  baseHp: number
  baseAttack: number
  baseDefense: number
  baseCritRate: number
  description: string
  color: string
}> = {
  warrior: {
    name: 'Warrior',
    emoji: '⚔️',
    baseHp: 150,
    baseAttack: 25,
    baseDefense: 20,
    baseCritRate: 0.1,
    description: 'Tank with high HP and defense',
    color: '#ef4444',
  },
  mage: {
    name: 'Mage',
    emoji: '🔮',
    baseHp: 80,
    baseAttack: 40,
    baseDefense: 10,
    baseCritRate: 0.2,
    description: 'High damage, low defense',
    color: '#8b5cf6',
  },
  archer: {
    name: 'Archer',
    emoji: '🏹',
    baseHp: 100,
    baseAttack: 30,
    baseDefense: 15,
    baseCritRate: 0.25,
    description: 'Balanced with high crit rate',
    color: '#22c55e',
  },
  assassin: {
    name: 'Assassin',
    emoji: '🗡️',
    baseHp: 70,
    baseAttack: 35,
    baseDefense: 8,
    baseCritRate: 0.35,
    description: 'Glass cannon with highest crit',
    color: '#6366f1',
  },
}

// Monster Data
export const MONSTER_DATA = {
  goblin: { name: 'Goblin', emoji: '👺', baseHp: 50, baseAttack: 8, baseDefense: 3, crystalBase: 5 },
  orc: { name: 'Orc', emoji: '👹', baseHp: 80, baseAttack: 12, baseDefense: 5, crystalBase: 10 },
  skeleton: { name: 'Skeleton', emoji: '💀', baseHp: 60, baseAttack: 15, baseDefense: 2, crystalBase: 8 },
  demon: { name: 'Demon', emoji: '😈', baseHp: 100, baseAttack: 18, baseDefense: 8, crystalBase: 15 },
  dragon: { name: 'Dragon', emoji: '🐉', baseHp: 150, baseAttack: 25, baseDefense: 12, crystalBase: 25 },
}

// Shop Items
export const SHOP_ITEMS: ShopItem[] = [
  // Eggs
  { id: 'egg_mystery', name: 'Mystery Egg', description: 'Contains random equipment', price: 500, category: 'egg', emoji: '🥚', rarity: 'common' },
  { id: 'egg_rare', name: 'Rare Egg', description: 'Contains rare+ equipment', price: 1500, category: 'egg', emoji: '🥚', rarity: 'rare', crystalPrice: 50 },
  { id: 'egg_legendary', name: 'Legendary Egg', description: 'Contains legendary equipment', price: 5000, category: 'egg', emoji: '🥚', rarity: 'legendary', crystalPrice: 200 },
  
  // Potions
  { id: 'potion_hp', name: 'Health Potion', description: 'Restore 50 HP', price: 100, category: 'potion', emoji: '❤️', effect: { type: 'exp', value: 0 } },
  { id: 'potion_power', name: 'Power Potion', description: '+50% Attack for 5 battles', price: 300, category: 'potion', emoji: '💪', effect: { type: 'boost', value: 50, duration: 5 } },
  
  // Special
  { id: 'exp_boost', name: 'EXP Booster', description: '2x EXP for 10 battles', price: 1000, category: 'special', emoji: '⚡', effect: { type: 'boost', value: 100, duration: 10 } },
  { id: 'crystal_magnet', name: 'Crystal Magnet', description: '+50% Crystal for 10 battles', price: 2000, category: 'special', emoji: '🧲', crystalPrice: 100, effect: { type: 'boost', value: 50, duration: 10 } },
]

// Equipment Templates
export const EQUIPMENT_TEMPLATES: EquipmentItem[] = [
  // Weapons
  { id: 'sword_iron', name: 'Iron Sword', slot: 'weapon', rarity: 'common', attack: 5, defense: 0, critRate: 0.02, emoji: '🗡️' },
  { id: 'sword_flame', name: 'Flame Sword', slot: 'weapon', rarity: 'rare', attack: 15, defense: 0, critRate: 0.05, emoji: '🔥' },
  { id: 'staff_ice', name: 'Ice Staff', slot: 'weapon', rarity: 'epic', attack: 25, defense: 5, critRate: 0.08, emoji: '🪄' },
  { id: 'blade_shadow', name: 'Shadow Blade', slot: 'weapon', rarity: 'legendary', attack: 40, defense: 10, critRate: 0.15, emoji: '🌑' },
  
  // Armor
  { id: 'armor_leather', name: 'Leather Armor', slot: 'armor', rarity: 'common', attack: 0, defense: 8, critRate: 0, emoji: '🥋' },
  { id: 'armor_steel', name: 'Steel Armor', slot: 'armor', rarity: 'rare', attack: 0, defense: 20, critRate: 0, emoji: '🛡️' },
  { id: 'armor_dragon', name: 'Dragon Armor', slot: 'armor', rarity: 'legendary', attack: 10, defense: 50, critRate: 0.05, emoji: '🐉' },
]

// Generate Random Monster
export function generateMonster(heroLevel: number): Monster {
  const types = Object.keys(MONSTER_DATA) as Array<keyof typeof MONSTER_DATA>
  const type = types[Math.floor(Math.random() * types.length)]
  const data = MONSTER_DATA[type]
  const level = Math.max(1, heroLevel + Math.floor(Math.random() * 3) - 1)
  const isBoss = Math.random() < 0.1
  
  const multiplier = isBoss ? 3 : 1
  
  return {
    id: `monster_${Date.now()}`,
    name: isBoss ? `BOSS ${data.name}` : data.name,
    type: type as any,
    level,
    hp: data.baseHp * level * multiplier,
    maxHp: data.baseHp * level * multiplier,
    attack: data.baseAttack * level * multiplier,
    defense: data.baseDefense * level * multiplier,
    isBoss,
    crystalReward: Math.floor(data.crystalBase * level * (isBoss ? 5 : 1)),
    expReward: level * (isBoss ? 50 : 10),
    emoji: data.emoji,
  }
}

// Generate Equipment from Egg
export function generateEquipment(rarity: 'common' | 'rare' | 'epic' | 'legendary'): EquipmentItem {
  const rarityOrder = ['common', 'rare', 'epic', 'legendary']
  const minIndex = rarityOrder.indexOf(rarity)
  const possibleItems = EQUIPMENT_TEMPLATES.filter(item => rarityOrder.indexOf(item.rarity) >= minIndex)
  return possibleItems[Math.floor(Math.random() * possibleItems.length)]
}

// Calculate Hero Stats
export function calculateHeroStats(hero: Hero): { hp: number, attack: number, defense: number, critRate: number } {
  const baseStats = HERO_CLASS_DATA[hero.class]
  let hp = baseStats.baseHp + (hero.level * 10)
  let attack = baseStats.baseAttack + (hero.level * 2)
  let defense = baseStats.baseDefense + (hero.level * 1.5)
  let critRate = baseStats.baseCritRate + (hero.level * 0.005)
  
  // Add equipment stats
  Object.values(hero.equipment).forEach(item => {
    if (item) {
      hp += item.defense * 5
      attack += item.attack
      defense += item.defense
      critRate += item.critRate
    }
  })
  
  return { hp: Math.floor(hp), attack: Math.floor(attack), defense: Math.floor(defense), critRate: Math.min(0.8, critRate) }
}

// Game Store
interface GameStore {
  // Connection
  address: string | null
  isConnected: boolean
  setConnected: (address: string) => void
  disconnect: () => void
  
  // Hero
  hero: Hero | null
  hasHero: boolean
  createHero: (name: string, heroClass: HeroClass) => void
  updateHero: (updates: Partial<Hero>) => void
  addExp: (amount: number) => void
  equipItem: (item: EquipmentItem) => void
  
  // Combat
  currentMonster: Monster | null
  battleLog: BattleLogEntry[]
  isAutoBattle: boolean
  totalKills: number
  bossKills: number
  spawnMonster: () => void
  attackMonster: () => void
  toggleAutoBattle: () => void
  addBattleLog: (entry: BattleLogEntry) => void
  clearBattleLog: () => void
  
  // Tokens
  tokens: TokenBalance
  addCrystal: (amount: number) => void
  spendCrystal: (amount: number) => boolean
  transactions: Transaction[]
  addTransaction: (type: 'earn' | 'spend' | 'convert', amount: number, description: string) => void
  
  // Inventory
  inventory: InventoryItem[]
  addToInventory: (item: InventoryItem) => void
  removeFromInventory: (itemId: string, quantity?: number) => void
  
  // Quests
  quests: Quest[]
  updateQuestProgress: (questId: string, progress: number) => void
  claimQuestReward: (questId: string) => void
  resetDailyQuests: () => void
  
  // Stats
  totalPlayTime: number
  lastActive: number
  updateActivity: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Connection
      address: null,
      isConnected: false,
      setConnected: (address) => set({ address, isConnected: true }),
      disconnect: () => set({ address: null, isConnected: false }),
      
      // Hero
      hero: null,
      hasHero: false,
      createHero: (name, heroClass) => {
        const baseStats = HERO_CLASS_DATA[heroClass]
        const hero: Hero = {
          id: `hero_${Date.now()}`,
          name,
          class: heroClass,
          level: 1,
          exp: 0,
          expToNext: 100,
          hp: baseStats.baseHp,
          maxHp: baseStats.baseHp,
          attack: baseStats.baseAttack,
          defense: baseStats.baseDefense,
          critRate: baseStats.baseCritRate,
          equipment: { weapon: null, armor: null, helmet: null, boots: null, accessory: null },
          skin: 'default',
          createdAt: Date.now(),
        }
        set({ hero, hasHero: true })
      },
      updateHero: (updates) => set(state => ({
        hero: state.hero ? { ...state.hero, ...updates } : null
      })),
      addExp: (amount) => {
        const { hero, updateHero } = get()
        if (!hero) return
        
        let newExp = hero.exp + amount
        let newLevel = hero.level
        let expToNext = hero.expToNext
        
        while (newExp >= expToNext) {
          newExp -= expToNext
          newLevel++
          expToNext = Math.floor(expToNext * 1.5)
        }
        
        const baseStats = HERO_CLASS_DATA[hero.class]
        updateHero({
          exp: newExp,
          level: newLevel,
          expToNext,
          maxHp: baseStats.baseHp + (newLevel * 10),
        })
      },
      equipItem: (item) => {
        const { hero, updateHero } = get()
        if (!hero) return
        
        updateHero({
          equipment: {
            ...hero.equipment,
            [item.slot]: item,
          }
        })
      },
      
      // Combat
      currentMonster: null,
      battleLog: [],
      isAutoBattle: false,
      totalKills: 0,
      bossKills: 0,
      spawnMonster: () => {
        const { hero } = get()
        if (!hero) return
        const monster = generateMonster(hero.level)
        set({ currentMonster: monster, battleLog: [] })
      },
      attackMonster: () => {
        const { hero, currentMonster, addBattleLog, addCrystal, addExp, spawnMonster, updateQuestProgress, addTransaction } = get()
        if (!hero || !currentMonster) return
        
        const heroStats = calculateHeroStats(hero)
        let battleLog: BattleLogEntry[] = []
        let monsterHp = currentMonster.hp
        let heroHp = hero.hp
        
        // Battle simulation
        let turn = 1
        while (monsterHp > 0 && heroHp > 0) {
          // Hero attacks
          const isCrit = Math.random() < heroStats.critRate
          const heroDamage = Math.floor(heroStats.attack * (isCrit ? 2 : 1) * (1 - currentMonster.defense / 100))
          monsterHp -= heroDamage
          battleLog.push({ id: `${Date.now()}_${turn}_hero`, turn, attacker: 'hero', damage: heroDamage, isCrit, timestamp: Date.now() })
          
          if (monsterHp <= 0) break
          
          // Monster attacks
          const monsterDamage = Math.floor(currentMonster.attack * (1 - heroStats.defense / 100))
          heroHp -= monsterDamage
          battleLog.push({ id: `${Date.now()}_${turn}_monster`, turn, attacker: 'monster', damage: monsterDamage, isCrit: false, timestamp: Date.now() })
          
          turn++
        }
        
        set({ battleLog })
        
        // Result
        if (monsterHp <= 0) {
          const crystal = currentMonster.crystalReward
          const exp = currentMonster.expReward
          
          addCrystal(crystal)
          addExp(exp)
          addTransaction('earn', crystal, `Defeated ${currentMonster.name}`)
          
          set(state => ({
            totalKills: state.totalKills + 1,
            bossKills: state.bossKills + (currentMonster.isBoss ? 1 : 0),
            hero: state.hero ? { ...state.hero, hp: heroHp } : null,
          }))
          
          // Update quests
          updateQuestProgress('monster_hunt', 1)
          if (currentMonster.isBoss) {
            updateQuestProgress('boss_slayer', 1)
          }
          
          // Spawn new monster after delay
          setTimeout(() => spawnMonster(), 1000)
        } else {
          // Hero died
          set(state => ({
            hero: state.hero ? { ...state.hero, hp: 0 } : null,
            currentMonster: null,
          }))
        }
      },
      toggleAutoBattle: () => set(state => ({ isAutoBattle: !state.isAutoBattle })),
      addBattleLog: (entry) => set(state => ({ battleLog: [...state.battleLog, entry] })),
      clearBattleLog: () => set({ battleLog: [] }),
      
      // Tokens
      tokens: { crystal: 0, pendingCrystal: 0, totalEarned: 0, totalConverted: 0 },
      addCrystal: (amount) => set(state => ({
        tokens: {
          ...state.tokens,
          crystal: state.tokens.crystal + amount,
          totalEarned: state.tokens.totalEarned + amount,
        }
      })),
      spendCrystal: (amount) => {
        const { tokens } = get()
        if (tokens.crystal < amount) return false
        set(state => ({
          tokens: { ...state.tokens, crystal: state.tokens.crystal - amount }
        }))
        return true
      },
      transactions: [],
      addTransaction: (type, amount, description) => set(state => ({
        transactions: [
          { id: `tx_${Date.now()}`, type, amount, description, timestamp: Date.now() },
          ...state.transactions,
        ].slice(0, 100)
      })),
      
      // Inventory
      inventory: [],
      addToInventory: (item) => set(state => ({
        inventory: [...state.inventory, item]
      })),
      removeFromInventory: (itemId, quantity = 1) => set(state => ({
        inventory: state.inventory.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - quantity }
            : item
        ).filter(item => item.quantity > 0)
      })),
      
      // Quests
      quests: [
        { id: 'monster_hunt', name: 'Monster Hunter', description: 'Defeat 10 monsters', type: 'daily', target: 10, progress: 0, crystalReward: 50, expReward: 100, completed: false, claimed: false },
        { id: 'boss_slayer', name: 'Boss Slayer', description: 'Defeat 3 bosses', type: 'daily', target: 3, progress: 0, crystalReward: 100, expReward: 200, completed: false, claimed: false },
        { id: 'crystal_collector', name: 'Crystal Collector', description: 'Collect 500 crystals', type: 'daily', target: 500, progress: 0, crystalReward: 50, expReward: 150, completed: false, claimed: false },
      ],
      updateQuestProgress: (questId, progress) => set(state => ({
        quests: state.quests.map(quest =>
          quest.id === questId
            ? {
                ...quest,
                progress: quest.progress + progress,
                completed: quest.progress + progress >= quest.target,
              }
            : quest
        )
      })),
      claimQuestReward: (questId) => {
        const { quests, addCrystal, addExp, addTransaction } = get()
        const quest = quests.find(q => q.id === questId)
        if (!quest || !quest.completed || quest.claimed) return
        
        addCrystal(quest.crystalReward)
        addExp(quest.expReward)
        addTransaction('earn', quest.crystalReward, `Quest: ${quest.name}`)
        
        set(state => ({
          quests: state.quests.map(q =>
            q.id === questId ? { ...q, claimed: true } : q
          )
        }))
      },
      resetDailyQuests: () => set(state => ({
        quests: state.quests.map(quest =>
          quest.type === 'daily'
            ? { ...quest, progress: 0, completed: false, claimed: false }
            : quest
        )
      })),
      
      // Stats
      totalPlayTime: 0,
      lastActive: Date.now(),
      updateActivity: () => set({ lastActive: Date.now() }),
    }),
    {
      name: 'pixel-quest-storage',
      partialize: (state) => ({
        address: state.address,
        isConnected: state.isConnected,
        hero: state.hero,
        hasHero: state.hasHero,
        tokens: state.tokens,
        transactions: state.transactions,
        inventory: state.inventory,
        quests: state.quests,
        totalKills: state.totalKills,
        bossKills: state.bossKills,
        totalPlayTime: state.totalPlayTime,
        lastActive: state.lastActive,
      }),
    }
  )
)
