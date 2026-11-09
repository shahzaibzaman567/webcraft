import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { clearAuthUser, setCurrentUser, updateLocalUser } from '../lib/auth';
import { getMe } from '../lib/userApi';

interface DevAuthPanelProps {
  mode: 'signIn' | 'signUp';
  onAuthenticated: () => void;
}

export const DevAuthPanel: React.FC<DevAuthPanelProps> = ({ mode, onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setLoading(true);
    setError('');
    setCurrentUser(cleanEmail, name.trim() || undefined);

    try {
      const account = await getMe();
      updateLocalUser({
        id: account.id,
        email: account.email,
        name: account.name,
        username: account.username || undefined,
        workspaceName: account.workspaceName || undefined,
        avatar: account.avatar || undefined,
        role: account.role,
      });
      onAuthenticated();
    } catch (err) {
      clearAuthUser();
      setError(
        err instanceof Error
          ? err.message
          : 'Development sign-in failed. Check the backend configuration.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">Clerk is not configured</p>
          <p>
            This email-only form is a development fallback. It only works when the backend has
            <code className="mx-1 rounded bg-amber-100 px-1 dark:bg-amber-900/50">ALLOW_DEV_AUTH=true</code>
            and is not enabled in production.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === 'signUp' && (
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/15 dark:bg-[#070c24] dark:text-white"
            />
          </div>
        )}

        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/15 dark:bg-[#070c24] dark:text-white"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-slate-950 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
        >
          {loading ? 'Verifying with backend...' : 'Continue in development mode'}
        </button>
      </form>

      <p className="text-center text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
        For production authentication, add <code className="rounded bg-slate-100 px-1 dark:bg-white/10">VITE_CLERK_PUBLISHABLE_KEY</code> to the frontend and the Clerk secret keys to the backend.
      </p>
    </div>
  );
};
