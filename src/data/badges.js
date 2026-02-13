// ============ ACHIEVEMENT BADGES ============
export const BADGES = [
  // Streak badges
  { id: 'streak_3', name: 'Getting Started', description: '3-day streak', icon: '🌱', condition: (s) => s.streak >= 3 },
  { id: 'streak_7', name: 'One Week Strong', description: '7-day streak', icon: '🔥', condition: (s) => s.streak >= 7 },
  { id: 'streak_14', name: 'Two Week Warrior', description: '14-day streak', icon: '⚔️', condition: (s) => s.streak >= 14 },
  { id: 'streak_30', name: 'Month of Iron', description: '30-day streak', icon: '🛡️', condition: (s) => s.streak >= 30 },
  { id: 'streak_60', name: 'Unbreakable', description: '60-day streak', icon: '💎', condition: (s) => s.streak >= 60 },
  { id: 'streak_90', name: 'Legendary', description: '90-day streak', icon: '👑', condition: (s) => s.streak >= 90 },

  // Completion badges
  { id: 'perfect_day', name: 'Perfect Day', description: '100% completion in a day', icon: '⭐', condition: (s) => s.todayPct >= 100 },
  { id: 'perfect_week', name: 'Perfect Week', description: '7 perfect days in a row', icon: '🌟', condition: (s) => s.perfectDays >= 7 },
  { id: 'above_80_7', name: 'Consistent', description: '80%+ for 7 days straight', icon: '📈', condition: (s) => s.above80Days >= 7 },
  { id: 'above_80_30', name: 'Machine', description: '80%+ for 30 days straight', icon: '🤖', condition: (s) => s.above80Days >= 30 },

  // XP badges
  { id: 'xp_500', name: 'First 500', description: 'Earn 500 XP', icon: '🐺', condition: (s) => s.totalXP >= 500 },
  { id: 'xp_1500', name: 'XP Hunter', description: 'Earn 1,500 XP', icon: '🎯', condition: (s) => s.totalXP >= 1500 },
  { id: 'xp_5000', name: 'XP Beast', description: 'Earn 5,000 XP', icon: '💪', condition: (s) => s.totalXP >= 5000 },
  { id: 'xp_15000', name: 'XP Legend', description: 'Earn 15,000 XP', icon: '🏆', condition: (s) => s.totalXP >= 15000 },

  // Specific achievement badges
  { id: 'early_bird', name: 'Early Bird', description: 'Complete sunlight + protein by 8 AM', icon: '🌅', condition: (s) => s.earlyBird },
  { id: 'exhale_30', name: 'Iron Lungs', description: 'Mackenzie exhale over 30 seconds', icon: '🫁', condition: (s) => s.maxExhale >= 30 },
  { id: 'exhale_45', name: 'Steel Lungs', description: 'Mackenzie exhale over 45 seconds', icon: '🌬️', condition: (s) => s.maxExhale >= 45 },
  { id: 'exhale_60', name: 'Diamond Lungs', description: 'Mackenzie exhale over 60 seconds', icon: '💨', condition: (s) => s.maxExhale >= 60 },
  { id: 'reaction_sub200', name: 'Lightning', description: 'Reaction time under 200ms', icon: '⚡', condition: (s) => s.bestReaction > 0 && s.bestReaction < 200 },
  { id: 'sunday_boss', name: 'Boss Battle Victor', description: 'Complete all Sunday cognitive tests', icon: '🧪', condition: (s) => s.sundayBattleComplete },

  // Xander-specific
  { id: 'cal_target_3', name: 'Fueled Up', description: 'Hit calorie target 3 days in a row', icon: '🍖', condition: (s) => s.calTargetStreak >= 3 },
  { id: 'cal_target_7', name: 'Nutrition Machine', description: 'Hit calorie target 7 days in a row', icon: '🥩', condition: (s) => s.calTargetStreak >= 7 },
  { id: 'weight_135', name: 'Gaining Ground', description: 'Reach 135 lbs', icon: '⚖️', condition: (s) => s.currentWeight >= 135 },
  { id: 'weight_140', name: 'Breaking Through', description: 'Reach 140 lbs', icon: '📊', condition: (s) => s.currentWeight >= 140 },
  { id: 'weight_145', name: 'Almost There', description: 'Reach 145 lbs', icon: '🎯', condition: (s) => s.currentWeight >= 145 },
  { id: 'weight_150', name: 'Target Weight', description: 'Reach 150 lbs', icon: '🏈', condition: (s) => s.currentWeight >= 150 },

  // Maddox-specific
  { id: 'co2_complete', name: 'Breath Master', description: 'Complete CO2 tolerance table', icon: '🫁', condition: (s) => s.co2Complete },
  { id: 'mouth_tape_7', name: 'Tape Champion', description: 'Mouth tape 7 days in a row', icon: '😷', condition: (s) => s.mouthTapeStreak >= 7 },
];

export function getEarnedBadges(stats) {
  return BADGES.filter(b => {
    try { return b.condition(stats); } catch { return false; }
  });
}
