import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthGate({ children }) {
  const { user, loading, signInWithPassword, signUpWithPassword, resetPassword } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');

  if (loading) return <div className="p-8">Loading…</div>;
  if (user) return children;

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await signInWithPassword({ email: email.trim(), password });
    setMsg(error ? error.message : 'Signed in.');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setMsg('Passwords do not match.');
    const { error, data } = await signUpWithPassword({
      email: email.trim(),
      password,
      username: username.trim(),
    });
    if (error) return setMsg(error.message);
    // If email confirmations are ON, user must confirm via email.
    setMsg(data.user?.confirmed_at ? 'Account created.' : 'Check your email to confirm.');
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await resetPassword(email.trim());
    setMsg(error ? error.message : 'Password reset email sent.');
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="glass-effect rounded-2xl p-8 w-full max-w-md space-y-4">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${mode === 'signin' ? 'bg-indigo-600 text-white' : 'border'}`}
            onClick={() => { setMode('signin'); setMsg(''); }}
          >
            Sign in
          </button>
          <button
            className={`px-3 py-1 rounded ${mode === 'signup' ? 'bg-indigo-600 text-white' : 'border'}`}
            onClick={() => { setMode('signup'); setMsg(''); }}
          >
            Create account
          </button>
          <button
            className={`px-3 py-1 rounded ${mode === 'reset' ? 'bg-indigo-600 text-white' : 'border'}`}
            onClick={() => { setMode('reset'); setMsg(''); }}
          >
            Reset password
          </button>
        </div>

        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3">
            <input
              className="w-full px-3 py-2 rounded border bg-transparent"
              type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
            <input
              className="w-full px-3 py-2 rounded border bg-transparent"
              type="password" placeholder="password"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
            />
            <button className="w-full py-2 rounded bg-indigo-600 text-white">Sign in</button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <input
              className="w-full px-3 py-2 rounded border bg-transparent"
              type="text" placeholder="username"
              value={username} onChange={(e) => setUsername(e.target.value)}
              required minLength={3} maxLength={24}
            />
            <input
              className="w-full px-3 py-2 rounded border bg-transparent"
              type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
            <input
              className="w-full px-3 py-2 rounded border bg-transparent"
              type="password" placeholder="password (min 8 chars)"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
            />
            <input
              className="w-full px-3 py-2 rounded border bg-transparent"
              type="password" placeholder="confirm password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8}
            />
            <button className="w-full py-2 rounded bg-indigo-600 text-white">Create account</button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-3">
            <input
              className="w-full px-3 py-2 rounded border bg-transparent"
              type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
            <button className="w-full py-2 rounded bg-indigo-600 text-white">Send reset link</button>
          </form>
        )}

        {msg && <div className="text-sm opacity-80">{msg}</div>}
      </div>
    </div>
  );
}