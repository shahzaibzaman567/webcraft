import { createClerkClient, verifyToken } from '@clerk/backend';
import { NextFunction, Request, Response } from 'express';
import { env, isProduction } from '../config/env';
import { AppError, errors } from '../lib/errors';
import { log } from '../lib/logger';
import { User } from '../models/User';

export interface AuthUser {
  clerkId: string;
  email: string;
  name: string;
  username?: string;
  workspaceName?: string;
  avatar?: string;
  role: 'admin' | 'user';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

const clerk = env.clerk.secretKey
  ? createClerkClient({ secretKey: env.clerk.secretKey, publishableKey: env.clerk.publishableKey || undefined })
  : null;

function bearerToken(req: Request): string {
  const authorization = req.get('authorization');
  return authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
}

function displayName(first?: string | null, last?: string | null, email?: string): string {
  const full = [first, last].filter(Boolean).join(' ').trim();
  if (full) return full;
  return (email ?? '').split('@')[0] || 'Webcraft User';
}

async function resolveClerkUser(req: Request): Promise<AuthUser | null> {
  const token = bearerToken(req);
  if (!token || !clerk || !env.clerk.secretKey) {
    return null;
  }

  const payload = await verifyToken(token, {
    secretKey: env.clerk.secretKey,
    ...(env.clerk.authorizedParties.length > 0
      ? { authorizedParties: env.clerk.authorizedParties }
      : {}),
  });

  const clerkId = typeof payload?.sub === 'string' ? payload.sub : '';
  if (!clerkId) {
    return null;
  }

  const user = await clerk.users.getUser(clerkId);
  const primary = user.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId);
  const email = (primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '').trim().toLowerCase();
  if (!email) {
    return null;
  }

  const adminEmail = env.adminEmail.trim().toLowerCase();
  return {
    clerkId,
    email,
    name: displayName(user.firstName, user.lastName, email),
    username: user.username ?? undefined,
    avatar: user.imageUrl || undefined,
    role: email === adminEmail ? 'admin' : 'user',
  };
}

function resolveDevUser(req: Request): AuthUser | null {
  if (isProduction || !env.allowDevAuth) {
    return null;
  }
  const rawEmail = req.get('x-user-email')?.trim().toLowerCase() ?? '';
  if (!rawEmail || !rawEmail.includes('@')) {
    return null;
  }
  const adminEmail = env.adminEmail.trim().toLowerCase();
  return {
    clerkId: `dev_${rawEmail}`,
    email: rawEmail,
    name: rawEmail.split('@')[0] || 'Webcraft User',
    role: rawEmail === adminEmail ? 'admin' : 'user',
  };
}

async function persistUser(user: AuthUser): Promise<void> {
  const existing = await User.findOne({ email: user.email }).select('status role username workspaceName').lean();
  if (existing?.status === 'suspended') {
    throw errors.forbidden('This account has been suspended');
  }

  const patch: Record<string, unknown> = {
    clerkId: user.clerkId,
    name: user.name,
    avatar: user.avatar ?? '',
    role: user.role,
    lastActive: new Date(),
  };
  const setOnInsert: Record<string, unknown> = {
    status: 'active',
    projectsCount: 0,
  };
  if (user.username) {
    patch.username = user.username;
  } else {
    setOnInsert.username = (user.email.split('@')[0] ?? '').toLowerCase();
  }
  if (user.workspaceName) {
    patch.workspaceName = user.workspaceName;
  } else {
    setOnInsert.workspaceName = `${user.name.split(' ')[0] || 'Webcraft'}'s Workspace`;
  }

  await User.findOneAndUpdate(
    { email: user.email },
    {
      $set: patch,
      $setOnInsert: setOnInsert,
    },
    { upsert: true, new: true },
  );
}

export async function requireUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const resolved = (await resolveClerkUser(req)) ?? resolveDevUser(req);
    if (!resolved) {
      next(errors.loginRequired());
      return;
    }
    await persistUser(resolved);
    req.authUser = resolved;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    log('warn', 'auth_verification_failed', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
    next(errors.loginRequired());
  }
}

export function isClerkConfigured(): boolean {
  return Boolean(env.clerk.secretKey);
}
