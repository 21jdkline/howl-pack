import { useApp } from './contexts/AppContext';
import SplashScreen from './components/SplashScreen';
import ProfileSelector from './components/ProfileSelector';
import useNotifications from './hooks/useNotifications';
import TodayTab from './tabs/TodayTab';
import FuelTab from './tabs/FuelTab';
import TrainTab from './tabs/TrainTab';
import MindTab from './tabs/MindTab';
import TestsTab from './tabs/TestsTab';
import PackTab from './tabs/PackTab';
import StatsTab from './tabs/StatsTab';
import SetupTab from './tabs/SetupTab';
import { getDailyQuote } from './data/levels';
import { Home, Beef, Dumbbell, Brain, FlaskConical, Users, BarChart3, Settings } from 'lucide-react';

const TAB_CONFIG = {
  home:  { label: 'Home', Icon: Home },
  fuel:  { label: 'Fuel', Icon: Beef },
  train: { label: 'Train', Icon: Dumbbell },
  mind:  { label: 'Mind', Icon: Brain },
  tests: { label: 'Tests', Icon: FlaskConical },
  pack:  { label: 'Pack', Icon: Users },
  stats: { label: 'Stats', Icon: BarChart3 },
  setup: { label: 'Setup', Icon: Settings },
};

function Header() {
  const { profile, todayStats, streak, rankInfo, switchProfile, recoveryPhase, monthsSinceSurgery, weeksSinceSurgery, profileId } = useApp();
  if (!profile) return null;

  const pct = todayStats.percentComplete;
  const accent = profile.accentColor;

  return (
    <header className="sticky top-0 z-20 bg-navy-dark/95 backdrop-blur border-b border-white/5">
      <div className="max-w-lg mx-auto px-4 pt-3 pb-2">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button onClick={switchProfile} className="w-9 h-9 rounded-lg overflow-hidden active:scale-90 transition-transform flex-shrink-0">
              <img src={profileId === 'xander' ? '/x-factor-64.png' : '/beast-mode-64.png'}
                alt={profile.name} className="w-full h-full object-cover" />
            </button>
            <div>
              <h1 className="text-sm font-black tracking-wider" style={{ color: accent }}>
                {profile.appName}
              </h1>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-500">
                {profile.subtitle}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              {streak > 0 && <span className="text-orange-400 text-xs">🔥 {streak}</span>}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono">
                {rankInfo.current.icon} {rankInfo.current.name}
              </span>
            </div>
            {profileId === 'xander' && (
              <p className="text-[9px] text-gray-600 mt-0.5">
                {Math.round(monthsSinceSurgery)}mo post-op • Week {weeksSinceSurgery}
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            {profileId === 'xander' && recoveryPhase && (
              <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: recoveryPhase.color }}>
                Phase {recoveryPhase.num}: {recoveryPhase.name}
              </span>
            )}
            {profileId === 'maddox' && (
              <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: accent }}>
                Beast Mode
              </span>
            )}
            <span className="text-[10px] text-gray-500 ml-auto">{todayStats.completedItems}/{todayStats.totalItems}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                background: pct >= 80
                  ? 'linear-gradient(90deg, #2ecc71, #4ade80)'
                  : pct >= 50
                    ? `linear-gradient(90deg, ${accent}, #fbbf24)`
                    : `linear-gradient(90deg, #e63946, ${accent})`,
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-gray-600">{todayStats.xpEarned} XP today</span>
            <span className="text-sm font-black tabular-nums" style={{ color: pct >= 80 ? '#2ecc71' : pct >= 50 ? accent : '#e63946' }}>
              {pct}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function QuoteBanner() {
  const quote = getDailyQuote();
  return (
    <div className="mx-4 mb-3 bg-gradient-to-r from-white/[0.03] to-white/[0.06] rounded-xl p-3 border border-white/5">
      <p className="text-xs text-gray-400 italic leading-relaxed">"{quote.text}"</p>
      <p className="text-[10px] text-gray-600 mt-1 text-right">— {quote.author}</p>
    </div>
  );
}

function BottomNav() {
  const { activeTab, setActiveTab, profile } = useApp();
  if (!profile) return null;

  const tabs = profile.tabs.map(id => ({
    id,
    ...TAB_CONFIG[id],
  }));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-navy-dark/95 backdrop-blur border-t border-white/5">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-2 flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === id ? 'text-white' : 'text-gray-600'
            }`}
            style={activeTab === id ? { color: profile.accentColor } : undefined}
          >
            <Icon size={16} />
            <span className="text-[9px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function PoweredByHowl() {
  return (
    <div className="flex items-center justify-center gap-1.5 py-4 opacity-20">
      <span className="text-[10px] text-gray-500 tracking-widest uppercase">Powered by</span>
      <span className="text-xs font-black text-white tracking-wider">HOWL</span>
      <span className="text-xs">🐺</span>
    </div>
  );
}

export default function App() {
  const { activeTab, profile, profileId, showSplash, dismissSplash } = useApp();

  // Fire toast notifications for badges, rank ups, streaks, etc.
  useNotifications();

  // Splash screen (once daily with video)
  if (showSplash) return <SplashScreen onComplete={dismissSplash} />;

  // Profile selection
  if (!profileId || !profile) return <ProfileSelector />;

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <TodayTab />;
      case 'fuel': return <FuelTab />;
      case 'train': return <TrainTab />;
      case 'mind': return <MindTab />;
      case 'tests': return <TestsTab />;
      case 'pack': return <PackTab />;
      case 'stats': return <StatsTab />;
      case 'setup': return <SetupTab />;
      default: return <TodayTab />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark text-white">
      <Header />
      {activeTab === 'home' && <QuoteBanner />}
      <main className="px-4 pb-20 max-w-lg mx-auto">
        {renderTab()}
        <PoweredByHowl />
      </main>
      <BottomNav />
    </div>
  );
}
