import { useState, useRef } from 'react';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('tap'); // tap | playing | done
  const videoRef = useRef(null);

  const handleTap = () => {
    setPhase('playing');
    const vid = videoRef.current;
    if (vid) {
      vid.muted = false;
      vid.play().catch(() => {
        // If sound blocked, try muted
        vid.muted = true;
        vid.play();
      });
    }
  };

  const handleVideoEnd = () => {
    setPhase('done');
    // Mark as seen today
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('howl_splash_seen', today);
    // Short pause then transition
    setTimeout(() => {
      onComplete?.();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Preloaded video (hidden until playing) */}
      <video
        ref={videoRef}
        src="/howl-intro.mp4"
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        className={`w-full h-full object-contain transition-opacity duration-300 ${phase === 'playing' ? 'opacity-100' : 'opacity-0'}`}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Tap to start overlay */}
      {phase === 'tap' && (
        <button
          onClick={handleTap}
          className="relative z-10 flex flex-col items-center gap-4 active:scale-95 transition-transform"
        >
          <div className="text-6xl">🐺</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">
            Powered by
          </div>
          <div className="text-3xl font-black tracking-[0.4em] text-white">
            HOWL
          </div>
          <div className="mt-6 px-6 py-2.5 rounded-full border border-white/20 text-xs text-gray-400 font-medium animate-pulse">
            Tap to start your day
          </div>
        </button>
      )}

      {/* Done — fade out */}
      {phase === 'done' && (
        <div className="absolute inset-0 bg-black animate-fadeIn" />
      )}
    </div>
  );
}

// Helper: check if splash should show today
export function shouldShowSplash() {
  const today = new Date().toISOString().split('T')[0];
  const lastSeen = localStorage.getItem('howl_splash_seen');
  return lastSeen !== today;
}
