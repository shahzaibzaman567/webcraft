import { errors } from '../lib/errors';

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizePrompt(input: string, maxLength = 4000): string {
  const withoutControls = input.replace(CONTROL_CHARS, ' ');
  const normalized = withoutControls.replace(/[^\S\r\n]+/g, ' ').trim();
  if (normalized.length < 3) {
    throw errors.validation('Prompt is too short');
  }
  if (normalized.length > maxLength) {
    throw errors.validation(`Prompt must be ${maxLength} characters or fewer`);
  }
  return normalized;
}

export function sanitizeLabel(input: string, maxLength = 80): string {
  const cleaned = input.replace(CONTROL_CHARS, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length < 1 || cleaned.length > maxLength) {
    throw errors.validation(`Label must be between 1 and ${maxLength} characters`);
  }
  return cleaned;
}

export function sanitizeFileName(input: string, fallback = 'webcraft-project'): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return cleaned.length > 0 ? cleaned : fallback;
}
