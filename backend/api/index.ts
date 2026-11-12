import type { Request, Response } from 'express';
import { createApp } from '../src/app';
import { connectDB } from '../src/config/database';
import { ensureSettings } from '../src/services/settingsService';
import { keyPoolManager } from '../src/services/keyPoolManager';

let initialized = false;
let initPromise: Promise<void> | null = null;
const app = createApp();

const INIT_TIMEOUT_MS = 4_000;
const HEALTH_INIT_TIMEOUT_MS = 6_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Server initialization timed out after ${ms}ms`));
    }, ms);
    timer.unref();

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function initServer(): Promise<void> {
  if (initialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await ensureSettings();
      await keyPoolManager.init();
      initialized = true;
    })().catch((error: unknown) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

function isHealthRequest(url: string | undefined): boolean {
  const path = (url ?? '/').split('?')[0] ?? '/';
  return (
    path === '/' ||
    path === '/health' ||
    path === '/favicon.ico' ||
    path === '/robots.txt' ||
    path.startsWith('/api/health')
  );
}

export default async function handler(req: Request, res: Response): Promise<void> {
  const init = initServer().catch((error: unknown) => {
    console.error('Database/Settings init warning:', error);
  });

  const initTimeout = isHealthRequest(req.url) ? HEALTH_INIT_TIMEOUT_MS : INIT_TIMEOUT_MS;
  try {
    await withTimeout(init, initTimeout);
  } catch (error) {
    console.error('Request proceeded without full server initialization:', error);
  }

  return app(req, res);
}
