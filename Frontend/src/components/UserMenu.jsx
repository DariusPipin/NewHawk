import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="text-sm opacity-80">{user.email}</div>
      <button onClick={signOut} className="px-3 py-1 rounded border">Sign out</button>
    </div>
  );
}