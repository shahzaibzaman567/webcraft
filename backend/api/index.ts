import type { Request, Response } from 'express';
import { createApp } from '../src/app';
import { connectDB } from '../src/config/database';
import { ensureSettings } from '../src/services/settingsService';
import { keyPoolManager } from '../src/services/keyPoolManager';

let initialized = false;
let initPromise: Promise<void> | null = null;
const app = createApp();

async function initServer(): Promise<void> {
  if (initialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await ensureSettings();
      await keyPoolManager.init();
      initialized = true;
    })();
  }
  return initPromise;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    await initServer();
  } catch (error) {
    console.error('Database/Settings init warning:', error);
  }
  return app(req, res);
}

