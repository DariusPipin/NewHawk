import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Games from '@/components/Games';
import Compare from '@/components/Compare';
import Leaderboard from '@/components/Leaderboard';
import Profile from '@/components/Profile';
import Wrapped from '@/components/Wrapped';
import LinkAccounts from '@/components/LinkAccounts';
import Settings from '@/components/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('achievementTracker_user');
    const savedAccounts = localStorage.getItem('achievementTracker_accounts');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAccounts) {
      setLinkedAccounts(JSON.parse(savedAccounts));
    }
  }, []);

  const handleLinkAccount = (accountData) => {
    const newAccounts = [...linkedAccounts, { ...accountData, id: Date.now() }];
    setLinkedAccounts(newAccounts);
    localStorage.setItem('achievementTracker_accounts', JSON.stringify(newAccounts));
    
    toast({
      title: "Account Linked! 🎮",
      description: `Successfully connected your ${accountData.platform} account!`,
      className: 'bg-green-600/90 border-green-500 text-white',
    });
  };
  
  const handleUnlinkAccount = (accountId) => {
    const accountToUnlink = linkedAccounts.find(acc => acc.id === accountId);
    const newAccounts = linkedAccounts.filter(acc => acc.id !== accountId);
    setLinkedAccounts(newAccounts);
    localStorage.setItem('achievementTracker_accounts', JSON.stringify(newAccounts));
    
    toast({
      title: "Account Unlinked!",
      description: `Your ${accountToUnlink.platform} account has been disconnected.`,
      variant: 'destructive',
    });
  };

  const handleCreateProfile = (profileData) => {
    const newUser = { ...profileData, id: Date.now(), createdAt: new Date().toISOString() };
    setUser(newUser);
    localStorage.setItem('achievementTracker_user', JSON.stringify(newUser));
    
    toast({
      title: "Profile Created! 🚀",
      description: "Welcome to your achievement tracking journey!",
      className: 'bg-blue-600/90 border-blue-500 text-white',
    });
  };

  const renderPage = () => {
    if (!user) {
      return <Profile onCreateProfile={handleCreateProfile} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} linkedAccounts={linkedAccounts} />;
      case 'games':
        return <Games linkedAccounts={linkedAccounts} />;
      case 'compare':
        return <Compare />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'wrapped':
        return <Wrapped user={user} linkedAccounts={linkedAccounts} />;
      case 'link-accounts':
        return <LinkAccounts onLinkAccount={handleLinkAccount} linkedAccounts={linkedAccounts} onUnlinkAccount={handleUnlinkAccount} />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return <Dashboard user={user} linkedAccounts={linkedAccounts} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>OmniGamer - Unified Gaming Dashboard</title>
        <meta name="description" content="Track your gaming achievements across Steam, Xbox, WoW, and Riot Games in one unified dashboard." />
      </Helmet>
      
      <div className="flex min-h-screen">
        {user && (
          <Sidebar 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            user={user}
            linkedAccounts={linkedAccounts}
          />
        )}
        
        <main className={`flex-1 transition-all duration-300 ${user ? "pl-72" : ""}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="p-4 sm:p-6 lg:p-8"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Toaster />
      </div>
    </>
  );
}

export default App;