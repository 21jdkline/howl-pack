import { useState, useEffect, useRef } from 'react';
import { useApp, getFromStorage, saveToStorage } from '../contexts/AppContext';
import { NSDR_VIDEOS, SLEEP_CHECKLIST, LKM_STEPS, BREATHING_SCHEDULE, YOUTUBE_LINKS } from '../data/levels';
import { ExternalLink, Play, Square, ChevronDown, ChevronUp } from 'lucide-react';

const RECOVERY_MILESTONES = [
  { month: 1, title: 'Protection Phase', description: 'Protect graft, reduce swelling, regain knee extension.' },
  { month: 2, title: 'Early Rehabilitation', description: 'Gentle ROM. Light PT. Walking without crutches (if cleared).' },
  { month: 3, title: 'Progressive Loading', description: 'Increasing ROM, light resistance. Upper body ramps up.' },
  { month: 4, title: 'Strengthening Phase', description: 'Progressive lower body. Stationary bike, light leg press.' },
  { month: 5, title: 'Advanced Strengthening', description: 'Heavier lower body. Single-leg strength. Core stability.' },
  { month: 6, title: 'Return to Activity', description: 'Light jogging (if cleared). Agility ladder. Plyometrics start.' },
  { month: 7, title: 'Sport-Specific Prep', description: 'Cutting drills, change of direction. Football movements.' },
  { month: 8, title: 'Advanced Sport Training', description: 'Full speed running, advanced agility. Position drills.' },
  { month: 9, title: 'Return to Practice', description: 'Non-contact team drills first. Then progressive contact.' },
  { month: 10, title: 'Full Clearance', description: 'Full contact practice. Game-ready conditioning.' },
];

export default function MindTab() {
  const { profile, profileId, monthsSinceSurgery } = useApp();
  const accent = profile?.accentColor || '#e63946';
  const [section, setSection] = useState('breathing');
  const [breathType, setBreathType] = useState('box');
  const [expandedSleep, setExpandedSleep] = useState(null);
  const [lkmActive, setLkmActive] = useState(false);
  const [lkmStep, setLkmStep] = useState(0);
  const [lkmTimer, setLkmTimer] = useState(0);
  const timerRef = useRef(null);

  const isWeekday = () => { const d = new Date().getDay(); return d >= 1 && d <= 5; };
  const wd = isWeekday();
  const schedule = wd ? BREATHING_SCHEDULE.weekday : BREATHING_SCHEDULE.weekend;

  const sections = [
    ['breathing', '🫁 Breathe'],
    ['nsdr', '🧘 NSDR'],
    ['lkm', '❤️ LKM'],
    ['viz', '🏈 Visualize'],
    ['sleep', '🌙 Sleep'],
  ];
  if (profileId === 'xander') sections.push(['timeline', '📈 Timeline']);
  if (profileId === 'maddox') sections.push(['co2', '🫁 CO2 Table']);

  // CO2 table state (Maddox)
  const [co2Round, setCo2Round] = useState(0);
  const [co2Holds, setCo2Holds] = useState(() => getFromStorage(`howl_maddox_co2_holds_${dateKey}`, []));
  const [co2Running, setCo2Running] = useState(false);
  const [co2Timer, setCo2Timer] = useState(0);
  const co2Ref = useRef(null);

  // LKM timer
  useEffect(() => {
    if (lkmActive) {
      timerRef.current = setInterval(() => {
        setLkmTimer(prev => {
          const next = prev + 1;
          if (next >= 600) { setLkmActive(false); clearInterval(timerRef.current); return 600; }
          const pct = (next / 600) * 100;
          const idx = LKM_STEPS.findIndex((s, i) => pct >= s.pct && (!LKM_STEPS[i + 1] || pct < LKM_STEPS[i + 1].pct));
          if (idx >= 0) setLkmStep(idx);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [lkmActive]);

  return (
    <div className="space-y-3">
      {/* Section tabs */}
      <div className="flex gap-1 flex-wrap">
        {sections.map(([key, label]) => (
          <button key={key} onClick={() => setSection(key)}
            className={`text-[10px] px-2.5 py-1.5 rounded-full font-semibold transition-colors ${
              section === key ? 'text-white' : 'text-gray-500 bg-white/[0.03]'
            }`}
            style={section === key ? { background: `${accent}22`, color: accent, borderColor: accent } : undefined}>
            {label}
          </button>
        ))}
      </div>

      {/* BREATHING */}
      {section === 'breathing' && (
        <>
          <div className="rounded-xl p-2.5 border-l-4 border-red-500 bg-red-500/5">
            <span className="text-[10px] text-red-400 font-semibold">{BREATHING_SCHEDULE.rule}</span>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
            <h3 className="text-[10px] font-semibold text-gray-400 mb-2">{wd ? '📚 Weekday' : '🏠 Weekend'} Schedule</h3>
            {schedule.map((sc, i) => (
              <div key={i} className="py-1.5 border-b border-white/[0.03] last:border-0">
                <div className="flex justify-between"><span className="text-xs font-bold text-yellow-500">{sc.time}</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{sc.label}</span></div>
                <div className="text-[10px] text-gray-500 mt-0.5">{sc.note}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className={`flex-1 text-[10px] py-2 rounded-lg font-semibold ${breathType === 'box' ? 'text-white' : 'text-gray-500 bg-white/[0.03]'}`}
              style={breathType === 'box' ? { background: `${accent}22`, color: accent } : undefined}
              onClick={() => setBreathType('box')}>Box Breathing</button>
            <button className={`flex-1 text-[10px] py-2 rounded-lg font-semibold ${breathType === 'resonance' ? 'text-white' : 'text-gray-500 bg-white/[0.03]'}`}
              style={breathType === 'resonance' ? { background: '#3a86ff22', color: '#3a86ff' } : undefined}
              onClick={() => setBreathType('resonance')}>Resonance</button>
          </div>
          {breathType === 'box' ? (
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
              <h3 className="text-sm font-bold mb-1">Box Breathing</h3>
              <p className="text-[10px] text-yellow-500 mb-3">Navy SEAL technique — calms the nervous system in minutes</p>
              <div className="text-2xl font-black text-center tracking-widest my-4" style={{ color: accent }}>4 – 4 – 4 – 4</div>
              <div className="text-xs leading-7">
                <strong>Inhale</strong> through nose for 4 sec<br />
                <strong>Hold</strong> lungs full for 4 sec<br />
                <strong>Exhale</strong> through mouth for 4 sec<br />
                <strong>Hold</strong> lungs empty for 4 sec
              </div>
              <p className="text-[10px] text-gray-500 mt-2">Repeat 4-8 rounds. Start with 5 min.</p>
              <a href={YOUTUBE_LINKS.boxBreathing} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold mt-3 px-3 py-1.5 rounded-lg" style={{ background: `${accent}22`, color: accent }}>
                <ExternalLink size={12} /> Guided Video
              </a>
            </div>
          ) : (
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
              <h3 className="text-sm font-bold mb-1">Resonance Breathing</h3>
              <p className="text-[10px] text-yellow-500 mb-3">5.5 breaths/min — maximizes HRV</p>
              <div className="text-2xl font-black text-center tracking-widest my-4 text-blue-400">5.5 in – 5.5 out</div>
              <div className="text-xs leading-7">
                <strong>Inhale</strong> slowly through nose 5.5 sec<br />
                <strong>Exhale</strong> slowly through nose 5.5 sec<br />
                No holds. Continuous, smooth rhythm.
              </div>
              <p className="text-[10px] text-gray-500 mt-2">Optimal breathing rate for HRV. Higher HRV = better recovery.</p>
              <a href={YOUTUBE_LINKS.resonanceBreathing} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold mt-3 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <ExternalLink size={12} /> Guided Video
              </a>
            </div>
          )}
        </>
      )}

      {/* NSDR */}
      {section === 'nsdr' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <h3 className="text-sm font-bold mb-2">🧘 Non-Sleep Deep Rest</h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">NSDR puts your brain into a deeply restorative state. Huberman calls it "the single best tool for reset." Do after training or before bed.</p>
          <p className="text-[10px] text-gray-500 mb-3"><strong>Benefits:</strong> Reduces cortisol, accelerates healing, improves focus, boosts growth hormone.</p>
          <div className="grid grid-cols-2 gap-2">
            {NSDR_VIDEOS.map(v => (
              <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 rounded-lg text-xs font-semibold" style={{ background: `${accent}11`, color: accent }}>
                ▶ {v.duration}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* LKM */}
      {section === 'lkm' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <h3 className="text-sm font-bold mb-2">❤️ Loving Kindness Meditation</h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">LKM builds emotional resilience, reduces anxiety, improves focus. Athletes who practice it recover faster from setbacks. 10 min, eyes closed.</p>
          {!lkmActive ? (
            <button onClick={() => { setLkmActive(true); setLkmTimer(0); setLkmStep(0); }}
              className="w-full py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2" style={{ background: accent, color: '#fff' }}>
              <Play size={14} /> Start 10-Min Session
            </button>
          ) : (
            <div className="text-center">
              <div className="text-4xl font-black mb-2" style={{ color: accent }}>
                {Math.floor((600 - lkmTimer) / 60)}:{String((600 - lkmTimer) % 60).padStart(2, '0')}
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full transition-all" style={{ width: `${(lkmTimer / 600) * 100}%`, background: accent }} />
              </div>
              <div className="text-sm leading-relaxed p-3 bg-surface rounded-lg min-h-[60px] flex items-center justify-center">
                {LKM_STEPS[lkmStep]?.text}
              </div>
              <button onClick={() => { setLkmActive(false); clearInterval(timerRef.current); }}
                className="mt-3 px-4 py-2 rounded-lg text-xs text-gray-400 bg-white/5 inline-flex items-center gap-1">
                <Square size={12} /> End Session
              </button>
            </div>
          )}
        </div>
      )}

      {/* VISUALIZATION */}
      {section === 'viz' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <h3 className="text-sm font-bold mb-2">🏈 Mental Reps</h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">Mental visualization strengthens neural pathways. Same brain areas fire whether you physically perform a movement or vividly imagine it.</p>
          <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">15-Min Session</h4>
          <div className="text-xs leading-7 text-gray-300">
            <strong className="text-yellow-500">Min 1–3:</strong> Close eyes. Breathe. Picture the field — grass, lights, crowd sounds.<br /><br />
            <strong className="text-yellow-500">Min 4–7:</strong> See yourself in position. Run routes, make reads. Feel the ball. Every rep is perfect.<br /><br />
            <strong className="text-yellow-500">Min 8–11:</strong> Game situations. 4th quarter, game on the line. You make the play.<br /><br />
            <strong className="text-yellow-500">Min 12–15:</strong> See the end. The scholarship offer. The handshake. Your family in the stands.
          </div>
          <p className="text-xs text-yellow-500 font-semibold italic mt-4">"The body achieves what the mind believes."</p>
        </div>
      )}

      {/* SLEEP */}
      {section === 'sleep' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <h3 className="text-sm font-bold mb-2">🌙 Sleep Protocol</h3>
          <p className="text-[10px] text-gray-500 mb-3">Sleep is when your body heals, muscles grow, and brain consolidates learning. THE most important recovery tool.</p>
          {SLEEP_CHECKLIST.map((item, i) => (
            <div key={item.id} className="py-1.5 border-b border-white/[0.03] last:border-0">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedSleep(expandedSleep === i ? null : i)}>
                <span className="text-xs text-white">{item.text}</span>
                {expandedSleep === i ? <ChevronUp size={12} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={12} className="text-gray-500 flex-shrink-0" />}
              </div>
              {expandedSleep === i && (
                <div className="text-[10px] text-yellow-500 mt-1 pl-3 border-l-2 border-yellow-500/30 leading-relaxed">{item.why}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TIMELINE (Xander only) */}
      {section === 'timeline' && profileId === 'xander' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <h3 className="text-sm font-bold mb-1">📈 Recovery Timeline</h3>
          <p className="text-[10px] text-gray-500 mb-3">ACL Reconstruction — November 2025</p>
          {RECOVERY_MILESTONES.map((m, i) => {
            const currentMonth = Math.round(monthsSinceSurgery);
            const status = m.month < currentMonth ? 'complete' : m.month === currentMonth ? 'current' : 'upcoming';
            const color = status === 'complete' ? '#2ecc71' : status === 'current' ? accent : '#333';
            return (
              <div key={i} className="pl-3 py-1.5 border-l-2 mb-1" style={{ borderColor: color }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">Month {m.month}: {m.title}</span>
                  {status === 'current' && <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${accent}33`, color: accent }}>NOW</span>}
                  {status === 'complete' && <span className="text-xs">✅</span>}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">{m.description}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* CO2 TOLERANCE TABLE (Maddox) */}
      {section === 'co2' && profileId === 'maddox' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <h3 className="text-sm font-bold mb-2">🫁 CO2 Tolerance Table</h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            Breath hold training increases CO2 tolerance, which improves breathing efficiency, calms your nervous system, and builds mental toughness.
          </p>
          <p className="text-[10px] text-yellow-500 font-semibold mb-3">Protocol: Breathe normally → exhale naturally → hold until first urge to breathe → record time</p>

          <div className="text-[10px] text-gray-500 mb-3">
            <strong>Goal:</strong> 4 rounds. Rest 1-2 min between holds. Try to improve each round.
          </div>

          {/* Timer */}
          <div className="text-center mb-4">
            <div className="text-4xl font-black mb-2" style={{ color: co2Running ? accent : '#888' }}>
              {co2Timer.toFixed(1)}s
            </div>
            {!co2Running ? (
              <button onClick={() => {
                setCo2Running(true);
                setCo2Timer(0);
                co2Ref.current = setInterval(() => setCo2Timer(prev => prev + 0.1), 100);
              }}
                className="px-6 py-2.5 rounded-lg text-xs font-bold" style={{ background: accent, color: '#fff' }}>
                {co2Holds.length === 0 ? 'Start Round 1' : `Start Round ${co2Holds.length + 1}`}
              </button>
            ) : (
              <button onClick={() => {
                clearInterval(co2Ref.current);
                setCo2Running(false);
                const holdTime = Math.round(co2Timer * 10) / 10;
                const newHolds = [...co2Holds, holdTime];
                setCo2Holds(newHolds);
                saveToStorage(`howl_maddox_co2_holds_${dateKey}`, newHolds);
                if (newHolds.length >= 4) {
                  saveToStorage(`howl_maddox_co2_${dateKey}`, true);
                }
                setCo2Timer(0);
              }}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-red-500 text-white animate-pulse">
                STOP — Log Hold
              </button>
            )}
          </div>

          {/* Results */}
          {co2Holds.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Today's Rounds</h4>
              {co2Holds.map((hold, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <span className="text-xs font-bold w-16" style={{ color: accent }}>Round {i + 1}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (hold / 60) * 100)}%`, background: accent }} />
                  </div>
                  <span className="text-xs font-bold text-white w-12 text-right">{hold}s</span>
                </div>
              ))}
              {co2Holds.length >= 4 && (
                <div className="text-xs text-green-400 font-bold text-center mt-2">✅ CO2 Table Complete — +25 Bonus XP!</div>
              )}
              {co2Holds.length > 0 && (
                <div className="text-[10px] text-gray-500 mt-1">
                  Best: <strong className="text-white">{Math.max(...co2Holds)}s</strong> · Avg: <strong className="text-white">{(co2Holds.reduce((a, b) => a + b, 0) / co2Holds.length).toFixed(1)}s</strong>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
