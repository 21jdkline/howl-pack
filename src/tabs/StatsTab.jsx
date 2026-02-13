import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { RANKS } from '../data/levels';
import { BADGES, getEarnedBadges } from '../data/badges';
import { Flame, Target, TrendingUp, BarChart3, Award } from 'lucide-react';

export default function StatsTab() {
  const { profile, profileId, totalXP, rankInfo, streak, todayStats, allCompletions, checklist, weightLog } = useApp();
  const accent = profile?.accentColor || '#6366f1';

  // Last 7 days data
  const last7 = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dc = allCompletions[key] || {};
      const completed = checklist.filter(item => {
        const val = dc[item.id];
        return val !== undefined && val !== null && val !== '' && val !== false;
      }).length;
      const pct = checklist.length > 0 ? Math.round((completed / checklist.length) * 100) : 0;
      days.push({ key, pct, label: d.toLocaleDateString(undefined, { weekday: 'short' }) });
    }
    return days;
  }, [allCompletions, checklist]);

  const weeklyAvg = last7.length > 0 ? Math.round(last7.reduce((a, b) => a + b.pct, 0) / last7.length) : 0;
  const daysActive = Object.keys(allCompletions).length;

  // Badge calculation
  const badgeStats = useMemo(() => {
    let maxExhale = 0;
    let bestReaction = Infinity;
    let above80Days = 0;
    let perfectDays = 0;

    Object.values(allCompletions).forEach((dc) => {
      const exhale = Number(dc.exhale) || 0;
      const reaction = Number(dc.reaction) || 0;
      if (exhale > maxExhale) maxExhale = exhale;
      if (reaction > 0 && reaction < bestReaction) bestReaction = reaction;

      const completed = checklist.filter(item => {
        const val = dc[item.id];
        return val !== undefined && val !== null && val !== '' && val !== false;
      }).length;
      const pct = checklist.length > 0 ? Math.round((completed / checklist.length) * 100) : 0;
      if (pct >= 80) above80Days++;
      if (pct >= 100) perfectDays++;
    });

    return {
      streak,
      totalXP,
      todayPct: todayStats.percentComplete,
      maxExhale,
      bestReaction: bestReaction === Infinity ? 0 : bestReaction,
      above80Days,
      perfectDays,
      currentWeight: weightLog?.length > 0 ? weightLog[weightLog.length - 1].w : 0,
      calTargetStreak: 0, // Would need meal data to calculate
      co2Complete: false,
      mouthTapeStreak: 0,
      earlyBird: false,
      sundayBattleComplete: false,
    };
  }, [allCompletions, checklist, streak, totalXP, todayStats, weightLog]);

  const earnedBadges = useMemo(() => getEarnedBadges(badgeStats), [badgeStats]);

  return (
    <div className="space-y-3">
      {/* Rank Card */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 text-center">
        <div className="text-4xl mb-2">{rankInfo.current.icon}</div>
        <div className="text-lg font-black" style={{ color: accent }}>{rankInfo.current.name}</div>
        <div className="text-xs text-gray-500">Rank {rankInfo.current.rank} of {RANKS.length}</div>
        <div className="mt-3">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${rankInfo.progress * 100}%`, background: accent }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-500">{totalXP.toLocaleString()} XP</span>
            {rankInfo.next && <span className="text-[10px] text-gray-500">{rankInfo.next.xpRequired.toLocaleString()} → {rankInfo.next.icon} {rankInfo.next.name}</span>}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
          <Flame size={16} className="mx-auto mb-1 text-orange-400" />
          <div className="text-2xl font-black text-orange-400">{streak}</div>
          <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">Streak</div>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
          <Target size={16} className="mx-auto mb-1" style={{ color: accent }} />
          <div className="text-2xl font-black" style={{ color: accent }}>{weeklyAvg}%</div>
          <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">7-Day Avg</div>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
          <TrendingUp size={16} className="mx-auto mb-1 text-green-400" />
          <div className="text-2xl font-black text-green-400">{totalXP.toLocaleString()}</div>
          <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">Total XP</div>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
          <BarChart3 size={16} className="mx-auto mb-1 text-blue-400" />
          <div className="text-2xl font-black text-blue-400">{daysActive}</div>
          <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">Days Active</div>
        </div>
      </div>

      {/* 7-Day Chart */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Last 7 Days</h3>
        <div className="flex items-end gap-1.5 h-24">
          {last7.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t transition-all" style={{
                height: `${Math.max(4, day.pct * 0.9)}px`,
                background: day.pct >= 80 ? '#2ecc71' : day.pct >= 50 ? accent : day.pct > 0 ? '#e63946' : '#1a1a28',
              }} />
              <span className="text-[8px] text-gray-500 font-bold">{day.pct}%</span>
              <span className="text-[7px] text-gray-600">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award size={14} style={{ color: accent }} />
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Badges ({earnedBadges.length}/{BADGES.length})
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {BADGES.map((badge) => {
            const earned = earnedBadges.some(b => b.id === badge.id);
            return (
              <div key={badge.id} className={`text-center p-2 rounded-lg ${earned ? '' : 'opacity-20'}`}
                style={earned ? { background: `${accent}11` } : undefined}>
                <div className="text-xl mb-0.5">{badge.icon}</div>
                <div className="text-[8px] font-semibold text-gray-300 leading-tight">{badge.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Metrics */}
      {badgeStats.maxExhale > 0 && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Personal Bests</h3>
          <div className="grid grid-cols-2 gap-3">
            {badgeStats.maxExhale > 0 && (
              <div><div className="text-[9px] text-gray-500">Exhale</div><div className="text-sm font-bold text-green-400">{badgeStats.maxExhale}s</div></div>
            )}
            {badgeStats.bestReaction > 0 && (
              <div><div className="text-[9px] text-gray-500">Reaction</div><div className="text-sm font-bold text-blue-400">{badgeStats.bestReaction}ms</div></div>
            )}
            <div><div className="text-[9px] text-gray-500">Perfect Days</div><div className="text-sm font-bold text-yellow-500">{badgeStats.perfectDays}</div></div>
            <div><div className="text-[9px] text-gray-500">80%+ Days</div><div className="text-sm font-bold" style={{ color: accent }}>{badgeStats.above80Days}</div></div>
          </div>
        </div>
      )}

      {/* Rank Ladder */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Rank Ladder</h3>
        {RANKS.map((rank) => {
          const unlocked = totalXP >= rank.xpRequired;
          const isCurrent = rank.rank === rankInfo.current.rank;
          return (
            <div key={rank.rank} className="flex items-center gap-3 py-1.5" style={{ opacity: unlocked ? 1 : 0.25 }}>
              <span className="text-lg w-7 text-center">{rank.icon}</span>
              <span className={`text-xs flex-1 ${isCurrent ? 'font-bold' : ''}`} style={isCurrent ? { color: accent } : undefined}>{rank.name}</span>
              <span className="text-[10px] text-gray-500">{rank.xpRequired.toLocaleString()} XP</span>
              {isCurrent && <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white" style={{ background: accent }}>YOU</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
