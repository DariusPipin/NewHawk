import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, X, Trophy, Star, Zap, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import CompareMatrix from '@/components/CompareMatrix';

const Compare = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const mockUsers = [
    { id: 1, username: 'GamerPro2024', avatar: 'Gaming enthusiast with headset', totalAchievements: 1247, gamerscore: 45230, rareCount: 89, platforms: ['Steam', 'Xbox', 'WoW'] },
    { id: 2, username: 'AchievementHunter', avatar: 'Trophy collector avatar', totalAchievements: 2156, gamerscore: 67890, rareCount: 156, platforms: ['Steam', 'Xbox', 'Riot'] },
    { id: 3, username: 'CasualGamer', avatar: 'Relaxed gamer with controller', totalAchievements: 567, gamerscore: 23450, rareCount: 34, platforms: ['Xbox', 'WoW'] },
    { id: 4, username: 'CompetitivePlayer', avatar: 'Esports player in action', totalAchievements: 1834, gamerscore: 56780, rareCount: 123, platforms: ['Steam', 'Riot'] },
    { id: 5, username: 'RaidLeader', avatar: 'Fantasy warrior avatar', totalAchievements: 2500, gamerscore: 75000, rareCount: 200, platforms: ['WoW', 'Steam'] },
    { id: 6, username: 'SoloQueueHero', avatar: 'Cyberpunk style character', totalAchievements: 980, gamerscore: 32000, rareCount: 50, platforms: ['Riot'] },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedUsers.find(selected => selected.id === user.id)
  );

  const addUser = (user) => {
    if (selectedUsers.length >= 4) {
      toast({ title: "Maximum Reached", description: "You can compare up to 4 users at once.", variant: "destructive" });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };
  
  const getPlatformClass = (platform) => `platform-${platform.toLowerCase()}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-bold animated-gradient-text mb-2">Compare Players</h1>
        <p className="text-gray-400 text-lg">See how you stack up against the competition.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-8">
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><Users className="h-5 w-5 mr-2 text-blue-400" />Add Players</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search players..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id} layout
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img alt={user.avatar} className="w-10 h-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1588990779542-ddd8b7b07476" />
                    <div>
                      <div className="font-semibold text-white">{user.username}</div>
                      <div className="text-xs text-gray-400">{user.totalAchievements} achievements</div>
                    </div>
                  </div>
                  <Button size="icon" onClick={() => addUser(user)} className="bg-blue-600 hover:bg-blue-700 h-8 w-8 shrink-0"><Plus className="h-4 w-4" /></Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          {selectedUsers.length === 0 ? (
            <div className="glass-effect rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
              <Users className="h-20 w-20 text-gray-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-300 mb-2">Select Players to Compare</h3>
              <p className="text-gray-400 max-w-sm">Add up to 4 players from the list on the left to see a detailed comparison of their gaming stats.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Selected Players ({selectedUsers.length}/4)</h3>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedUsers.map((user) => (
                    <motion.div layout key={user.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/5 rounded-lg p-4 relative group">
                      <Button size="icon" variant="destructive" onClick={() => removeUser(user.id)} className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></Button>
                      <div className="flex items-center space-x-4 mb-4">
                        <img alt={user.avatar} className="w-12 h-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1588990779542-ddd8b7b07476" />
                        <div>
                          <div className="font-bold text-white text-lg">{user.username}</div>
                          <div className="flex space-x-1 mt-1">
                            {user.platforms.map(platform => (<div key={platform} title={platform} className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${getPlatformClass(platform)}`}>{platform[0]}</div>))}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-xl font-bold text-blue-400">{user.totalAchievements}</div>
                          <div className="text-xs text-gray-400">Unlocks</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-green-400">{user.gamerscore.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">Score</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-purple-400">{user.rareCount}</div>
                          <div className="text-xs text-gray-400">Rare</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              {selectedUsers.length >= 2 && <CompareMatrix users={selectedUsers} />}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Compare;