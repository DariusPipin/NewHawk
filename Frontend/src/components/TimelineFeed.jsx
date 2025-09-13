import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, Star, Zap, Award } from 'lucide-react';

const TimelineFeed = ({ linkedAccounts }) => {
  const recentActivities = [
    { id: 1, type: 'achievement', title: 'Master Marksman', game: 'Counter-Strike 2', platform: 'Steam', rarity: 'rare', timestamp: '2h ago', icon: Trophy },
    { id: 2, type: 'meta', title: 'Week Warrior', description: '7-day achievement streak!', timestamp: '1d ago', icon: Award },
    { id: 3, type: 'achievement', title: 'Raid Leader', game: 'World of Warcraft', platform: 'WoW', rarity: 'epic', timestamp: '2d ago', icon: Star },
    { id: 4, type: 'achievement', title: 'Clutch Master', game: 'VALORANT', platform: 'Riot', rarity: 'uncommon', timestamp: '2d ago', icon: Trophy },
    { id: 5, type: 'achievement', title: 'Forza Marathon', game: 'Forza Horizon 5', platform: 'Xbox', rarity: 'common', timestamp: '3d ago', icon: Trophy },
  ];

  const getRarityClass = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 text-gray-400';
      case 'uncommon': return 'border-green-500 text-green-400';
      case 'rare': return 'border-blue-500 text-blue-400';
      case 'epic': return 'border-purple-500 text-purple-400';
      case 'legendary': return 'border-orange-500 text-orange-400';
      default: return 'border-gray-600 text-gray-500';
    }
  };

  const getPlatformClass = (platform) => `platform-${platform.toLowerCase()}`;
  const getMetaClass = () => 'bg-yellow-500 text-black';

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-400" />
        Recent Activity
      </h3>
      
      <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-white/10">
        {recentActivities.map((activity, index) => {
          const Icon = activity.icon;
          const isMeta = activity.type === 'meta';
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="pl-12 relative"
            >
                <div className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center ${isMeta ? getMetaClass() : getPlatformClass(activity.platform || 'default')} shadow-lg`}>
                    <Icon className="h-5 w-5" />
                </div>
              
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-white truncate">{activity.title}</h4>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                
                    <p className="text-sm text-gray-400 mb-2">
                        {isMeta ? activity.description : `in ${activity.game}`}
                    </p>
                    
                    {activity.rarity && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border bg-black/20 capitalize ${getRarityClass(activity.rarity)}`}>
                            {activity.rarity}
                        </span>
                    )}
                </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineFeed;