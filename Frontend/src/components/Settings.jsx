import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Bell, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Settings = ({ user }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: user.username,
    displayName: user.displayName || '',
    email: user.email || '',
    bio: user.bio || '',
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast({
      title: 'Profile Updated! ✨',
      description: 'Your changes have been saved.',
      className: 'bg-green-600/90 border-green-500 text-white',
    });
  };
  
  const handleFeatureRequest = () => {
    toast({
        title: "🚧 This feature isn't implemented yet!",
        description: "You can request this in your next prompt. 🚀"
    });
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
              <textarea
                rows="4"
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
          </form>
        );
      default:
        return (
            <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-white mb-4">Coming Soon!</h3>
                <p className="text-gray-400 mb-6">This section is under construction. You can request it in the next prompt!</p>
                <Button onClick={handleFeatureRequest}>Request This Feature</Button>
            </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold animated-gradient-text mb-2">Settings</h1>
        <p className="text-gray-400 text-lg mb-10">Manage your profile, account, and preferences.</p>
        
        <div className="flex space-x-2 glass-effect p-2 rounded-xl mb-8">
            {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                    <Button 
                        key={tab.id}
                        variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 text-base ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                    >
                        <Icon className="h-5 w-5 mr-2" />
                        {tab.label}
                    </Button>
                )
            })}
        </div>
        
        <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-effect p-8 rounded-xl"
        >
            {renderContent()}
        </motion.div>
    </div>
  );
};

export default Settings;