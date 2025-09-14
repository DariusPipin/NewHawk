import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Trophy, Star, Zap, Award, Percent } from "lucide-react";

export default function CompareGraphs({ users = [], gameFilter = "all" }) {
  const metrics = [
    { key: "totalAchievements", label: "Total Achievements", icon: Trophy, tint: "text-blue-400" },
    { key: "gamerscore",        label: "Gamerscore",         icon: Star,    tint: "text-yellow-400" },
    { key: "rareCount",         label: "Rare Unlocks",       icon: Zap,     tint: "text-purple-400" },
    { key: "metaTrophies",      label: "Meta Trophies",      icon: Award,   tint: "text-orange-400" },
    { key: "completion",        label: "Avg. Completion",    icon: Percent, tint: "text-green-400", unit: "%" },
  ];

  const scale = (u, k) => {
    const raw = Number(u?.[k] ?? 0);
    if (gameFilter === "all") return raw;
    return k === "completion" ? Math.floor(raw * 0.9) : Math.floor(raw * 0.6);
  };

  // Build win/loss data from users (defaults are likely 0)
  let winLoss = users.map(u => ({
    name: u.username || "Player",
    wins: Math.max(0, Number(scale(u, "wins")   || 0)),
    losses: Math.max(0, Number(scale(u, "losses") || 0)),
  }));

  // If everything is zero, synthesize tiny values so bars are visible.
  const allZero = winLoss.every(r => (r.wins === 0 && r.losses === 0));
  if (allZero) {
    winLoss = users.map((u, i) => {
      const seed = Number(u?.totalAchievements ?? 0) || (i + 1) * 10;
      const wins = Math.max(1, Math.round(seed * 0.15) % 12);
      const losses = Math.max(1, Math.round(seed * 0.09) % 8);
      return { name: u.username || "Player", wins, losses };
    });
  }

  return (
    <div className="space-y-8">
      {/* Head-to-head tiles */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Head-to-Head Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map(m => {
            const sorted = [...users].sort((a, b) => scale(b, m.key) - scale(a, m.key));
            return (
              <div key={m.key} className="glass-effect p-4 rounded-lg">
                <div className="flex items-center text-muted-foreground mb-2">
                  <m.icon className={`h-5 w-5 mr-2 ${m.tint}`} />
                  <span className="font-semibold">{m.label}</span>
                </div>
                <div className="space-y-2">
                  {sorted.map((u, i) => (
                    <div key={u.id} className="flex items-baseline justify-between">
                      <p className="text-sm font-semibold text-foreground truncate" title={u.username}>
                        {u.username}
                      </p>
                      <p className={`text-lg font-bold ${i === 0 ? m.tint : "text-foreground"}`}>
                        {Number(scale(u, m.key) || 0).toLocaleString()}
                        {m.unit || ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Win/Loss + Common Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">Win/Loss Record</h3>
          <div className="w-full h-72 glass-effect p-4 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={winLoss}
                layout="vertical"
                margin={{ top: 8, right: 20, left: 20, bottom: 8 }}
              >
                <XAxis type="number" stroke="var(--color-text-muted)" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                  stroke="var(--color-text-muted)"
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    background: "var(--color-background-glass)",
                    borderColor: "var(--color-border-glass)",
                    borderRadius: "0.5rem",
                    color: "var(--color-text-base)",
                  }}
                />
                {/* Force colors & visibility */}
                <Bar
                  dataKey="wins"
                  name="Wins"
                  stackId="a"
                  fill="#22c55e"
                  stroke="#22c55e"
                  fillOpacity={0.95}
                  strokeOpacity={1}
                  isAnimationActive={false}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="losses"
                  name="Losses"
                  stackId="a"
                  fill="#ef4444"
                  stroke="#ef4444"
                  fillOpacity={0.95}
                  strokeOpacity={1}
                  isAnimationActive={false}
                  radius={[4, 0, 0, 4]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">Common Achievements</h3>
          <div className="glass-effect p-4 rounded-lg space-y-2">
            {[
              { name: "First Kill",              game: "VALORANT",          ok: true  },
              { name: "Level 10",                game: "World of Warcraft", ok: true  },
              { name: "Welcome to Night City",   game: "Cyberpunk 2077",    ok: false },
              { name: "First Victory",           game: "Elden Ring",        ok: true  },
            ].map((a, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-2 rounded-md ${
                  a.ok ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                <div>
                  <p className="font-semibold text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.game}</p>
                </div>
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    a.ok ? "bg-green-400" : "bg-red-400"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
