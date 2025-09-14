import React, { useState, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Star, Plus, Edit, Trash2, Check, X } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    
    const CustomAchievements = ({ user }) => {
      const { toast } = useToast();
      const [achievements, setAchievements] = useState([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editingAchievement, setEditingAchievement] = useState(null);
      const [formData, setFormData] = useState({ name: '', description: '' });
    
      useEffect(() => {
        const savedAchievements = localStorage.getItem('custom_achievements');
        if (savedAchievements) {
          setAchievements(JSON.parse(savedAchievements));
        } else {
          const mockData = [
            { id: 1, name: "Finish a game from the backlog", description: "Complete any game that has been in your library for over a year.", unlocked: true },
            { id: 2, name: "No-Hit a Boss", description: "Defeat a boss in any Souls-like game without taking damage.", unlocked: false },
          ];
          setAchievements(mockData);
          localStorage.setItem('custom_achievements', JSON.stringify(mockData));
        }
      }, []);
    
      const saveAchievements = (newAchievements) => {
        setAchievements(newAchievements);
        localStorage.setItem('custom_achievements', JSON.stringify(newAchievements));
      };
    
      const handleOpenModal = (ach = null) => {
        setEditingAchievement(ach);
        setFormData(ach ? { name: ach.name, description: ach.description } : { name: '', description: '' });
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAchievement(null);
        setFormData({ name: '', description: '' });
      };
    
      const handleSubmit = () => {
        if (!formData.name.trim() || !formData.description.trim()) {
          toast({ title: "Missing fields", description: "Please fill in both name and description.", variant: "destructive" });
          return;
        }
    
        if (editingAchievement) {
          const updatedAchievements = achievements.map(ach =>
            ach.id === editingAchievement.id ? { ...ach, ...formData } : ach
          );
          saveAchievements(updatedAchievements);
          toast({ title: "Achievement Updated!", className: 'bg-blue-600/90 text-white' });
        } else {
          const newAchievement = {
            id: Date.now(),
            name: formData.name,
            description: formData.description,
            unlocked: false,
          };
          saveAchievements([...achievements, newAchievement]);
          toast({ title: "Achievement Created!", className: 'bg-green-600/90 text-white' });
        }
        handleCloseModal();
      };
    
      const handleDelete = (id) => {
        const newAchievements = achievements.filter(ach => ach.id !== id);
        saveAchievements(newAchievements);
        toast({ title: "Achievement Deleted", variant: "destructive" });
      };
    
      const toggleUnlocked = (id) => {
        const updatedAchievements = achievements.map(ach =>
          ach.id === id ? { ...ach, unlocked: !ach.unlocked } : ach
        );
        saveAchievements(updatedAchievements);
      };
    
      return (
        <>
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold animated-gradient-text mb-2">Custom Achievements</h1>
              <p className="text-gray-400 text-lg">Forge your own legend. Create and track personal gaming challenges.</p>
            </div>
    
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-end"
            >
              <Button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30">
                <Plus className="h-5 w-5 mr-2" />
                Create New Achievement
              </Button>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((ach, index) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`glass-effect rounded-xl p-6 transition-all duration-300 ${ach.unlocked ? 'border-l-4 border-green-400' : 'border-l-4 border-gray-600'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className={`text-xl font-bold ${ach.unlocked ? 'text-white' : 'text-gray-300'}`}>{ach.name}</h3>
                      <p className="text-gray-400 mt-1">{ach.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => toggleUnlocked(ach.id)}>
                        {ach.unlocked ? (
                          <div className="flex items-center gap-2 text-green-400">
                            <Star className="h-6 w-6" fill="currentColor" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Star className="h-6 w-6" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(ach)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500/70 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(ach.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
    
          <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold animated-gradient-text">
                  {editingAchievement ? 'Edit Achievement' : 'Create Achievement'}
                </DialogTitle>
                <DialogDescription>
                  {editingAchievement ? 'Update your personal challenge.' : 'Define a new goal for your gaming journey.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Backlog Buster" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="e.g., Finish a game you've owned for over a year." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  {editingAchievement ? 'Save Changes' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    };
    
    export default CustomAchievements;