'use client'

import { motion } from 'framer-motion'
import { useGameStore, QUESTS } from '@/store/gameStore'

export default function QuestPage() {
  const { hero, completeQuest } = useGameStore()

  if (!hero) return null

  const handleCompleteQuest = (questId: string) => {
    const quest = QUESTS.find(q => q.id === questId)
    if (quest && !hero.completedQuests.includes(questId)) {
      completeQuest(questId)
    }
  }

  const getQuestProgress = (quest: typeof QUESTS[0]) => {
    switch (quest.requirement.type) {
      case 'battles':
        return hero.battleWins
      case 'level':
        return hero.level
      default:
        return 0
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold">📜 Quests</h1>
        <p className="text-sm text-slate-400">Complete quests for rewards!</p>
      </div>

      {/* Daily Quests */}
      <div className="mb-6">
        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>⏰</span> Daily Quests
        </h2>
        <div className="space-y-3">
          {QUESTS.filter(q => q.type === 'daily').map((quest) => {
            const isCompleted = hero.completedQuests.includes(quest.id)
            const progress = getQuestProgress(quest)
            const isClaimable = progress >= quest.requirement.value && !isCompleted

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-slate-800/50 rounded-xl p-4 border ${
                  isCompleted ? 'border-green-500/30' : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{quest.emoji}</span>
                    <div>
                      <h3 className="font-bold text-sm">{quest.name}</h3>
                      <p className="text-xs text-slate-400">{quest.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-purple-400">+{quest.tokenReward} PIXEL</span>
                        <span className="text-xs text-yellow-400">+{quest.goldReward} Gold</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteQuest(quest.id)}
                    disabled={!isClaimable}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isCompleted
                        ? 'bg-green-600/20 text-green-400'
                        : isClaimable
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓ Done' : isClaimable ? 'Claim' : `${progress}/${quest.requirement.value}`}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Achievement Quests */}
      <div>
        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>🏆</span> Achievements
        </h2>
        <div className="space-y-3">
          {QUESTS.filter(q => q.type === 'achievement').map((quest) => {
            const isCompleted = hero.completedQuests.includes(quest.id)
            const progress = getQuestProgress(quest)
            const progressPercent = Math.min(100, (progress / quest.requirement.value) * 100)

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-slate-800/50 rounded-xl p-4 border ${
                  isCompleted ? 'border-yellow-500/30' : 'border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{quest.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{quest.name}</h3>
                    <p className="text-xs text-slate-400">{quest.description}</p>
                  </div>
                  {isCompleted && <span className="text-green-400">✓</span>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{progress}/{quest.requirement.value}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-purple-400">+{quest.tokenReward} PIXEL</span>
                  <span className="text-yellow-400">+{quest.goldReward} Gold</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
