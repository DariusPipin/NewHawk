import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trophy, Star, Clock, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const FUNCTION_SLUG = import.meta.env.VITE_FUNCTION_SLUG || 'hyper-service';
const AUTH_SLUG     = import.meta.env.VITE_STEAM_AUTH_SLUG || 'smart-action';

/* ---------- helpers ---------- */
function functionsBase() {
  const manual = import.meta.env.VITE_SUPABASE_FUNCTION_URL;
  if (manual) return manual.replace(/\/+$/, '');
  const host = new URL(import.meta.env.VITE_SUPABASE_URL).host.replace('.supabase.co', '.functions.supabase.co');
  return `https://${host}`;
}
function relFromEpoch(sec){
  if(!sec) return 'never';
  const d=Date.now()-sec*1000, m=Math.floor(d/60000);
  if(m<60) return `${m} min${m!==1?'s':''} ago`;
  const h=Math.floor(m/60); if(h<24) return `${h} hour${h!==1?'s':''} ago`;
  const days=Math.floor(h/24); return `${days} day${days!==1?'s':''} ago`;
}
function SteamImage({ appid, iconHash, logoHash, alt, className }) {
  const base = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}`;
  const comm = `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}`;
  const list = [
    `${base}/capsule_616x353.jpg`,
    `${base}/header.jpg`,
    `${base}/library_hero.jpg`,
    `${base}/library_600x900.jpg`,
    iconHash ? `${comm}/${iconHash}.jpg` : null,
    logoHash ? `${comm}/${logoHash}.jpg` : null,
    'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd'
  ].filter(Boolean);
  const [i,setI]=useState(0);
  return (
    <img
      alt={alt}
      className={className}
      src={list[i]}
      onError={()=>setI(v=>Math.min(v+1,list.length-1))}
      loading="lazy"
      decoding="async"
    />
  );
}
const cardVariants={ hidden:{opacity:0,y:20}, visible:i=>({opacity:1,y:0,transition:{delay:i*0.05,type:'spring',stiffness:100}}) };

/* ---------- data ---------- */
async function fetchGamesViaInvoke(steamid) {
  const { data, error } = await supabase.functions.invoke(FUNCTION_SLUG, {
    body: { endpoint:'games-achievements', steamid, playedOnly:true, max:200, concurrency:5, detail:true }
  });
  if (error) throw error;
  return data;
}
async function fetchGamesViaFetch(steamid) {
  const base = functionsBase();
  const url = `${base}/${FUNCTION_SLUG}?endpoint=games-achievements&steamid=${encodeURIComponent(steamid)}&playedOnly=true&max=200&concurrency=5&detail=true`;
  const r = await fetch(url);
  const t = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${t}`);
  try { return JSON.parse(t); } catch { return t; }
}
function shapeGames(payload){
  const arr = (payload?.results ?? payload ?? []);
  return arr.map(g=>{
    const total=Number(g.achievements_total??0);
    const done=Number(g.achievements_unlocked??0);
    return {
      id:g.appid,
      name:g.name||`App ${g.appid}`,
      platform:'Steam',
      achievementsTotal: total,
      achievementsDone: done,
      completion: total ? done/total : 0,
      lastPlayed: relFromEpoch(g.rtime_last_played),
      lastPlayedEpoch: g.rtime_last_played ?? 0,
      iconHash: g.img_icon_url || null,
      logoHash: g.img_logo_url || null,
      playtime: g.playtime_forever ?? 0,
    };
  });
}

/* ---------- component ---------- */
export default function Games(){
  const { toast } = useToast();
  const [steamId,setSteamId]=useState('');
  const [games,setGames]=useState([]);
  const [loading,setLoading]=useState(true);
  const [searchTerm,setSearchTerm]=useState('');
  const [selectedPlatform,setSelectedPlatform]=useState('all');
  const [sortBy,setSortBy]=useState('recent');
  const [viewMode,setViewMode]=useState('grid');

  const platforms = useMemo(()=>['all', ...new Set(games.map(g=>g.platform))],[games]);
  const filteredSorted = useMemo(()=>{
    const term=searchTerm.trim().toLowerCase();
    let arr=games.filter(g=>(!term||g.name.toLowerCase().includes(term))&&(selectedPlatform==='all'||g.platform===selectedPlatform));
    if(sortBy==='recent') arr.sort((a,b)=>b.lastPlayedEpoch-a.lastPlayedEpoch);
    else if(sortBy==='achievements') arr.sort((a,b)=>(b.achievementsTotal-a.achievementsTotal)||(b.achievementsDone-a.achievementsDone));
    else if(sortBy==='completion') arr.sort((a,b)=>b.completion-a.completion);
    return arr;
  },[games,searchTerm,selectedPlatform,sortBy]);

  const nsKey = (uid) => `steamid:${uid || 'anon'}`;

  // Handle Steam OpenID callback and persist SteamID
  useEffect(()=>{
    (async () => {
      const url=new URL(window.location.href);
      const sid=url.searchParams.get('steamid');
      const status=url.searchParams.get('status');
      const state=url.searchParams.get('state');
      const expect=sessionStorage.getItem('steam_state')||'';
      const { data:{ user } } = await supabase.auth.getUser();

      if(status){
        if(status==='ok' && sid && (!expect || expect===state)){
          if (user) {
            try { await supabase.auth.updateUser({ data: { steamid: sid } }); } catch {}
            localStorage.setItem(nsKey(user.id), sid);
          } else {
            let anon = localStorage.getItem('anon_id');
            if (!anon) { anon = crypto.randomUUID(); localStorage.setItem('anon_id', anon); }
            localStorage.setItem(nsKey(anon), sid);
          }
          setSteamId(sid);
        }else{
          toast({title:'Steam sign-in failed',description:'Try again.'});
        }
        url.searchParams.delete('steamid');url.searchParams.delete('status');url.searchParams.delete('state');
        window.history.replaceState({},'',url.toString());
        return;
      }

      if (user?.user_metadata?.steamid) setSteamId(user.user_metadata.steamid);
      else if (user) {
        const saved = localStorage.getItem(nsKey(user.id)) || '';
        setSteamId(saved || '');
      } else {
        const anon = localStorage.getItem('anon_id') || '';
        const saved = anon ? localStorage.getItem(nsKey(anon)) : '';
        setSteamId(saved || '');
      }
    })();
  },[toast]);

  // Fetch Steam data and upsert aggregate leaderboard row with Steam avatar/persona
  useEffect(()=>{
    if(!steamId) { setLoading(false); return; }
    (async()=>{
      try{
        setLoading(true);
        let payload;
        try { payload = await fetchGamesViaInvoke(steamId); }
        catch { payload = await fetchGamesViaFetch(steamId); }
        const shaped = shapeGames(payload);
        setGames(shaped);

        const totals = shaped.reduce((a,g)=>({
          games_count: a.games_count+1,
          achievements_unlocked: a.achievements_unlocked + (g.achievementsDone||0),
          achievements_total:    a.achievements_total    + (g.achievementsTotal||0),
          playtime_total:        a.playtime_total        + (g.playtime||0)
        }), { games_count:0, achievements_unlocked:0, achievements_total:0, playtime_total:0 });
        const completion = totals.achievements_total ? totals.achievements_unlocked / totals.achievements_total : 0;

        // fetch Steam persona + avatar
        let persona = null, avatarfull = null;
        try {
          const { data: p } = await supabase.functions.invoke(FUNCTION_SLUG, {
            body: { endpoint: 'player', steamid: steamId }
          });
          persona    = p?.personaname || null;
          avatarfull = p?.avatarfull || p?.avatarmedium || p?.avatar || null;
        } catch {}

        const { data:{ user } } = await supabase.auth.getUser();
        const username   = persona || user?.user_metadata?.username || user?.email || 'Player';
        const avatar_url = avatarfull || user?.user_metadata?.avatar_url || null;

        if (user) {
          await supabase.from('player_stats').upsert({
            user_id: user.id,
            username,
            steamid: steamId,
            avatar_url,
            games_count: totals.games_count,
            achievements_unlocked: totals.achievements_unlocked,
            achievements_total: totals.achievements_total,
            completion,
            playtime_total: totals.playtime_total,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        }
      }catch(e){
        console.error(e);
        toast({title:'Fetch failed',description:String(e.message||e)});
      }finally{
        setLoading(false);
      }
    })();
  },[steamId,toast]);

  function startSteamLogin(){
    const base=functionsBase();
    const state=crypto.randomUUID();
    sessionStorage.setItem('steam_state',state);
    const redirect=window.location.origin;
    const url=`${base}/${AUTH_SLUG}?action=start&redirect_uri=${encodeURIComponent(redirect)}&state=${encodeURIComponent(state)}`;
    window.location.href=url;
  }

  if(!steamId){
    return (
      <div className="max-w-xl mx-auto text-center space-y-6">
        <h1 className="text-5xl font-bold animated-gradient-text">Sign in with Steam</h1>
        <p className="text-gray-400">Connect Steam to load your games and achievements.</p>
        <Button size="lg" onClick={startSteamLogin}>
          <img alt="" src="https://community.cloudflare.steamstatic.com/public/shared/images/header/globalheader_logo.png" className="h-5 mr-2" />
          Continue with Steam
        </Button>
      </div>
    );
  }

  if(loading){
    return (
      <div className="space-y-8">
        <div><h1 className="text-5xl font-bold animated-gradient-text mb-2">Your Game Library</h1>
        <p className="text-gray-400 text-lg">Loading achievements…</p></div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({length:6}).map((_,i)=>(<div key={i} className="glass-effect rounded-xl overflow-hidden animate-pulse"><div className="h-48 bg-white/5"/><div className="p-5 space-y-3"><div className="h-6 bg-white/5 rounded"/><div className="h-3 bg-white/5 rounded w-2/3"/><div className="h-2.5 bg-white/5 rounded"/></div></div>))}
        </div>
      </div>
    );
  }

  const handleGameClick = () => {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-bold animated-gradient-text mb-2">Your Game Library</h1>
        <p className="text-gray-400 text-lg">Explore and track achievements across your collection.</p>
      </div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="glass-effect rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <input type="text" placeholder="Search games..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-transparent border-none rounded-lg text-white placeholder-gray-400 focus:outline-none"/>
          </div>
          <div className="flex items-center gap-2">
            {platforms.map(p=>(
              <Button key={p} onClick={()=>setSelectedPlatform(p)} variant={selectedPlatform===p?'secondary':'ghost'} size="sm" className={`capitalize ${selectedPlatform===p?'bg-white/10':''}`}>{p}</Button>
            ))}
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-4 py-2 bg-transparent border-none rounded-lg text-white focus:outline-none">
            <option value="recent" className="bg-gray-800">Recently Played</option>
            <option value="achievements" className="bg-gray-800">Most Achievements</option>
            <option value="completion" className="bg-gray-800">Completion Rate</option>
          </select>
          <div className="flex items-center gap-2">
            <Button onClick={()=>setViewMode('grid')} variant={viewMode==='grid'?'secondary':'ghost'} size="icon" className={viewMode==='grid'?'bg-white/10':''}><LayoutGrid/></Button>
            <Button onClick={()=>setViewMode('list')} variant={viewMode==='list'?'secondary':'ghost'} size="icon" className={viewMode==='list'?'bg-white/10':''}><List/></Button>
          </div>
        </div>
      </motion.div>

      <motion.div layout className={`grid gap-6 ${viewMode==='grid'?'grid-cols-1 md:grid-cols-2 xl:grid-cols-3':'grid-cols-1'}`}>
        {filteredSorted.map((game, index) => {
          const pct = game.achievementsTotal ? (game.achievementsDone / game.achievementsTotal) * 100 : 0;
          return (
            <motion.div
              layout
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              key={game.id}
              onClick={handleGameClick}
              className="glass-effect rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-blue-500 hover:bg-white/10"
            >
              <div className="relative h-48">
                <SteamImage appid={game.id} iconHash={game.iconHash} logoHash={game.logoHash} alt={`${game.name} cover`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                <div className="absolute top-0 right-0 m-3 px-2 py-1 rounded-full text-xs font-bold text-white/90 backdrop-blur-md bg-black/30 capitalize">{game.platform}</div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white truncate mb-2">{game.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><Trophy className="h-4 w-4 text-blue-400" />Achievements</span>
                    <span className="text-white font-semibold">{game.achievementsDone}/{game.achievementsTotal}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                    <motion.div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8,delay:0.2}}/>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-400" />Rarest: —</span>
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{game.lastPlayed}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
