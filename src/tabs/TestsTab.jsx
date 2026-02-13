import { useState } from 'react';
import { useApp, getFromStorage, saveToStorage } from '../contexts/AppContext';
import { postToSheet } from '../services/googleSheets';
import { ExternalLink, FlaskConical, CheckCircle2 } from 'lucide-react';

const TESTS = [
  { id: 'tmt_a', name: 'Trail Making A', description: 'Connect numbers 1-25 in order as fast as possible.', unit: 'sec', url: 'https://cognition.run/trail-making', icon: '🔢' },
  { id: 'tmt_b', name: 'Trail Making B', description: 'Alternate numbers and letters (1-A-2-B-3-C...).', unit: 'sec', url: 'https://cognition.run/trail-making', icon: '🔤' },
  { id: 'stroop', name: 'Stroop Test', description: 'Name the COLOR of the word, not the word itself.', unit: 'sec', url: 'https://cognition.run/stroop', icon: '🎨' },
  { id: 'flanker', name: 'Flanker Test', description: 'Identify the direction of the CENTER arrow.', unit: 'accuracy %', url: 'https://cognition.run/flanker', icon: '➡️' },
  { id: 'gonogo', name: 'Go/No-Go', description: 'Tap for green, hold for red. Tests impulse control.', unit: 'accuracy %', url: 'https://cognition.run/go-no-go', icon: '🚦' },
  { id: 'attention', name: 'Attention Span', description: 'Sustained attention task.', unit: 'sec', url: 'https://cognition.run/attention-span', icon: '🎯' },
  { id: 'reaction', name: 'Reaction Time', description: 'Click as fast as you can when the screen turns green.', unit: 'ms', url: 'https://humanbenchmark.com/tests/reactiontime', icon: '⚡' },
];

export default function TestsTab() {
  const { profile, profileId, dateKey } = useApp();
  const accent = profile?.accentColor || '#6366f1';
  const storageKey = `howl_tests_${dateKey}`;
  const [results, setResults] = useState(() => getFromStorage(storageKey, {}));
  const [inputValues, setInputValues] = useState({});
  const isSunday = new Date().getDay() === 0;

  const saveResult = (testId) => {
    const val = inputValues[testId];
    if (!val) return;
    const updated = { ...results, [testId]: { value: val, timestamp: new Date().toISOString() } };
    setResults(updated);
    saveToStorage(storageKey, updated);
    setInputValues(prev => ({ ...prev, [testId]: '' }));

    // Sync to Sheets when test is logged
    const sheet = profileId === 'xander' ? 'Xander_Tests' : 'Maddox_Tests';
    const row = { date: dateKey };
    TESTS.forEach(t => {
      const r = t.id === testId ? { value: val } : updated[t.id];
      row[t.id] = r ? r.value : '';
    });
    postToSheet(sheet, row);
  };

  const completedCount = Object.keys(results).length;
  const totalTests = TESTS.length;
  const allDone = completedCount >= totalTests;

  return (
    <div className="space-y-3">
      {/* Status */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 text-center">
        <FlaskConical size={24} className="mx-auto mb-2" style={{ color: accent }} />
        <h2 className="text-sm font-bold">{isSunday ? '🧪 Boss Battle Sunday' : '🧪 Cognitive Tests'}</h2>
        <p className="text-[10px] text-gray-500 mt-1">
          {isSunday ? 'Sunday test day! Complete all tests for 100 Bonus XP.' : 'Tests are scheduled for Sundays. You can practice anytime.'}
        </p>
        <div className="mt-3">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${(completedCount / totalTests) * 100}%`, background: allDone ? '#2ecc71' : accent }} />
          </div>
          <div className="text-[10px] text-gray-500 mt-1">{completedCount}/{totalTests} complete</div>
          {allDone && <div className="text-xs text-green-400 font-bold mt-2">✅ All tests complete! +100 XP Boss Battle Bonus</div>}
        </div>
      </div>

      {/* Test Cards */}
      {TESTS.map(test => {
        const result = results[test.id];
        return (
          <div key={test.id} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span>{test.icon}</span>
                <span className="text-sm font-semibold">{test.name}</span>
              </div>
              {result ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-green-400" />
                  <span className="text-xs font-bold text-green-400">{result.value} {test.unit}</span>
                </div>
              ) : null}
            </div>
            <p className="text-[10px] text-gray-500 mb-2">{test.description}</p>

            <div className="flex gap-2">
              <a href={test.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-blue-500/10 text-blue-400">
                <ExternalLink size={10} /> Take Test
              </a>
              <input
                type="text"
                placeholder={`Score (${test.unit})`}
                value={inputValues[test.id] || ''}
                onChange={(e) => setInputValues(prev => ({ ...prev, [test.id]: e.target.value }))}
                className="flex-1 bg-surface border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none"
              />
              <button onClick={() => saveResult(test.id)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{ background: accent, color: '#fff' }}>
                Log
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
