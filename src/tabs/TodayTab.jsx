import { useState, useRef, useCallback } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink, Droplets, Timer } from 'lucide-react';
import { useApp, getFromStorage, saveToStorage } from '../contexts/AppContext';
import { CATEGORIES, getDailyPrompt } from '../data/checklist';

export default function TodayTab() {
  const {
    profile, profileId, checklist, todayCompletions, toggleCompletion,
    setActiveTab, recoveryPhase, hydration, setHydration,
    weightLog, setWeightLog, kneeNote, setKneeNote, dateKey,
  } = useApp();

  const [expandedItem, setExpandedItem] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [weightInput, setWeightInput] = useState('');

  // Exhale stopwatch
  const [exhaleRunning, setExhaleRunning] = useState(false);
  const [exhaleTime, setExhaleTime] = useState(0);
  const exhaleRef = useRef(null);
  const startExhale = () => { setExhaleTime(0); setExhaleRunning(true); exhaleRef.current = setInterval(() => setExhaleTime(p => p + 0.1), 100); };
  const stopExhale = () => { clearInterval(exhaleRef.current); setExhaleRunning(false); const t = Math.round(exhaleTime * 10) / 10; setInputValues(prev => ({ ...prev, exhale: String(t) })); };
  const [journalText, setJournalText] = useState(todayCompletions.journal || '');

  const accent = profile.accentColor;

  // Group checklist by category
  const grouped = {};
  checklist.forEach((item) => {
    const cat = item.category || 'other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  const isCompleted = (id) => {
    const val = todayCompletions[id];
    return val !== undefined && val !== null && val !== '' && val !== false;
  };

  const handleToggle = (item) => {
    if (item.type === 'checkbox') {
      toggleCompletion(item.id);
    } else if (item.type === 'number' || item.type === 'text' || item.type === 'multi') {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    } else if (item.type === 'hydration') {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    }
  };

  const handleNumberSubmit = (item) => {
    const val = inputValues[item.id];
    if (val && val !== '') {
      toggleCompletion(item.id, val);
      setExpandedItem(null);
    }
  };

  const handleJournalSubmit = () => {
    if (journalText.trim()) {
      toggleCompletion('journal', journalText.trim());
      setExpandedItem(null);
    }
  };

  const handleMultiSubmit = (item) => {
    const values = {};
    item.fields.forEach(f => {
      values[f.id] = inputValues[`${item.id}_${f.id}`] || '';
    });
    toggleCompletion(item.id, JSON.stringify(values));
    setExpandedItem(null);
  };

  // Weight logging
  const addWeight = () => {
    const w = parseFloat(weightInput);
    if (!w || w < 80 || w > 300) return;
    setWeightLog(prev => [...prev, { date: new Date().toLocaleDateString(), w }]);
    setWeightInput('');
  };

  const weightTrend = weightLog.length >= 2
    ? weightLog[weightLog.length - 1].w - weightLog[weightLog.length - 2].w
    : null;

  return (
    <div className="space-y-3">
      {/* Quick Stats Row */}
      {profileId === 'xander' && (
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
            <div className="text-lg font-black text-blue-400">{hydration * 10}</div>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">oz water</div>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
            <div className="text-lg font-black text-green-400">
              {(() => {
                const calData = getFromStorage('howl_xander_today_cals', { cal: 0 });
                return calData.cal;
              })()}
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">cal today</div>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
            <div className="text-lg font-black" style={{ color: accent }}>
              {(() => {
                const calData = getFromStorage('howl_xander_today_cals', { prot: 0 });
                return calData.prot;
              })()}g
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">protein</div>
          </div>
        </div>
      )}

      {/* Hydration bar (Xander) */}
      {profileId === 'xander' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Droplets size={14} className="text-blue-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Hydration</span>
            </div>
            <span className="text-xs" style={{ color: hydration >= 8 ? '#2ecc71' : '#8888aa' }}>
              {hydration * 10}/80+ oz
            </span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                onClick={() => setHydration(i + 1 === hydration ? i : i + 1)}
                className="flex-1 h-5 rounded cursor-pointer transition-colors"
                style={{ background: i < hydration ? '#3a86ff' : '#1a1a28' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Daily Checklist */}
      {Object.entries(CATEGORIES).map(([catKey, catInfo]) => {
        const items = grouped[catKey];
        if (!items || items.length === 0) return null;

        return (
          <div key={catKey} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span>{catInfo.icon}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: catInfo.color }}>
                {catInfo.label}
              </span>
            </div>

            {items.map((item) => {
              const done = isCompleted(item.id);
              const isExpanded = expandedItem === item.id;

              return (
                <div key={item.id} className="border-b border-white/[0.03] last:border-0">
                  <div
                    className="flex items-center gap-3 py-2.5 cursor-pointer active:opacity-70"
                    onClick={() => handleToggle(item)}
                  >
                    {/* Checkbox */}
                    <div className="flex-shrink-0">
                      {done ? (
                        <CheckCircle2 size={20} className="text-green-400" />
                      ) : (
                        <Circle size={20} className="text-gray-600" />
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm ${done ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {item.icon} {item.label}
                      </div>
                      {item.timeHint && (
                        <div className="text-[10px] text-gray-600">{item.timeHint}</div>
                      )}
                    </div>

                    {/* Value display or XP */}
                    <div className="flex-shrink-0 text-right">
                      {done && item.type === 'number' && (
                        <span className="text-xs font-bold" style={{ color: accent }}>
                          {todayCompletions[item.id]} {item.unit}
                        </span>
                      )}
                      {!done && (
                        <span className="text-[10px] text-gray-600">{item.xp} XP</span>
                      )}
                    </div>

                    {/* Expand indicator for input items */}
                    {(item.type === 'number' || item.type === 'text' || item.type === 'multi') && (
                      <div className="flex-shrink-0">
                        {isExpanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                      </div>
                    )}
                  </div>

                  {/* Expanded input area */}
                  {isExpanded && item.type === 'number' && (
                    <div className="pb-3 pl-8">
                      {/* Exhale stopwatch */}
                      {item.id === 'exhale' && (
                        <div className="mb-2 text-center">
                          <div className="text-2xl font-black mb-1.5" style={{ color: exhaleRunning ? accent : '#888' }}>
                            {exhaleTime.toFixed(1)}s
                          </div>
                          {!exhaleRunning ? (
                            <button onClick={startExhale}
                              className="px-4 py-1.5 rounded-lg text-[10px] font-bold mb-2" style={{ background: `${accent}22`, color: accent }}>
                              ▶ Start Timer
                            </button>
                          ) : (
                            <button onClick={stopExhale}
                              className="px-4 py-1.5 rounded-lg text-[10px] font-bold bg-red-500 text-white animate-pulse mb-2">
                              ⏹ Stop
                            </button>
                          )}
                          <p className="text-[9px] text-gray-600">Exhale normally → hold → stop at first urge to breathe</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder={`Enter ${item.unit}`}
                          value={inputValues[item.id] || ''}
                          onChange={(e) => setInputValues(prev => ({ ...prev, [item.id]: e.target.value }))}
                          className="flex-1 bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                          autoFocus={item.id !== 'exhale'}
                        />
                        <button
                          onClick={() => handleNumberSubmit(item)}
                          className="px-4 py-2 rounded-lg text-xs font-bold"
                          style={{ background: accent, color: '#fff' }}
                        >
                          Log
                        </button>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Journal input */}
                  {isExpanded && item.id === 'journal' && (
                    <div className="pb-3 pl-8">
                      <p className="text-[10px] text-gray-500 mb-2 italic">{getDailyPrompt()}</p>
                      <textarea
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                        placeholder="Write your thoughts..."
                        className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/20 resize-none"
                        rows={3}
                        autoFocus
                      />
                      <button
                        onClick={handleJournalSubmit}
                        className="mt-2 px-4 py-2 rounded-lg text-xs font-bold"
                        style={{ background: accent, color: '#fff' }}
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {/* Multi-input (recovery check-in) */}
                  {isExpanded && item.type === 'multi' && item.fields && (
                    <div className="pb-3 pl-8 space-y-2">
                      {item.fields.map(field => (
                        <div key={field.id}>
                          <label className="text-[10px] text-gray-500 block mb-1">{field.label}</label>
                          {field.type === 'number' ? (
                            <input
                              type="number"
                              min={field.min}
                              max={field.max}
                              placeholder="0"
                              value={inputValues[`${item.id}_${field.id}`] || ''}
                              onChange={(e) => setInputValues(prev => ({ ...prev, [`${item.id}_${field.id}`]: e.target.value }))}
                              className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
                            />
                          ) : field.type === 'select' ? (
                            <select
                              value={inputValues[`${item.id}_${field.id}`] || ''}
                              onChange={(e) => setInputValues(prev => ({ ...prev, [`${item.id}_${field.id}`]: e.target.value }))}
                              className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
                            >
                              <option value="">Select...</option>
                              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : null}
                        </div>
                      ))}
                      <button
                        onClick={() => handleMultiSubmit(item)}
                        className="px-4 py-2 rounded-lg text-xs font-bold"
                        style={{ background: accent, color: '#fff' }}
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {/* Detail text */}
                  {isExpanded && item.detail && (
                    <div className="pb-2 pl-8">
                      <p className="text-[10px] text-gray-500 leading-relaxed">{item.detail}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Weight Log (Xander) */}
      {profileId === 'xander' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span>⚖️</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Weight Log</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Today's weight (lbs)"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="flex-1 bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
            />
            <button
              onClick={addWeight}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30"
            >
              Log
            </button>
          </div>
          {weightLog.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-400">
                Latest: <strong className="text-white">{weightLog[weightLog.length - 1].w} lbs</strong>
                <span className="text-gray-600 ml-1">({weightLog[weightLog.length - 1].date})</span>
              </div>
              {weightTrend !== null && (
                <div className="text-xs mt-1" style={{ color: weightTrend > 0 ? '#2ecc71' : '#e63946' }}>
                  {weightTrend > 0 ? '↑' : '↓'} {Math.abs(weightTrend).toFixed(1)} lbs
                </div>
              )}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full bg-green-400 transition-all"
                  style={{ width: `${Math.min(100, ((weightLog[weightLog.length - 1].w - 131) / (150 - 131)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-600">131 start</span>
                <span className="text-[10px] font-bold" style={{ color: accent }}>150 target 🏈</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Knee Status (Xander) */}
      {profileId === 'xander' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span>🩼</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Knee Status</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[9px] text-gray-500 uppercase block mb-1">Pain (0-10)</label>
              <input
                type="number" min="0" max="10" placeholder="0"
                value={kneeNote.pain}
                onChange={(e) => setKneeNote(prev => ({ ...prev, pain: e.target.value }))}
                className="w-full bg-surface border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 uppercase block mb-1">Swelling</label>
              <select
                value={kneeNote.swelling}
                onChange={(e) => setKneeNote(prev => ({ ...prev, swelling: e.target.value }))}
                className="w-full bg-surface border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white outline-none"
              >
                <option value="">--</option>
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="moderate">Mod</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] text-gray-500 uppercase block mb-1">ROM</label>
              <select
                value={kneeNote.rom}
                onChange={(e) => setKneeNote(prev => ({ ...prev, rom: e.target.value }))}
                className="w-full bg-surface border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white outline-none"
              >
                <option value="">--</option>
                <option value="better">Better</option>
                <option value="same">Same</option>
                <option value="stiff">Stiff</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
