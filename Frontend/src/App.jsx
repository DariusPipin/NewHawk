import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
import CustomAchievements from '@/components/CustomAchievements';
import Achievements from '@/components/Achievements';

import AuthGate from '@/components/AuthGate';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';

function App() {
  const { user: authUser } = useAuth(); // Supabase auth user
  const [currentPage, setCurrentPage] = useState('dashboard');

  // NEW: filters + pageKey to force re-mount when filters/page change
  const [pageFilters, setPageFilters] = useState({});
  const [pageKey, setPageKey] = useState(Date.now());

  // Optional in-app profile separate from Supabase user
  const [profileUser, setProfileUser] = useState(null);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const { toast } = useToast();

  // Resolve username from metadata
  const username = authUser?.user_metadata?.username ?? 'Player';

  // Load local profile + linked accounts
  useEffect(() => {
    const savedProfile = localStorage.getItem('achievementTracker_user');
    const savedAccounts = localStorage.getItem('achievementTracker_accounts');

    if (savedProfile) setProfileUser(JSON.parse(savedProfile));
    if (savedAccounts) setLinkedAccounts(JSON.parse(savedAccounts));
  }, []);

  const handleLinkAccount = (accountData) => {
    const newAccounts = [...linkedAccounts, { ...accountData, id: Date.now() }];
    setLinkedAccounts(newAccounts);
    localStorage.setItem('achievementTracker_accounts', JSON.stringify(newAccounts));

    toast({
      title: 'Account Linked',
      description: `Connected ${accountData.platform}.`,
      className: 'bg-green-600/90 border-green-500 text-white',
    });
  };

  const handleUnlinkAccount = (accountId) => {
    const accountToUnlink = linkedAccounts.find((a) => a.id === accountId);
    const newAccounts = linkedAccounts.filter((a) => a.id !== accountId);
    setLinkedAccounts(newAccounts);
    localStorage.setItem('achievementTracker_accounts', JSON.stringify(newAccounts));

    toast({
      title: 'Account Unlinked',
      description: `Disconnected ${accountToUnlink?.platform}.`,
      variant: 'destructive',
    });
  };

  const handleCreateProfile = (profileData) => {
    const newProfile = { ...profileData, id: Date.now(), createdAt: new Date().toISOString() };
    setProfileUser(newProfile);
    localStorage.setItem('achievementTracker_user', JSON.stringify(newProfile));

    toast({
      title: 'Profile Created',
      description: 'Welcome aboard.',
      className: 'bg-blue-600/90 border-blue-500 text-white',
    });
  };

  // NEW: navigateTo helper so other pages (e.g., Dashboard) can open Achievements with filters
  const navigateTo = (page, filters = {}) => {
    setPageFilters(filters);
    setCurrentPage(page);
    setPageKey(Date.now()); // force re-mount on page/filter changes
  };

  // NEW: wrap setCurrentPage to clear filters when leaving Achievements
  const handleSetCurrentPage = (page) => {
    if (currentPage === 'achievements' && page !== 'achievements') {
      setPageFilters({});
    }
    setCurrentPage(page);
    setPageKey(Date.now());
  };

  const renderPage = () => {
    // Require local profile after Supabase auth
    if (!profileUser) return <Profile onCreateProfile={handleCreateProfile} />;

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={profileUser} linkedAccounts={linkedAccounts} navigateTo={navigateTo} />;
      case 'games':
        return <Games user={profileUser} linkedAccounts={linkedAccounts} />;
      case 'achievements':
        return <Achievements initialFilters={pageFilters} />;
      case 'compare':
        return <Compare user={profileUser} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'wrapped':
        return <Wrapped user={profileUser} linkedAccounts={linkedAccounts} />;
      case 'custom-achievements':
        return <CustomAchievements user={profileUser} />;
      case 'link-accounts':
        return (
          <LinkAccounts
            onLinkAccount={handleLinkAccount}
            linkedAccounts={linkedAccounts}
            onUnlinkAccount={handleUnlinkAccount}
          />
        );
      case 'settings':
        return <Settings user={profileUser} />;
      default:
        return <Dashboard user={profileUser} linkedAccounts={linkedAccounts} navigateTo={navigateTo} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>UGAB - Unified Gaming Dashboard</title>
        <meta
          name="description"
          content="Track your gaming achievements across Steam, Xbox, WoW, and Riot Games in one unified dashboard."
        />
      </Helmet>

      {/* Gate entire app by Supabase auth */}
      <AuthGate>
        <div className="flex min-h-screen">
          {/* Show sidebar only after profile is created */}
          {authUser && profileUser && (
            <Sidebar
              currentPage={currentPage}
              setCurrentPage={handleSetCurrentPage} // use wrapped setter
              user={{ ...profileUser, username }}
              linkedAccounts={linkedAccounts}
            />
          )}

          <main className={`flex-1 transition-all duration-300 ${authUser && profileUser ? 'pl-72' : ''}`}>
            {/* Signed-in user menu with username */}
            {authUser && <UserMenu />}

            <div className="px-4 py-2 text-sm opacity-70">
              Signed in as <strong>{username}</strong>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={pageKey} // re-mount on page or filter changes
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                className="p-4 sm:p-6 lg:p-8"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>

          <Toaster />
        </div>
      </AuthGate>
    </>
  );
}

export default App;
