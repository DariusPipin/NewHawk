import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, X, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import CompareMatrix from "@/components/CompareMatrix";
import CompareGraphs from "@/components/CompareGraphs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Shapes a row from `player_stats` into the fields the new UI charts expect.
 * The DB has: achievements_unlocked, achievements_total, completion(0..1), etc.
 * The charts expect: totalAchievements, gamerscore, rareCount, metaTrophies,
 * completion (0..100), wins, losses, plus id/username/avatar/platforms.
 */
function normalizeRow(row) {
  const completionPct = Math.round(Number(row?.completion || 0) * 100);
  const unlocked = Number(row?.achievements_unlocked || 0);

  return {
    id: row.user_id,
    username: row.username || "Player",
    avatar: row.avatar_url || "",
    platforms: row.steamid ? ["Steam"] : [],
    totalAchievements: unlocked,
    gamerscore: unlocked,          // Steam proxy
    rareCount: 0,                  // not tracked in this table
    metaTrophies: 0,               // not tracked in this table
    completion: completionPct,     // 0..100 for charts
    wins: 0,                       // optional; not tracked → default 0
    losses: 0,                     // optional; not tracked → default 0

    // keep a few raw fields if you want to show them elsewhere
    games_count: Number(row?.games_count || 0),
    achievements_total: Number(row?.achievements_total || 0),
    playtime_total: Number(row?.playtime_total || 0),
    updated_at: row.updated_at,
  };
}

const Compare = () => {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [gameFilter, setGameFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [allPlayers, setAllPlayers] = useState([]);        // raw rows
  const [selectedUsers, setSelectedUsers] = useState([]);  // normalized users

  // Load players from DB once
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("player_stats")
          .select(
            "user_id, username, avatar_url, steamid, games_count, achievements_unlocked, achievements_total, completion, playtime_total, updated_at"
          )
          .order("achievements_unlocked", { ascending: false })
          .limit(200);

        if (error) throw error;
        setAllPlayers(data || []);
      } catch (e) {
        console.error(e);
        toast({
          title: "Failed to load players",
          description: String(e.message || e),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  // Filter left-hand list (exclude already selected)
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const picked = new Set(selectedUsers.map((u) => u.id));
    return (allPlayers || [])
      .filter((u) =>
        term ? (u.username || "Player").toLowerCase().includes(term) : true
      )
      .filter((u) => !picked.has(u.user_id));
  }, [allPlayers, searchTerm, selectedUsers]);

  const addUser = (row) => {
    if (selectedUsers.length >= 4) {
      toast({
        title: "Maximum Reached",
        description: "You can compare up to 4 users at once.",
        variant: "destructive",
      });
      return;
    }
    setSelectedUsers((s) => [...s, normalizeRow(row)]);
    setSearchTerm("");
  };

  const removeUser = (userId) => {
    setSelectedUsers((s) => s.filter((u) => u.id !== userId));
  };

  const getPlatformDotClass = (p) => {
    const k = p.toLowerCase();
    if (k.includes("steam")) return "bg-blue-500";
    if (k.includes("xbox")) return "bg-green-500";
    if (k.includes("riot")) return "bg-red-500";
    if (k.includes("wow")) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const mockGames = ["all", "Cyberpunk 2077", "Elden Ring", "VALORANT"];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold animated-gradient-text">Player Showdown</h1>
        <p className="text-muted-foreground text-lg">
          Who will claim the ultimate bragging rights?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: search & add */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4"
        >
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" /> Add Challengers
            </h3>

            <div className="relative">
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              <AnimatePresence>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 rounded-lg bg-white/5 border border-white/10 animate-pulse"
                    />
                  ))
                ) : filteredUsers.length === 0 ? (
                  <div className="text-sm text-muted-foreground px-2 py-6 text-center">
                    No players found.
                  </div>
                ) : (
                  filteredUsers.map((row) => (
                    <motion.div
                      key={row.user_id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center justify-between p-2 bg-background/30 rounded-lg hover:bg-background/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        {row.avatar_url ? (
                          <img
                            alt=""
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            src={row.avatar_url}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10" />
                        )}
                        <p
                          className="font-semibold text-foreground truncate"
                          title={row.username || "Player"}
                        >
                          {row.username || "Player"}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        onClick={() => addUser(row)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 w-8 flex-shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Right: selections + charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8"
        >
          <div className="glass-effect rounded-xl p-6 min-h-[400px] flex flex-col">
            {/* selected avatars */}
            <div className="flex justify-center items-start gap-4 relative mb-4">
              <AnimatePresence>
                {selectedUsers.map((u) => (
                  <motion.div
                    key={u.id}
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative flex flex-col items-center group w-24"
                  >
                    {u.avatar ? (
                      <img
                        alt=""
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-border ring-4 ring-transparent group-hover:ring-primary transition-all"
                        src={u.avatar}
                      />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-border bg-white/5" />
                    )}
                    <p className="font-bold text-foreground mt-2 text-center w-full truncate">
                      {u.username}
                    </p>
                    <div className="flex space-x-1 mt-1">
                      {u.platforms.map((p) => (
                        <div
                          key={p}
                          title={p}
                          className={`w-3 h-3 rounded-full ${getPlatformDotClass(p)}`}
                        />
                      ))}
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeUser(u.id)}
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {selectedUsers.length > 0 && selectedUsers.length < 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-muted-foreground"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-dashed border-border flex items-center justify-center">
                    <Plus className="h-8 w-8" />
                  </div>
                  <p className="font-bold mt-2">Add Player</p>
                </motion.div>
              )}
            </div>

            {/* game filter */}
            {selectedUsers.length >= 2 && (
              <div className="flex justify-center mb-6">
                <Select value={gameFilter} onValueChange={setGameFilter}>
                  <SelectTrigger className="w-[280px] bg-background/50 border-border">
                    <Gamepad2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by game" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGames.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g === "all" ? "All Games" : g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* empty state */}
            {selectedUsers.length < 2 && (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-muted-foreground">
                <Users className="h-16 w-16 mb-4" />
                <h3 className="text-xl font-semibold text-foreground">
                  Select players to begin
                </h3>
                <p>Add 2 to 4 players for a full comparison.</p>
              </div>
            )}

            {/* charts */}
            <AnimatePresence>
              {selectedUsers.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex-grow space-y-8"
                >
                  <CompareMatrix users={selectedUsers} gameFilter={gameFilter} />
                  <CompareGraphs users={selectedUsers} gameFilter={gameFilter} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Compare;
