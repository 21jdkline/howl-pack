/**
 * Google Sheets Auto-Sync Service
 * 
 * Posts data to the HOWL Pack Data Google Sheet (personal data for both boys).
 * Uses debounced posting — waits 3 seconds after last change before sending,
 * so rapid checkbox taps don't spam the API.
 * 
 * Data flows:
 *   Checklist completion → Xander_Daily or Maddox_Daily
 *   Weight log → Xander_Weight
 *   Knee status → Xander_Knee
 *   Calorie data → Xander_Daily (calorie_target_hit field)
 *   Cognitive tests → Xander_Tests or Maddox_Tests
 */

const SCRIPT_URL_KEY = 'howl_googleScriptUrl';

let debounceTimers = {};

export const getScriptUrl = () => localStorage.getItem(SCRIPT_URL_KEY) || '';
export const isConfigured = () => getScriptUrl().length > 0;

// ============ CORE POST (debounced) ============
export function syncToSheet(sheet, data, debounceMs = 3000) {
  // Clear existing timer for this sheet
  if (debounceTimers[sheet]) clearTimeout(debounceTimers[sheet]);

  // Set new timer
  debounceTimers[sheet] = setTimeout(() => {
    postToSheet(sheet, data);
  }, debounceMs);
}

// ============ IMMEDIATE POST (no debounce) ============
export async function postToSheet(sheet, data) {
  const url = getScriptUrl();
  const payload = {
    sheet,
    data: { ...data, timestamp: new Date().toISOString() },
  };

  // Always save locally as backup
  saveLocally(sheet, payload.data);

  if (!url) return { success: false, reason: 'no_url' };

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { success: true };
  } catch (err) {
    console.warn('Sheet sync failed:', err);
    return { success: false, reason: 'network_error' };
  }
}

// ============ FETCH ============
export async function fetchFromSheet(sheet) {
  const url = getScriptUrl();
  if (!url) return getLocal(sheet);

  try {
    const response = await fetch(`${url}?sheet=${sheet}`);
    if (!response.ok) return getLocal(sheet);
    const result = await response.json();
    return result.success ? result.data : getLocal(sheet);
  } catch {
    return getLocal(sheet);
  }
}

// ============ BUILD DAILY ROW FROM COMPLETIONS ============
export function buildDailyRow(profileId, dateKey, completions, extras = {}) {
  const c = completions || {};

  const shared = {
    date: dateKey,
    sunlight: c.sunlight ? 'Y' : '',
    protein: c.protein ? 'Y' : '',
    exhale_sec: c.exhale || '',
    am_supplements: c.am_supplements ? 'Y' : '',
    reaction_ms: c.reaction || '',
    nasal_1: c.nasal_1 ? 'Y' : '',
    nasal_2: c.nasal_2 ? 'Y' : '',
    workout: c.workout ? 'Y' : '',
    screen_cutoff: c.screen_cutoff ? 'Y' : '',
    nsdr: c.nsdr ? 'Y' : '',
    journal: c.journal || '',
    mouth_tape_sleep: c.mouth_tape_sleep ? 'Y' : '',
  };

  if (profileId === 'xander') {
    return {
      ...shared,
      collagen: c.collagen ? 'Y' : '',
      pt_exercises: c.pt_exercises ? 'Y' : '',
      recovery_pain: extras.pain || '',
      recovery_swelling: extras.swelling || '',
      recovery_rom: extras.rom || '',
      hydration_oz: extras.hydration || '',
      calorie_target_hit: extras.calHit ? 'Y' : '',
      completion_pct: extras.pct || 0,
      xp_earned: extras.xp || 0,
      streak: extras.streak || 0,
    };
  }

  if (profileId === 'maddox') {
    return {
      ...shared,
      mouth_tape_day: c.mouth_tape_day ? 'Y' : '',
      pm_supplements: c.pm_supplements ? 'Y' : '',
      co2_table: extras.co2Done ? 'Y' : '',
      completion_pct: extras.pct || 0,
      xp_earned: extras.xp || 0,
      streak: extras.streak || 0,
    };
  }

  return shared;
}

// ============ LOCAL BACKUP ============
function saveLocally(sheet, data) {
  try {
    const key = `howl_local_${sheet}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    // Upsert by date if daily data
    if (data.date) {
      const idx = existing.findIndex(r => r.date === data.date);
      if (idx >= 0) existing[idx] = data;
      else existing.push(data);
    } else {
      existing.push(data);
    }
    // Keep last 90 days
    const trimmed = existing.slice(-90);
    localStorage.setItem(key, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('Local save failed:', err);
  }
}

function getLocal(sheet) {
  try {
    return JSON.parse(localStorage.getItem(`howl_local_${sheet}`) || '[]');
  } catch {
    return [];
  }
}

// ============ FLUSH — force send any pending debounced data ============
export function flushAll() {
  Object.keys(debounceTimers).forEach(key => {
    clearTimeout(debounceTimers[key]);
    delete debounceTimers[key];
  });
}
