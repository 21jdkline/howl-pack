// ============ SHARED CHECKLIST (all profiles, Pack XP) ============
export const SHARED_CHECKLIST = [
  // Morning
  { id: 'sunlight', label: 'Morning sunlight (10 min)', type: 'checkbox', xp: 10, category: 'morning', icon: '☀️', timeHint: 'Within 30 min of waking' },
  { id: 'protein', label: 'Protein at breakfast', type: 'checkbox', xp: 10, category: 'morning', icon: '🥩', timeHint: 'With breakfast' },
  { id: 'exhale', label: 'Mackenzie exhale test', type: 'number', unit: 'sec', xp: 15, category: 'morning', icon: '🌬️', timeHint: 'Morning, before eating' },
  { id: 'am_supplements', label: 'Morning supplements', type: 'checkbox', xp: 10, category: 'morning', icon: '💊', timeHint: 'With breakfast' },

  // Midday
  { id: 'reaction', label: 'Reaction time test', type: 'number', unit: 'ms', xp: 15, category: 'midday', icon: '⚡', timeHint: 'Any time', link: 'https://humanbenchmark.com/tests/reactiontime' },
  { id: 'nasal_1', label: 'Nasal breathing check', type: 'checkbox', xp: 5, category: 'midday', icon: '👃', timeHint: '12pm' },
  { id: 'nasal_2', label: 'Nasal breathing check', type: 'checkbox', xp: 5, category: 'afternoon', icon: '👃', timeHint: '3-4pm' },

  // Training
  { id: 'workout', label: 'Training / workout completed', type: 'checkbox', xp: 30, category: 'training', icon: '💪', timeHint: 'After school' },

  // Evening
  { id: 'screen_cutoff', label: 'Screen cutoff', type: 'checkbox', xp: 20, category: 'evening', icon: '📴', timeHint: 'By 9-9:30 PM' },
  { id: 'nsdr', label: 'NSDR completed', type: 'checkbox', xp: 20, category: 'evening', icon: '🧘', timeHint: 'Afternoon or before bed' },
  { id: 'journal', label: 'Daily journal', type: 'text', xp: 15, category: 'evening', icon: '📝', timeHint: 'Evening', placeholder: '' },
  { id: 'mouth_tape_sleep', label: 'Mouth tape for sleep', type: 'checkbox', xp: 15, category: 'evening', icon: '😴', timeHint: 'Bedtime' },
];

// ============ XANDER-ONLY ITEMS ============
export const XANDER_CHECKLIST = [
  { id: 'collagen', label: 'Collagen + Vitamin C', type: 'checkbox', xp: 10, category: 'morning', icon: '🧬', timeHint: '30-60 min before PT/training',
    detail: '15-20g collagen peptides + 500mg Vitamin C. Research shows this before exercise increases collagen synthesis in tendons and ligaments.' },
  { id: 'pt_exercises', label: 'PT / Rehab exercises', type: 'checkbox', xp: 25, category: 'training', icon: '🩼', timeHint: 'Per PT schedule', removable: true,
    detail: 'Complete assigned PT protocol. Log pain and ROM after.' },
  { id: 'recovery_checkin', label: 'Recovery check-in', type: 'multi', xp: 15, category: 'evening', icon: '📊', timeHint: 'Evening',
    fields: [
      { id: 'pain', label: 'Knee pain (0-10)', type: 'number', min: 0, max: 10 },
      { id: 'swelling', label: 'Swelling', type: 'select', options: ['none', 'mild', 'moderate'] },
      { id: 'rom', label: 'ROM', type: 'select', options: ['better', 'same', 'stiff'] },
    ] },
  { id: 'hydration', label: 'Hydration 80+ oz', type: 'hydration', xp: 10, category: 'midday', icon: '💧', timeHint: 'Throughout the day' },
  // Calorie target bonus is auto-calculated from Fuel tab, not a checklist item
];

// ============ MADDOX-ONLY ITEMS ============
export const MADDOX_CHECKLIST = [
  { id: 'mouth_tape_day', label: 'Mouth tape practice (20-30 min)', type: 'checkbox', xp: 15, category: 'afternoon', icon: '😷', timeHint: 'After school' },
  { id: 'pm_supplements', label: 'Evening supplements', type: 'checkbox', xp: 10, category: 'evening', icon: '💊', timeHint: 'With dinner' },
  // CO2 tolerance table bonus is tracked in Mind tab, not a checklist item
];

// ============ JOURNAL PROMPTS ============
export const JOURNAL_PROMPTS = [
  "What's one win from today?",
  "What was the hardest thing today and how'd you handle it?",
  "What are you grateful for?",
  "What's one thing you want to do better tomorrow?",
  "Who helped you today?",
  "What did you learn today?",
  "What are you most proud of this week?",
  "What's something you're looking forward to?",
  "What would you tell yourself a year from now?",
  "What's one thing that made you smile today?",
];

export const getDailyPrompt = () => {
  const d = new Date();
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return JOURNAL_PROMPTS[dayOfYear % JOURNAL_PROMPTS.length];
};

// ============ BUILD FULL CHECKLIST FOR PROFILE ============
export const getChecklist = (profileId) => {
  const shared = [...SHARED_CHECKLIST];
  // Set the journal placeholder to today's prompt
  const journalItem = shared.find(i => i.id === 'journal');
  if (journalItem) journalItem.placeholder = getDailyPrompt();

  if (profileId === 'xander') {
    return [...shared, ...XANDER_CHECKLIST];
  }
  if (profileId === 'maddox') {
    return [...shared, ...MADDOX_CHECKLIST];
  }
  return shared;
};

export const getMaxDailyXP = (profileId) => {
  return getChecklist(profileId).reduce((sum, item) => sum + item.xp, 0);
};

// Categories for grouping display
export const CATEGORIES = {
  morning: { label: 'Morning', icon: '☀️', color: '#f4a824' },
  midday: { label: 'Midday', icon: '🌤️', color: '#3a86ff' },
  afternoon: { label: 'Afternoon', icon: '☁️', color: '#60a5fa' },
  training: { label: 'Training', icon: '💪', color: '#e63946' },
  evening: { label: 'Evening', icon: '🌙', color: '#8b5cf6' },
};
