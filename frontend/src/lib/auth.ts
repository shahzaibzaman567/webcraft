/**
 * Webcraft Auth Manager
 * --------------------
 * Clerk is the production auth source. A local email session is kept only as a
 * development fallback when no Clerk publishable key is configured.
 */

export interface WebcraftUser {
  id: string;
  name: string;
  username?: string;
  workspaceName?: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: number;
}

export const SUPERADMIN_EMAIL = 'shahzaibzaman.official@gmail.com';
export const CLERK_ENABLED = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const USER_STORAGE_KEY = 'webcraft_user';

interface ClerkWindow extends Window {
  Clerk?: {
    signOut?: (options?: { redirectUrl?: string }) => Promise<void>;
    session?: {
      getToken: () => Promise<string | null>;
    };
  };
}

let clerkSignedIn = !CLERK_ENABLED;
let clerkTokenGetter: (() => Promise<string | null>) | null = null;

function isAdminEmail(email: string): boolean {
  return email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
}

export function registerClerkTokenGetter(getter: () => Promise<string | null>): void {
  clerkTokenGetter = getter;
}

export function getClerkToken(): Promise<string | null> {
  if (clerkTokenGetter) {
    return clerkTokenGetter();
  }
  const clerk = (window as ClerkWindow).Clerk;
  if (clerk?.session) {
    return clerk.session.getToken();
  }
  return Promise.resolve(null);
}

export function setClerkAuthState(signedIn: boolean): void {
  clerkSignedIn = signedIn;
}

export function getCurrentUser(): WebcraftUser | null {
  if (typeof window === 'undefined') return null;
  if (CLERK_ENABLED && !clerkSignedIn) return null;

  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as WebcraftUser;
    if (isAdminEmail(user.email)) {
      user.role = 'admin';
    }
    return user;
  } catch {
    return null;
  }
}

function persistUser(user: WebcraftUser, notify = true): WebcraftUser {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  if (notify) {
    window.dispatchEvent(new CustomEvent('webcraft-auth-change', { detail: user }));
  }
  return user;
}

export function setCurrentUser(email: string, name?: string, avatar?: string): WebcraftUser {
  const cleanEmail = email.trim().toLowerCase();
  const isAdmin = isAdminEmail(cleanEmail);
  const existing = getCurrentUser();
  const user: WebcraftUser = {
    id: existing?.id ?? `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name?.trim() || existing?.name || (isAdmin ? 'Shahzaib Zaman' : cleanEmail.split('@')[0] || 'Webcraft User'),
    email: cleanEmail,
    avatar: avatar || existing?.avatar || undefined,
    role: isAdmin ? 'admin' : 'user',
    createdAt: existing?.createdAt ?? Date.now(),
  };

  return persistUser(user);
}

export function setClerkUser(profile: {
  id: string;
  email: string;
  name: string;
  username?: string;
  workspaceName?: string;
  avatar?: string;
  role?: 'admin' | 'user';
  createdAt?: number;
}): WebcraftUser {
  const cleanEmail = profile.email.trim().toLowerCase();
  const user: WebcraftUser = {
    id: profile.id,
    name: profile.name || cleanEmail.split('@')[0] || 'Webcraft User',
    username: profile.username,
    workspaceName: profile.workspaceName,
    email: cleanEmail,
    avatar: profile.avatar,
    role: profile.role ?? (isAdminEmail(cleanEmail) ? 'admin' : 'user'),
    createdAt: profile.createdAt ?? Date.now(),
  };
  return persistUser(user);
}

export function updateLocalUser(patch: Partial<WebcraftUser>): WebcraftUser | null {
  const existing = getCurrentUser();
  if (!existing) return null;
  const user = { ...existing, ...patch };
  if (isAdminEmail(user.email)) {
    user.role = 'admin';
  }
  return persistUser(user);
}

export function clearAuthUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('webcraft-auth-change', { detail: null }));
}

export function logout(): void {
  clearAuthUser();
  void (window as ClerkWindow).Clerk?.signOut?.({ redirectUrl: '/login' });
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function isSuperAdmin(): boolean {
  const user = getCurrentUser();
  return user?.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase() || user?.role === 'admin';
}
