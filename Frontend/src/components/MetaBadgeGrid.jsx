import React from 'react';
import { motion } from 'framer-motion';
import { Award, Crown, Zap, Target, Gamepad2, Trophy } from 'lucide-react';

const MetaBadgeGrid = ({ metaTrophies }) => {
  const badges = [
    { id: 'streak_7', name: 'Week Warrior', description: '7 day streak', icon: Zap, unlocked: true, color: 'from-yellow-400 to-orange-500' },
    { id: 'rare_hunter', name: 'Rare Hunter', description: '10 rare unlocks', icon: Crown, unlocked: true, color: 'from-purple-500 to-pink-500' },
    { id: 'marathoner', name: 'Marathoner', description: '10hr session', icon: Target, unlocked: metaTrophies >= 3, color: 'from-blue-400 to-cyan-400' },
    { id: 'platform_hopper', name: 'Platform Hopper', description: '3+ platforms', icon: Gamepad2, unlocked: metaTrophies >= 2, color: 'from-green-400 to-emerald-500' },
    { id: 'genre_polyglot', name: 'Genre Master', description: '5+ genres', icon: Trophy, unlocked: false, color: 'from-red-500 to-rose-500' },
    { id: 'valorant_ascendant', name: 'Ascendant', description: 'VALORANT rank', icon: Award, unlocked: false, color: 'from-indigo-400 to-purple-500' }
  ];

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Award className="h-5 w-5 mr-2 text-yellow-400" />
        Meta Trophies
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.3 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              title={`${badge.name}: ${badge.description}`}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center p-2 text-center transition-all duration-300
                ${badge.unlocked
                  ? `bg-gradient-to-br ${badge.color} border-2 border-transparent shadow-lg`
                  : 'bg-gray-800/80 border-2 border-gray-700 opacity-60'
              }`}
            >
              <Icon className={`h-8 w-8 mb-1 ${badge.unlocked ? 'text-white' : 'text-gray-400'}`} />
              <div className={`text-xs font-bold leading-tight ${badge.unlocked ? 'text-white' : 'text-gray-400'}`}>
                {badge.name}
              </div>
              {!badge.unlocked && <div className="absolute inset-0 bg-black/50 rounded-lg"></div>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MetaBadgeGrid;