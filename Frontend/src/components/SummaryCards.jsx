import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target } from 'lucide-react';

const SummaryCards = ({ stats }) => {
  const cards = [
    { title: 'Total Achievements', value: stats.totalAchievements, icon: Trophy, color: 'text-blue-400', gradient: 'from-blue-500/20 to-transparent' },
    { title: 'Total Gamerscore', value: stats.totalGamerscore, icon: Star, color: 'text-green-400', gradient: 'from-green-500/20 to-transparent' },
    { title: 'Rare Achievements', value: stats.rareAchievements, icon: Zap, color: 'text-purple-400', gradient: 'from-purple-500/20 to-transparent' },
    { title: 'Meta Trophies', value: stats.metaTrophies, icon: Target, color: 'text-orange-400', gradient: 'from-orange-500/20 to-transparent' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            whileHover={{ y: -5, scale: 1.02,
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`glass-effect rounded-xl p-6 bg-gradient-to-br ${card.gradient} overflow-hidden`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">{card.title}</h3>
                <p className={`text-4xl font-bold ${card.color}`}>{card.value.toLocaleString()}</p>
              </div>
              <Icon className={`h-8 w-8 ${card.color} opacity-30`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SummaryCards;