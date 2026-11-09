import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import {
  clearAuthUser,
  getCurrentUser,
  registerClerkTokenGetter,
  setClerkAuthState,
  setClerkUser,
} from '../lib/auth';

export const ClerkAuthBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    registerClerkTokenGetter(() => getToken());
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;

    setClerkAuthState(Boolean(isSignedIn));

    if (isSignedIn && user) {
      const email = (
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0]?.emailAddress ??
        ''
      ).trim().toLowerCase();

      if (email) {
        const existing = getCurrentUser();
        setClerkUser({
          id: user.id,
          email,
          name: user.fullName || user.firstName || email.split('@')[0] || 'Webcraft User',
          username: user.username ?? undefined,
          avatar: user.imageUrl ?? undefined,
          createdAt: existing?.createdAt,
        });
      }
    } else {
      clearAuthUser();
    }

    setReady(true);
  }, [isLoaded, isSignedIn, user]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040819] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
          <span className="text-sm font-medium text-slate-400">Loading your workspace...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
