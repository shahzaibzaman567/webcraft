import type { Request, Response } from 'express';

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

export default function handler(_req: Request, res: Response): void {
  const results: Record<string, string> = {};

  for (const check of checks) {
    try {
      check.run();
      results[check.name] = 'ok';
    } catch (error) {
      results[check.name] =
        error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    }
  }

  res.status(200).json({ results });
}
