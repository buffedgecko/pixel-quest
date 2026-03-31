// Hero Types
export type HeroClass = 'warrior' | 'mage' | 'archer' | 'assassin'

export interface Hero {
  id: string
  name: string
  class: HeroClass
  level: number
  exp: number
  expToNext: number
  hp: number
  maxHp: number
  attack: number
  defense: number
  critRate: number
  equipment: Equipment
  skin: string
  createdAt: number
}

// Equipment Types
export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory'

export interface Equipment {
  weapon: EquipmentItem | null
  armor: EquipmentItem | null
  helmet: EquipmentItem | null
  boots: EquipmentItem | null
  accessory: EquipmentItem | null
}

export interface EquipmentItem {
  id: string
  name: string
  slot: EquipmentSlot
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  attack: number
  defense: number
  critRate: number
  emoji: string
}

// Monster Types
export type MonsterType = 'goblin' | 'orc' | 'skeleton' | 'demon' | 'dragon' | 'boss'

export interface Monster {
  id: string
  name: string
  type: MonsterType
  level: number
  hp: number
  maxHp: number
  attack: number
  defense: number
  isBoss: boolean
  crystalReward: number
  expReward: number
  emoji: string
}

// Shop Types
export type ShopCategory = 'egg' | 'equipment' | 'potion' | 'special'

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  crystalPrice?: number
  category: ShopCategory
  emoji: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  effect?: {
    type: 'exp' | 'crystal' | 'boost'
    value: number
    duration?: number
  }
}

// Quest Types
export type QuestType = 'daily' | 'weekly' | 'achievement'

export interface Quest {
  id: string
  name: string
  description: string
  type: QuestType
  target: number
  progress: number
  crystalReward: number
  expReward: number
  completed: boolean
  claimed: boolean
  expiresAt?: number
}

// Inventory Types
export interface InventoryItem {
  id: string
  itemId: string
  type: 'equipment' | 'potion' | 'egg' | 'special'
  quantity: number
  data: EquipmentItem | ShopItem
}

// Token/Reward Types
export interface TokenBalance {
  crystal: number
  pendingCrystal: number
  totalEarned: number
  totalConverted: number
}

export interface Transaction {
  id: string
  type: 'earn' | 'spend' | 'convert'
  amount: number
  description: string
  timestamp: number
}

// Game State
export interface GameState {
  // User
  address: string | null
  isConnected: boolean
  
  // Hero
  hero: Hero | null
  hasHero: boolean
  
  // Combat
  currentMonster: Monster | null
  battleLog: BattleLogEntry[]
  isAutoBattle: boolean
  totalKills: number
  bossKills: number
  
  // Economy
  tokens: TokenBalance
  transactions: Transaction[]
  
  // Inventory
  inventory: InventoryItem[]
  
  // Quests
  quests: Quest[]
  
  // Stats
  totalPlayTime: number
  lastActive: number
}

export interface BattleLogEntry {
  id: string
  turn: number
  attacker: 'hero' | 'monster'
  damage: number
  isCrit: boolean
  timestamp: number
}
