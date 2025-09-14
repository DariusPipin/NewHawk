import React from "react";

export default function RarityDistribution({ rarity, height = 200 }) {
  const items = [
    { key: "common",    label: "Common",    color: "bg-blue-500",    val: rarity?.common ?? 0 },
    { key: "uncommon",  label: "Uncommon",  color: "bg-emerald-500", val: rarity?.uncommon ?? 0 },
    { key: "rare",      label: "Rare",      color: "bg-purple-500",  val: rarity?.rare ?? 0 },
    { key: "epic",      label: "Epic",      color: "bg-fuchsia-500", val: rarity?.epic ?? 0 },
    { key: "legendary", label: "Legendary", color: "bg-amber-500",   val: rarity?.legendary ?? 0 },
  ];
  const heightPct = v => `${Math.max(0, Math.min(100, v))}%`;

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6">Rarity Distribution</h3>

      {/* vertical bars */}
      <div className="w-full flex items-end justify-between gap-6" style={{ height }}>
        {items.map(i => (
          <div key={i.key} className="flex flex-col items-center gap-2 flex-1 h-full">
            <div className="relative w-10 sm:w-12 h-full rounded-md bg-white/5 ring-1 ring-white/10 overflow-hidden">
              <div
                className={`absolute bottom-0 left-0 w-full ${i.color}`}
                style={{ height: heightPct(i.val) }}
                title={`${i.label}: ${Math.round(i.val)}%`}
                aria-label={`${i.label} ${Math.round(i.val)} percent`}
              />
            </div>
            <div className="text-sm font-semibold">{Math.round(i.val)}%</div>
            <div className="text-xs opacity-70">{i.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
