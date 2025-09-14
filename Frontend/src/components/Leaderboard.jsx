import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Expected table: player_stats
// Columns: user_id, username, avatar_url, steamid, games_count,
// achievements_unlocked, achievements_total, completion,
// playtime_total (minutes), updated_at

function rel(t) {
  if (!t) return "—";
  const d = new Date(t);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}
function hours(mins = 0) {
  return (Math.round((mins / 60) * 10) / 10).toFixed(1);
}

export default function Leaderboards() {
  const [metric, setMetric] = useState("achievements"); // "achievements" | "gamerscore"
  const [timeframe, setTimeframe] = useState("all");    // "all" | "year" | "month" | "week"
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  // Which column to order by (you can expand later)
  const orderCol = metric === "gamerscore" ? "achievements_unlocked" : "achievements_unlocked";

  // lower bound ISO timestamp for timeframe
  const since = useMemo(() => {
    if (timeframe === "all") return null;
    const d = new Date();
    if (timeframe === "year")  d.setFullYear(d.getFullYear() - 1);
    if (timeframe === "month") d.setMonth(d.getMonth() - 1);
    if (timeframe === "week")  d.setDate(d.getDate() - 7);
    return d.toISOString();
  }, [timeframe]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        let q = supabase
          .from("player_stats")
          .select(
            "user_id, username, avatar_url, steamid, games_count, achievements_unlocked, achievements_total, completion, playtime_total, updated_at",
            { count: "exact" }
          )
          .order(orderCol, { ascending: false })
          .limit(100);

        if (since) q = q.gte("updated_at", since);

        const { data, error } = await q;
        if (error) throw error;
        setRows(data || []);
      } catch (e) {
        console.error(e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderCol, since]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-effect rounded-xl p-4 flex flex-wrap items-center gap-3">
        <span className="opacity-80">Metric:</span>
        <Tab v="achievements" cur={metric} set={setMetric} label="Achievements" />
        <Tab v="gamerscore"   cur={metric} set={setMetric} label="Gamerscore" />
        <div className="mx-4" />
        <span className="opacity-80">Time:</span>
        <Tab v="all"   cur={timeframe} set={setTimeframe} label="All Time" />
        <Tab v="year"  cur={timeframe} set={setTimeframe} label="This Year" />
        <Tab v="month" cur={timeframe} set={setTimeframe} label="This Month" />
        <Tab v="week"  cur={timeframe} set={setTimeframe} label="This Week" />
      </div>

      {/* Table */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-sm">
            <tr>
              <Th>#</Th>
              <Th>Player</Th>
              <Th>Games</Th>
              <Th>Unlocked</Th>
              <Th>Total</Th>
              <Th>Completion</Th>
              <Th>Playtime (hrs)</Th>
              <Th>Updated</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-6 text-center opacity-70">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-center opacity-70">No players yet.</td></tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.user_id} className="border-t border-white/5">
                  <Td className="w-10">{i + 1}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar url={r.avatar_url} name={r.username} />
                      <div className="font-medium">{r.username || "Player"}</div>
                    </div>
                  </Td>
                  <Td>{r.games_count ?? 0}</Td>
                  <Td className="font-semibold">{r.achievements_unlocked ?? 0}</Td>
                  <Td>{r.achievements_total ?? 0}</Td>
                  <Td>{r.achievements_total ? Math.round((r.completion ?? 0) * 100) : 0}%</Td>
                  <Td>{hours(r.playtime_total)}</Td>
                  <Td className="opacity-70">{rel(r.updated_at)}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- UI bits ---------- */
function Avatar({ url, name }) {
  if (url) {
    return <img src={url} alt="" className="w-8 h-8 rounded-full object-cover" />;
  }
  const initial = (name && name.trim()[0]) ? name.trim()[0].toUpperCase() : "P";
  return (
    <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center text-xs">
      {initial}
    </div>
  );
}
function Th({ children }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
function Tab({ v, cur, set, label }) {
  const active = cur === v;
  return (
    <button
      onClick={() => set(v)}
      className={`px-3 py-1 rounded-md text-sm ${active ? "bg-white/10" : "hover:bg-white/5"}`}
    >
      {label}
    </button>
  );
}
