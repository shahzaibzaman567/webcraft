import { Server } from 'node:http';
import { createApp } from './app';
import { connectDB, disconnectDB } from './config/database';
import { env } from './config/env';
import { log } from './lib/logger';
import { keyPoolManager } from './services/keyPoolManager';
import { ensureSettings } from './services/settingsService';

let server: Server | null = null;
let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  log('info', 'shutdown_started', { signal });

  const force = setTimeout(() => {
    log('error', 'shutdown_forced');
    process.exit(1);
  }, 10_000);
  force.unref();

  if (server) {
    await new Promise<void>((resolve) => {
      server?.close(() => resolve());
    });
  }

  try {
    await keyPoolManager.flush();
  } catch {
    log('error', 'key_pool_flush_failed_on_shutdown');
  }

  try {
    await disconnectDB();
  } catch {
    log('error', 'mongodb_disconnect_failed_on_shutdown');
  }

  clearTimeout(force);
  log('info', 'shutdown_complete');
  process.exit(0);
}

async function main(): Promise<void> {
  await connectDB();
  await ensureSettings();
  await keyPoolManager.init();

  const app = createApp();
  server = app.listen(env.port, () => {
    log('info', 'server_started', {
      port: env.port,
      env: env.nodeEnv,
      frontendUrl: env.frontendUrl,
    });
  });

  server.on('error', (error) => {
    log('error', 'server_error', { name: error.name });
    process.exitCode = 1;
  });

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
  process.on('unhandledRejection', (reason) => {
    log('error', 'unhandled_rejection', {
      name: reason instanceof Error ? reason.name : 'UnknownError',
    });
  });
  process.on('uncaughtException', (error) => {
    log('error', 'uncaught_exception', { name: error.name });
    void shutdown('uncaughtException');
  });
}

main().catch((error: unknown) => {
  log('error', 'startup_failed', { name: error instanceof Error ? error.name : 'UnknownError' });
  process.exit(1);
});
