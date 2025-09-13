import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Gamepad2, Users, BarChart3, Gift, Link, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Trophy },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'compare', label: 'Compare', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { id: 'wrapped', label: 'Wrapped', icon: Gift },
];

const actionItems = [
    { id: 'link-accounts', label: 'Link Accounts', icon: Link },
    { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ currentPage, setCurrentPage, user }) => {

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 h-full w-72 bg-background/80 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col p-6"
        >
            <div className="flex items-center space-x-3 mb-10">
                <Trophy className="h-10 w-10 animated-gradient-text" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    OmniGamer
                </span>
            </div>
            
            <nav className="flex flex-col space-y-2 flex-grow">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 pb-2">Main Menu</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                        <Button
                            key={item.id}
                            variant="ghost"
                            size="lg"
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full justify-start text-base py-6 relative ${isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Icon className={`h-5 w-5 mr-4 ${isActive ? 'text-blue-400' : ''}`} />
                            {item.label}
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-500 rounded-r-full"
                                />
                            )}
                        </Button>
                    );
                })}

                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 pt-8 pb-2">Actions</p>
                {actionItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                        <Button
                            key={item.id}
                            variant="ghost"
                            size="lg"
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full justify-start text-base py-6 relative ${isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Icon className={`h-5 w-5 mr-4 ${isActive ? 'text-blue-400' : ''}`} />
                            {item.label}
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-500 rounded-r-full"
                                />
                            )}
                        </Button>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleLogout}
                    className="w-full justify-start text-base py-6 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                    <LogOut className="h-5 w-5 mr-4" />
                    Logout
                </Button>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 mt-4">
                    <img class="w-10 h-10 rounded-full object-cover" alt="User avatar" src="https://images.unsplash.com/photo-1580428180163-76ab1efe2aed" />
                    <div>
                        <p className="font-semibold text-white">{user.displayName || user.username}</p>
                        <p className="text-xs text-gray-400">Level 42 - Grandmaster</p>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;