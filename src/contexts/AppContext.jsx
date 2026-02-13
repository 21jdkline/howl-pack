import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { getChecklist, getMaxDailyXP, SHARED_CHECKLIST } from '../data/checklist';
import { getRankInfo } from '../data/levels';
import { PROFILES } from '../data/profiles';
import { postDailyStats } from '../services/packFeed';
import { syncToSheet, buildDailyRow, postToSheet } from '../services/googleSheets';

const AppContext = createContext(null);

const getDateKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getFromStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
};

const saveToStorage = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// Xander surgery date: early November 2025
const SURGERY_DATE = new Date('2025-11-03');

export function AppProvider({ children }) {
  // ============ PROFILE SELECTION ============
  const [profileId, setProfileId] = useState(() => getFromStorage('howl_profile', null));
  const [showSplash, setShowSplash] = useState(true);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const profile = profileId ? PROFILES[profileId] : null;

  const selectProfile = useCallback((id) => {
    saveToStorage('howl_profile', id);
    setProfileId(id);
  }, []);

  const switchProfile = useCallback(() => {
    saveToStorage('howl_profile', null);
    setProfileId(null);
  }, []);

  // ============ TAB STATE ============
  const [activeTab, setActiveTab] = useState('home');

  // Reset tab when switching profiles
  useEffect(() => {
    setActiveTab('home');
  }, [profileId]);

  // ============ DATE ============
  const dateKey = getDateKey();

  // ============ COMPLETIONS ============
  // Keyed by profile and date: { xander: { '2026-02-13': { sunlight: true, ... } }, maddox: { ... } }
  const storageKey = profileId ? `howl_${profileId}_completions` : null;

  const [allCompletions, setAllCompletions] = useState(() =>
    storageKey ? getFromStorage(storageKey, {}) : {}
  );

  // Reload completions when profile changes
  useEffect(() => {
    if (storageKey) {
      setAllCompletions(getFromStorage(storageKey, {}));
    }
  }, [storageKey]);

  // Persist completions
  useEffect(() => {
    if (storageKey) {
      saveToStorage(storageKey, allCompletions);
    }
  }, [allCompletions, storageKey]);

  const todayCompletions = allCompletions[dateKey] || {};

  const toggleCompletion = useCallback((itemId, value = true) => {
    setAllCompletions((prev) => {
      const today = prev[dateKey] || {};
      const current = today[itemId];
      let newValue;

      if (typeof value === 'boolean') {
        newValue = current ? undefined : true;
      } else {
        newValue = value;
      }

      const updated = { ...today };
      if (newValue === undefined || newValue === '' || newValue === null) {
        delete updated[itemId];
      } else {
        updated[itemId] = newValue;
      }

      return { ...prev, [dateKey]: updated };
    });
  }, [dateKey]);

  // ============ TODAY'S STATS ============
  const checklist = useMemo(() => profileId ? getChecklist(profileId) : [], [profileId]);

  const todayStats = useMemo(() => {
    let xpEarned = 0;
    let completedItems = 0;

    checklist.forEach((item) => {
      const val = todayCompletions[item.id];
      if (val !== undefined && val !== null && val !== '' && val !== false) {
        xpEarned += item.xp;
        completedItems++;
      }
    });

    // Calorie target bonus for Xander
    if (profileId === 'xander') {
      const calData = getFromStorage('howl_xander_today_cals', { cal: 0 });
      if (calData.cal >= 3100) {
        xpEarned += 25; // Bonus XP for hitting calorie target
      }
    }

    // CO2 table bonus for Maddox
    if (profileId === 'maddox') {
      const co2Done = getFromStorage(`howl_maddox_co2_${dateKey}`, false);
      if (co2Done) {
        xpEarned += 25; // Bonus XP for CO2 table
      }
    }

    const percentComplete = checklist.length > 0
      ? Math.round((completedItems / checklist.length) * 100)
      : 0;

    return { xpEarned, percentComplete, totalItems: checklist.length, completedItems };
  }, [todayCompletions, checklist, profileId, dateKey]);

  // ============ TOTAL XP ============
  const totalXP = useMemo(() => {
    let total = 0;
    Object.entries(allCompletions).forEach(([, dayCompletions]) => {
      checklist.forEach((item) => {
        const val = dayCompletions[item.id];
        if (val !== undefined && val !== null && val !== '' && val !== false) {
          total += item.xp;
        }
      });
    });
    return total;
  }, [allCompletions, checklist]);

  const rankInfo = useMemo(() => getRankInfo(totalXP), [totalXP]);

  // ============ STREAK ============
  const streak = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let current = 0;

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      const dc = allCompletions[key];
      if (!dc) {
        if (i === 0) continue; // Today not started yet is OK
        break;
      }
      const cc = checklist.filter((item) => {
        const val = dc[item.id];
        return val !== undefined && val !== null && val !== '' && val !== false;
      }).length;
      if (cc >= checklist.length * 0.5) {
        current++;
      } else {
        if (i === 0) continue;
        break;
      }
    }
    return current;
  }, [allCompletions, checklist]);

  // ============ XANDER: SURGERY / RECOVERY ============
  const daysSinceSurgery = useMemo(() => {
    const now = new Date();
    return Math.floor((now - SURGERY_DATE) / (1000 * 60 * 60 * 24));
  }, []);

  const weeksSinceSurgery = Math.floor(daysSinceSurgery / 7);
  const monthsSinceSurgery = Math.round(daysSinceSurgery / 30.44 * 10) / 10;

  const recoveryPhase = useMemo(() => {
    const months = daysSinceSurgery / 30.44;
    if (months < 1) return { num: 1, name: 'Protection', color: '#60a5fa' };
    if (months < 3) return { num: 2, name: 'Early Rehab', color: '#60a5fa' };
    if (months < 5) return { num: 3, name: 'Progressive Loading', color: '#f4a824' };
    if (months < 7) return { num: 4, name: 'Strengthening', color: '#e63946' };
    if (months < 9) return { num: 5, name: 'Return to Sport Prep', color: '#f59e0b' };
    return { num: 6, name: 'Return to Sport', color: '#2ecc71' };
  }, [daysSinceSurgery]);

  // ============ PACK FEED SYNC ============
  useEffect(() => {
    if (profile && todayStats.completedItems > 0) {
      postDailyStats({
        appId: profile.appId,
        name: profile.name,
        nickname: profile.nickname,
        emoji: profile.emoji,
        percentComplete: todayStats.percentComplete,
        xpEarned: todayStats.xpEarned,
        streak,
      });
    }
  }, [profile, todayStats.completedItems, todayStats.percentComplete, todayStats.xpEarned, streak]);

  // ============ GOOGLE SHEETS AUTO-SYNC ============
  // Debounced — fires 3 sec after last change to avoid spamming
  useEffect(() => {
    if (!profileId || todayStats.completedItems === 0) return;
    const sheet = profileId === 'xander' ? 'Xander_Daily' : 'Maddox_Daily';
    const calData = getFromStorage('howl_xander_today_cals', { cal: 0 });
    const kneeData = getFromStorage(`howl_knee_${dateKey}`, {});
    const hydrationOz = getFromStorage(`howl_hydration_${dateKey}`, 0) * 10;

    const row = buildDailyRow(profileId, dateKey, todayCompletions, {
      pain: kneeData.pain,
      swelling: kneeData.swelling,
      rom: kneeData.rom,
      hydration: hydrationOz,
      calHit: calData.cal >= 3100,
      pct: todayStats.percentComplete,
      xp: todayStats.xpEarned,
      streak,
      co2Done: getFromStorage(`howl_maddox_co2_${dateKey}`, false),
    });

    syncToSheet(sheet, row, 3000);
  }, [profileId, dateKey, todayCompletions, todayStats.completedItems, todayStats.percentComplete, todayStats.xpEarned, streak, hydration, kneeNote]);

  // ============ HYDRATION (Xander) ============
  const [hydration, setHydration] = useState(() =>
    getFromStorage(`howl_hydration_${dateKey}`, 0)
  );
  useEffect(() => {
    saveToStorage(`howl_hydration_${dateKey}`, hydration);
  }, [hydration, dateKey]);

  // ============ WEIGHT LOG (Xander) ============
  const [weightLog, setWeightLog] = useState(() =>
    getFromStorage('howl_xander_weight', [])
  );
  useEffect(() => {
    if (profileId === 'xander') {
      saveToStorage('howl_xander_weight', weightLog);
      // Sync latest weight to Sheets
      if (weightLog.length > 0) {
        const latest = weightLog[weightLog.length - 1];
        const prev = weightLog.length >= 2 ? weightLog[weightLog.length - 2].w : null;
        const trend = prev ? (latest.w - prev).toFixed(1) : '';
        syncToSheet('Xander_Weight', { date: latest.date, weight_lbs: latest.w, trend }, 1000);
      }
    }
  }, [weightLog, profileId]);

  // ============ KNEE STATUS (Xander) ============
  const [kneeNote, setKneeNote] = useState(() =>
    getFromStorage(`howl_knee_${dateKey}`, { pain: '', swelling: '', rom: '' })
  );
  useEffect(() => {
    saveToStorage(`howl_knee_${dateKey}`, kneeNote);
    // Sync knee data to Sheets
    if (profileId === 'xander' && (kneeNote.pain || kneeNote.swelling || kneeNote.rom)) {
      syncToSheet('Xander_Knee', {
        date: dateKey,
        pain_0_10: kneeNote.pain,
        swelling: kneeNote.swelling,
        rom: kneeNote.rom,
      }, 3000);
    }
  }, [kneeNote, dateKey, profileId]);

  // ============ CONTEXT VALUE ============
  const value = {
    // Profile
    profileId, profile, selectProfile, switchProfile, showSplash,
    // Navigation
    activeTab, setActiveTab,
    // Date
    dateKey,
    // Checklist
    checklist, todayCompletions, toggleCompletion, allCompletions,
    // Stats
    todayStats, totalXP, rankInfo, streak,
    // Xander-specific
    daysSinceSurgery, weeksSinceSurgery, monthsSinceSurgery, recoveryPhase,
    hydration, setHydration,
    weightLog, setWeightLog,
    kneeNote, setKneeNote,
    SURGERY_DATE,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

export { getDateKey, getFromStorage, saveToStorage };
