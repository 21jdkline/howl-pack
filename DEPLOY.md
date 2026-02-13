# HOWL Pack — Deploy Guide

## Quick Start (5 minutes)

### 1. Push to GitHub
```bash
cd howl-pack
git init
git add .
git commit -m "HOWL Pack v1.0 — X Factor + Beast Mode merged"
gh repo create howl-pack --public --push
```

### 2. Deploy to Vercel
```bash
npx vercel --prod
```
Or connect GitHub repo at vercel.com → Import → howl-pack

**Live URL:** `howl-pack.vercel.app`

### 3. Create Google Sheets (2 sheets needed)

#### Sheet A: HOWL Pack Data (personal data for both boys)
1. Go to sheets.google.com → Blank spreadsheet
2. Name it "HOWL Pack Data"
3. Extensions → Apps Script
4. Paste contents of `scripts/google-apps-script.js`
5. Run `initializeSheets()` (click play button, authorize)
6. Run `setEmails()` — then edit the script to replace placeholder emails
7. Run `setupWeeklyTrigger()` — sets up Sunday 9 PM weekly report
8. Deploy → New Deployment → Web App → Execute as Me → Anyone
9. Copy the URL

#### Sheet B: HOWL Pack Feed (shared competition)
1. Go to sheets.google.com → Blank spreadsheet
2. Name it "HOWL Pack Feed"
3. Extensions → Apps Script
4. Paste contents of `scripts/pack-feed-apps-script.js`
5. Run `initializePackFeed()`
6. Deploy → New Deployment → Web App → Execute as Me → Anyone
7. Copy the URL — **this goes in ALL family apps** (Demon Slayer too)

### 4. Configure the App
1. Open howl-pack.vercel.app on phone
2. Select a profile (Xander or Maddox)
3. Go to Setup tab (PIN: 1234)
4. Paste Sheet A script URL in "Apps Script URL"
5. Paste Sheet B script URL in "Pack Feed" 
6. Add email address for weekly reports
7. Save

### 5. Add to Home Screen (iPhone)
1. Open Safari → go to howl-pack.vercel.app
2. Share button → "Add to Home Screen"
3. Name it "X Factor" or "Beast Mode"
4. Appears as an app icon

### 6. Wire Demon Slayer
1. Open operation-demon-slayer.vercel.app
2. Go to Setup
3. Paste Sheet B (Pack Feed) URL
4. Now all 3 family members show up on the leaderboard

---

## Weekly Reports

Reports auto-send **Sunday at 9 PM** via the Apps Script trigger.

**Dad gets:** Family report with both boys' stats, head-to-head, pattern detection
**Each kid gets:** Individual report with their stats, missed items, encouragement

To test: Open Apps Script → Run `generateWeeklyReport()` manually.

---

## Files Reference

```
howl-pack/
├── src/
│   ├── App.jsx              ← Main shell, header, nav
│   ├── main.jsx             ← Entry point
│   ├── index.css            ← Tailwind + base styles
│   ├── contexts/
│   │   └── AppContext.jsx    ← All state management
│   ├── components/
│   │   ├── SplashScreen.jsx  ← "Powered by HOWL" 
│   │   └── ProfileSelector.jsx ← Launch screen
│   ├── data/
│   │   ├── profiles.js       ← Profile definitions
│   │   ├── checklist.js      ← Shared + profile-specific items
│   │   └── levels.js         ← Ranks, quotes, NSDR, sleep, LKM, breathing
│   ├── services/
│   │   ├── packFeed.js       ← Pack Feed service (identical to Demon Slayer)
│   │   └── googleSheets.js   ← Personal Google Sheets sync
│   └── tabs/
│       ├── TodayTab.jsx      ← Daily checklist + quick stats
│       ├── FuelTab.jsx       ← Calorie tracker (Xander)
│       ├── TrainTab.jsx      ← Workouts + schedule (profile-based)
│       ├── MindTab.jsx       ← Breathing, NSDR, LKM, viz, sleep, timeline
│       ├── TestsTab.jsx      ← Sunday cognitive battery
│       ├── PackTab.jsx       ← Leaderboard + trash talk
│       ├── StatsTab.jsx      ← XP, rank, streak, 7-day chart
│       └── SetupTab.jsx      ← Settings, PIN-protected
├── scripts/
│   ├── google-apps-script.js      ← Personal data + weekly reports
│   └── pack-feed-apps-script.js   ← Shared competition layer
├── public/
│   └── manifest.json         ← PWA manifest
├── package.json
├── vite.config.js
├── tailwind.config.js
└── DEPLOY.md                 ← This file
```
