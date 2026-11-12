import { Router } from 'express';
import { env } from '../config/env';
import { isDatabaseReady } from '../config/database';
import { isInngestConfigured } from '../inngest/client';
import { isClerkConfigured } from '../middleware/requireUser';
import { keyPoolManager } from '../services/keyPoolManager';
import { isMailConfigured } from '../services/mailer';
import { isSupabaseConfigured } from '../services/supabaseMirror';

const router = Router();

router.get('/', (_req, res) => {
  const stats = keyPoolManager.getStats();
  const databaseReady = isDatabaseReady();
  res.json({
    success: true,
    data: {
      status: databaseReady ? 'operational' : 'degraded',
      database: databaseReady ? 'connected' : 'disconnected',
      platform: 'Webcraft AI Builder',
      version: '1.0.0',
      uptimeSeconds: Math.round(process.uptime()),
      activeKeys: stats.active,
      totalKeys: stats.total,
      cooldownKeys: stats.cooldown,
      providers: stats.providers,
      capabilities: {
        mongodb: Boolean(env.mongodbUri),
        encryption: Boolean(env.masterEncryptionSecret),
        adminApi: Boolean(env.adminApiSecret),
        clerk: isClerkConfigured(),
        supabase: isSupabaseConfigured(),
        email: isMailConfigured(),
        inngest: isInngestConfigured(),
      },
      timestamp: new Date().toISOString(),
    },
    requestId: String(res.locals.requestId ?? ''),
  });
});

export const healthRouter = router;
