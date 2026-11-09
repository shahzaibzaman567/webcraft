type LogLevel = 'info' | 'warn' | 'error';

const SECRET_PATTERNS: RegExp[] = [
  /Bearer\s+[A-Za-z0-9._~+/=-]+/gi,
  /\bsk-[A-Za-z0-9_-]{8,}\b/g,
  /\bgsk_[A-Za-z0-9_-]{8,}\b/g,
  /\bAIza[0-9A-Za-z_-]{8,}\b/g,
  /\bsk-or-v1-[A-Za-z0-9_-]{8,}\b/g,
];

function redact(value: unknown): string {
  let text = typeof value === 'string' ? value : JSON.stringify(value);
  if (text === undefined) {
    return '';
  }
  for (const pattern of SECRET_PATTERNS) {
    text = text.replace(pattern, '[REDACTED]');
  }
  return text;
}

export function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta: JSON.parse(redact(meta) || '{}') as Record<string, unknown> } : {}),
  };
  const line = redact(entry);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}
