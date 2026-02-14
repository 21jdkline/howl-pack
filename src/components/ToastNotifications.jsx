import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, ...toast, createdAt: Date.now() }]);
    // Auto-dismiss after duration (default 5s)
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 5000);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {children}
      {/* Toast container — fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none flex flex-col items-center">
        {toasts.map((toast, i) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-full max-w-lg px-3 animate-slideDown"
            style={{ marginTop: i === 0 ? '8px' : '4px' }}
          >
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg border"
              style={{
                background: toast.bg || '#1a1a2eee',
                borderColor: toast.accent || '#6366f1',
              }}
            >
              {toast.icon && <span className="text-xl flex-shrink-0">{toast.icon}</span>}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white">{toast.title}</div>
                {toast.message && <div className="text-[10px] text-gray-400 mt-0.5">{toast.message}</div>}
              </div>
              <button onClick={() => dismissToast(toast.id)} className="flex-shrink-0 text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}

// ============ PRE-BUILT TOAST TYPES ============
export const TOAST_TYPES = {
  badge: (badge) => ({
    icon: badge.icon,
    title: `Badge Earned: ${badge.name}`,
    message: badge.description,
    accent: '#f4a824',
    bg: '#1a1a2eee',
    duration: 6000,
  }),
  rankUp: (rank) => ({
    icon: rank.icon,
    title: `RANK UP: ${rank.name}`,
    message: `You've reached Rank ${rank.rank}!`,
    accent: rank.color || '#6366f1',
    bg: '#1a1a2eee',
    duration: 7000,
  }),
  trashTalk: (sender, message) => ({
    icon: sender.emoji || '🐺',
    title: `${sender.nickname || sender.name} says:`,
    message: message,
    accent: '#e63946',
    bg: '#1a1a2eee',
    duration: 6000,
  }),
  streak: (count) => ({
    icon: '🔥',
    title: `${count}-Day Streak!`,
    message: count >= 30 ? 'Absolutely legendary.' : count >= 14 ? 'Two weeks strong. Unstoppable.' : count >= 7 ? 'One full week. Keep it rolling.' : 'Building momentum!',
    accent: '#f4a824',
    bg: '#1a1a2eee',
    duration: 5000,
  }),
  perfectDay: () => ({
    icon: '⭐',
    title: '100% DAY',
    message: 'Every single item. Perfect execution.',
    accent: '#2ecc71',
    bg: '#1a1a2eee',
    duration: 6000,
  }),
  calorieTarget: () => ({
    icon: '🎯',
    title: 'CALORIE TARGET HIT',
    message: '3,100 cal reached — +25 Bonus XP!',
    accent: '#2ecc71',
    bg: '#1a1a2eee',
    duration: 5000,
  }),
  co2Complete: () => ({
    icon: '🫁',
    title: 'CO2 TABLE COMPLETE',
    message: '4 rounds done — +25 Bonus XP!',
    accent: '#f4a824',
    bg: '#1a1a2eee',
    duration: 5000,
  }),
};
