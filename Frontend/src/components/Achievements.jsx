
import React, { useState, useMemo, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Search, Award, CheckCircle, XCircle, Trophy, Star, Gamepad2, Zap } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    
    const mockGameAchievements = [
      { id: 'ga1', type: 'Game', name: "The Fool", game: "Cyberpunk 2077", unlocked: true, description: "Become a mercenary.", rarity: 95.5, platform: 'Steam', points: 10 },
      { id: 'ga2', type: 'Game', name: "The Lovers", game: "Cyberpunk 2077", unlocked: true, description: "Steal the Relic.", rarity: 80.1, platform: 'Steam', points: 15 },
      { id: 'ga3', type: 'Game', name: "V for Vendetta", game: "Cyberpunk 2077", unlocked: false, description: "After 'The Devil', attack Arasaka Tower.", rarity: 2.3, platform: 'Steam', points: 100 },
      { id: 'ga4', type: 'Game', name: "Elden Lord", game: "Elden Ring", unlocked: true, description: "Achieve the 'Elden Lord' ending.", rarity: 25.4, platform: 'Steam', points: 50 },
      { id: 'ga5', type: 'Game', name: "Welcome to the Clutch", game: "VALORANT", unlocked: true, description: "Win a 1v5 situation.", rarity: 1.2, platform: 'Riot', points: 75 },
      { id: 'ga6', type: 'Game', name: "Cutting Edge", game: "World of Warcraft", unlocked: false, description: "Defeat the final boss of the current raid tier on Mythic difficulty.", rarity: 0.5, platform: 'WoW', points: 200 },
      { id: 'ga7', type: 'Game', name: "Centurion", game: "Forza Horizon 5", unlocked: true, description: "Drive any car at 100mph for 10 seconds.", rarity: 88.0, platform: 'Xbox', points: 5 },
    ];
    
    const mockMetaBadges = [
        { id: 'ma1', type: 'Meta', name: 'Week Warrior', description: 'Maintain a 7-day achievement streak.', unlocked: true, rarity: 35, points: 50 },
        { id: 'ma2', type: 'Meta', name: 'Rare Hunter', description: 'Unlock 10 rare achievements (rarity < 10%).', unlocked: true, rarity: 15, points: 100 },
        { id: 'ma3', type: 'Meta', name: 'Marathoner', description: 'Complete a gaming session over 10 hours long.', unlocked: true, rarity: 22, points: 30 },
        { id: 'ma4', type: 'Meta', name: 'Platform Hopper', description: 'Link accounts from 3+ different platforms.', unlocked: true, rarity: 40, points: 40 },
        { id: 'ma5', type: 'Meta', name: 'Genre Master', description: 'Play games from 5+ different genres.', unlocked: false, rarity: 18, points: 50 },
        { id: 'ma6', type: 'Meta', name: 'Ascendant', description: 'Reach Ascendant rank in VALORANT.', unlocked: false, rarity: 5, points: 150 }
    ];
    
    const Achievements = ({ initialFilters = {} }) => {
        const [allAchievements, setAllAchievements] = useState([]);
        const [filters, setFilters] = useState({
            search: '',
            type: 'all',
            status: 'all',
            platform: 'all',
            rarity: 'all',
            ...initialFilters
        });
    
        useEffect(() => {
            const customAchievements = JSON.parse(localStorage.getItem('custom_achievements') || '[]').map(ach => ({ ...ach, type: 'Custom', rarity: -1 }));
            setAllAchievements([...mockGameAchievements, ...mockMetaBadges, ...customAchievements]);
        }, []);
    
        const handleFilterChange = (filterName, value) => {
            setFilters(prev => ({ ...prev, [filterName]: value }));
        };
    
        const filteredAchievements = useMemo(() => {
            return allAchievements.filter(ach => {
                const searchMatch = ach.name.toLowerCase().includes(filters.search.toLowerCase()) || ach.description.toLowerCase().includes(filters.search.toLowerCase());
                const typeMatch = filters.type === 'all' || ach.type === filters.type;
                const statusMatch = filters.status === 'all' || (filters.status === 'unlocked' && ach.unlocked) || (filters.status === 'locked' && !ach.unlocked);
                const platformMatch = filters.platform === 'all' || (ach.platform && ach.platform === filters.platform);
                
                let rarityMatch = filters.rarity === 'all';
                if (filters.rarity === 'rare' && ach.rarity >= 0 && ach.rarity < 10) rarityMatch = true;
                if (filters.rarity === 'uncommon' && ach.rarity >= 10 && ach.rarity < 50) rarityMatch = true;
                
                return searchMatch && typeMatch && statusMatch && platformMatch && rarityMatch;
            });
        }, [filters, allAchievements]);
    
        const getRarityColor = (rarity) => {
            if (rarity < 0) return 'text-gray-400';
            if (rarity < 10) return 'text-yellow-400';
            if (rarity < 50) return 'text-purple-400';
            return 'text-blue-400';
        };
        
        const getIconForType = (type) => {
            switch(type) {
                case 'Game': return <Gamepad2 className="h-5 w-5 text-blue-400" />;
                case 'Meta': return <Trophy className="h-5 w-5 text-yellow-400" />;
                case 'Custom': return <Star className="h-5 w-5 text-green-400" />;
                default: return null;
            }
        };
    
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-5xl font-bold animated-gradient-text mb-2">Achievement Hub</h1>
                    <p className="text-gray-400 text-lg">Your complete collection of accolades across all platforms.</p>
                </div>
    
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect rounded-xl p-4 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 relative min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" placeholder="Search achievements..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} className="w-full pl-10 pr-4 py-2 bg-transparent border-none rounded-lg text-white placeholder-gray-400 focus:outline-none" />
                        </div>
                    </div>
                     <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-gray-400 mr-2">Type:</span>
                        {['all', 'Game', 'Meta', 'Custom'].map(type => (
                            <Button key={type} onClick={() => handleFilterChange('type', type)} variant={filters.type === type ? "secondary" : "ghost"} size="sm" className={`capitalize ${filters.type === type ? 'bg-white/10' : ''}`}>{type}</Button>
                        ))}
                        <span className="text-sm font-semibold text-gray-400 ml-4 mr-2">Status:</span>
                        {['all', 'unlocked', 'locked'].map(status => (
                            <Button key={status} onClick={() => handleFilterChange('status', status)} variant={filters.status === status ? "secondary" : "ghost"} size="sm" className={`capitalize ${filters.status === status ? 'bg-white/10' : ''}`}>{status}</Button>
                        ))}
                        <span className="text-sm font-semibold text-gray-400 ml-4 mr-2">Rarity:</span>
                        {['all', 'rare', 'uncommon'].map(rarity => (
                            <Button key={rarity} onClick={() => handleFilterChange('rarity', rarity)} variant={filters.rarity === rarity ? "secondary" : "ghost"} size="sm" className={`capitalize ${filters.rarity === rarity ? 'bg-white/10' : ''}`}>{rarity}</Button>
                        ))}
                        <span className="text-sm font-semibold text-gray-400 ml-4 mr-2">Platform:</span>
                         {['all', 'Steam', 'Xbox', 'Riot', 'WoW'].map(platform => (
                            <Button key={platform} onClick={() => handleFilterChange('platform', platform)} variant={filters.platform === platform ? "secondary" : "ghost"} size="sm" className={`capitalize ${filters.platform === platform ? 'bg-white/10' : ''}`}>{platform}</Button>
                        ))}
                    </div>
                </motion.div>
    
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredAchievements.map((ach, index) => (
                            <motion.div
                                key={ach.id}
                                layout
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                transition={{ duration: 0.3, delay: index * 0.02 }}
                                className={`glass-effect p-4 rounded-lg flex items-center space-x-4 border-l-4 ${ach.unlocked ? 'border-green-500' : 'border-red-500'}`}
                            >
                                <div className="flex-shrink-0">
                                    {ach.unlocked ? <CheckCircle className="h-8 w-8 text-green-400" /> : <XCircle className="h-8 w-8 text-red-400" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                       {getIconForType(ach.type)}
                                       <p className="font-bold text-white text-lg">{ach.name}</p>
                                       {ach.game && <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">({ach.game})</span>}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">{ach.description}</p>
                                </div>
                                <div className="text-right flex-shrink-0 w-24 space-y-1">
                                    {ach.rarity >= 0 && (
                                        <div>
                                            <p className={`font-bold text-xl ${getRarityColor(ach.rarity)}`}>{ach.rarity}%</p>
                                            <p className="text-xs text-gray-500">Rarity</p>
                                        </div>
                                    )}
                                    {ach.points && (
                                        <div>
                                            <p className="font-bold text-lg text-green-400">{ach.points}</p>
                                            <p className="text-xs text-gray-500">Points</p>
                                        </div>
                                    )}
                                </div>
                                {ach.platform && <div className="text-xs font-semibold capitalize text-white/70">{ach.platform}</div>}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filteredAchievements.length === 0 && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                            <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white">No Achievements Found</h3>
                            <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    };
    
    export default Achievements;
  