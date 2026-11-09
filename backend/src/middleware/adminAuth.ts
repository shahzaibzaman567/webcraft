import crypto from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { errors } from '../lib/errors';

function safeEqual(left: string, right: string): boolean {
  const leftHash = crypto.createHash('sha256').update(left).digest();
  const rightHash = crypto.createHash('sha256').update(right).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.get('authorization');
  const bearer = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  const token = bearer || req.get('x-admin-api-secret')?.trim() || '';
  const adminEmailHeader = req.get('x-admin-email')?.trim().toLowerCase();
  const isSecretValid = Boolean(token) && safeEqual(token, env.adminApiSecret);
  const isEmailValid = !adminEmailHeader || adminEmailHeader === env.adminEmail.toLowerCase();

  if (!isSecretValid || !isEmailValid) {
    next(errors.unauthorized());
    return;
  }

  next();
}
