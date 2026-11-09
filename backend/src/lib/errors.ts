export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly expose: boolean;

  constructor(statusCode: number, code: string, message: string, expose = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.expose = expose;
  }
}

export class ProviderError extends AppError {
  readonly retryable: boolean;
  readonly cooldownMs: number;
  readonly fatal: boolean;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    options: { retryable: boolean; cooldownMs?: number; fatal?: boolean },
  ) {
    super(statusCode, code, message);
    this.name = 'ProviderError';
    this.retryable = options.retryable;
    this.cooldownMs = options.cooldownMs ?? 0;
    this.fatal = options.fatal ?? false;
  }
}

export const errors = {
  unauthorized: () => new AppError(401, 'UNAUTHORIZED', 'Admin authorization is required'),
  loginRequired: () => new AppError(401, 'UNAUTHORIZED', 'Please sign in to continue'),
  forbidden: (message = 'You do not have permission to access this resource') =>
    new AppError(403, 'FORBIDDEN', message),
  notFound: (message = 'Resource not found') => new AppError(404, 'NOT_FOUND', message),
  badRequest: (message = 'Invalid request') => new AppError(400, 'BAD_REQUEST', message),
  validation: (message = 'Invalid request payload') => new AppError(422, 'VALIDATION_ERROR', message),
  tooLarge: (message = 'Request payload is too large') => new AppError(413, 'PAYLOAD_TOO_LARGE', message),
  tooManyRequests: (message = 'Too many requests, please try again later') =>
    new AppError(429, 'RATE_LIMITED', message),
  unavailable: (message = 'Service temporarily unavailable') =>
    new AppError(503, 'SERVICE_UNAVAILABLE', message),
  badGateway: (message = 'Upstream service failed to return a valid response') =>
    new AppError(502, 'BAD_GATEWAY', message),
  internal: () => new AppError(500, 'INTERNAL_ERROR', 'Internal server error', false),
};
