import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trophy, Star, Clock, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Games = ({ linkedAccounts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const { toast } = useToast();

  const mockGames = [
    { id: 1, name: 'Cyberpunk 2077', platform: 'Steam', achievements: 180, completed: 120, rarest: 'V for Vendetta', lastPlayed: '1 hour ago', image: 'Futuristic open-world RPG in Night City' },
    { id: 2, name: 'VALORANT', platform: 'Riot', achievements: 55, completed: 45, rarest: 'Radiant Player', lastPlayed: '1 day ago', image: 'Tactical shooter with unique agents' },
    { id: 3, name: 'World of Warcraft', platform: 'WoW', achievements: 3500, completed: 2800, rarest: 'Gladiator', lastPlayed: '2 days ago', image: 'Fantasy MMORPG with epic adventures' },
    { id: 4, name: 'Forza Horizon 5', platform: 'Xbox', achievements: 150, completed: 140, rarest: 'Hall of Famer', lastPlayed: '4 days ago', image: 'Open-world racing game in Mexico' },
    { id: 5, name: 'Elden Ring', platform: 'Steam', achievements: 42, completed: 42, rarest: 'Elden Lord', lastPlayed: '1 week ago', image: 'Action RPG in a dark fantasy world' },
    { id: 6, name: 'League of Legends', platform: 'Riot', achievements: 120, completed: 90, rarest: 'Challenger Rank', lastPlayed: '2 weeks ago', image: 'Multiplayer online battle arena game' },
  ];

  const platforms = ['all', ...new Set(mockGames.map(g => g.platform))];

  const filteredGames = mockGames.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || game.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const handleGameClick = game => {
    toast({
      title: "🚧 Game Drill-in Coming Soon!",
      description: `A detailed view for ${game.name} isn't implemented yet, but you can request it next! 🚀`
    });
  };

  const getPlatformClass = (platform) => {
    return `platform-${platform.toLowerCase()}`;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.05, type: 'spring', stiffness: 100 }
    })
  };

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-5xl font-bold animated-gradient-text mb-2">Your Game Library</h1>
            <p className="text-gray-400 text-lg">Explore and track achievements across your entire collection.</p>
        </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search games..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-transparent border-none rounded-lg text-white placeholder-gray-400 focus:outline-none" />
          </div>
          
          <div className="flex items-center gap-2">
            {platforms.map(platform => (
              <Button key={platform} onClick={() => setSelectedPlatform(platform)} variant={selectedPlatform === platform ? "secondary" : "ghost"} size="sm" className={`capitalize ${selectedPlatform === platform ? 'bg-white/10' : ''}`}>
                {platform}
              </Button>
            ))}
          </div>
          
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2 bg-transparent border-none rounded-lg text-white focus:outline-none">
            <option value="recent" className="bg-gray-800">Recently Played</option>
            <option value="achievements" className="bg-gray-800">Most Achievements</option>
            <option value="completion" className="bg-gray-800">Completion Rate</option>
          </select>

          <div className="flex items-center gap-2">
            <Button onClick={() => setViewMode('grid')} variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className={viewMode === 'grid' ? 'bg-white/10' : ''}><LayoutGrid /></Button>
            <Button onClick={() => setViewMode('list')} variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className={viewMode === 'list' ? 'bg-white/10' : ''}><List /></Button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        layout
        className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
      >
        {filteredGames.map((game, index) => (
          <motion.div 
            layout 
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            key={game.id} 
            onClick={() => handleGameClick(game)} 
            className="glass-effect rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-blue-500 hover:bg-white/10"
          >
            <div className="relative h-48">
              <img alt={`${game.name} game cover`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" src="https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd" />
              <div className="absolute top-0 right-0 m-3 px-2 py-1 rounded-full text-xs font-bold text-white/90 backdrop-blur-md bg-black/30 capitalize">{game.platform}</div>
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-bold text-white truncate mb-2">{game.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Trophy className="h-4 w-4 text-blue-400" />Achievements</span>
                  <span className="text-white font-semibold">{game.completed}/{game.achievements}</span>
                </div>
                
                <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                    <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                        initial={{width: 0}}
                        animate={{width: `${(game.completed / game.achievements) * 100}%`}}
                        transition={{duration: 0.8, delay: 0.2}}
                    />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-400" />Rarest: {game.rarest}</span>
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{game.lastPlayed}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Games;