import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Gamepad2, Users, BarChart3, Gift, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = ({ currentPage, setCurrentPage, user, linkedAccounts }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Trophy },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'compare', label: 'Compare', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { id: 'wrapped', label: 'Wrapped', icon: Gift },
    { id: 'link-accounts', label: 'Link Accounts', icon: Link },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Achievement Tracker
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(item.id)}
                  className={`relative ${isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-white/10'}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-600 rounded-md -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-1">
              {linkedAccounts.slice(0, 3).map((account, index) => (
                <div
                  key={account.id}
                  className={`w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-bold platform-${account.platform.toLowerCase()}`}
                  title={`${account.platform} - ${account.username}`}
                >
                  {account.platform[0]}
                </div>
              ))}
              {linkedAccounts.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-white/20 flex items-center justify-center text-xs font-bold">
                  +{linkedAccounts.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-300">{user.username}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;