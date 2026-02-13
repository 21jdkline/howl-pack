/**
 * HOWL Pack — Unified Google Apps Script
 * Handles data for both Xander (X Factor) and Maddox (Beast Mode)
 * 
 * TABS CREATED:
 *   Xander_Daily, Xander_Tests, Xander_Workouts, Xander_Weight, Xander_Knee
 *   Maddox_Daily, Maddox_Tests, Maddox_Workouts
 *   WeeklyReports
 * 
 * DEPLOY: Extensions > Apps Script > paste > Deploy > Web App > Anyone
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = data.sheet;
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return resp({ success: false, error: 'Sheet not found: ' + sheetName });
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowData = headers.map(h => data.data[h] !== undefined ? data.data[h] : '');
    
    // Upsert: if sheet has 'date' column, update existing row for same date
    const dateCol = headers.indexOf('date');
    if (dateCol >= 0 && data.data.date) {
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][dateCol] === data.data.date) {
          // Update existing row
          sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
          return resp({ success: true, action: 'updated' });
        }
      }
    }
    
    // No existing row — append
    sheet.appendRow(rowData);
    return resp({ success: true, action: 'appended' });
  } catch (err) {
    return resp({ success: false, error: err.toString() });
  }
}

function resp(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = e.parameter.sheet || 'Xander_Daily';
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return resp({ success: false, error: 'Sheet not found' });
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
    
    return resp({ success: true, data: rows });
  } catch (err) {
    return resp({ success: false, error: err.toString() });
  }
}

// ============ INITIALIZE SHEETS ============
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Xander sheets
  createIfMissing(ss, 'Xander_Daily', ['date','sunlight','protein','exhale_sec','am_supplements','reaction_ms','nasal_1','nasal_2','workout','screen_cutoff','nsdr','journal','mouth_tape_sleep','collagen','pt_exercises','recovery_pain','recovery_swelling','recovery_rom','hydration_oz','calorie_target_hit','completion_pct','xp_earned','streak','timestamp']);
  createIfMissing(ss, 'Xander_Tests', ['date','tmt_a','tmt_b','stroop','flanker','gonogo','attention','reaction','timestamp']);
  createIfMissing(ss, 'Xander_Workouts', ['date','type','exercises','notes','duration','timestamp']);
  createIfMissing(ss, 'Xander_Weight', ['date','weight_lbs','trend','timestamp']);
  createIfMissing(ss, 'Xander_Knee', ['date','pain_0_10','swelling','rom','notes','timestamp']);
  
  // Maddox sheets
  createIfMissing(ss, 'Maddox_Daily', ['date','sunlight','protein','exhale_sec','am_supplements','reaction_ms','nasal_1','nasal_2','workout','screen_cutoff','nsdr','journal','mouth_tape_sleep','mouth_tape_day','pm_supplements','co2_table','completion_pct','xp_earned','streak','timestamp']);
  createIfMissing(ss, 'Maddox_Tests', ['date','tmt_a','tmt_b','stroop','flanker','gonogo','attention','reaction','timestamp']);
  createIfMissing(ss, 'Maddox_Workouts', ['date','type','exercises','notes','duration','timestamp']);
  
  // Reports
  createIfMissing(ss, 'WeeklyReports', ['week_start','week_end','xander_avg_pct','xander_xp','xander_streak','xander_weight','xander_cal_hit_rate','maddox_avg_pct','maddox_xp','maddox_streak','winner','timestamp']);
  
  Logger.log('All sheets initialized successfully!');
}

function createIfMissing(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#e8e8f0');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ============ WEEKLY REPORT — Triggered Sunday 9 PM ============
function generateWeeklyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  
  const xanderData = getWeekData(ss, 'Xander_Daily', weekStart, today);
  const maddoxData = getWeekData(ss, 'Maddox_Daily', weekStart, today);
  
  // Calculate stats
  const xStats = calcStats(xanderData);
  const mStats = calcStats(maddoxData);
  
  // Get weight data
  const weightSheet = ss.getSheetByName('Xander_Weight');
  const lastWeight = weightSheet ? getLastValue(weightSheet, 'weight_lbs') : 'N/A';
  
  // Get calorie hit rate from Xander daily
  const calHitRate = xanderData.filter(d => d.calorie_target_hit === 'true' || d.calorie_target_hit === true).length;
  
  // Determine winner
  const winner = xStats.avgPct > mStats.avgPct ? 'Xander' : mStats.avgPct > xStats.avgPct ? 'Maddox' : 'Tie';
  
  // Build family email
  const familyHtml = buildFamilyReport(xStats, mStats, lastWeight, calHitRate, winner, weekStart, today);
  const xanderHtml = buildIndividualReport('Xander', xStats, lastWeight, calHitRate, weekStart, today);
  const maddoxHtml = buildIndividualReport('Maddox', mStats, null, null, weekStart, today);
  
  // Send emails
  const dadEmail = PropertiesService.getScriptProperties().getProperty('DAD_EMAIL');
  const xanderEmail = PropertiesService.getScriptProperties().getProperty('XANDER_EMAIL');
  const maddoxEmail = PropertiesService.getScriptProperties().getProperty('MADDOX_EMAIL');
  
  if (dadEmail) {
    MailApp.sendEmail({ to: dadEmail, subject: '🐺 HOWL Pack — Week ' + getWeekNumber(today) + ' Report Card', htmlBody: familyHtml });
  }
  if (xanderEmail) {
    MailApp.sendEmail({ to: xanderEmail, subject: '🏈 X Factor — Your Week ' + getWeekNumber(today) + ' Report', htmlBody: xanderHtml });
  }
  if (maddoxEmail) {
    MailApp.sendEmail({ to: maddoxEmail, subject: '🦁 Beast Mode — Your Week ' + getWeekNumber(today) + ' Report', htmlBody: maddoxHtml });
  }
  
  // Log to WeeklyReports sheet
  const reportSheet = ss.getSheetByName('WeeklyReports');
  if (reportSheet) {
    reportSheet.appendRow([
      weekStart.toISOString().split('T')[0],
      today.toISOString().split('T')[0],
      xStats.avgPct, xStats.totalXP, xStats.streak, lastWeight, calHitRate + '/7',
      mStats.avgPct, mStats.totalXP, mStats.streak,
      winner, new Date().toISOString()
    ]);
  }
}

// ============ HELPER FUNCTIONS ============
function getWeekData(ss, sheetName, start, end) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  }).filter(row => {
    const d = new Date(row.date);
    return d >= start && d <= end;
  });
}

function calcStats(data) {
  if (data.length === 0) return { avgPct: 0, totalXP: 0, streak: 0, bestDay: 0, worstDay: 100, daysLogged: 0, missedItems: {} };
  
  const pcts = data.map(d => Number(d.completion_pct) || 0);
  const xps = data.map(d => Number(d.xp_earned) || 0);
  const streaks = data.map(d => Number(d.streak) || 0);
  
  // Find most-missed items
  const missedItems = {};
  data.forEach(row => {
    Object.entries(row).forEach(([key, val]) => {
      if (['date','completion_pct','xp_earned','streak','timestamp'].includes(key)) return;
      if (!val || val === '' || val === 'false' || val === false) {
        missedItems[key] = (missedItems[key] || 0) + 1;
      }
    });
  });
  
  return {
    avgPct: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
    totalXP: xps.reduce((a, b) => a + b, 0),
    streak: Math.max(...streaks),
    bestDay: Math.max(...pcts),
    worstDay: Math.min(...pcts),
    daysLogged: data.length,
    missedItems: Object.entries(missedItems).sort((a, b) => b[1] - a[1]).slice(0, 3),
  };
}

function getLastValue(sheet, colName) {
  const data = sheet.getDataRange().getValues();
  const col = data[0].indexOf(colName);
  if (col < 0) return 'N/A';
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i][col]) return data[i][col];
  }
  return 'N/A';
}

function getWeekNumber(d) {
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
}

// ============ EMAIL TEMPLATES ============
function buildFamilyReport(xStats, mStats, weight, calHitRate, winner, start, end) {
  const formatDate = (d) => (d.getMonth()+1) + '/' + d.getDate();
  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#0a0a0f;color:#e8e8f0;padding:24px;border-radius:16px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:32px;">🐺</div>
        <div style="font-size:10px;color:#888;letter-spacing:3px;text-transform:uppercase;">HOWL Pack</div>
        <div style="font-size:18px;font-weight:900;letter-spacing:2px;">WEEKLY REPORT CARD</div>
        <div style="font-size:11px;color:#888;">${formatDate(start)} — ${formatDate(end)}</div>
      </div>
      
      <div style="text-align:center;background:#111118;border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:2px;">This Week's Winner</div>
        <div style="font-size:24px;font-weight:900;color:${winner === 'Xander' ? '#e63946' : winner === 'Maddox' ? '#f4a824' : '#6366f1'};">🏆 ${winner}</div>
      </div>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr style="border-bottom:1px solid #222;">
          <td style="padding:8px;font-size:12px;color:#888;"></td>
          <td style="padding:8px;font-size:12px;color:#e63946;font-weight:700;text-align:center;">🏈 Xander</td>
          <td style="padding:8px;font-size:12px;color:#f4a824;font-weight:700;text-align:center;">🦁 Maddox</td>
        </tr>
        <tr style="border-bottom:1px solid #222;">
          <td style="padding:8px;font-size:11px;color:#888;">Avg Completion</td>
          <td style="padding:8px;font-size:16px;font-weight:900;text-align:center;color:${xStats.avgPct >= 80 ? '#2ecc71' : '#e63946'};">${xStats.avgPct}%</td>
          <td style="padding:8px;font-size:16px;font-weight:900;text-align:center;color:${mStats.avgPct >= 80 ? '#2ecc71' : '#f4a824'};">${mStats.avgPct}%</td>
        </tr>
        <tr style="border-bottom:1px solid #222;">
          <td style="padding:8px;font-size:11px;color:#888;">XP Earned</td>
          <td style="padding:8px;font-size:14px;font-weight:700;text-align:center;">${xStats.totalXP}</td>
          <td style="padding:8px;font-size:14px;font-weight:700;text-align:center;">${mStats.totalXP}</td>
        </tr>
        <tr style="border-bottom:1px solid #222;">
          <td style="padding:8px;font-size:11px;color:#888;">Streak</td>
          <td style="padding:8px;font-size:14px;text-align:center;">🔥 ${xStats.streak}</td>
          <td style="padding:8px;font-size:14px;text-align:center;">🔥 ${mStats.streak}</td>
        </tr>
        <tr style="border-bottom:1px solid #222;">
          <td style="padding:8px;font-size:11px;color:#888;">Best Day</td>
          <td style="padding:8px;font-size:14px;text-align:center;">${xStats.bestDay}%</td>
          <td style="padding:8px;font-size:14px;text-align:center;">${mStats.bestDay}%</td>
        </tr>
        <tr>
          <td style="padding:8px;font-size:11px;color:#888;">Days Active</td>
          <td style="padding:8px;font-size:14px;text-align:center;">${xStats.daysLogged}/7</td>
          <td style="padding:8px;font-size:14px;text-align:center;">${mStats.daysLogged}/7</td>
        </tr>
      </table>
      
      <div style="background:#111118;border-radius:12px;padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;color:#e63946;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Xander — Items Missed Most</div>
        ${xStats.missedItems.map(([item, count]) => `<div style="font-size:11px;color:#888;padding:2px 0;">${formatItemName(item)} — missed ${count} days</div>`).join('')}
      </div>
      
      <div style="background:#111118;border-radius:12px;padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;color:#f4a824;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Maddox — Items Missed Most</div>
        ${mStats.missedItems.map(([item, count]) => `<div style="font-size:11px;color:#888;padding:2px 0;">${formatItemName(item)} — missed ${count} days</div>`).join('')}
      </div>
      
      <div style="background:#111118;border-radius:12px;padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;color:#e63946;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Xander — Recovery Metrics</div>
        <div style="font-size:11px;color:#888;">Weight: <strong style="color:#fff;">${weight} lbs</strong></div>
        <div style="font-size:11px;color:#888;">Calorie target hit: <strong style="color:#fff;">${calHitRate}/7 days</strong></div>
      </div>
      
      <div style="text-align:center;padding-top:12px;font-size:10px;color:#444;">
        Powered by HOWL 🐺
      </div>
    </div>
  `;
}

function buildIndividualReport(name, stats, weight, calHitRate, start, end) {
  const formatDate = (d) => (d.getMonth()+1) + '/' + d.getDate();
  const accent = name === 'Xander' ? '#e63946' : '#f4a824';
  const icon = name === 'Xander' ? '🏈' : '🦁';
  
  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#0a0a0f;color:#e8e8f0;padding:24px;border-radius:16px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:32px;">${icon}</div>
        <div style="font-size:18px;font-weight:900;color:${accent};">${name === 'Xander' ? 'X FACTOR: THE COMEBACK' : 'BEAST MODE PROTOCOL'}</div>
        <div style="font-size:11px;color:#888;">${formatDate(start)} — ${formatDate(end)}</div>
      </div>
      
      <div style="text-align:center;background:#111118;border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:32px;font-weight:900;color:${stats.avgPct >= 80 ? '#2ecc71' : accent};">${stats.avgPct}%</div>
        <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:2px;">Average Completion</div>
      </div>
      
      <div style="display:flex;text-align:center;margin-bottom:16px;">
        <div style="flex:1;background:#111118;border-radius:12px;padding:12px;margin-right:6px;">
          <div style="font-size:20px;font-weight:900;color:${accent};">${stats.totalXP}</div>
          <div style="font-size:9px;color:#888;text-transform:uppercase;">XP Earned</div>
        </div>
        <div style="flex:1;background:#111118;border-radius:12px;padding:12px;margin-left:6px;">
          <div style="font-size:20px;font-weight:900;color:#f4a824;">🔥 ${stats.streak}</div>
          <div style="font-size:9px;color:#888;text-transform:uppercase;">Day Streak</div>
        </div>
      </div>
      
      <div style="background:#111118;border-radius:12px;padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;color:${accent};font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">These got missed the most this week</div>
        ${stats.missedItems.map(([item, count]) => `<div style="font-size:12px;color:#ccc;padding:3px 0;">• ${formatItemName(item)} — ${count} days</div>`).join('')}
        <div style="font-size:10px;color:#888;margin-top:8px;font-style:italic;">Small wins add up. Focus on these next week.</div>
      </div>
      
      ${weight ? `
      <div style="background:#111118;border-radius:12px;padding:12px;margin-bottom:12px;">
        <div style="font-size:10px;color:${accent};font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Recovery</div>
        <div style="font-size:12px;color:#ccc;">Weight: <strong>${weight} lbs</strong> (target: 150)</div>
        <div style="font-size:12px;color:#ccc;">Calorie target hit: <strong>${calHitRate}/7 days</strong></div>
      </div>
      ` : ''}
      
      <div style="text-align:center;padding:16px;font-size:13px;font-style:italic;color:#888;">
        "The grind includes days when you don't feel like grinding."
      </div>
      
      <div style="text-align:center;font-size:10px;color:#444;">
        Powered by HOWL 🐺
      </div>
    </div>
  `;
}

function formatItemName(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ============ SETUP TRIGGER ============
// Run this once to set up the Sunday night report
function setupWeeklyTrigger() {
  // Delete existing triggers
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  
  // Sunday at 9 PM
  ScriptApp.newTrigger('generateWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(21)
    .create();
  
  Logger.log('Weekly report trigger set for Sunday 9 PM');
}

// ============ SET EMAIL ADDRESSES ============
// Run once to configure
function setEmails() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('DAD_EMAIL', 'REPLACE_WITH_DAD_EMAIL');
  props.setProperty('XANDER_EMAIL', 'REPLACE_WITH_XANDER_EMAIL');
  props.setProperty('MADDOX_EMAIL', 'REPLACE_WITH_MADDOX_EMAIL');
  Logger.log('Emails configured. Remember to replace placeholders!');
}
