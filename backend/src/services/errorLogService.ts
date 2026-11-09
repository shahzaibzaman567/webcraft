import { ErrorLevel, ErrorLog } from '../models/ErrorLog';
import { ProviderId } from '../types/keys';
import { log } from '../lib/logger';

const SERVICE_NAMES: Record<ProviderId, string> = {
  gemini: 'Google Gemini',
  groq: 'Groq Cloud (Llama 3.3)',
  openrouter: 'OpenRouter',
  together: 'Together AI (FLUX)',
};

export function providerLabel(provider: ProviderId): string {
  return SERVICE_NAMES[provider];
}

export interface ErrorLogInput {
  level: ErrorLevel;
  service: string;
  endpoint: string;
  message: string;
}

export async function recordErrorLog(input: ErrorLogInput): Promise<void> {
  try {
    await ErrorLog.create({
      timestamp: new Date(),
      level: input.level,
      service: input.service.slice(0, 120),
      endpoint: input.endpoint.slice(0, 120),
      message: input.message.slice(0, 1000),
      status: 'unresolved',
    });
  } catch (error) {
    log('error', 'error_log_write_failed', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
  }
}

export function recordErrorLogSafe(input: ErrorLogInput): void {
  void recordErrorLog(input);
}
