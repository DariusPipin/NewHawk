import React from 'react';
import { motion } from 'framer-motion';
import { Gem, BarChart3 } from 'lucide-react';

const RarityHistogram = ({ linkedAccounts }) => {
  const rarityData = [
    { label: 'Common', percentage: 45, color: 'bg-gray-500' },
    { label: 'Uncommon', percentage: 30, color: 'bg-green-500' },
    { label: 'Rare', percentage: 15, color: 'bg-blue-500' },
    { label: 'Epic', percentage: 8, color: 'bg-purple-500' },
    { label: 'Legendary', percentage: 2, color: 'bg-orange-500' }
  ];

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Gem className="h-5 w-5 mr-2 text-blue-400" />
        Rarity Distribution
      </h3>
      
      <div className="flex items-end h-48 gap-3">
        {rarityData.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex-1 flex flex-col items-center justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <p className="text-white font-bold text-sm mb-1">{item.percentage}%</p>
            <motion.div
              className={`w-full rounded-t-md ${item.color} transition-all duration-300 hover:brightness-125`}
              initial={{ height: 0 }}
              animate={{ height: `${item.percentage}%` }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.8, type: 'spring' }}
              title={`${item.label}: ${item.percentage}%`}
            />
            <p className="text-xs text-gray-400 mt-2">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RarityHistogram;