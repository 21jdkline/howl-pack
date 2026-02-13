// ============ RANKS (shared across all apps) ============
export const RANKS = [
  { rank: 1, name: 'Pup', xpRequired: 0, icon: '🐾', color: '#666' },
  { rank: 2, name: 'Omega', xpRequired: 500, icon: '🐺', color: '#888' },
  { rank: 3, name: 'Delta', xpRequired: 1500, icon: '🐺', color: '#aaa' },
  { rank: 4, name: 'Beta', xpRequired: 3500, icon: '🐺', color: '#ccc' },
  { rank: 5, name: 'Fang', xpRequired: 7000, icon: '🦷', color: '#e63946' },
  { rank: 6, name: 'Dire', xpRequired: 14000, icon: '🔥', color: '#f4a824' },
  { rank: 7, name: 'Howl', xpRequired: 30000, icon: '🌕', color: '#fff' },
];

export const getRankInfo = (totalXP) => {
  let current = RANKS[0];
  let next = RANKS[1];
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXP >= RANKS[i].xpRequired) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
      break;
    }
  }
  const xpInto = totalXP - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 0;
  const progress = next ? xpInto / xpNeeded : 1;
  return { current, next, xpInto, xpNeeded, progress };
};

// ============ QUOTES ============
export const QUOTES = [
  { text: "The comeback is always stronger than the setback.", author: "Anonymous" },
  { text: "Success isn't owned. It's leased. And rent is due every day.", author: "J.J. Watt" },
  { text: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'", author: "Muhammad Ali" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
  { text: "The separation is in the preparation.", author: "Russell Wilson" },
  { text: "When you want to succeed as bad as you want to breathe, then you'll be successful.", author: "Eric Thomas" },
  { text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.", author: "Bruce Lee" },
  { text: "Champions aren't made in gyms. Champions are made from something they have deep inside them.", author: "Muhammad Ali" },
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { text: "Iron sharpens iron.", author: "Proverbs 27:17" },
  { text: "Be so good they can't ignore you.", author: "Steve Martin" },
  { text: "Nobody who ever gave his best regretted it.", author: "George Halas" },
  { text: "Hard times don't create heroes. It is during the hard times when the hero within us is revealed.", author: "Bob Riley" },
  { text: "The harder the battle, the sweeter the victory.", author: "Les Brown" },
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "Get after it.", author: "Jocko Willink" },
  { text: "Stay hard.", author: "David Goggins" },
  { text: "Who's gonna carry the boats?", author: "David Goggins" },
  { text: "The only easy day was yesterday.", author: "Navy SEALs" },
  { text: "Pain is weakness leaving the body.", author: "U.S. Marines" },
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "We suffer more in imagination than in reality.", author: "Seneca" },
  { text: "How long are you going to wait before you demand the best for yourself?", author: "Epictetus" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" },
  { text: "Float like a butterfly, sting like a bee.", author: "Muhammad Ali" },
  { text: "Everyone has a plan until they get punched in the mouth.", author: "Mike Tyson" },
  { text: "Pressure is a privilege — it only comes to those who earn it.", author: "Billie Jean King" },
  { text: "I've failed over and over again in my life. And that is why I succeed.", author: "Michael Jordan" },
  { text: "They don't know what's coming. But you do. Every rep, every meal, every breath — you're building something they can't see yet.", author: "X Factor" },
  { text: "The comeback kid doesn't announce his return. He just shows up ready.", author: "X Factor" },
  { text: "Talent sets the floor. Character sets the ceiling.", author: "Bill Belichick" },
  { text: "Obsessed is a word the lazy use to describe the dedicated.", author: "Grant Cardone" },
  { text: "Do your job.", author: "Bill Belichick" },
  { text: "Today I will do what others won't, so tomorrow I can do what others can't.", author: "Jerry Rice" },
  { text: "Be like water.", author: "Bruce Lee" },
  { text: "Embrace the suck.", author: "Military Saying" },
  { text: "Breathe. Focus. Execute.", author: "HOWL" },
  { text: "The strength of the wolf is the pack, and the strength of the pack is the wolf.", author: "Rudyard Kipling" },
  { text: "What we do in life echoes in eternity.", author: "Maximus" },
  { text: "Your mind will quit a thousand times before your body will.", author: "Unknown" },
  { text: "The grind includes days when you don't feel like grinding.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown" },
];

export const getDailyQuote = () => {
  const d = new Date();
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return QUOTES[dayOfYear % QUOTES.length];
};

// ============ NSDR VIDEOS ============
export const NSDR_VIDEOS = [
  { id: 'nsdr10', title: 'NSDR 10 min (Huberman)', duration: '10 min', url: 'https://www.youtube.com/watch?v=AKGrmY8OSHM' },
  { id: 'nsdr20', title: 'NSDR 20 min', duration: '20 min', url: 'https://www.youtube.com/watch?v=hEypv90GzDE' },
  { id: 'nsdr15', title: 'NSDR 15 min', duration: '15 min', url: 'https://www.youtube.com/watch?v=pL02HRFk2vo' },
  { id: 'lkm', title: 'Loving-Kindness Meditation', duration: '10 min', url: 'https://www.youtube.com/watch?v=sz7cpV7ERsM' },
];

// ============ SLEEP CHECKLIST ============
export const SLEEP_CHECKLIST = [
  { id: 'sc1', text: 'Phone charging OUTSIDE bedroom by 9:30 PM', why: 'Blue light and notifications are the #1 sleep killer for teens.' },
  { id: 'sc2', text: 'Room temp 65-68°F', why: 'Your body needs to cool down for deep sleep. Cooler room = more growth hormone.' },
  { id: 'sc3', text: 'No caffeine after 2 PM', why: 'Caffeine has a 6-hour half-life. A soda at 4 PM = half that caffeine at 10 PM.' },
  { id: 'sc4', text: 'Same bedtime within 30 min every night', why: 'Your circadian rhythm is the most powerful sleep tool. Irregular bedtimes wreck it.' },
  { id: 'sc5', text: '10 min sunlight within 30 min of waking', why: 'Morning light sets your circadian clock and triggers healthy cortisol release.' },
  { id: 'sc6', text: 'Dark room — blackout curtains or sleep mask', why: 'Even small light reduces melatonin. Deep sleep is when your body rebuilds.' },
  { id: 'sc7', text: 'Target 8.5-9.5 hours per night', why: 'Teens need more than adults. Growth hormone peaks during deep sleep — this is when your body rebuilds.' },
  { id: 'sc8', text: 'Mouth tape on before bed', why: 'Forces nasal breathing during sleep. Reduces snoring, improves oxygen saturation, deeper sleep. Use 3M Micropore tape — gentle on skin.' },
];

// ============ LKM STEPS ============
export const LKM_STEPS = [
  { pct: 0, text: "Find a comfortable position. Close your eyes. Take 3 deep breaths to settle in." },
  { pct: 10, text: "Bring to mind someone you love unconditionally — a parent, a friend, a pet. Picture their face." },
  { pct: 18, text: "Silently repeat: 'May you be happy. May you be healthy. May you be safe. May you live with ease.'" },
  { pct: 27, text: "Feel the warmth of those words. Let them be real." },
  { pct: 35, text: "Now turn those words toward yourself. Picture yourself healthy, strong, on the football field." },
  { pct: 43, text: "Repeat: 'May I be happy. May I be healthy. May I be safe. May I live with ease.'" },
  { pct: 52, text: "It might feel awkward. Stay with it. You deserve these words as much as anyone." },
  { pct: 60, text: "Now think of a teammate or classmate — someone neutral." },
  { pct: 68, text: "Repeat for them: 'May you be happy. May you be healthy. May you be safe.'" },
  { pct: 77, text: "Expand — picture your whole team, your family. Send the same wish to all of them." },
  { pct: 85, text: "'May we all be happy. May we all be healthy. May we all be safe.'" },
  { pct: 93, text: "Let the feeling spread. Breathe naturally. Rest in this space of goodwill." },
  { pct: 100, text: "Take a deep breath. Wiggle your fingers. Open your eyes when ready." },
];

// ============ BREATHING SCHEDULE ============
export const BREATHING_SCHEDULE = {
  weekday: [
    { time: '6:30–7:30 AM', label: 'Before School', note: '5–10 min resonance breathing to start grounded.' },
    { time: '3:30–5:00 PM', label: 'After School', note: 'Box breathing or resonance. Reset after the school day.' },
    { time: '7:00–9:00 PM', label: 'Evening', note: 'Resonance breathing before bed. Pairs with NSDR.' },
  ],
  weekend: [
    { time: '8:00–10:00 AM', label: 'Morning', note: 'Longer session — 10–15 min resonance breathing.' },
    { time: '1:00–3:00 PM', label: 'Afternoon', note: 'Box breathing before training or midday reset.' },
    { time: '7:00–9:00 PM', label: 'Evening', note: 'Resonance + NSDR stack for deep recovery.' },
  ],
  rule: '⛔ Never during school hours (8 AM – 3 PM weekdays)',
};

export const YOUTUBE_LINKS = {
  nsdr10: 'https://www.youtube.com/watch?v=AKGrmY8OSHM',
  nsdr20: 'https://www.youtube.com/watch?v=hEypv90GzDE',
  boxBreathing: 'https://www.youtube.com/results?search_query=box+breathing+4-4-4-4+guided+5+minutes',
  resonanceBreathing: 'https://www.youtube.com/results?search_query=resonance+breathing+5.5+seconds+guided+10+minutes',
};
