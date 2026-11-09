import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { serve } from 'inngest/express';
import { env } from './config/env';
import { inngest, isInngestConfigured } from './inngest/client';
import { inngestFunctions } from './inngest/functions';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { globalLimiter } from './middleware/rateLimiters';
import { requestId } from './middleware/requestId';
import { accountRouter } from './routes/account';
import { adminRouter } from './routes/admin';
import { adminKeysRouter } from './routes/adminKeys';
import { chatRouter } from './routes/chat';
import { contactRouter } from './routes/contact';
import { exportZipRouter } from './routes/exportZip';
import { generateRouter } from './routes/generate';
import { healthRouter } from './routes/health';
import { imageRouter } from './routes/image';
import { integrationsRouter } from './routes/integrations';
import { jobsRouter } from './routes/jobs';
import { projectsRouter } from './routes/projects';
import { publicSettingsRouter } from './routes/publicSettings';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  if (env.trustProxy > 0) {
    app.set('trust proxy', env.trustProxy);
  }

  app.use(requestId);
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origin === env.frontendUrl) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Admin-API-Secret',
        'X-Admin-Email',
        'X-User-Email',
      ],
      exposedHeaders: ['Content-Disposition'],
      maxAge: 86_400,
      optionsSuccessStatus: 204,
    }),
  );
  app.use(express.json({ limit: '6mb' }));

  if (isInngestConfigured()) {
    app.use(
      '/api/inngest',
      serve({
        client: inngest,
        functions: inngestFunctions,
      }),
    );
  }

  app.use(globalLimiter);

  app.use('/api/health', healthRouter);
  app.use('/api/settings/public', publicSettingsRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/account', accountRouter);
  app.use('/api/integrations', integrationsRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/jobs', jobsRouter);
  app.use('/api/generate', generateRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/image', imageRouter);
  app.use('/api/export-zip', exportZipRouter);
  app.use('/api/admin/keys', adminKeysRouter);
  app.use('/api/admin', adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
