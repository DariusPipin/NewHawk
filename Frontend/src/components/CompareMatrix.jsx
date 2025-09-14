import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  Radar,
} from "recharts";

function clamp(v, lo, hi) {
  const n = Number.isFinite(v) ? v : 0;
  return Math.max(lo, Math.min(hi, n));
}

export default function CompareMatrix({ users = [], gameFilter = "all" }) {
  // 1) Define metrics shown on the radar
  const metrics = [
    { key: "totalAchievements", label: "Achievements" },
    { key: "gamerscore",        label: "Gamerscore" },
    { key: "rareCount",         label: "Rare Unlocks" },
    { key: "metaTrophies",      label: "Meta Trophies" },
    { key: "completion",        label: "Completion %" },
  ];

  // 2) Build a safe series map: { key: 'u_<id>', label: username }
  const series = useMemo(
    () =>
      users.map(u => ({
        key: `u_${u.id}`,       // safe, stable dataKey
        label: u.username || "Player",
        color: undefined,       // filled below
      })),
    [users]
  );

  // 3) Colors (supports up to 4 players)
  const palette = ["#6b8afd", "#4ad69d", "#ffc658", "#ff8042"];
  series.forEach((s, i) => (s.color = palette[i % palette.length]));

  // 4) Value accessor with light scaling when a game is selected
  const getValue = (u, k) => {
    const raw = clamp(u?.[k] ?? 0, 0, 1e12); // guard against NaN/undefined
    if (gameFilter === "all") return raw;
    return k === "completion" ? Math.floor(raw * 0.9) : Math.floor(raw * 0.6);
  };

  // 5) Per-metric max for normalization (avoid divide-by-zero with fallback 1)
  const maxByMetric = metrics.reduce((acc, m) => {
    const max = Math.max(
      1,
      ...users.map(u => getValue(u, m.key))
    );
    acc[m.key] = max;
    return acc;
  }, {});

  // 6) Build radar data rows. Each row has:
  //    { subject: 'Label', u_<id1>: pct, u_<id2>: pct, ... }
  const data = metrics.map(m => {
    const row = { subject: m.label };
    users.forEach((u, i) => {
      const val = getValue(u, m.key);
      const pct = Math.round((val / maxByMetric[m.key]) * 100);
      row[series[i].key] = clamp(pct, 0, 100);
    });
    return row;
  });

  // 7) Render
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="w-full h-[380px] md:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="85%" data={data}>
            <PolarGrid stroke="var(--color-border-glass)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
            {series.map(s => (
              <Radar
                key={s.key}
                name={s.label}            // legend label
                dataKey={s.key}           // SAFE key in data rows
                stroke={s.color}
                fill={s.color}
                fillOpacity={0.55}
              />
            ))}
            <Legend
              formatter={(value) => {
                // Recharts passes dataKey here; map it back to the username label
                const found = series.find(s => s.key === value);
                return found?.label ?? value;
              }}
              wrapperStyle={{ color: "var(--color-text-base)", paddingTop: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "var(--color-background-glass)",
                borderColor: "var(--color-border-glass)",
                borderRadius: 8,
                color: "var(--color-text-base)",
              }}
              labelStyle={{ color: "var(--color-text-base)" }}
              formatter={(value, name) => {
                // name is dataKey (u_<id>); show username in tooltip
                const found = series.find(s => s.key === name);
                return [value, found?.label ?? name];
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
