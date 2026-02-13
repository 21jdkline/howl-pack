/**
 * Pack Feed — Cross-App Competition Layer
 * 
 * Each app (Demon Slayer, Beast Mode, X Factor) posts daily stats
 * to a shared Google Sheet. Each app reads from the same sheet
 * to show family leaderboard + trash talk.
 * 
 * SHARED GOOGLE SHEET TABS:
 *   - PackDaily: date, appId, name, percentComplete, xpEarned, streak
 *   - PackChat: timestamp, appId, name, message
 * 
 * This file is identical across all 3 apps.
 */

const PACK_SHEET_URL_KEY = 'howl_pack_sheet_url';

export const getPackSheetUrl = () => {
  return localStorage.getItem(PACK_SHEET_URL_KEY) || '';
};

export const setPackSheetUrl = (url) => {
  localStorage.setItem(PACK_SHEET_URL_KEY, url);
};

// ============ POST DAILY STATS ============

export const postDailyStats = async (stats) => {
  const url = getPackSheetUrl();
  const today = new Date().toISOString().split('T')[0];

  const payload = {
    sheet: 'PackDaily',
    data: {
      date: today,
      appId: stats.appId,       // 'demon-slayer', 'beast-mode', 'x-factor'
      name: stats.name,         // 'Jay', 'Maddox', 'Xander'
      nickname: stats.nickname, // 'DAD', 'MADMAN', 'XANDMAN'
      emoji: stats.emoji,       // '👑', '🦁', '🐺'
      percentComplete: stats.percentComplete,
      xpEarned: stats.xpEarned,
      streak: stats.streak,
      timestamp: new Date().toISOString(),
    },
  };

  // Save locally always
  savePackLocal('PackDaily', payload.data);

  if (!url) return { success: false, reason: 'no_url' };

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { success: true };
  } catch {
    return { success: false, reason: 'network_error' };
  }
};

// ============ POST TRASH TALK ============

export const postTrashTalk = async (message, sender) => {
  const url = getPackSheetUrl();

  const payload = {
    sheet: 'PackChat',
    data: {
      timestamp: new Date().toISOString(),
      appId: sender.appId,
      name: sender.name,
      nickname: sender.nickname,
      emoji: sender.emoji,
      message,
    },
  };

  savePackLocal('PackChat', payload.data);

  if (!url) return { success: false, reason: 'no_url' };

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { success: true };
  } catch {
    return { success: false, reason: 'network_error' };
  }
};

// ============ FETCH PACK DATA ============

export const fetchPackData = async (sheet = 'PackDaily') => {
  const url = getPackSheetUrl();
  if (!url) return getPackLocal(sheet);

  try {
    const response = await fetch(`${url}?action=fetch&sheet=${sheet}`);
    if (!response.ok) return getPackLocal(sheet);
    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    return getPackLocal(sheet);
  } catch {
    return getPackLocal(sheet);
  }
};

// ============ LOCAL STORAGE HELPERS ============

function savePackLocal(sheet, data) {
  const key = `howl_${sheet}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  
  if (sheet === 'PackDaily') {
    // Replace today's entry for this app
    const today = new Date().toISOString().split('T')[0];
    const filtered = existing.filter(
      (e) => !(e.date === today && e.appId === data.appId)
    );
    filtered.push(data);
    localStorage.setItem(key, JSON.stringify(filtered));
  } else {
    existing.push(data);
    // Keep last 100 messages
    if (existing.length > 100) existing.splice(0, existing.length - 100);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

function getPackLocal(sheet) {
  const key = `howl_${sheet}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

// ============ QUICK TRASH TALK PRESETS ============

export const TRASH_TALK = [
  "Is that all you got? 🥱",
  "Better check the leaderboard... I'm coming for you 🐺",
  "Wake up. You're falling behind. ⏰",
  "I did my protocol. Did you? 👀",
  "100% today. Your move. 💯",
  "That streak looking a little weak 🔥",
  "You sleeping or competing? 😴",
  "Dad's watching. Don't embarrass yourself. 👑",
  "Fenrir doesn't quit. Neither do I. 🐺",
  "The pack is only as strong as the weakest wolf. Step it up. 💪",
];
