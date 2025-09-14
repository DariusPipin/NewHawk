import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import RarityDistribution from "@/components/RarityDistribution";

const FUNCTION_SLUG = import.meta.env.VITE_FUNCTION_SLUG || "hyper-service";

function pct(n, d) { return d ? Math.round((n * 100) / d) : 0; }

function aggregate(games) {
  const totalUnlocked = games.reduce((s,g)=>s+(g.achievements_unlocked||0),0);
  const gamerscore = totalUnlocked; // Steam proxy
  const unlocked = games.flatMap(g => (g.achievements_detail||[]).map(a=>a));
  const buckets = { common:0, uncommon:0, rare:0, epic:0, legendary:0 };
  for (const a of unlocked) {
    const p = a.global_percent;
    if (p == null) continue;
    if (p > 50) buckets.common++;
    else if (p > 25) buckets.uncommon++;
    else if (p > 10) buckets.rare++;
    else if (p > 5)  buckets.epic++;
    else             buckets.legendary++;
  }
  const rareAchievements = buckets.rare + buckets.epic + buckets.legendary;
  const metaTrophies = games.filter(g => g.achievements_total>0 && g.achievements_unlocked===g.achievements_total).length;

  // streak by unique days with unlocks
  const days = new Set(unlocked.filter(a=>a.unlocktime).map(a => new Date(a.unlocktime*1000).toISOString().slice(0,10)));
  const today = new Date(); today.setHours(0,0,0,0);
  const iso = d => new Date(d).toISOString().slice(0,10);
  let streak = 0;
  for (let d=new Date(today); days.has(iso(d)); d.setDate(d.getDate()-1)) streak++;

  const denom = Object.values(buckets).reduce((a,b)=>a+b,0);
  const rarity = {
    common: pct(buckets.common,denom),
    uncommon: pct(buckets.uncommon,denom),
    rare: pct(buckets.rare,denom),
    epic: pct(buckets.epic,denom),
    legendary: pct(buckets.legendary,denom),
  };

  return { totalUnlocked, gamerscore, rareAchievements, metaTrophies, rarity, streak };
}

export default function Dashboard() {
  const [metrics,setMetrics] = useState(null);
  const [name,setName] = useState("Player");

  useEffect(()=>{(async()=>{
    const { data:{ user } } = await supabase.auth.getUser();
    setName(user?.user_metadata?.username || user?.email || "Player");
    // find steamid
    let steamid = user?.user_metadata?.steamid;
    if (!steamid) {
      const key = user ? `steamid:${user.id}` : `steamid:${localStorage.getItem('anon_id')||''}`;
      steamid = localStorage.getItem(key) || "";
    }
    if (!steamid) { setMetrics({totalUnlocked:0,gamerscore:0,rareAchievements:0,metaTrophies:0,rarity:{common:0,uncommon:0,rare:0,epic:0,legendary:0},streak:0}); return; }

    const { data, error } = await supabase.functions.invoke(FUNCTION_SLUG, {
      body:{ endpoint:'games-achievements', steamid, playedOnly:true, max:200, concurrency:5, detail:true }
    });
    if (error) throw error;
    const games = (data?.results||[]);
    setMetrics(aggregate(games));
  })().catch(console.error)},[]);

  if (!metrics) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-bold animated-gradient-text">Welcome back, {name}!</h1>
        <p className="text-gray-400 text-lg">Here's your aggregated gaming universe.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Achievements" value={metrics.totalUnlocked}/>
        <Card title="Total Gamerscore" value={metrics.gamerscore} accent="text-green-400"/>
        <Card title="Rare Achievements" value={metrics.rareAchievements} accent="text-purple-300"/>
        <Card title="Meta Trophies" value={metrics.metaTrophies} accent="text-orange-300"/>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      <RarityDistribution rarity={metrics.rarity} />

        <div className="glass-effect rounded-xl p-6 flex items-center justify-center">
          <Ring value={metrics.streak}/>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, accent }) {
  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="opacity-70 mb-2">{title}</div>
      <div className={`text-5xl font-bold ${accent||"text-blue-300"}`}>{value}</div>
    </div>
  );
}

function Ring({ value }) {
  const deg = Math.min(360, (value % 100) * 3.6);
  return (
    <div className="text-center">
      <div
        className="h-40 w-40 rounded-full mx-auto mb-3"
        style={{ background: `conic-gradient(#f97316 ${deg}deg, #1f2937 0)` }}
      >
        <div className="h-36 w-36 rounded-full bg-[#111827] m-2 flex items-center justify-center text-4xl font-bold">
          {value}
        </div>
      </div>
      <div className="opacity-70">day streak</div>
    </div>
  );
}
