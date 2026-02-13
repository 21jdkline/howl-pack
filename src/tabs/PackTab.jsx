import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { fetchPackData, postTrashTalk, TRASH_TALK } from '../services/packFeed';
import { Trophy, MessageCircle, Send } from 'lucide-react';

export default function PackTab() {
  const { profile } = useApp();
  const [dailyData, setDailyData] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const accent = profile?.accentColor || '#6366f1';

  const loadData = useCallback(async () => {
    setLoading(true);
    const [daily, chat] = await Promise.all([
      fetchPackData('PackDaily'),
      fetchPackData('PackChat'),
    ]);
    setDailyData(Array.isArray(daily) ? daily : []);
    setChatData(Array.isArray(chat) ? chat : []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Get today's entries (latest per person)
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = {};
  dailyData
    .filter(e => e.date === today)
    .forEach(e => { todayEntries[e.appId] = e; });

  const podium = Object.values(todayEntries).sort((a, b) => b.percentComplete - a.percentComplete);
  const medals = ['🥇', '🥈', '🥉'];

  const sendMessage = async (msg) => {
    const text = msg || message.trim();
    if (!text || !profile) return;
    await postTrashTalk(text, {
      appId: profile.appId,
      name: profile.name,
      nickname: profile.nickname,
      emoji: profile.emoji,
    });
    setMessage('');
    loadData();
  };

  return (
    <div className="space-y-3">
      {/* Leaderboard */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={16} style={{ color: accent }} />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Today's Podium</h2>
        </div>

        {loading ? (
          <div className="text-center py-6 text-gray-600 text-sm">Loading pack data...</div>
        ) : podium.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No data yet today.</p>
            <p className="text-gray-600 text-xs mt-1">Complete your checklist to show up here!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {podium.map((entry, i) => (
              <div key={entry.appId} className="flex items-center gap-3 py-2 px-3 rounded-lg"
                style={{ background: i === 0 ? `${accent}11` : 'transparent' }}>
                <span className="text-lg">{medals[i] || '  '}</span>
                <span className="text-lg">{entry.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold">{entry.nickname || entry.name}</div>
                  <div className="text-[10px] text-gray-500">🔥 {entry.streak || 0} day streak</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black" style={{ color: entry.percentComplete >= 80 ? '#2ecc71' : accent }}>
                    {entry.percentComplete}%
                  </div>
                  <div className="text-[10px] text-gray-500">{entry.xpEarned} XP</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trash Talk */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={16} style={{ color: accent }} />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Trash Talk</h2>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {TRASH_TALK.slice(0, 4).map((msg, i) => (
            <button key={i} onClick={() => sendMessage(msg)}
              className="text-[10px] px-2.5 py-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              {msg}
            </button>
          ))}
        </div>

        {/* Message input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Talk trash..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/20"
          />
          <button onClick={() => sendMessage()}
            className="px-3 py-2 rounded-lg" style={{ background: accent, color: '#fff' }}>
            <Send size={14} />
          </button>
        </div>

        {/* Chat messages */}
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
          {[...chatData].reverse().slice(0, 20).map((msg, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5">
              <span className="text-sm flex-shrink-0">{msg.emoji}</span>
              <div>
                <span className="text-[10px] font-bold text-gray-400">{msg.nickname || msg.name}</span>
                <p className="text-xs text-gray-300">{msg.message}</p>
              </div>
              <span className="text-[9px] text-gray-600 ml-auto flex-shrink-0">
                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
              </span>
            </div>
          ))}
          {chatData.length === 0 && (
            <div className="text-center py-4 text-gray-600 text-xs">No messages yet. Be the first to talk trash!</div>
          )}
        </div>
      </div>
    </div>
  );
}
