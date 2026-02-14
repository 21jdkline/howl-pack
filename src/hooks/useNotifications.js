import { useEffect, useRef } from 'react';
import { useApp, getFromStorage, saveToStorage } from '../contexts/AppContext';
import { useToast, TOAST_TYPES } from '../components/ToastNotifications';
import { getEarnedBadges } from '../data/badges';
import { RANKS } from '../data/levels';

/**
 * Monitors app state and fires toast notifications for:
 * - New badges earned
 * - Rank ups
 * - Streak milestones (3, 7, 14, 30, 60, 90)
 * - Perfect day (100%)
 * - Calorie target hit (Xander)
 * 
 * Uses localStorage to track what's already been notified so toasts don't repeat.
 */
export default function useNotifications() {
  const { profileId, totalXP, rankInfo, streak, todayStats, allCompletions, checklist, weightLog, dateKey } = useApp();
  const { addToast } = useToast();
  const prevRef = useRef({ rank: null, badges: [], streak: 0, perfectNotified: false, calNotified: false });

  useEffect(() => {
    if (!profileId) return;

    // Check notification preferences
    const nBadges = getFromStorage('howl_notify_badges', true);
    const nRank = getFromStorage('howl_notify_rankup', true);
    const nStreak = getFromStorage('howl_notify_streak', true);
    const nPerfect = getFromStorage('howl_notify_perfect', true);

    const notifiedKey = `howl_notified_${profileId}_${dateKey}`;
    const notified = getFromStorage(notifiedKey, { badges: [], rank: null, streaks: [], perfect: false, cal: false });

    // ============ BADGE CHECK ============
    const badgeStats = {
      streak,
      totalXP,
      todayPct: todayStats.percentComplete,
      maxExhale: 0,
      bestReaction: Infinity,
      above80Days: 0,
      perfectDays: 0,
      currentWeight: weightLog?.length > 0 ? weightLog[weightLog.length - 1].w : 0,
      calTargetStreak: 0,
      co2Complete: false,
      mouthTapeStreak: 0,
      earlyBird: false,
      sundayBattleComplete: false,
    };

    Object.values(allCompletions).forEach((dc) => {
      const exhale = Number(dc.exhale) || 0;
      const reaction = Number(dc.reaction) || 0;
      if (exhale > badgeStats.maxExhale) badgeStats.maxExhale = exhale;
      if (reaction > 0 && reaction < badgeStats.bestReaction) badgeStats.bestReaction = reaction;
      const completed = checklist.filter(item => {
        const val = dc[item.id];
        return val !== undefined && val !== null && val !== '' && val !== false;
      }).length;
      const pct = checklist.length > 0 ? Math.round((completed / checklist.length) * 100) : 0;
      if (pct >= 80) badgeStats.above80Days++;
      if (pct >= 100) badgeStats.perfectDays++;
    });
    if (badgeStats.bestReaction === Infinity) badgeStats.bestReaction = 0;

    const earned = getEarnedBadges(badgeStats);
    const newBadges = earned.filter(b => !notified.badges.includes(b.id));
    newBadges.forEach(badge => {
      if (nBadges) addToast(TOAST_TYPES.badge(badge));
      notified.badges.push(badge.id);
    });

    // ============ RANK UP CHECK ============
    if (notified.rank !== null && rankInfo.current.rank > notified.rank) {
      if (nRank) addToast(TOAST_TYPES.rankUp(rankInfo.current));
    }
    notified.rank = rankInfo.current.rank;

    // ============ STREAK MILESTONES ============
    const streakMilestones = [3, 7, 14, 30, 60, 90];
    streakMilestones.forEach(m => {
      if (streak >= m && !notified.streaks.includes(m)) {
        if (nStreak) addToast(TOAST_TYPES.streak(m));
        notified.streaks.push(m);
      }
    });

    // ============ PERFECT DAY ============
    if (todayStats.percentComplete >= 100 && !notified.perfect) {
      if (nPerfect) addToast(TOAST_TYPES.perfectDay());
      notified.perfect = true;
    }

    // ============ CALORIE TARGET (Xander) ============
    if (profileId === 'xander') {
      const calData = getFromStorage('howl_xander_today_cals', { cal: 0 });
      if (calData.cal >= 3100 && !notified.cal) {
        addToast(TOAST_TYPES.calorieTarget());
        notified.cal = true;
      }
    }

    // Save what we've notified
    saveToStorage(notifiedKey, notified);
  }, [profileId, totalXP, streak, todayStats.percentComplete, todayStats.completedItems, dateKey]);
}
