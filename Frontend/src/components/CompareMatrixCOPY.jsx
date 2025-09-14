import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target, TrendingUp, Award } from 'lucide-react';

const CompareMatrix = ({ users }) => {
  const metrics = [
    { key: 'totalAchievements', label: 'Total Achievements', icon: Trophy, color: 'text-blue-400' },
    { key: 'gamerscore', label: 'Gamerscore', icon: Star, color: 'text-green-400' },
    { key: 'rareCount', label: 'Rare Achievements', icon: Zap, color: 'text-purple-400' },
  ];

  const getWinner = (metric) => {
    let maxValue = -1;
    let winnerId = null;
    
    users.forEach(user => {
      if (user[metric] > maxValue) {
        maxValue = user[metric];
        winnerId = user.id;
      }
    });
    
    return winnerId;
  };

  const formatValue = (value, metric) => {
    if (metric === 'gamerscore') {
      return value.toLocaleString();
    }
    return value.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6"
    >
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Award className="h-5 w-5 mr-2 text-yellow-400" />
        Comparison Matrix
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-gray-400">Metric</th>
              {users.map(user => (
                <th key={user.id} className="text-center py-3 px-4 text-white">
                  {user.username}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const winnerId = getWinner(metric.key);
              
              return (
                <motion.tr
                  key={metric.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                      <span className="text-white font-medium">{metric.label}</span>
                    </div>
                  </td>
                  {users.map(user => (
                    <td key={user.id} className="text-center py-4 px-4">
                      <div className={`font-semibold ${
                        user.id === winnerId 
                          ? `${metric.color} text-lg` 
                          : 'text-gray-300'
                      }`}>
                        {formatValue(user[metric.key], metric.key)}
                        {user.id === winnerId && (
                          <span className="ml-1">👑</span>
                        )}
                      </div>
                    </td>
                  ))}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map(metric => {
          const winnerId = getWinner(metric.key);
          const winner = users.find(u => u.id === winnerId);
          const Icon = metric.icon;
          
          return (
            <div key={metric.key} className="bg-white/5 rounded-lg p-4 text-center">
              <Icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
              <div className="text-sm text-gray-400 mb-1">{metric.label} Leader</div>
              <div className="font-semibold text-white">{winner?.username}</div>
              <div className={`text-sm ${metric.color}`}>
                {formatValue(winner?.[metric.key] || 0, metric.key)}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CompareMatrix;