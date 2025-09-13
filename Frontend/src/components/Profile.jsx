import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Trophy, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Profile = ({ onCreateProfile }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    bio: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username.trim() && formData.displayName.trim()) {
      onCreateProfile(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30"
          >
            <Trophy className="h-12 w-12 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold animated-gradient-text mb-2">
            Welcome to OmniGamer
          </h1>
          <p className="text-gray-400 text-lg">
            Create your profile to unify your gaming legacy.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username *</label>
                <div className="relative">
                  <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your unique handle" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Display Name *</label>
                <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="How you appear" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div className="relative">
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="For notifications (optional)" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Your gaming motto..."/>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
            >
              <Gamepad2 className="h-5 w-5 mr-2" />
              Create My Gaming Hub
            </Button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-sm text-gray-500"
        >
          Track achievements from Steam, Xbox, WoW, and Riot Games. 🎮
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Profile;