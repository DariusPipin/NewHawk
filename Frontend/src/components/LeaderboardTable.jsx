import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [sortBy, setSortBy] = useState('achievements_unlocked'); // achievements_unlocked | completion | playtime_total

  const sorted = useMemo(() => {
    const a = [...rows];
    if (sortBy === 'completion') a.sort((x,y)=>(y.completion??0)-(x.completion??0));
    else if (sortBy === 'playtime_total') a.sort((x,y)=>(y.playtime_total??0)-(x.playtime_total??0));
    else a.sort((x,y)=>(y.achievements_unlocked??0)-(x.achievements_unlocked??0));
    return a.slice(0,100);
  }, [rows, sortBy]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select('user_id,username,avatar_url,steamid,games_count,achievements_unlocked,achievements_total,completion,playtime_total,updated_at')
        .order('achievements_unlocked', { ascending:false })
        .limit(100);
      if (!error) setRows(data || []);
    })();

    // realtime updates (optional; enable Realtime on the table)
    const channel = supabase
      .channel('realtime:player_stats')
      .on('postgres_changes', { event:'*', schema:'public', table:'player_stats' }, async () => {
        const { data } = await supabase
          .from('player_stats')
          .select('user_id,username,avatar_url,steamid,games_count,achievements_unlocked,achievements_total,completion,playtime_total,updated_at')
          .order('achievements_unlocked', { ascending:false })
          .limit(100);
        setRows(data || []);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold animated-gradient-text">Leaderboard</h1>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="bg-transparent border rounded px-3 py-1">
          <option value="achievements_unlocked" className="bg-gray-800">Most Achievements</option>
          <option value="completion" className="bg-gray-800">Highest Completion</option>
          <option value="playtime_total" className="bg-gray-800">Most Playtime</option>
        </select>
      </div>

      <div className="glass-effect rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-sm">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Player</th>
              <th className="p-3">Games</th>
              <th className="p-3">Unlocked</th>
              <th className="p-3">Total</th>
              <th className="p-3">Completion</th>
              <th className="p-3">Playtime (hrs)</th>
              <th className="p-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.user_id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-3">{i+1}</td>
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={r.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(r.username||'Player')}`}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{r.username || 'Player'}</div>
                    <div className="text-xs opacity-60">{r.steamid}</div>
                  </div>
                </td>
                <td className="p-3">{r.games_count ?? 0}</td>
                <td className="p-3">{r.achievements_unlocked ?? 0}</td>
                <td className="p-3">{r.achievements_total ?? 0}</td>
                <td className="p-3">{Math.round((r.completion ?? 0)*100)}%</td>
                <td className="p-3">{Math.round((r.playtime_total ?? 0)/60)}</td>
                <td className="p-3 text-xs opacity-70">{r.updated_at ? new Date(r.updated_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
            {sorted.length===0 && (
              <tr><td className="p-6 text-center opacity-70" colSpan={8}>No players yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
