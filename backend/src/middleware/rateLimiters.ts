import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { errors } from '../lib/errors';

const handler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(errors.tooManyRequests());
};

const base = {
  standardHeaders: 'draft-7' as const,
  legacyHeaders: false,
  handler,
};

export const globalLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 300,
});

export const adminLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 30,
});

export const aiLimiter = rateLimit({
  ...base,
  windowMs: 60 * 1000,
  limit: 20,
});

export const imageLimiter = rateLimit({
  ...base,
  windowMs: 60 * 1000,
  limit: 60,
});

export const exportLimiter = rateLimit({
  ...base,
  windowMs: 60 * 1000,
  limit: 10,
});

export const contactLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 5,
});

export const integrationLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 20,
});
