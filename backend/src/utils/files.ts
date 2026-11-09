import { errors } from '../lib/errors';

export const MAX_FILES = 200;
export const MAX_FILE_CHARS = 400_000;
export const MAX_TOTAL_CHARS = 1_500_000;

const SAFE_PATH = /^[A-Za-z0-9._\-/]+$/;

export function safeRelativePath(rawPath: string): string {
  const normalized = rawPath.replace(/\\/g, '/').trim();
  if (
    normalized.length === 0 ||
    normalized.length > 200 ||
    normalized.startsWith('/') ||
    normalized.includes('..') ||
    /^[A-Za-z]:/.test(normalized) ||
    !SAFE_PATH.test(normalized)
  ) {
    throw errors.validation('One or more file paths are invalid');
  }
  return normalized;
}

export function assertFileBudget(totalChars: number): void {
  if (totalChars > MAX_TOTAL_CHARS) {
    throw errors.tooLarge('Combined file content is too large');
  }
}

export function assertFileContent(content: string): void {
  if (content.length > MAX_FILE_CHARS) {
    throw errors.tooLarge('A file exceeds the maximum allowed size');
  }
}
