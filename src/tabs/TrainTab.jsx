import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const getTodayName = () => { const d = new Date().getDay(); return DAYS[d === 0 ? 6 : d - 1]; };

// ============ XANDER WORKOUTS ============
const XANDER_WORKOUTS = [
  { id: 'push', name: 'Push Day', subtitle: 'Chest, Shoulders, Triceps', icon: '💪', duration: '45 min',
    notes: 'Start with a weight you can do 10 reps with good form. If last 2 reps are easy, go up 5 lbs next time.',
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 3, reps: '8-10', rest: '90s', muscle: 'Chest', instructions: 'Lie on flat bench, dumbbells at chest level, palms forward. Press up until arms extended. Lower slowly. Feet flat, slight back arch.' },
      { name: 'Overhead Dumbbell Press', sets: 3, reps: '8-10', rest: '90s', muscle: 'Shoulders', instructions: 'Sit with back support. Dumbbells at shoulder height. Press straight up. Keep core tight.' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60s', muscle: 'Upper Chest', instructions: 'Bench at 30-45°. Same as flat press but angled. Slightly lighter weight.' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '60s', muscle: 'Side Delts', instructions: 'Light dumbbells at sides. Slight elbow bend, raise to T shape. LIGHT weight, slow and controlled.' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '60s', muscle: 'Triceps', instructions: 'Cable rope. Elbows at 90° tucked to sides. Push down, squeeze at bottom. Only forearms move.' },
      { name: 'Push-Ups', sets: 2, reps: 'Max', rest: '60s', muscle: 'Chest', instructions: 'Hands wider than shoulders. Write down count and beat it next time.' },
    ] },
  { id: 'pull', name: 'Pull Day', subtitle: 'Back, Biceps, Rear Delts', icon: '🏋️', duration: '45 min',
    notes: 'Squeeze shoulder blades together at the end of every back movement — that\'s where the activation happens.',
    exercises: [
      { name: 'Lat Pulldowns', sets: 3, reps: '8-10', rest: '90s', muscle: 'Lats', instructions: 'Wide grip, palms away. Pull bar to upper chest by driving elbows down and back.' },
      { name: 'Dumbbell Row', sets: 3, reps: '10-12 each', rest: '90s', muscle: 'Mid Back', instructions: 'One knee and hand on bench. Pull dumbbell to hip. Squeeze at top.' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60s', muscle: 'Rear Delts', instructions: 'CRUCIAL for shoulder health. Cable at face height. Pull toward face, elbows high. LIGHT weight.' },
      { name: 'Bicep Curls', sets: 3, reps: '10-12', rest: '60s', muscle: 'Biceps', instructions: 'Dumbbells at sides, palms forward. Curl up. Don\'t swing — upper arms stay still.' },
      { name: 'Hammer Curls', sets: 2, reps: '12-15', rest: '60s', muscle: 'Forearms', instructions: 'Palms face each other. Hits different bicep part and forearms — important for grip.' },
      { name: 'Band Pull-Aparts', sets: 3, reps: '20', rest: '45s', muscle: 'Posture', instructions: 'Band at chest height, arms straight. Pull apart until it touches chest. Great for posture.' },
    ] },
  { id: 'power', name: 'Football Power', subtitle: 'Explosive Upper + Core', icon: '🏈', duration: '50 min',
    notes: 'All core exercises are ACL-safe. Be EXPLOSIVE on power movements, CONTROLLED on core.',
    exercises: [
      { name: 'Med Ball Chest Pass (Seated)', sets: 4, reps: '8', rest: '60s', muscle: 'Power', instructions: 'Sit against wall. 6-10 lb med ball at chest. Explosive push/throw. Goal is SPEED.' },
      { name: 'Dumbbell Floor Press', sets: 3, reps: '8-10', rest: '90s', muscle: 'Chest/Tris', instructions: 'Lie on FLOOR. Pause at bottom with arms on floor, then press explosively.' },
      { name: 'Single Arm DB Press', sets: 3, reps: '8 each', rest: '60s', muscle: 'Shoulders/Core', instructions: 'Standing, one dumbbell at shoulder. Press overhead. Keep core tight, don\'t lean.' },
      { name: 'Dead Bugs', sets: 3, reps: '10 each', rest: '45s', muscle: 'Deep Core', instructions: 'On back, arms up, knees 90°. Extend opposite arm and leg. Lower back PRESSED to floor.' },
      { name: 'Pallof Press', sets: 3, reps: '10 each', rest: '45s', muscle: 'Anti-Rotation', instructions: 'Sideways to cable at chest. Press arms straight out. RESIST the rotation. Hold 2 sec.' },
      { name: 'Plank', sets: 3, reps: '30-45s', rest: '45s', muscle: 'Core', instructions: 'Forearms on floor. Straight line head to heels. Stop when form breaks.' },
      { name: 'Seated Farmer\'s Hold', sets: 3, reps: '30s', rest: '60s', muscle: 'Grip/Traps', instructions: 'Sit holding heaviest dumbbells you can grip. Shoulders back, 30 sec. Builds football grip.' },
    ] },
  { id: 'pt', name: 'PT / Rehab', subtitle: 'Daily Recovery Work', icon: '🩼', duration: '20-30 min',
    notes: 'Do these EVERY day, even rest days. This is the foundation of your comeback.',
    removable: true,
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: '15', rest: '30s', muscle: 'Quads', instructions: 'Seated, leg straight. Tighten quad, press knee down. Hold 5 sec. Basic but critical.' },
      { name: 'Straight Leg Raises', sets: 3, reps: '12', rest: '45s', muscle: 'Quads/Hip', instructions: 'On back, one leg bent foot flat. Raise straight leg to height of bent knee. Slow lower.' },
      { name: 'Heel Slides', sets: 3, reps: '15', rest: '30s', muscle: 'ROM', instructions: 'On back, slide heel toward butt bending knee. Go to comfortable range. Slide back out.' },
      { name: 'Wall Sits', sets: 3, reps: '30s', rest: '60s', muscle: 'Quads', instructions: 'Back against wall, slide down to 90° if able. Hold. If too much, higher angle is fine.' },
      { name: 'Calf Raises', sets: 3, reps: '15', rest: '30s', muscle: 'Calves', instructions: 'Standing on both feet. Rise up on toes. Slow lower. Maintain circulation in lower legs.' },
    ] },
];

const XANDER_SCHEDULE = [
  { day: 'Monday', workout: 'push' }, { day: 'Tuesday', workout: 'pull' },
  { day: 'Wednesday', workout: null, label: 'Rest / PT Only' },
  { day: 'Thursday', workout: 'power' }, { day: 'Friday', workout: 'push' },
  { day: 'Saturday', workout: 'pull' }, { day: 'Sunday', workout: null, label: 'Full Rest Day' },
];

// ============ MADDOX WORKOUTS ============
const MADDOX_WORKOUTS = [
  { id: 'kb', name: 'Kettlebell Focus', subtitle: 'Full Body Power', icon: '🏋️', duration: '20 min',
    notes: 'Focus on form over weight. Explosive hips on swings.',
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: '10', rest: '60s', muscle: 'Legs', instructions: 'Hold KB at chest. Squat deep, elbows between knees. Drive up through heels.' },
      { name: 'KB Swings', sets: 3, reps: '15', rest: '60s', muscle: 'Posterior Chain', instructions: 'Hinge at hips, swing to chest height. Drive with glutes, not arms.' },
      { name: 'KB Deadlifts', sets: 3, reps: '10', rest: '60s', muscle: 'Back/Legs', instructions: 'KB between feet. Hinge and lift. Keep back straight.' },
      { name: 'Push-Ups', sets: 3, reps: '10-15', rest: '60s', muscle: 'Chest', instructions: 'Full range of motion. Chest to floor. From knees if needed.' },
      { name: 'KB Halos', sets: 2, reps: '8 each way', rest: '45s', muscle: 'Shoulders', instructions: 'Hold KB upside down at chest. Circle it around your head. Both directions.' },
    ] },
  { id: 'cali', name: 'Calisthenics', subtitle: 'Bodyweight Strength', icon: '🤸', duration: '25 min',
    notes: 'No equipment needed. Can do anywhere.',
    exercises: [
      { name: 'Push-Ups', sets: 3, reps: '15', rest: '60s', muscle: 'Chest', instructions: 'Vary hand position each set: wide, normal, diamond.' },
      { name: 'Bodyweight Squats', sets: 3, reps: '20', rest: '60s', muscle: 'Legs', instructions: 'Feet shoulder width. Squat until thighs parallel. Drive up.' },
      { name: 'Burpees', sets: 3, reps: '8', rest: '60s', muscle: 'Full Body', instructions: 'Drop, chest to floor, push up, jump. Keep moving.' },
      { name: 'Mountain Climbers', sets: 3, reps: '20 each', rest: '45s', muscle: 'Core/Cardio', instructions: 'Plank position. Drive knees to chest alternating. Fast.' },
      { name: 'Plank', sets: 3, reps: '45s', rest: '45s', muscle: 'Core', instructions: 'Forearms on floor. Straight line. Squeeze everything.' },
      { name: 'Lunges', sets: 3, reps: '10 each', rest: '60s', muscle: 'Legs', instructions: 'Step forward, lower back knee toward floor. Alternate legs.' },
    ] },
  { id: 'emom', name: 'EMOM', subtitle: 'Every Min on the Min', icon: '⏱️', duration: '15 min',
    notes: 'Set a timer. At the top of each minute, do the prescribed reps. Rest the remainder of the minute.',
    exercises: [
      { name: 'Min 1: Push-Ups', sets: 1, reps: '10', rest: 'remainder', muscle: 'Chest', instructions: '10 push-ups, rest until next minute.' },
      { name: 'Min 2: Squats', sets: 1, reps: '15', rest: 'remainder', muscle: 'Legs', instructions: '15 bodyweight squats, rest until next minute.' },
      { name: 'Min 3: Burpees', sets: 1, reps: '5', rest: 'remainder', muscle: 'Full Body', instructions: '5 burpees, rest until next minute.' },
      { name: 'Repeat x5 rounds', sets: 5, reps: '—', rest: '—', muscle: '15 min total', instructions: 'Cycle through all 3 exercises for 5 rounds = 15 minutes.' },
    ] },
  { id: 'gym_upper', name: 'Gym: Upper Body', subtitle: 'Push & Pull', icon: '💪', duration: '35 min',
    notes: 'Controlled reps. Full range of motion.',
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 3, reps: '10', rest: '90s', muscle: 'Chest', instructions: 'Flat bench, press up, lower slowly.' },
      { name: 'Dumbbell Rows', sets: 3, reps: '10 each', rest: '90s', muscle: 'Back', instructions: 'One hand on bench, pull weight to hip.' },
      { name: 'Overhead Press', sets: 3, reps: '8', rest: '90s', muscle: 'Shoulders', instructions: 'Standing or seated. Press dumbbells overhead.' },
      { name: 'Bicep Curls', sets: 2, reps: '12', rest: '60s', muscle: 'Biceps', instructions: 'Controlled curl, no swinging.' },
      { name: 'Tricep Dips (bench)', sets: 2, reps: '12', rest: '60s', muscle: 'Triceps', instructions: 'Hands on bench behind you. Lower and press up.' },
    ] },
  { id: 'gym_lower', name: 'Gym: Lower Body', subtitle: 'Legs & Core', icon: '🦵', duration: '35 min',
    notes: 'Build a strong base.',
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: '10', rest: '90s', muscle: 'Quads', instructions: 'Hold dumbbell at chest. Deep squat.' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10', rest: '90s', muscle: 'Hamstrings', instructions: 'Dumbbells in front. Hinge at hips, slight knee bend. Feel hamstring stretch.' },
      { name: 'Lunges', sets: 3, reps: '10 each', rest: '60s', muscle: 'Legs', instructions: 'Dumbbells at sides. Step forward and lower.' },
      { name: 'Calf Raises', sets: 3, reps: '15', rest: '45s', muscle: 'Calves', instructions: 'Hold dumbbells. Rise on toes. Slow lower.' },
      { name: 'Plank', sets: 3, reps: '45s', rest: '45s', muscle: 'Core', instructions: 'Forearms. Straight line. Hold.' },
    ] },
  { id: 'muay', name: 'Muay Thai', subtitle: 'Combat Training', icon: '🥊', duration: '60 min',
    notes: 'Log your class. Great cardio + mental toughness.',
    exercises: [
      { name: 'Muay Thai Class', sets: 1, reps: '60 min', rest: '—', muscle: 'Full Body', instructions: 'Log when you attend class. Note any techniques worked on.' },
    ] },
];

const MADDOX_SCHEDULE = [
  { day: 'Monday', workout: 'kb' }, { day: 'Tuesday', workout: 'cali' },
  { day: 'Wednesday', workout: 'muay' }, { day: 'Thursday', workout: 'gym_upper' },
  { day: 'Friday', workout: 'emom' }, { day: 'Saturday', workout: 'gym_lower' },
  { day: 'Sunday', workout: null, label: 'Rest Day' },
];

// ============ WEIGHT MILESTONES (Xander only) ============
const WEIGHT_MILESTONES = [
  { week: 0, weight: 131, label: 'Start' }, { week: 4, weight: 135, label: 'Month 1' },
  { week: 8, weight: 139, label: 'Month 2' }, { week: 12, weight: 143, label: 'Month 3' },
  { week: 16, weight: 147, label: 'Month 4' }, { week: 20, weight: 150, label: 'Target' },
];

export default function TrainTab() {
  const { profile, profileId, weightLog } = useApp();
  const accent = profile?.accentColor || '#e63946';
  const [expandedW, setExpandedW] = useState(null);
  const [expandedEx, setExpandedEx] = useState(null);

  const workouts = profileId === 'xander' ? XANDER_WORKOUTS : MADDOX_WORKOUTS;
  const schedule = profileId === 'xander' ? XANDER_SCHEDULE : MADDOX_SCHEDULE;
  const todayName = getTodayName();
  const todaySchedule = schedule.find(s => s.day === todayName);
  const todayWorkout = todaySchedule?.workout ? workouts.find(w => w.id === todaySchedule.workout) : null;

  return (
    <div className="space-y-3">
      {/* Weekly Schedule */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={14} style={{ color: accent }} />
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Weekly Schedule</h2>
        </div>
        {schedule.map(({ day, workout, label }) => {
          const w = workout ? workouts.find(x => x.id === workout) : null;
          const isToday = todayName === day;
          return (
            <div key={day} className={`flex items-center justify-between py-1.5 ${isToday ? 'px-2 -mx-2 rounded-lg' : ''}`}
              style={isToday ? { background: `${accent}11` } : undefined}>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isToday ? 'font-bold' : 'text-gray-400'}`} style={isToday ? { color: accent } : undefined}>{day}</span>
                {isToday && <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${accent}33`, color: accent }}>TODAY</span>}
              </div>
              <span className="text-xs text-gray-500">{w ? `${w.icon} ${w.name}` : label || 'Rest'}</span>
            </div>
          );
        })}
      </div>

      {/* Today's workout highlight */}
      {todayWorkout && (
        <div className="rounded-xl p-3 border-l-4" style={{ background: `${accent}11`, borderColor: accent }}>
          <div className="text-xs text-gray-400 mb-1">Today's Workout</div>
          <div className="text-base font-bold">{todayWorkout.icon} {todayWorkout.name}</div>
          <div className="text-xs text-gray-500">{todayWorkout.subtitle} · {todayWorkout.duration}</div>
          <button className="mt-2 text-xs font-bold" style={{ color: accent }}
            onClick={() => setExpandedW(todayWorkout.id)}>View Workout →</button>
        </div>
      )}

      {/* All Workouts */}
      {workouts.map(w => (
        <div key={w.id} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
          <div className="cursor-pointer" onClick={() => setExpandedW(expandedW === w.id ? null : w.id)}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">{w.icon} {w.name}</div>
                <div className="text-[10px] text-gray-500">{w.subtitle} · {w.duration}</div>
              </div>
              {expandedW === w.id ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
            </div>
          </div>

          {expandedW === w.id && (
            <div className="mt-3 space-y-1">
              {w.notes && (
                <div className="text-[10px] px-2 py-1.5 rounded-lg mb-2" style={{ background: '#f4a82411', color: '#f4a824' }}>
                  💡 {w.notes}
                </div>
              )}
              {w.exercises.map((ex, i) => (
                <div key={i} className="border-l-2 border-white/10 pl-3 py-1">
                  <div className="cursor-pointer" onClick={() => setExpandedEx(expandedEx === `${w.id}_${i}` ? null : `${w.id}_${i}`)}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{ex.name}</span>
                      <span className="text-[10px] text-gray-500">{ex.sets}×{ex.reps}</span>
                    </div>
                    <div className="text-[9px]" style={{ color: accent }}>{ex.muscle} · Rest {ex.rest}</div>
                  </div>
                  {expandedEx === `${w.id}_${i}` && (
                    <div className="text-[11px] text-gray-400 mt-1 leading-relaxed bg-surface p-2 rounded">
                      {ex.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Weight Targets (Xander) */}
      {profileId === 'xander' && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">⚖️ Weight Targets</h3>
          {WEIGHT_MILESTONES.map((m, i) => (
            <div key={i} className="flex justify-between py-1">
              <span className="text-xs text-gray-500">{m.label}</span>
              <span className="text-xs font-bold" style={{ color: m.weight <= (weightLog.length > 0 ? weightLog[weightLog.length-1].w : 131) ? '#2ecc71' : '#888' }}>
                {m.weight} lbs {m.weight <= (weightLog.length > 0 ? weightLog[weightLog.length-1].w : 131) ? '✅' : ''}
              </span>
            </div>
          ))}
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
            <div className="h-full rounded-full bg-green-400 transition-all"
              style={{ width: `${Math.min(100, ((weightLog.length > 0 ? weightLog[weightLog.length-1].w : 131) - 131) / (150 - 131) * 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
