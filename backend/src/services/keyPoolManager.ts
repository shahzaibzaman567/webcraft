import crypto from 'node:crypto';
import { env } from '../config/env';
import { decryptSecret, encryptSecret, fingerprintSecret, maskSecret } from '../lib/crypto';
import { keyStore } from '../lib/keyStore';
import { AppError, ProviderError, errors } from '../lib/errors';
import { log } from '../lib/logger';
import { FailoverResult, ProviderOperationArgs } from '../types/ai';
import { PROVIDERS, ProviderId, ProviderStats, PublicKey, StoredKey } from '../types/keys';
import { sanitizeLabel } from '../utils/sanitize';
import { providerLabel, recordErrorLogSafe } from './errorLogService';

const COOLDOWN_RATE_LIMIT_MS = 60_000;
const COOLDOWN_TRANSIENT_MS = 30_000;
const COOLDOWN_INVALID_KEY_MS = 6 * 60 * 60 * 1000;
const COOLDOWN_DECRYPT_FAILURE_MS = 60 * 60 * 1000;

interface FailoverContext {
  endpoint?: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function isCoolingDown(key: StoredKey, now: number): boolean {
  return Boolean(key.cooldownUntil && new Date(key.cooldownUntil).getTime() > now);
}

function toPublicKey(key: StoredKey, now: number): PublicKey {
  const status =
    key.status === 'exhausted' ? 'exhausted' : isCoolingDown(key, now) ? 'cooldown' : 'active';
  return {
    id: key.id,
    provider: key.provider,
    label: key.label,
    maskedKey: key.maskedHint,
    status,
    requestsToday: key.requestsToday,
    totalRequests: key.totalRequests,
    failureCount: key.failureCount,
    createdAt: key.createdAt,
    lastUsedAt: key.lastUsedAt ?? null,
    cooldownUntil: key.cooldownUntil ?? null,
  };
}

class KeyPoolManager {
  private cursor: Record<ProviderId, number> = {
    gemini: 0,
    groq: 0,
    openrouter: 0,
    together: 0,
  };
  private dailyTimer: NodeJS.Timeout | null = null;

  async init(): Promise<void> {
    await keyStore.init();
    if (keyStore.getStatsDate() !== todayKey()) {
      await keyStore.resetDaily(todayKey());
    }
    this.dailyTimer = setInterval(() => {
      if (keyStore.getStatsDate() !== todayKey()) {
        void keyStore.resetDaily(todayKey()).catch(() => {
          log('error', 'daily_key_stats_reset_failed');
        });
      }
    }, 10 * 60 * 1000);
    this.dailyTimer.unref();
  }

  listKeys(): PublicKey[] {
    const now = Date.now();
    return keyStore
      .getAll()
      .map((key) => toPublicKey(key, now))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  getStats(): { total: number; active: number; cooldown: number; providers: ProviderStats[] } {
    const keys = this.listKeys();
    const providers: ProviderStats[] = PROVIDERS.map((provider) => {
      const scoped = keys.filter((key) => key.provider === provider);
      return {
        provider,
        total: scoped.length,
        active: scoped.filter((key) => key.status === 'active').length,
        cooldown: scoped.filter((key) => key.status === 'cooldown').length,
        requestsToday: scoped.reduce((sum, key) => sum + key.requestsToday, 0),
      };
    });
    return {
      total: keys.length,
      active: keys.filter((key) => key.status === 'active').length,
      cooldown: keys.filter((key) => key.status === 'cooldown').length,
      providers,
    };
  }

  async addKey(input: { provider: ProviderId; label: string; key: string }): Promise<PublicKey> {
    const label = sanitizeLabel(input.label);
    const plainKey = input.key.trim();
    if (plainKey.length < 8 || plainKey.length > 512) {
      throw errors.validation('API key length is invalid');
    }
    const fingerprint = fingerprintSecret(plainKey);
    if (keyStore.getAll().some((key) => key.fingerprint === fingerprint)) {
      throw new AppError(409, 'DUPLICATE_KEY', 'This API key is already in the pool');
    }
    const record: StoredKey = {
      id: crypto.randomUUID(),
      provider: input.provider,
      label,
      encryptedKey: encryptSecret(plainKey),
      maskedHint: maskSecret(plainKey),
      fingerprint,
      status: 'active',
      requestsToday: 0,
      totalRequests: 0,
      failureCount: 0,
      createdAt: new Date().toISOString(),
    };
    await keyStore.add(record);
    log('info', 'key_added', { id: record.id, provider: record.provider });
    return toPublicKey(record, Date.now());
  }

  async removeKey(id: string): Promise<void> {
    const removed = await keyStore.remove(id);
    if (!removed) {
      throw errors.notFound('API key not found');
    }
    log('info', 'key_removed', { id });
  }

  async executeWithFailover<T>(
    providers: ProviderId[],
    operation: (args: ProviderOperationArgs) => Promise<T>,
    context: FailoverContext = {},
  ): Promise<FailoverResult<T>> {
    await this.resetDailyIfNeeded();
    const startedAt = Date.now();
    let attempts = 0;
    let lastError: unknown;

    for (const provider of providers) {
      const keys = this.orderedHealthyKeys(provider);
      for (const key of keys) {
        if (attempts >= env.aiMaxAttempts) {
          break;
        }
        attempts += 1;
        const attemptStartedAt = Date.now();

        let apiKey: string;
        try {
          apiKey = decryptSecret(key.encryptedKey);
        } catch {
          keyStore.update(key.id, (record) => {
            record.failureCount += 1;
            record.cooldownUntil = new Date(Date.now() + COOLDOWN_DECRYPT_FAILURE_MS).toISOString();
          });
          log('warn', 'key_decryption_failed', { id: key.id, provider });
          recordErrorLogSafe({
            level: 'error',
            service: providerLabel(provider),
            endpoint: context.endpoint ?? '/api/ai',
            message: `Stored credential could not be decrypted. Key moved to cooldown and failover continued.`,
          });
          continue;
        }

        try {
          const result = await operation({ apiKey, provider, keyId: key.id });
          keyStore.update(key.id, (record) => {
            record.requestsToday += 1;
            record.totalRequests += 1;
            record.failureCount = 0;
            record.lastUsedAt = new Date().toISOString();
            record.cooldownUntil = undefined;
            record.status = 'active';
          });
          return {
            result,
            provider,
            keyId: key.id,
            attempts,
            latencyMs: Date.now() - startedAt,
          };
        } catch (error) {
          const info = this.classifyError(error);
          keyStore.update(key.id, (record) => {
            record.requestsToday += 1;
            record.totalRequests += 1;
            record.failureCount += 1;
            record.lastUsedAt = new Date().toISOString();
            if (info.cooldownMs > 0) {
              record.cooldownUntil = new Date(Date.now() + info.cooldownMs).toISOString();
            }
          });
          lastError = error;
          this.recordFailure(provider, error, info, context, Date.now() - attemptStartedAt);
          log('warn', 'key_attempt_failed', {
            id: key.id,
            provider,
            statusCode: info.statusCode,
            retryable: info.retryable,
          });
          if (info.fatal) {
            throw error instanceof AppError ? error : errors.badGateway();
          }
        }
      }
    }

    if (lastError instanceof AppError) {
      log('warn', 'all_providers_exhausted', { code: lastError.code, attempts });
      recordErrorLogSafe({
        level: 'critical',
        service: 'AI Provider Pool',
        endpoint: context.endpoint ?? '/api/ai',
        message: `All AI providers exhausted after ${attempts} attempt(s). Last error: ${lastError.code}.`,
      });
    }
    throw errors.unavailable('All AI providers are temporarily unavailable. Please try again shortly.');
  }

  async flush(): Promise<void> {
    if (this.dailyTimer) {
      clearInterval(this.dailyTimer);
      this.dailyTimer = null;
    }
    await keyStore.flush();
  }

  private orderedHealthyKeys(provider: ProviderId): StoredKey[] {
    const now = Date.now();
    const healthy = keyStore
      .getAll()
      .filter((key) => key.provider === provider && key.status === 'active' && !isCoolingDown(key, now));
    if (healthy.length === 0) {
      return [];
    }
    const start = this.cursor[provider] % healthy.length;
    this.cursor[provider] = (start + 1) % healthy.length;
    return [...healthy.slice(start), ...healthy.slice(0, start)];
  }

  private classifyError(error: unknown): {
    statusCode: number;
    retryable: boolean;
    fatal: boolean;
    cooldownMs: number;
  } {
    if (error instanceof ProviderError) {
      let cooldownMs = error.cooldownMs;
      if (cooldownMs === 0 && error.retryable) {
        cooldownMs =
          error.code === 'AI_KEY_INVALID'
            ? COOLDOWN_INVALID_KEY_MS
            : error.code === 'AI_RATE_LIMITED'
              ? COOLDOWN_RATE_LIMIT_MS
              : COOLDOWN_TRANSIENT_MS;
      }
      return {
        statusCode: error.statusCode,
        retryable: error.retryable,
        fatal: error.fatal,
        cooldownMs,
      };
    }
    return {
      statusCode: 500,
      retryable: true,
      fatal: false,
      cooldownMs: COOLDOWN_TRANSIENT_MS,
    };
  }

  private recordFailure(
    provider: ProviderId,
    error: unknown,
    info: { statusCode: number; retryable: boolean },
    context: FailoverContext,
    elapsedMs: number,
  ): void {
    const code = error instanceof ProviderError ? error.code : 'AI_UNKNOWN_ERROR';
    let message: string;
    if (code === 'AI_RATE_LIMITED') {
      message = `429 rate limit hit. Auto-switched to the next healthy key in ${elapsedMs}ms.`;
    } else if (code === 'AI_KEY_INVALID') {
      message = `Credential rejected. Key moved to cooldown; failover continued in ${elapsedMs}ms.`;
    } else if (code === 'AI_TIMEOUT') {
      message = `Provider timed out after ${elapsedMs}ms. Failover continued.`;
    } else {
      message = `Provider error (${code}, HTTP ${info.statusCode}). Failover continued in ${elapsedMs}ms.`;
    }
    recordErrorLogSafe({
      level: code === 'AI_RATE_LIMITED' ? 'warning' : info.statusCode >= 500 ? 'error' : 'warning',
      service: providerLabel(provider),
      endpoint: context.endpoint ?? '/api/ai',
      message,
    });
  }

  private async resetDailyIfNeeded(): Promise<void> {
    if (keyStore.getStatsDate() !== todayKey()) {
      await keyStore.resetDaily(todayKey());
    }
  }
}

export const keyPoolManager = new KeyPoolManager();
