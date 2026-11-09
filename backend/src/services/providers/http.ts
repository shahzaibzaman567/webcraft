import { env } from '../../config/env';
import { ProviderError } from '../../lib/errors';

const RETRY_AFTER_MAX_MS = 15 * 60 * 1000;

function parseRetryAfter(value: string | null): number {
  if (!value) {
    return 0;
  }
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.min(seconds * 1000, RETRY_AFTER_MAX_MS);
  }
  const date = Date.parse(value);
  if (Number.isFinite(date)) {
    return Math.min(Math.max(date - Date.now(), 0), RETRY_AFTER_MAX_MS);
  }
  return 0;
}

export async function postJson(
  url: string,
  headers: Record<string, string>,
  body: unknown,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(env.aiTimeoutMs),
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    if (name === 'TimeoutError' || name === 'AbortError') {
      throw new ProviderError(504, 'AI_TIMEOUT', 'AI provider timed out', {
        retryable: true,
        cooldownMs: 30_000,
      });
    }
    throw new ProviderError(502, 'AI_NETWORK_ERROR', 'AI provider is unreachable', {
      retryable: true,
      cooldownMs: 30_000,
    });
  }

  if (!response.ok) {
    const status = response.status;
    let errorText = '';
    try {
      errorText = (await response.text()).slice(0, 4000).toLowerCase();
    } catch {
      errorText = '';
    }
    const invalidKey =
      status === 401 ||
      status === 403 ||
      errorText.includes('api key not valid') ||
      errorText.includes('api_key_invalid') ||
      errorText.includes('invalid api key') ||
      errorText.includes('invalid_api_key') ||
      errorText.includes('incorrect api key') ||
      errorText.includes('unauthenticated');

    if (invalidKey) {
      throw new ProviderError(502, 'AI_KEY_INVALID', 'AI provider rejected the credential', {
        retryable: true,
        cooldownMs: 6 * 60 * 60 * 1000,
      });
    }
    if (status === 429) {
      throw new ProviderError(503, 'AI_RATE_LIMITED', 'AI provider rate limit reached', {
        retryable: true,
        cooldownMs: parseRetryAfter(response.headers.get('retry-after')) || 60_000,
      });
    }
    if (status === 408 || status >= 500) {
      throw new ProviderError(503, 'AI_UPSTREAM_UNAVAILABLE', 'AI provider is temporarily unavailable', {
        retryable: true,
        cooldownMs: 30_000,
      });
    }
    throw new ProviderError(400, 'AI_BAD_REQUEST', 'AI provider rejected the request', {
      retryable: true,
      cooldownMs: 5 * 60 * 1000,
    });
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new ProviderError(502, 'AI_INVALID_RESPONSE', 'AI provider returned an invalid response', {
      retryable: true,
      cooldownMs: 15_000,
    });
  }
}
