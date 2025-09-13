import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const StreakWidget = ({ currentStreak }) => {
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = new Date().getDay() - (new Date().getDay() - 1 - i);
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex % 7];
    const isActive = i < currentStreak;
    return { day: dayName, active: isActive };
  });

  return (
    <div className="glass-effect rounded-xl p-6 flex flex-col items-center justify-center text-center">
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative w-32 h-32"
      >
        <motion.svg className="absolute inset-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#ffffff20" strokeWidth="6" fill="transparent" />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#streakGradient)"
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * (currentStreak % 7)) / 7 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <defs>
            <linearGradient id="streakGradient">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </motion.svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Flame className="h-8 w-8 text-orange-400 mb-1" />
            <div className="text-4xl font-bold text-white">{currentStreak}</div>
            <div className="text-sm text-gray-400">day streak</div>
        </div>
      </motion.div>
      
      <div className="mt-6 w-full">
        <div className="grid grid-cols-7 gap-2">
            {streakDays.map((day, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className={`text-center py-2 rounded-lg transition-colors duration-300 ${
                day.active 
                    ? 'bg-orange-500/20 text-orange-300' 
                    : 'bg-gray-700/50 text-gray-400'
                }`}
            >
                <div className="text-xs font-bold">{day.day}</div>
            </motion.div>
            ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
            Next milestone: {Math.ceil(currentStreak / 10) * 10 || 10} days 🔥
        </p>
      </div>
    </div>
  );
};

export default StreakWidget;