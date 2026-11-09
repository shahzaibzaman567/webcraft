import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { isProduction } from '../config/env';
import { AppError, errors } from '../lib/errors';
import { log } from '../lib/logger';

interface ErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ path: string; message: string }>;
  };
  requestId: string;
}

function respond(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: ErrorBody['error']['details'],
): void {
  const body: ErrorBody = {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
    requestId: String(res.locals.requestId ?? ''),
  };
  res.status(statusCode).json(body);
}

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(errors.notFound('Route not found'));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  const requestId = String(res.locals.requestId ?? '');

  if (error instanceof ZodError) {
    log('warn', 'request_validation_failed', { requestId });
    respond(
      res,
      422,
      'VALIDATION_ERROR',
      'Invalid request payload',
      error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    );
    return;
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      log('error', 'request_failed', { requestId, code: error.code, statusCode: error.statusCode });
    } else {
      log('warn', 'request_rejected', { requestId, code: error.code, statusCode: error.statusCode });
    }
    respond(
      res,
      error.statusCode,
      error.code,
      error.expose || !isProduction ? error.message : 'Request failed',
    );
    return;
  }

  const type = (error as { type?: string } | null)?.type;
  if (type === 'entity.too.large') {
    respond(res, 413, 'PAYLOAD_TOO_LARGE', 'Request payload is too large');
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    respond(res, 400, 'INVALID_JSON', 'Request body contains invalid JSON');
    return;
  }

  log('error', 'unhandled_error', {
    requestId,
    name: error instanceof Error ? error.name : 'UnknownError',
    message: error instanceof Error ? error.message : 'Unknown error',
    ...(isProduction || !(error instanceof Error) ? {} : { stack: error.stack }),
  });
  respond(res, 500, 'INTERNAL_ERROR', 'Internal server error');
}
