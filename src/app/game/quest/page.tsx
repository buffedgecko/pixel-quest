'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import type { QuestType } from '@/types/game'

export default function QuestPage() {
  const { quests, claimQuestReward } = useGameStore()
  
  const dailyQuests = quests.filter(q => q.type === 'daily')
  const weeklyQuests = quests.filter(q => q.type === 'weekly')
  const achievements = quests.filter(q => q.type === 'achievement')
  
  const renderQuest = (quest: typeof quests[0]) => {
    const progress = Math.min(quest.progress, quest.target)
    const progressPercent = (progress / quest.target) * 100
    const canClaim = quest.completed && !quest.claimed
    
    return (
      <motion.div
        key={quest.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`glass rounded-xl p-4 ${quest.claimed ? 'opacity-50' : ''}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-bold">{quest.name}</h4>
            <p className="text-sm text-gray-400">{quest.description}</p>
          </div>
          <div className="text-right">
            <div className="text-primary font-bold">💎 {quest.crystalReward}</div>
            <div className="text-xs text-secondary">+{quest.expReward} EXP</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{progress} / {quest.target}</span>
            <span>{Math.floor(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${quest.completed ? 'bg-green-500' : 'bg-gradient-to-r from-primary to-secondary'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        
        {/* Claim Button */}
        {canClaim && (
          <motion.button
            onClick={() => claimQuestReward(quest.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 font-bold"
          >
            🎁 Claim Reward!
          </motion.button>
        )}
        
        {quest.claimed && (
          <div className="text-center mt-3 text-sm text-gray-400">
            ✓ Claimed
          </div>
        )}
      </motion.div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Daily Quests */}
      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          📅 Daily Quests
        </h3>
        <div className="space-y-3">
          {dailyQuests.map(renderQuest)}
        </div>
      </div>
      
      {/* Weekly Quests */}
      {weeklyQuests.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            📆 Weekly Quests
          </h3>
          <div className="space-y-3">
            {weeklyQuests.map(renderQuest)}
          </div>
        </div>
      )}
      
      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            🏆 Achievements
          </h3>
          <div className="space-y-3">
            {achievements.map(renderQuest)}
          </div>
        </div>
      )}
      
      {/* Info */}
      <div className="glass rounded-xl p-4 text-center">
        <p className="text-sm text-gray-400">
          Complete quests to earn 💎 Crystals!<br/>
          Crystals will convert to $PIXEL tokens at launch.
        </p>
      </div>
    </div>
  )
}
