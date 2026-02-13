import { useState, useMemo } from 'react';
import { useApp, getFromStorage, saveToStorage } from '../contexts/AppContext';
import { MEALS, SUPPLEMENTS, DAILY_TARGET, SLOTS, SLOT_LABELS, DAYS, getMealById, getCategoryForSlot, formatQty } from '../data/xander-meals';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const getTodayName = () => { const d = new Date().getDay(); return DAYS[d === 0 ? 6 : d - 1]; };

export default function FuelTab() {
  const { profile, dateKey } = useApp();
  const accent = profile?.accentColor || '#e63946';

  const [view, setView] = useState('plan');
  const [planDay, setPlanDay] = useState(getTodayName());
  const [mealPlan, setMealPlan] = useState(() => getFromStorage('howl_mealplan', {}));
  const [todayCals, setTodayCals] = useState(() => getFromStorage(`howl_cals_${dateKey}`, { cal: 0, prot: 0, meals: [] }));
  const [mealName, setMealName] = useState('');
  const [mealCal, setMealCal] = useState('');
  const [mealProt, setMealProt] = useState('');
  const [viewingMeal, setViewingMeal] = useState(null);
  const [expandedSup, setExpandedSup] = useState(null);

  const savePlan = (p) => { setMealPlan(p); saveToStorage('howl_mealplan', p); };
  const saveCals = (c) => { setTodayCals(c); saveToStorage(`howl_cals_${dateKey}`, c); saveToStorage('howl_xander_today_cals', c); };

  const dayTotals = useMemo(() => {
    let cal = 0, prot = 0;
    SLOTS.forEach(s => { const id = mealPlan[`${planDay}_${s}`]; if (id) { const m = getMealById(id); if (m) { cal += m.cal; prot += m.protein; } } });
    return { cal, prot };
  }, [mealPlan, planDay]);

  const hitTarget = todayCals.cal >= DAILY_TARGET.cal;
  const calPct = Math.min(100, Math.round((todayCals.cal / DAILY_TARGET.cal) * 100));
  const protPct = Math.min(100, Math.round((todayCals.prot / DAILY_TARGET.protein) * 100));

  const logMeal = () => {
    if (!mealName) return;
    const meal = { name: mealName, cal: Number(mealCal) || 0, prot: Number(mealProt) || 0, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) };
    const updated = { cal: todayCals.cal + meal.cal, prot: todayCals.prot + meal.prot, meals: [...(todayCals.meals || []), meal] };
    saveCals(updated);
    setMealName(''); setMealCal(''); setMealProt('');
  };

  const logFromPlan = (meal) => {
    const updated = { cal: todayCals.cal + meal.cal, prot: todayCals.prot + meal.protein, meals: [...(todayCals.meals || []), { name: meal.name, cal: meal.cal, prot: meal.protein, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }] };
    saveCals(updated);
  };

  // ============ RECIPE DETAIL VIEW ============
  if (viewingMeal) {
    const meal = viewingMeal;
    return (
      <div className="space-y-3">
        <button onClick={() => setViewingMeal(null)} className="flex items-center gap-1 text-xs font-bold" style={{ color: accent }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <h2 className="text-lg font-black mb-1">{meal.name}</h2>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: `${accent}22`, color: accent }}>{meal.cal} cal</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-500/10 text-blue-400">{meal.protein}g protein</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400">{meal.cookTime}</span>
            {meal.grabAndGo && <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400">Grab & Go</span>}
          </div>
          {meal.description && <p className="text-xs text-gray-400 leading-relaxed mb-4">{meal.description}</p>}

          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Ingredients</h3>
          {meal.ingredients?.map((ing, i) => (
            <div key={i} className="text-xs py-1 border-b border-white/[0.02]">
              <strong className="text-yellow-500">{formatQty(ing.qty)} {ing.unit}</strong> {ing.item}
              <span className="text-[9px] text-gray-600 ml-2">({ing.aisle})</span>
            </div>
          ))}

          {meal.steps && (
            <>
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-4 mb-2">Instructions</h3>
              {meal.steps.map((step, i) => (
                <div key={i} className="flex gap-2.5 py-2 border-b border-white/[0.02]">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ background: accent, color: '#fff' }}>{i + 1}</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </>
          )}

          <button onClick={() => { logFromPlan(meal); setViewingMeal(null); }}
            className="w-full mt-4 py-2.5 rounded-lg text-xs font-bold" style={{ background: accent, color: '#fff' }}>
            Log This Meal ({meal.cal} cal)
          </button>
        </div>
      </div>
    );
  }

  // ============ MAIN VIEW ============
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {[['plan', '📋 Plan'], ['log', '✏️ Log'], ['shop', '🛒 Shop']].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)}
            className={`text-[10px] px-3 py-1.5 rounded-full font-semibold flex-1 ${view === k ? 'text-white' : 'text-gray-500 bg-white/[0.03]'}`}
            style={view === k ? { background: `${accent}22`, color: accent } : undefined}>
            {l}
          </button>
        ))}
      </div>

      {/* Daily Target */}
      <div className="rounded-xl border border-white/5 p-4" style={hitTarget ? { background: '#2ecc7111', borderColor: '#2ecc7133' } : { background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">Today</div>
            <div className="text-xl font-black" style={{ color: hitTarget ? '#2ecc71' : accent }}>{todayCals.cal} <span className="text-sm font-normal text-gray-500">/ {DAILY_TARGET.cal}</span></div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">Protein</div>
            <div className="text-lg font-black" style={{ color: todayCals.prot >= DAILY_TARGET.protein ? '#2ecc71' : '#f4a824' }}>{todayCals.prot}g <span className="text-sm font-normal text-gray-500">/ {DAILY_TARGET.protein}g</span></div>
          </div>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-1">
          <div className="h-full rounded-full transition-all" style={{ width: `${calPct}%`, background: hitTarget ? '#2ecc71' : accent }} />
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${protPct}%`, background: '#f4a824' }} />
        </div>
        {hitTarget && <div className="text-xs text-green-400 font-bold text-center mt-2">🎯 TARGET HIT — +25 Bonus XP!</div>}
      </div>

      {/* MEAL PLAN */}
      {view === 'plan' && (
        <>
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
            {DAYS.map(d => (
              <button key={d} onClick={() => setPlanDay(d)}
                className={`text-[10px] px-2 py-1 rounded font-semibold whitespace-nowrap ${planDay === d ? 'text-white' : 'text-gray-500'}`}
                style={planDay === d ? { background: `${accent}22`, color: accent } : undefined}>
                {d.slice(0, 3)}
              </button>
            ))}
          </div>

          {SLOTS.map(slot => {
            const key = `${planDay}_${slot}`;
            const selId = mealPlan[key];
            const meal = selId ? getMealById(selId) : null;
            const cat = getCategoryForSlot(slot);
            const opts = MEALS[cat] || [];
            return (
              <div key={slot} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{SLOT_LABELS[slot]}</span>
                  {meal && <span className="text-[10px] font-bold text-green-400">{meal.cal} cal · {meal.protein}g P</span>}
                </div>
                <select value={selId || ''} onChange={(e) => savePlan({ ...mealPlan, [key]: e.target.value || undefined })}
                  className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none">
                  <option value="">Select meal...</option>
                  {opts.map(m => <option key={m.id} value={m.id}>{m.name} ({m.cal} cal)</option>)}
                </select>
                {meal && (
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => setViewingMeal(meal)} className="text-[10px] font-bold" style={{ color: accent }}>View Recipe →</button>
                    <button onClick={() => logFromPlan(meal)} className="text-[10px] font-bold text-green-400 ml-auto">+ Log This</button>
                  </div>
                )}
              </div>
            );
          })}

          <div className="rounded-xl border border-white/5 p-3 flex justify-between" style={{ background: dayTotals.cal >= DAILY_TARGET.cal ? '#2ecc7111' : 'rgba(255,255,255,0.02)' }}>
            <div>
              <div className="text-[9px] font-semibold text-gray-500 uppercase">{planDay} Plan</div>
              <div className="text-lg font-black" style={{ color: dayTotals.cal >= DAILY_TARGET.cal ? '#2ecc71' : accent }}>{dayTotals.cal} cal</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-semibold text-gray-500 uppercase">Protein</div>
              <div className="text-lg font-black" style={{ color: dayTotals.prot >= DAILY_TARGET.protein ? '#2ecc71' : '#f4a824' }}>{dayTotals.prot}g</div>
            </div>
          </div>
        </>
      )}

      {/* QUICK LOG */}
      {view === 'log' && (
        <>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Log a Meal</h3>
            <input placeholder="What did you eat?" value={mealName} onChange={e => setMealName(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none mb-2" />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input type="number" placeholder="Calories" value={mealCal} onChange={e => setMealCal(e.target.value)}
                className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" />
              <input type="number" placeholder="Protein (g)" value={mealProt} onChange={e => setMealProt(e.target.value)}
                className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" />
            </div>
            <button onClick={logMeal} className="w-full py-2.5 rounded-lg text-xs font-bold" style={{ background: accent, color: '#fff' }}>Log Meal</button>
          </div>
          {todayCals.meals?.length > 0 && (
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Today's Meals</h3>
              {todayCals.meals.map((meal, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-white/[0.03] last:border-0">
                  <div><div className="text-xs">{meal.name}</div><div className="text-[10px] text-gray-600">{meal.time}</div></div>
                  <div className="text-right"><span className="text-xs font-bold text-green-400">{meal.cal} cal</span><span className="text-[10px] text-gray-500 ml-1.5">{meal.prot}g P</span></div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* SHOPPING LIST */}
      {view === 'shop' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart size={14} style={{ color: accent }} />
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Shopping — {planDay}</h3>
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2 mb-2">
            {DAYS.map(d => (
              <button key={d} onClick={() => setPlanDay(d)}
                className={`text-[10px] px-2 py-1 rounded font-semibold whitespace-nowrap ${planDay === d ? 'text-white' : 'text-gray-500'}`}
                style={planDay === d ? { background: `${accent}22`, color: accent } : undefined}>
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
          {(() => {
            const items = {};
            SLOTS.forEach(sl => {
              const id = mealPlan[`${planDay}_${sl}`];
              if (id) { const m = getMealById(id); if (m?.ingredients) m.ingredients.forEach(ing => {
                const k = ing.item;
                if (!items[k]) items[k] = { item: k, qty: 0, unit: ing.unit, aisle: ing.aisle };
                items[k].qty += ing.qty;
              }); }
            });
            const list = Object.values(items);
            const byAisle = {};
            list.forEach(it => { const a = it.aisle || 'Other'; if (!byAisle[a]) byAisle[a] = []; byAisle[a].push(it); });
            if (list.length === 0) return <p className="text-xs text-gray-500">Select meals in the Meal Plan first.</p>;
            return Object.entries(byAisle).map(([aisle, items]) => (
              <div key={aisle} className="mb-3">
                <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-500 mb-1">{aisle}</div>
                {items.map((it, i) => (
                  <div key={i} className="text-xs py-0.5 text-gray-300">
                    <strong className="text-yellow-500">{formatQty(it.qty)} {it.unit}</strong> {it.item}
                  </div>
                ))}
              </div>
            ));
          })()}
        </div>
      )}

      {/* SUPPLEMENTS */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">💊 Supplements</h3>
        {SUPPLEMENTS.map((sup, i) => (
          <div key={i} className="py-1.5 border-b border-white/[0.03] last:border-0">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedSup(expandedSup === i ? null : i)}>
              <span className="text-xs font-semibold">{sup.icon} {sup.name}</span>
              <span className="text-[10px] text-yellow-500">{sup.dose}</span>
            </div>
            {expandedSup === i && (
              <div className="text-[10px] text-gray-400 mt-1 pl-5 leading-relaxed">
                <div><strong>Timing:</strong> {sup.timing}</div>
                <div className="mt-1">{sup.why}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
