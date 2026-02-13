/**
 * HOWL Pack Feed — Shared Competition Layer
 * 
 * This is deployed on a SEPARATE Google Sheet from the personal data.
 * All 3 apps (Demon Slayer, Beast Mode/X Factor) post to this same sheet.
 * 
 * TABS: PackDaily, PackChat
 * DEPLOY: Web App > Anyone
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(data.sheet);
    if (!sheet) return resp({ success: false, error: 'Sheet not found: ' + data.sheet });
    
    if (data.sheet === 'PackDaily') {
      // Upsert — replace today's entry for this appId, or append
      const rows = sheet.getDataRange().getValues();
      const dateCol = 0;
      const appIdCol = 1;
      let found = false;
      
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][dateCol] === data.data.date && rows[i][appIdCol] === data.data.appId) {
          // Update existing row
          const rowData = [data.data.date, data.data.appId, data.data.name, data.data.nickname, data.data.emoji, data.data.percentComplete, data.data.xpEarned, data.data.streak, data.data.timestamp];
          sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
          found = true;
          break;
        }
      }
      
      if (!found) {
        sheet.appendRow([data.data.date, data.data.appId, data.data.name, data.data.nickname, data.data.emoji, data.data.percentComplete, data.data.xpEarned, data.data.streak, data.data.timestamp]);
      }
    } else if (data.sheet === 'PackChat') {
      sheet.appendRow([data.data.timestamp, data.data.appId, data.data.name, data.data.nickname, data.data.emoji, data.data.message]);
    }
    
    return resp({ success: true });
  } catch (err) {
    return resp({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = e.parameter.sheet || 'PackDaily';
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return resp({ success: false, error: 'Sheet not found' });
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return resp({ success: true, data: [] });
    
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
    
    // Only return last 7 days for PackDaily
    if (sheetName === 'PackDaily') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      const filtered = rows.filter(r => new Date(r.date) >= cutoff);
      return resp({ success: true, data: filtered });
    }
    
    // Last 50 messages for PackChat
    if (sheetName === 'PackChat') {
      return resp({ success: true, data: rows.slice(-50) });
    }
    
    return resp({ success: true, data: rows });
  } catch (err) {
    return resp({ success: false, error: err.toString() });
  }
}

function resp(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function initializePackFeed() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let daily = ss.getSheetByName('PackDaily');
  if (!daily) {
    daily = ss.insertSheet('PackDaily');
    daily.appendRow(['date','appId','name','nickname','emoji','percentComplete','xpEarned','streak','timestamp']);
    daily.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#e8e8f0');
    daily.setFrozenRows(1);
  }
  
  let chat = ss.getSheetByName('PackChat');
  if (!chat) {
    chat = ss.insertSheet('PackChat');
    chat.appendRow(['timestamp','appId','name','nickname','emoji','message']);
    chat.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#e8e8f0');
    chat.setFrozenRows(1);
  }
  
  Logger.log('Pack Feed initialized!');
}
