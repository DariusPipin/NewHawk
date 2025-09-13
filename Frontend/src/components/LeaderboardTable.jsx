import React from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const LeaderboardTable = ({ data, selectedMetric, selectedPlatform }) => {
  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case 'steam': return 'bg-blue-600';
      case 'xbox': return 'bg-green-600';
      case 'wow': return 'bg-orange-600';
      case 'riot': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2: return <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-black">2</div>;
      case 3: return <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>;
      default: return <div className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">{rank}</div>;
    }
  };

  const getChangeIcon = (change) => {
    if (change.startsWith('+')) {
      return <TrendingUp className="h-4 w-4 text-green-400" />;
    } else if (change.startsWith('-')) {
      return <TrendingDown className="h-4 w-4 text-red-400" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatValue = (value, metric) => {
    if (metric === 'gamerscore') {
      return value.toLocaleString();
    }
    return value.toString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-400">Rank</th>
            <th className="text-left py-3 px-4 text-gray-400">Player</th>
            <th className="text-center py-3 px-4 text-gray-400">Platforms</th>
            <th className="text-center py-3 px-4 text-gray-400">Score</th>
            <th className="text-center py-3 px-4 text-gray-400">Change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((player, index) => (
            <motion.tr
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  {getRankIcon(player.rank)}
                </div>
              </td>
              
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <img alt={player.avatar} className="w-full h-full rounded-full object-cover" src="https://images.unsplash.com/photo-1691398495617-18457fbf826d" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{player.username}</div>
                    <div className="text-xs text-gray-400">
                      {player.achievements.toLocaleString()} total achievements
                    </div>
                  </div>
                </div>
              </td>
              
              <td className="py-4 px-4">
                <div className="flex justify-center space-x-1">
                  {player.platforms.slice(0, 4).map((platform, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-6 rounded-full ${getPlatformColor(platform)} flex items-center justify-center text-xs font-bold text-white`}
                      title={platform}
                    >
                      {platform[0]}
                    </div>
                  ))}
                  {player.platforms.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
                      +{player.platforms.length - 4}
                    </div>
                  )}
                </div>
              </td>
              
              <td className="py-4 px-4 text-center">
                <div className="font-bold text-lg text-white">
                  {formatValue(player[selectedMetric], selectedMetric)}
                </div>
              </td>
              
              <td className="py-4 px-4">
                <div className="flex items-center justify-center space-x-1">
                  {getChangeIcon(player.change)}
                  <span className={`text-sm font-medium ${
                    player.change.startsWith('+') ? 'text-green-400' :
                    player.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {player.change}
                  </span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;