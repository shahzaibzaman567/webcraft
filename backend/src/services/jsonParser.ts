import { ZodType } from 'zod';
import { AppError } from '../lib/errors';

function tryParse(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const direct = tryParse(withoutFence);
  if (direct !== undefined) {
    return direct;
  }

  const start = withoutFence.indexOf('{');
  const end = withoutFence.lastIndexOf('}');
  if (start !== -1 && end > start) {
    const sliced = tryParse(withoutFence.slice(start, end + 1));
    if (sliced !== undefined) {
      return sliced;
    }
  }

  throw new AppError(502, 'AI_INVALID_RESPONSE', 'The AI returned an invalid response format');
}

export function validateJsonResponse<T>(text: string, schema: ZodType<T>): T {
  const parsed = extractJson(text);
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new AppError(502, 'AI_INVALID_RESPONSE', 'The AI returned an invalid response format');
  }
  return result.data;
}
