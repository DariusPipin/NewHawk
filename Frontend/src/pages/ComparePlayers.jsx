// src/pages/ComparePlayers.jsx (or wherever you mount it)
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

function hours(mins = 0) { return Math.round((mins / 60) * 10) / 10; }
function pct(n = 0) { return Math.round((n || 0) * 100); }
function num(n = 0) { return new Intl.NumberFormat().format(n || 0); }

export default function ComparePlayers() {
  const [loading, setLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState([]); // up to 4 rows from DB

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("player_stats")
          .select(
            "user_id, username, avatar_url, games_count, achievements_unlocked, achievements_total, completion, playtime_total, updated_at, steamid"
          )
          .order("achievements_unlocked", { ascending: false })
          .limit(200);
        if (error) throw error;
        setAllPlayers(data || []);
      } catch (e) {
        console.error(e);
        setAllPlayers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const ids = new Set(selected.map((p) => p.user_id));
    return (allPlayers || [])
      .filter((p) =>
        !term ? true : (p.username || "Player").toLowerCase().includes(term)
      )
      .filter((p) => !ids.has(p.user_id));
  }, [allPlayers, q, selected]);

  const add = (p) =>
    setSelected((s) => (s.length >= 4 ? s : [...s, p]));
  const remove = (id) =>
    setSelected((s) => s.filter((x) => x.user_id !== id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: player picker */}
      <div className="glass-effect rounded-xl p-5">
        <h3 className="text-2xl font-semibold mb-4">Add Players</h3>

        <div className="mb-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search players..."
            className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 outline-none"
          />
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
          {loading ? (
            <div className="opacity-70">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="opacity-70">No players found.</div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.user_id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar p={p} />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.username || "Player"}</div>
                    <div className="text-xs opacity-70 truncate">
                      {num(p.achievements_unlocked)} achievements
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => add(p)}
                  disabled={selected.length >= 4}
                >
                  +
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: compare panel */}
      <div className="glass-effect rounded-xl p-5">
        {selected.length === 0 ? (
          <div className="h-full min-h-[50vh] flex items-center justify-center text-center opacity-70">
            <div>
              <div className="text-2xl font-semibold mb-2">Select Players to Compare</div>
              <div>Add up to 4 players from the list on the left.</div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* selected chips */}
            <div className="flex flex-wrap gap-3">
              {selected.map((p) => (
                <div
                  key={p.user_id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10"
                >
                  <Avatar p={p} size={20} />
                  <span className="text-sm">{p.username || "Player"}</span>
                  <button
                    onClick={() => remove(p.user_id)}
                    className="text-xs opacity-70 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* side-by-side stats */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard title="Achievements" values={selected.map((p) => p.achievements_unlocked)} labels={selected} />
              <StatCard title="Total Achievements" values={selected.map((p) => p.achievements_total)} labels={selected} />
              <StatCard title="Completion" values={selected.map((p) => pct(p.completion))} labels={selected} suffix="%" />
              <StatCard title="Games" values={selected.map((p) => p.games_count)} labels={selected} />
              <StatCard title="Playtime (hrs)" values={selected.map((p) => hours(p.playtime_total))} labels={selected} />
            </div>

            {/* simple table view */}
            <div className="overflow-auto rounded-lg border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-sm">
                  <tr>
                    <Th>Player</Th>
                    <Th>Games</Th>
                    <Th>Unlocked</Th>
                    <Th>Total</Th>
                    <Th>Completion</Th>
                    <Th>Playtime (hrs)</Th>
                  </tr>
                </thead>
                <tbody>
                  {selected.map((p) => (
                    <tr key={p.user_id} className="border-t border-white/5">
                      <Td>
                        <div className="flex items-center gap-3">
                          <Avatar p={p} />
                          <div className="font-medium">{p.username || "Player"}</div>
                        </div>
                      </Td>
                      <Td>{num(p.games_count)}</Td>
                      <Td className="font-semibold">{num(p.achievements_unlocked)}</Td>
                      <Td>{num(p.achievements_total)}</Td>
                      <Td>{pct(p.completion)}%</Td>
                      <Td>{hours(p.playtime_total)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ p, size = 32 }) {
  // Prefer Steam avatar if present; else stored avatar_url; else fallback circle
  const src =
    (p.avatar_url && p.avatar_url.startsWith("http") && p.avatar_url) ||
    null;
  return src ? (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="rounded-full bg-white/10"
      style={{ width: size, height: size }}
    />
  );
}

function StatCard({ title, values, labels, suffix = "" }) {
  const max = Math.max(1, ...values.map((v) => Number(v) || 0));
  return (
    <div className="p-4 rounded-lg bg-white/5">
      <div className="opacity-80 mb-3">{title}</div>
      <div className="space-y-3">
        {values.map((v, i) => {
          const w = Math.max(4, Math.round((Number(v) || 0) * 100 / max));
          return (
            <div key={labels[i].user_id}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="truncate max-w-[60%]">{labels[i].username || "Player"}</div>
                <div className="opacity-80">{num(v)}{suffix}</div>
              </div>
              <div className="h-2 bg-white/10 rounded">
                <div className="h-2 rounded bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${w}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Th({ children }) { return <th className="px-4 py-3 font-semibold">{children}</th>; }
function Td({ children }) { return <td className="px-4 py-3">{children}</td>; }
