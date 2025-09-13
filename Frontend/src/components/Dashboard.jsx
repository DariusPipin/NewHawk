import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target, TrendingUp, Activity } from 'lucide-react';
import SummaryCards from '@/components/SummaryCards';
import RarityHistogram from '@/components/RarityHistogram';
import StreakWidget from '@/components/StreakWidget';
import MetaBadgeGrid from '@/components/MetaBadgeGrid';
import TimelineFeed from '@/components/TimelineFeed';

const Dashboard = ({ user, linkedAccounts }) => {
  const [stats, setStats] = useState({
    totalAchievements: 0,
    totalGamerscore: 0,
    rareAchievements: 0,
    metaTrophies: 0,
    currentStreak: 0,
    platformBreakdown: {}
  });

  useEffect(() => {
    // Enhanced mock stats
    const mockStats = {
      totalAchievements: linkedAccounts.length * 250 + Math.floor(Math.random() * 500),
      totalGamerscore: linkedAccounts.length * 35000 + Math.floor(Math.random() * 20000),
      rareAchievements: linkedAccounts.length * 25 + Math.floor(Math.random() * 50),
      metaTrophies: Math.floor(linkedAccounts.length * 3) + Math.floor(Math.random() * 7),
      currentStreak: Math.floor(Math.random() * 50) + 5,
      platformBreakdown: {}
    };

    linkedAccounts.forEach(account => {
      mockStats.platformBreakdown[account.platform] = {
        achievements: Math.floor(Math.random() * 150) + 75,
        gamerscore: Math.floor(Math.random() * 20000) + 10000
      };
    });

    setStats(mockStats);
  }, [linkedAccounts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-5xl font-bold animated-gradient-text mb-2">
          Welcome back, {user.displayName || user.username}!
        </h1>
        <p className="text-gray-400 text-lg">
          Here's your aggregated gaming universe. Ready to conquer?
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SummaryCards stats={stats} />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-8">
          <RarityHistogram linkedAccounts={linkedAccounts} />
          <TimelineFeed linkedAccounts={linkedAccounts} />
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          <StreakWidget currentStreak={stats.currentStreak} />
          <MetaBadgeGrid metaTrophies={stats.metaTrophies} />
          
          <motion.div variants={itemVariants} className="glass-effect rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-400" />
              Global Standing
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Platforms</span>
                <span className="font-semibold text-blue-400">{linkedAccounts.length} Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Average Completion</span>
                 <div className="flex items-center space-x-2">
                   <div className="w-24 bg-gray-700 rounded-full h-2">
                       <motion.div 
                         className="bg-green-500 h-2 rounded-full" 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.floor(Math.random() * 30 + 60)}%`}}
                         transition={{ duration: 1, delay: 0.5 }}
                       />
                   </div>
                   <span className="font-semibold text-green-400">
                     {Math.floor(Math.random() * 30 + 60)}%
                   </span>
                 </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Global Rank</span>
                <span className="font-semibold text-purple-400">
                  #{Math.floor(Math.random() * 10000 + 1000).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;