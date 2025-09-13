import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Plus, Check, ExternalLink, Shield, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const LinkAccounts = ({ onLinkAccount, linkedAccounts, onUnlinkAccount }) => {
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({});
  const { toast } = useToast();

  const platforms = [
    { id: 'steam', name: 'Steam', description: 'Achievements & game library', color: 'from-blue-500 to-cyan-400', icon: '🎮', fields: [{ name: 'steamId', label: 'Steam ID or Vanity URL', placeholder: 'e.g., gaben', required: true }, { name: 'username', label: 'Display Name', placeholder: 'Your gamer tag', required: true }] },
    { id: 'xbox', name: 'Xbox', description: 'Gamerscore & achievements', color: 'from-green-500 to-emerald-400', icon: '🎯', fields: [{ name: 'gamertag', label: 'Gamertag', placeholder: 'e.g., Major Nelson', required: true }, { name: 'username', label: 'Display Name', placeholder: 'Your gamer tag', required: true }], oauth: true },
    { id: 'wow', name: 'WoW', description: 'Character achievements', color: 'from-yellow-500 to-orange-400', icon: '⚔️', fields: [{ name: 'battlenetId', label: 'Battle.net ID', placeholder: 'YourName#1234', required: true }, { name: 'username', label: 'Display Name', placeholder: 'Your gamer tag', required: true }], oauth: true },
    { id: 'riot', name: 'Riot Games', description: 'LoL/VALORANT ranks', color: 'from-red-500 to-pink-500', icon: '🔥', fields: [{ name: 'riotId', label: 'Riot ID', placeholder: 'YourName#TAG', required: true }, { name: 'username', label: 'Display Name', placeholder: 'Your gamer tag', required: true }] },
  ];

  const isLinked = (platformId) => linkedAccounts.some(account => account.platform.toLowerCase() === platformId);

  const handleFormSubmit = (platform) => {
    const requiredFields = platform.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]?.trim());
    
    if (missingFields.length > 0) {
      toast({ title: "Missing Information", description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`, variant: "destructive" });
      return;
    }

    onLinkAccount({ platform: platform.name, ...formData, linkedAt: new Date().toISOString() });
    setActiveForm(null);
    setFormData({});
  };

  const handleOAuthConnect = (platform) => {
    toast({
      title: "🚧 OAuth Coming Soon!",
      description: `${platform.name} OAuth isn't implemented. You can request it in your next prompt! 🚀`,
    });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-bold animated-gradient-text mb-2">Link Your Accounts</h1>
        <p className="text-gray-400 text-lg">Connect your gaming platforms to build your unified profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform, index) => {
          const linked = isLinked(platform.id);
          const isActive = activeForm === platform.id;
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
              layout
              className={`glass-effect rounded-xl p-6 transition-all duration-300 ${isActive ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center text-3xl shadow-lg`}>{platform.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                    <p className="text-sm text-gray-400">{platform.description}</p>
                  </div>
                </div>
                {linked && (
                  <div className="flex items-center gap-2 text-green-400">
                    <Check className="h-5 w-5" /> <span className="text-sm font-medium">Linked</span>
                  </div>
                )}
              </div>

              <AnimatePresence>
              {!linked && !isActive && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                  {platform.oauth ? (
                    <Button onClick={() => handleOAuthConnect(platform)} className="w-full bg-white/10 hover:bg-white/20 text-white"><Shield className="h-4 w-4 mr-2" />Connect with OAuth</Button>
                  ) : (
                    <Button onClick={() => setActiveForm(platform.id)} className="w-full bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" />Link Manually</Button>
                  )}
                </motion.div>
              )}
              </AnimatePresence>

              <AnimatePresence>
                {!linked && isActive && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="space-y-4 pt-4">
                      {platform.fields.map(field => (
                        <div key={field.name}>
                          <label className="block text-xs font-medium text-gray-400 mb-1">{field.label} {field.required && '*'}</label>
                          <input type="text" name={field.name} value={formData[field.name] || ''} onChange={handleChange} placeholder={field.placeholder} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                      ))}
                      <div className="flex gap-3 pt-2">
                        <Button onClick={() => handleFormSubmit(platform)} className="flex-1 bg-blue-600 hover:bg-blue-700"><Link className="h-4 w-4 mr-2" />Link Account</Button>
                        <Button onClick={() => { setActiveForm(null); setFormData({}); }} variant="ghost" size="icon" className="hover:bg-white/10"><X className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {linked && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-green-400 font-semibold">{linkedAccounts.find(acc => acc.platform.toLowerCase() === platform.id)?.username}</p>
                    <p className="text-xs text-gray-400">Linked on {new Date(linkedAccounts.find(acc => acc.platform.toLowerCase() === platform.id)?.linkedAt).toLocaleDateString()}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => onUnlinkAccount(linkedAccounts.find(acc => acc.platform.toLowerCase() === platform.id)?.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LinkAccounts;