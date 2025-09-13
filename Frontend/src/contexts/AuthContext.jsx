import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // initial session + listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // one-time username upsert into public.profiles after sign-in
  useEffect(() => {
    const applyPendingUsername = async () => {
      if (!user) return;
      const pending = localStorage.getItem('pending_username');
      if (!pending) return;

      await supabase.from('profiles').upsert({ id: user.id, username: pending }, { onConflict: 'id' });
      if (!user.user_metadata?.username) {
        await supabase.auth.updateUser({ data: { username: pending } });
      }
      localStorage.removeItem('pending_username');
    };
    applyPendingUsername();
  }, [user]);

  const signUpWithPassword = async ({ email, password, username }) => {
    localStorage.setItem('pending_username', username?.trim() ?? '');
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: window.location.origin, // if email confirmations are enabled
      },
    });
  };

  const signInWithPassword = async ({ email, password }) =>
    supabase.auth.signInWithPassword({ email, password });

  const resetPassword = async (email) =>
    supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });

  const updatePassword = async (newPassword) =>
    supabase.auth.updateUser({ password: newPassword });

  const signOut = async () => supabase.auth.signOut();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUpWithPassword,
        signInWithPassword,
        resetPassword,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);