import { useState } from 'react';
import { Save, Trash2, Download, ExternalLink, Link, Users, Mail, Lock, ArrowLeftRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { NSDR_VIDEOS } from '../data/levels';
import { setPackSheetUrl, getPackSheetUrl } from '../services/packFeed';

export default function SetupTab() {
  const { profile, profileId, switchProfile } = useApp();
  const accent = profile?.accentColor || '#6366f1';

  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const storedPin = localStorage.getItem('howl_setup_pin') || '1234';

  // Settings state
  const [scriptUrl, setScriptUrl] = useState(localStorage.getItem('howl_googleScriptUrl') || '');
  const [sheetUrl, setSheetUrl] = useState(localStorage.getItem('howl_googleSheetUrl') || '');
  const [packUrl, setPackUrl] = useState(getPackSheetUrl());
  const [emailTo, setEmailTo] = useState(localStorage.getItem('howl_report_email') || '');
  const [saved, setSaved] = useState(false);

  if (!unlocked) {
    return (
      <div className="space-y-4 pt-8">
        <div className="text-center">
          <Lock size={32} className="mx-auto mb-3 text-gray-500" />
          <h2 className="text-sm font-bold text-gray-400 mb-4">Enter PIN to access settings</h2>
        </div>
        <div className="flex gap-2 max-w-[200px] mx-auto">
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && pin === storedPin) setUnlocked(true); }}
            placeholder="PIN"
            className="flex-1 bg-surface border border-white/10 rounded-lg px-3 py-3 text-center text-lg text-white outline-none tracking-[0.5em]"
            autoFocus
          />
        </div>
        <button
          onClick={() => { if (pin === storedPin) setUnlocked(true); }}
          className="block mx-auto px-6 py-2 rounded-lg text-xs font-bold"
          style={{ background: accent, color: '#fff' }}
        >
          Unlock
        </button>
        <p className="text-[10px] text-gray-600 text-center">Default PIN: 1234</p>
      </div>
    );
  }

  const saveSettings = () => {
    localStorage.setItem('howl_googleScriptUrl', scriptUrl);
    localStorage.setItem('howl_googleSheetUrl', sheetUrl);
    setPackSheetUrl(packUrl);
    localStorage.setItem('howl_report_email', emailTo);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('howl_')) {
        data[key] = JSON.parse(localStorage.getItem(key) || 'null');
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `howl-pack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm('This will erase ALL local data for both profiles. Are you sure?')) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('howl_')) keys.push(key);
      }
      keys.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-white">Setup</h2>

      {/* Switch Profile */}
      <button
        onClick={switchProfile}
        className="w-full rounded-xl p-3 bg-white/[0.03] border border-white/5 flex items-center gap-3 active:bg-white/[0.06]"
      >
        <ArrowLeftRight size={16} className="text-gray-400" />
        <span className="text-sm text-gray-300">Switch Profile</span>
        <span className="ml-auto text-xs text-gray-500">Currently: {profile?.name}</span>
      </button>

      {/* Quick Links */}
      <div className="rounded-xl p-3 bg-white/[0.03] border border-white/5 space-y-1.5">
        <h3 className="text-[10px] font-semibold text-gray-400 mb-1">Quick Links</h3>
        <a href="https://humanbenchmark.com/tests/reactiontime" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300">
          <ExternalLink size={12} /> Reaction Time Test
        </a>
        {NSDR_VIDEOS.map(v => (
          <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300">
            <ExternalLink size={12} /> {v.title} ({v.duration})
          </a>
        ))}
      </div>

      {/* Google Sheet */}
      <div className="rounded-xl p-3 bg-white/[0.03] border border-white/5 space-y-2">
        <div className="flex items-center gap-2">
          <Link size={14} style={{ color: accent }} />
          <h3 className="text-[10px] font-semibold text-gray-400">Google Sheet (Personal Data)</h3>
        </div>
        <div>
          <label className="text-[9px] text-gray-500 block mb-1">Apps Script URL</label>
          <input type="url" value={scriptUrl} onChange={e => setScriptUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/..."
            className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none" />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 block mb-1">Sheet URL (reference)</label>
          <input type="url" value={sheetUrl} onChange={e => setSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/..."
            className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none" />
        </div>
      </div>

      {/* Pack Feed */}
      <div className="rounded-xl p-3 bg-white/[0.03] border border-white/5 space-y-2">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-green-400" />
          <h3 className="text-[10px] font-semibold text-gray-400">Pack Feed (Family Competition)</h3>
        </div>
        <p className="text-[9px] text-gray-500">Shared Google Sheet URL — same in all family apps.</p>
        <input type="url" value={packUrl} onChange={e => setPackUrl(e.target.value)}
          placeholder="https://script.google.com/macros/s/..."
          className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-green-400" />
      </div>

      {/* Weekly Report Email */}
      <div className="rounded-xl p-3 bg-white/[0.03] border border-white/5 space-y-2">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-blue-400" />
          <h3 className="text-[10px] font-semibold text-gray-400">Weekly Report Email</h3>
        </div>
        <p className="text-[9px] text-gray-500">Family report sent Sunday night. Individual reports to each kid.</p>
        <div>
          <label className="text-[9px] text-gray-500 block mb-1">Dad's email (family report)</label>
          <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)}
            placeholder="dad@email.com"
            className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none" />
        </div>
      </div>

      {/* Save */}
      <button onClick={saveSettings}
        className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
          saved
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'border border-white/10 text-white hover:bg-white/5'
        }`}
        style={!saved ? { background: `${accent}22`, borderColor: `${accent}44`, color: accent } : undefined}
      >
        <Save size={14} />
        {saved ? 'Saved ✓' : 'Save Settings'}
      </button>

      {/* Data Management */}
      <div className="rounded-xl p-3 bg-white/[0.03] border border-white/5 space-y-2">
        <h3 className="text-[10px] font-semibold text-gray-400">Data Management</h3>
        <button onClick={exportData}
          className="w-full py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium flex items-center justify-center gap-2">
          <Download size={12} /> Export All Data
        </button>
        <button onClick={clearData}
          className="w-full py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium flex items-center justify-center gap-2">
          <Trash2 size={12} /> Clear All Data
        </button>
      </div>

      {/* Setup Guide */}
      <div className="rounded-xl p-3 bg-white/[0.03] border border-white/5">
        <h3 className="text-[10px] font-semibold text-gray-400 mb-2">Setup Guide</h3>
        <div className="text-[10px] text-gray-500 space-y-1.5">
          <p><strong className="text-gray-400">1.</strong> Create a Google Sheet for family data. Extensions → Apps Script. Paste the script. Run initializeSheets(). Deploy as Web App.</p>
          <p><strong className="text-gray-400">2.</strong> Create a SEPARATE shared sheet for Pack Feed competition. Deploy its script. Put that URL in Pack Feed section — same URL in Demon Slayer too.</p>
          <p><strong className="text-gray-400">3.</strong> Open Safari → go to Vercel URL → Share → Add to Home Screen.</p>
        </div>
      </div>

      {/* Version */}
      <div className="text-center py-2">
        <p className="text-[9px] text-gray-700">HOWL Pack v1.0.0</p>
        <p className="text-[9px] text-gray-700">Powered by HOWL 🐺</p>
      </div>
    </div>
  );
}
