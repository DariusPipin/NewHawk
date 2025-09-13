import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Filter, Trophy, Star, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeaderboardTable from '@/components/LeaderboardTable';

const Leaderboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('gamerscore');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all-time');

  const metrics = [
    { id: 'gamerscore', label: 'Gamerscore', icon: Star, color: 'text-green-400' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, color: 'text-blue-400' },
    { id: 'rare', label: 'Rare Count', icon: Zap, color: 'text-purple-400' },
    { id: 'meta', label: 'Meta Trophies', icon: Target, color: 'text-orange-400' }
  ];

  const platforms = ['all', 'steam', 'xbox', 'wow', 'riot'];
  const timeframes = ['all-time', 'this-year', 'this-month', 'this-week'];

  const mockLeaderboardData = [
    { id: 1, rank: 1, username: 'AchievementKing', avatar: 'Crown wearing gamer avatar', achievements: 3247, gamerscore: 89450, rare: 234, meta: 15, platforms: ['Steam', 'Xbox', 'WoW', 'Riot'], change: '+2' },
    { id: 2, rank: 2, username: 'TrophyHunter', avatar: 'Trophy collector with medals', achievements: 2891, gamerscore: 76230, rare: 198, meta: 12, platforms: ['Steam', 'Xbox', 'WoW'], change: '-1' },
    { id: 3, rank: 3, username: 'GamerSupreme', avatar: 'Elite gamer with headset', achievements: 2654, gamerscore: 71890, rare: 187, meta: 11, platforms: ['Steam', 'Xbox', 'Riot'], change: '+1' },
    { id: 4, rank: 4, username: 'CompletionistPro', avatar: 'Perfectionist gamer avatar', achievements: 2456, gamerscore: 68340, rare: 176, meta: 10, platforms: ['Steam', 'WoW'], change: '0' },
    { id: 5, rank: 5, username: 'RareCollector', avatar: 'Rare achievement specialist', achievements: 2234, gamerscore: 65120, rare: 165, meta: 9, platforms: ['Xbox', 'Riot'], change: '+3' },
    { id: 6, rank: 6, username: 'NewChallenger', avatar: 'Up and coming gamer', achievements: 2100, gamerscore: 62000, rare: 150, meta: 8, platforms: ['Steam'], change: '+5' },
    { id: 7, rank: 7, username: 'MMO-Master', avatar: 'Online game expert', achievements: 2050, gamerscore: 61500, rare: 145, meta: 8, platforms: ['WoW', 'Riot'], change: '-2' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-bold animated-gradient-text mb-2">Global Leaderboards</h1>
        <p className="text-gray-400 text-lg">Find out who is the ultimate gamer.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-400" />
            <span className="font-semibold">Metric:</span>
            {metrics.map(metric => (
              <Button key={metric.id} onClick={() => setSelectedMetric(metric.id)} variant={selectedMetric === metric.id ? "secondary" : "ghost"} size="sm" className={selectedMetric === metric.id ? 'bg-white/10' : ''}>
                {metric.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Platform:</span>
            {platforms.map(platform => (
              <Button key={platform} onClick={() => setSelectedPlatform(platform)} variant={selectedPlatform === platform ? "secondary" : "ghost"} size="sm" className={`capitalize ${selectedPlatform === platform ? 'bg-white/10' : ''}`}>
                {platform}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Time:</span>
            {timeframes.map(timeframe => (
              <Button key={timeframe} onClick={() => setSelectedTimeframe(timeframe)} variant={selectedTimeframe === timeframe ? "secondary" : "ghost"} size="sm" className={`capitalize ${selectedTimeframe === timeframe ? 'bg-white/10' : ''}`}>
                {timeframe.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <LeaderboardTable data={mockLeaderboardData} selectedMetric={selectedMetric} />
      </motion.div>
    </div>
  );
};

export default Leaderboard;