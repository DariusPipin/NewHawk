import React from "react";
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

/** Bigger, cleaner radar that matches the mock. */
export default function CompareMatrix({ users, gameFilter }) {
  const metrics = [
    { key: "totalAchievements", label: "Achievements" },
    { key: "gamerscore", label: "Gamerscore" },
    { key: "rareCount", label: "Rare Unlocks" },
    { key: "metaTrophies", label: "Meta Trophies" },
    { key: "completion", label: "Completion %" },
  ];

  const getVal = (u, k) => {
    if (gameFilter === "all") return u[k] || 0;
    // light scaling when not “all”
    if (k === "completion") return Math.floor((u[k] || 0) * 0.9);
    return Math.floor((u[k] || 0) * 0.6);
  };

  const max = metrics.reduce((acc, m) => {
    acc[m.key] = Math.max(1, ...users.map((u) => getVal(u, m.key)));
    return acc;
  }, {});

  const data = metrics.map((m) => {
    const row = { subject: m.label };
    users.forEach((u) => {
      const v = getVal(u, m.key);
      row[u.username] = Math.round((v / max[m.key]) * 100);
    });
    return row;
  });

  const palette = ["#6b8afd", "#4ad69d", "#ffc658", "#ff8042"];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="w-full h-[300px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="var(--color-border-glass)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
            {users.map((u, i) => (
              <Radar
                key={u.id}
                name={u.username}
                dataKey={u.username}
                stroke={palette[i % palette.length]}
                fill={palette[i % palette.length]}
                fillOpacity={0.55}
              />
            ))}
            <Legend
              wrapperStyle={{
                color: "var(--color-text-base)",
                paddingTop: 14,
              }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-background-glass)",
                borderColor: "var(--color-border-glass)",
                borderRadius: 8,
                color: "var(--color-text-base)",
              }}
              labelStyle={{ color: "var(--color-text-base)" }}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
