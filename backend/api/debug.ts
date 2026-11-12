import type { Request, Response } from 'express';
import { connectDB, isDatabaseReady } from '../src/config/database';

interface Check {
  name: string;
  run: () => unknown;
}

const checks: Check[] = [
  { name: 'env', run: () => require('../src/config/env') },
  { name: 'crypto', run: () => require('../src/lib/crypto') },
  { name: 'express', run: () => require('express') },
  { name: 'mongoose', run: () => require('mongoose') },
  { name: 'inngest', run: () => require('inngest') },
  { name: '@clerk/backend', run: () => require('@clerk/backend') },
  { name: 'app-module', run: () => require('../src/app') },
  {
    name: 'createApp',
    run: () => {
      const { createApp } = require('../src/app') as typeof import('../src/app');
      return createApp();
    },
  },
];

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`.split('\n')[0] ?? error.name;
  }
  return String(error);
}

export default async function handler(_req: Request, res: Response): Promise<void> {
  const results: Record<string, string> = {};

  for (const check of checks) {
    try {
      check.run();
      results[check.name] = 'ok';
    } catch (error) {
      results[check.name] = describeError(error);
    }
  }

  try {
    await Promise.race([
      connectDB(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('connect timeout')), 9_000)),
    ]);
    results['mongodb-connect'] = isDatabaseReady() ? 'ok' : 'not-ready';
  } catch (error) {
    results['mongodb-connect'] = describeError(error);
  }

  res.status(200).json({ results });
}
