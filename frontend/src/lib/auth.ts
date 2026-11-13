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
export const SUPERADMIN_EMAILS = [
  'shahzaibzaman.official@gmail.com',
  'shahzaibzaman567@gmail.com',
  'shahzaibzaman465@gmail.com',
  'shahzaibzaman@gmail.com',
];
export const SUPERADMIN_USERNAMES = [
  'shahzaibzaman567',
  'shahzaibzaman465',
  'shahzaibzaman',
  'shah-coder',
  'shahzaib',
];
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

export function isAdminIdentity(email?: string, username?: string, name?: string): boolean {
  const e = (email || '').trim().toLowerCase();
  const u = (username || '').trim().toLowerCase();
  const n = (name || '').trim().toLowerCase();

  if (e && SUPERADMIN_EMAILS.some((adm) => e === adm.toLowerCase())) return true;
  if (u && SUPERADMIN_USERNAMES.some((adm) => u === adm.toLowerCase())) return true;
  if (e && e.includes('shahzaibzaman')) return true;
  if (u && u.includes('shahzaibzaman')) return true;
  if (n && n.includes('shahzaib zaman')) return true;
  return false;
}

function isAdminEmail(email: string, username?: string): boolean {
  return isAdminIdentity(email, username);
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
    if (isAdminIdentity(user.email, user.username, user.name)) {
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
  const isAdmin = isAdminIdentity(cleanEmail, undefined, name);
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
  const isAdmin = isAdminIdentity(cleanEmail, profile.username, profile.name);
  const user: WebcraftUser = {
    id: profile.id,
    name: profile.name || cleanEmail.split('@')[0] || 'Webcraft User',
    username: profile.username,
    workspaceName: profile.workspaceName,
    email: cleanEmail,
    avatar: profile.avatar,
    role: isAdmin ? 'admin' : (profile.role ?? 'user'),
    createdAt: profile.createdAt ?? Date.now(),
  };
  return persistUser(user);
}

export function updateLocalUser(patch: Partial<WebcraftUser>): WebcraftUser | null {
  const existing = getCurrentUser();
  if (!existing) return null;
  const user = { ...existing, ...patch };
  if (isAdminIdentity(user.email, user.username, user.name)) {
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
  if (!user) return false;
  if (user.role === 'admin') return true;
  return isAdminIdentity(user.email, user.username, user.name);
}
