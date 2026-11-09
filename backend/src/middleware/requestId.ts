import crypto from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

export function requestId(_req: Request, res: Response, next: NextFunction): void {
  const id = crypto.randomUUID();
  res.locals.requestId = id;
  res.setHeader('x-request-id', id);
  next();
}
