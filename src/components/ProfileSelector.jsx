import { PROFILES } from '../data/profiles';
import { useApp } from '../contexts/AppContext';

export default function ProfileSelector() {
  const { selectProfile } = useApp();

  return (
    <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center px-6">
      {/* HOWL Logo */}
      <div className="text-center mb-12">
        <div className="text-4xl mb-3">🐺</div>
        <div className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-500 mb-1">Powered by</div>
        <div className="text-xl font-black tracking-widest text-white">HOWL</div>
      </div>

      {/* Profile Cards */}
      <div className="w-full max-w-sm space-y-4">
        {Object.values(PROFILES).map((p) => (
          <button
            key={p.id}
            onClick={() => selectProfile(p.id)}
            className="w-full rounded-2xl p-6 border-2 transition-all duration-200 active:scale-[0.98]"
            style={{
              background: `${p.accentColor}11`,
              borderColor: `${p.accentColor}44`,
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ background: `${p.accentColor}22` }}
              >
                {p.icon}
              </div>
              <div className="text-left">
                <div className="text-lg font-black tracking-wider" style={{ color: p.accentColor }}>
                  {p.appName}
                </div>
                <div className="text-sm font-semibold text-gray-400">
                  {p.subtitle}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {p.name}'s Protocol
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-[10px] text-gray-700 tracking-wider uppercase">Family Health & Performance</p>
      </div>
    </div>
  );
}
