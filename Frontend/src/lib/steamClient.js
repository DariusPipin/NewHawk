import { supabase } from '@/lib/supabaseClient';

// If your Edge Function reads query params, keep using them:
export async function getAchievements(steamid, appid) {
  const { data, error } = await supabase.functions.invoke('steam', {
    // pass as JSON body (recommended). Update your function to read req.json().
    body: { endpoint: 'achievements', steamid, appid }
  });
  if (error) throw error;
  return data;
}

export async function getOwnedGames(steamid) {
  const { data, error } = await supabase.functions.invoke('steam', {
    body: { endpoint: 'owned-games', steamid }
  });
  if (error) throw error;
  return data;
}