import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export type HeroClass = 'warrior' | 'mage' | 'archer' | 'assassin'

export interface Hero {
  id: string
  name: string
  class: HeroClass
  level: number
  exp: number
  gold: number
  pixelTokens: number
  battleWins: number
  battleLosses: number
  completedQuests: string[]
  createdAt: number
}

export interface Monster {
  id: string
  name: string
  emoji: string
  level: number
  hp: number
  attack: number
  defense: number
  xpReward: number
  goldReward: number
  tokenReward: number
}

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  emoji: string
}

export interface Quest {
  id: string
  name: string
  description: string
  emoji: string
  type: 'daily' | 'achievement'
  requirement: { type: string; value: number }
  tokenReward: number
  goldReward: number
}

export interface BattleResult {
  monsterName: string
  xpGained: number
  tokensGained: number
  won: boolean
  timestamp?: number
}

// Hero Class Data
export const HERO_CLASS_DATA: Record<HeroClass, {
  name: string
  emoji: string
  description: string
  baseHp: number
  baseAttack: number
  baseDefense: number
  baseSpeed: number
}> = {
  warrior: {
    name: 'Warrior',
    emoji: '⚔️',
    description: 'Tank with high HP and defense',
    baseHp: 150,
    baseAttack: 25,
    baseDefense: 20,
    baseSpeed: 8,
  },
  mage: {
    name: 'Mage',
    emoji: '🔮',
    description: 'High damage dealer',
    baseHp: 80,
    baseAttack: 40,
    baseDefense: 10,
    baseSpeed: 12,
  },
  archer: {
    name: 'Archer',
    emoji: '🏹',
    description: 'Balanced with range advantage',
    baseHp: 100,
    baseAttack: 30,
    baseDefense: 15,
    baseSpeed: 15,
  },
  assassin: {
    name: 'Assassin',
    emoji: '🗡️',
    description: 'Fast and deadly',
    baseHp: 70,
    baseAttack: 35,
    baseDefense: 8,
    baseSpeed: 20,
  },
}

// Calculate hero stats
export function calculateHeroStats(hero: Hero) {
  const classData = HERO_CLASS_DATA[hero.class]
  const levelMultiplier = 1 + (hero.level - 1) * 0.1
  
  return {
    maxHp: Math.floor(classData.baseHp * levelMultiplier),
    attack: Math.floor(classData.baseAttack * levelMultiplier),
    defense: Math.floor(classData.baseDefense * levelMultiplier),
    speed: Math.floor(classData.baseSpeed * levelMultiplier),
  }
}

// Monsters
export const MONSTERS: Monster[] = [
  {
    id: 'slime',
    name: 'Slime',
    emoji: '🟢',
    level: 1,
    hp: 30,
    attack: 5,
    defense: 2,
    xpReward: 10,
    goldReward: 50,
    tokenReward: 5,
  },
  {
    id: 'goblin',
    name: 'Goblin',
    emoji: '👺',
    level: 3,
    hp: 50,
    attack: 10,
    defense: 5,
    xpReward: 25,
    goldReward: 100,
    tokenReward: 10,
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    emoji: '💀',
    level: 5,
    hp: 80,
    attack: 15,
    defense: 8,
    xpReward: 40,
    goldReward: 200,
    tokenReward: 20,
  },
  {
    id: 'orc',
    name: 'Orc',
    emoji: '👹',
    level: 8,
    hp: 120,
    attack: 20,
    defense: 12,
    xpReward: 60,
    goldReward: 350,
    tokenReward: 35,
  },
  {
    id: 'demon',
    name: 'Demon',
    emoji: '😈',
    level: 12,
    hp: 180,
    attack: 30,
    defense: 18,
    xpReward: 100,
    goldReward: 500,
    tokenReward: 50,
  },
  {
    id: 'dragon',
    name: 'Dragon',
    emoji: '🐉',
    level: 20,
    hp: 300,
    attack: 50,
    defense: 30,
    xpReward: 200,
    goldReward: 1000,
    tokenReward: 100,
  },
]

// Shop Items
export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'sword_iron',
    name: 'Iron Sword',
    description: '+5 Attack',
    price: 500,
    category: 'equipment',
    emoji: '🗡️',
  },
  {
    id: 'shield_wood',
    name: 'Wooden Shield',
    description: '+5 Defense',
    price: 400,
    category: 'equipment',
    emoji: '🛡️',
  },
  {
    id: 'potion_hp',
    name: 'Health Potion',
    description: 'Restore HP in battle',
    price: 100,
    category: 'consumable',
    emoji: '🧪',
  },
  {
    id: 'potion_atk',
    name: 'Attack Boost',
    description: '+20% Attack for 5 min',
    price: 250,
    category: 'consumable',
    emoji: '💪',
  },
  {
    id: 'armor_leather',
    name: 'Leather Armor',
    description: '+10 Defense',
    price: 800,
    category: 'equipment',
    emoji: '🦺',
  },
  {
    id: 'boots_speed',
    name: 'Swift Boots',
    description: '+10 Speed',
    price: 600,
    category: 'equipment',
    emoji: '👢',
  },
]

// Quests
export const QUESTS: Quest[] = [
  {
    id: 'win_3_battles',
    name: 'Battle Veteran',
    description: 'Win 3 battles',
    emoji: '⚔️',
    type: 'daily',
    requirement: { type: 'battles', value: 3 },
    tokenReward: 50,
    goldReward: 200,
  },
  {
    id: 'win_10_battles',
    name: 'Warrior Spirit',
    description: 'Win 10 battles',
    emoji: '🏆',
    type: 'daily',
    requirement: { type: 'battles', value: 10 },
    tokenReward: 100,
    goldReward: 500,
  },
  {
    id: 'reach_level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    emoji: '⭐',
    type: 'achievement',
    requirement: { type: 'level', value: 5 },
    tokenReward: 200,
    goldReward: 1000,
  },
  {
    id: 'reach_level_10',
    name: 'Champion',
    description: 'Reach level 10',
    emoji: '👑',
    type: 'achievement',
    requirement: { type: 'level', value: 10 },
    tokenReward: 500,
    goldReward: 2500,
  },
  {
    id: 'collect_1000_tokens',
    name: 'Token Collector',
    description: 'Collect 1000 PIXEL tokens',
    emoji: '💎',
    type: 'achievement',
    requirement: { type: 'tokens', value: 1000 },
    tokenReward: 100,
    goldReward: 500,
  },
]

// Game State
interface GameState {
  hero: Hero | null
  isLoading: boolean
  battleResults: BattleResult[]
  
  // Actions
  createHero: (name: string, heroClass: HeroClass) => void
  updateHero: (updates: Partial<Hero>) => void
  addBattleResult: (result: Omit<BattleResult, 'timestamp'>) => void
  buyItem: (itemId: string) => void
  completeQuest: (questId: string) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      hero: null,
      isLoading: false,
      battleResults: [],
      
      createHero: (name, heroClass) => set({
        isLoading: true,
        hero: {
          id: `hero_${Date.now()}`,
          name,
          class: heroClass,
          level: 1,
          exp: 0,
          gold: 100,
          pixelTokens: 0,
          battleWins: 0,
          battleLosses: 0,
          completedQuests: [],
          createdAt: Date.now(),
        },
      }),
      
      updateHero: (updates) => set(state => ({
        hero: state.hero ? { ...state.hero, ...updates } : null,
      })),
      
      addBattleResult: (result) => set(state => {
        const hero = state.hero
        if (!hero) return state
        
        const newResult: BattleResult = {
          ...result,
          timestamp: Date.now(),
        }
        
        return {
          battleResults: [newResult, ...state.battleResults].slice(0, 50),
          hero: result.won 
            ? { ...hero, battleWins: hero.battleWins + 1 }
            : { ...hero, battleLosses: hero.battleLosses + 1 },
        }
      }),
      
      buyItem: (itemId) => {
        const { hero } = get()
        const item = SHOP_ITEMS.find(i => i.id === itemId)
        if (!hero || !item || hero.gold < item.price) return
        
        set({
          hero: {
            ...hero,
            gold: hero.gold - item.price,
          },
        })
      },
      
      completeQuest: (questId) => {
        const { hero } = get()
        const quest = QUESTS.find(q => q.id === questId)
        if (!hero || !quest || hero.completedQuests.includes(questId)) return
        
        set({
          hero: {
            ...hero,
            pixelTokens: hero.pixelTokens + quest.tokenReward,
            gold: hero.gold + quest.goldReward,
            completedQuests: [...hero.completedQuests, questId],
          },
        })
      },
    }),
    {
      name: 'pixel-quest-storage',
    }
  )
)
