import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Download, Trophy, Star, Zap, Calendar, TrendingUp, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ShareBar from '@/components/ShareBar';

const Wrapped = ({ user, linkedAccounts }) => {
  const [wrappedData, setWrappedData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const generateWrappedData = () => {
      const currentYear = new Date().getFullYear();
      return {
        year: currentYear,
        totalAchievements: linkedAccounts.length * 180 + Math.floor(Math.random() * 100),
        totalGamerscore: linkedAccounts.length * 28000 + Math.floor(Math.random() * 15000),
        rarest: [
          { name: 'Mythic Raider', game: 'World of Warcraft', rarity: '0.1%' },
          { name: 'Global Elite', game: 'Counter-Strike 2', rarity: '0.3%' },
          { name: 'Radiant Rank', game: 'VALORANT', rarity: '0.2%' },
        ],
        busiestDay: { date: 'December 15th', achievements: 23, hours: 12 },
        longestStreak: Math.floor(Math.random() * 45) + 15,
        topGames: [
          { name: 'Counter-Strike 2', achievements: 89, hours: 245 },
          { name: 'World of Warcraft', achievements: 156, hours: 189 },
          { name: 'VALORANT', achievements: 45, hours: 134 },
        ],
        metaHighlights: ['Week Warrior', 'Rare Hunter', 'Platform Hopper', 'Genre Master'],
      };
    };
    setWrappedData(generateWrappedData());
  }, [user, linkedAccounts]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleExport = () => {
    toast({
      title: "🚧 Export Coming Soon!",
      description: "PDF export isn't implemented. You can request it in your next prompt! 🚀",
    });
  };

  const slides = wrappedData ? [
    {
      id: 'welcome',
      content: (
          <div className="text-center">
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type: 'spring'}} className="text-8xl mb-4">🎁</motion.div>
              <h1 className="text-5xl font-bold animated-gradient-text mb-2">{wrappedData.year} Wrapped</h1>
              <p className="text-xl text-gray-300">Your year in gaming, unwrapped.</p>
          </div>
      )
    },
    {
      id: 'summary',
      content: (
        <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">Your Epic Year</h2>
            <div className="grid grid-cols-2 gap-6">
                <div className="glass-effect p-6 rounded-xl">
                    <Trophy className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-4xl font-bold text-white">{wrappedData.totalAchievements.toLocaleString()}</p>
                    <p className="text-gray-400">Achievements</p>
                </div>
                <div className="glass-effect p-6 rounded-xl">
                    <Star className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-4xl font-bold text-white">{wrappedData.totalGamerscore.toLocaleString()}</p>
                    <p className="text-gray-400">Gamerscore</p>
                </div>
            </div>
        </div>
      )
    },
    {
        id: 'rarest',
        content: (
          <div className="w-full">
              <h2 className="text-3xl font-bold text-white text-center mb-6">Legendary Unlocks</h2>
              <div className="space-y-4">
              {wrappedData.rarest.map((ach, i) => (
                  <motion.div key={i} initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: i * 0.2}} className="glass-effect rounded-lg p-4 flex items-center justify-between">
                      <div>
                          <p className="font-semibold text-white">{ach.name}</p>
                          <p className="text-sm text-gray-400">{ach.game}</p>
                      </div>
                      <p className="text-lg font-bold text-purple-400">{ach.rarity}</p>
                  </motion.div>
              ))}
              </div>
          </div>
        )
      },
    {
      id: 'streak',
      content: (
        <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">Peak Dedication</h2>
            <div className="flex items-center justify-center gap-8">
                <div className="glass-effect p-6 rounded-xl text-center">
                    <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-4xl font-bold text-white">{wrappedData.longestStreak}</p>
                    <p className="text-gray-400">Longest Streak</p>
                </div>
                <div className="glass-effect p-6 rounded-xl text-center">
                    <Calendar className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-4xl font-bold text-white">{wrappedData.busiestDay.achievements}</p>
                    <p className="text-gray-400">Busiest Day</p>
                </div>
            </div>
        </div>
      )
    },
    {
        id: 'topGames',
        content: (
            <div className="w-full">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Your Top Games</h2>
                <div className="space-y-3">
                {wrappedData.topGames.map((game, i) => (
                    <motion.div key={i} initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{delay: i * 0.15}} className="glass-effect rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <p className="text-2xl font-bold text-gray-500">{i+1}</p>
                           <div>
                                <p className="font-semibold text-white">{game.name}</p>
                                <p className="text-sm text-gray-400">{game.hours} hours</p>
                            </div>
                        </div>
                        <p className="text-lg font-bold text-blue-400">{game.achievements} unlocks</p>
                    </motion.div>
                ))}
                </div>
            </div>
        )
    },
    {
        id: 'share',
        content: (
            <div className="text-center space-y-6">
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type: 'spring'}} className="text-8xl mb-4">🎉</motion.div>
                <h1 className="text-4xl font-bold text-white mb-2">That's a Wrap!</h1>
                <p className="text-lg text-gray-300 mb-6">Share your epic gaming year with the world.</p>
                <ShareBar title={`${user.username}'s ${wrappedData?.year} Gaming Wrapped`} description={`I unlocked ${wrappedData.totalAchievements} achievements!`} />
            </div>
        )
    }
  ] : [];

  if (!wrappedData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="relative w-full max-w-2xl aspect-[9/16]">
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className="absolute inset-0 glass-effect rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl"
                    style={{ background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.8), rgba(10, 10, 16, 0.9))' }}
                >
                    {slides[currentSlide].content}
                </motion.div>
            </AnimatePresence>
        </div>

      <div className="flex items-center justify-between w-full max-w-2xl mt-6">
        <Button onClick={prevSlide} disabled={currentSlide === 0} variant="ghost" className="hover:bg-white/10">Previous</Button>
        <div className="flex space-x-2">
            {slides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-blue-400 scale-125' : 'bg-gray-600 hover:bg-gray-400'}`} />
            ))}
        </div>
        {currentSlide < slides.length - 1 ? (
          <Button onClick={nextSlide} className="bg-blue-600 hover:bg-blue-700">Next</Button>
        ) : (
          <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700"><Download className="h-4 w-4 mr-2" />Export</Button>
        )}
      </div>
    </div>
  );
};

export default Wrapped;