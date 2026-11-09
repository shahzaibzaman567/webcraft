import { promises as fs } from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';
import { ApiKey, ApiKeyRecord } from '../models/ApiKey';
import { VaultMeta } from '../models/VaultMeta';
import { ProviderId, StoredKey } from '../types/keys';
import { log } from './logger';

const META_ID = 'key-pool';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function isProvider(value: unknown): value is ProviderId {
  return value === 'gemini' || value === 'groq' || value === 'openrouter' || value === 'together';
}

function toStoredKey(document: ApiKeyRecord): StoredKey {
  return {
    id: document._id,
    provider: document.provider,
    label: document.label,
    encryptedKey: document.encryptedKey,
    maskedHint: document.maskedHint,
    fingerprint: document.fingerprint,
    status: document.status === 'exhausted' ? 'exhausted' : document.status,
    requestsToday: document.requestsToday ?? 0,
    totalRequests: document.totalRequests ?? 0,
    failureCount: document.failureCount ?? 0,
    createdAt: document.createdAt ? new Date(document.createdAt).toISOString() : new Date().toISOString(),
    lastUsedAt: document.lastUsed ? new Date(document.lastUsed).toISOString() : undefined,
    cooldownUntil: document.cooldownUntil ? new Date(document.cooldownUntil).toISOString() : undefined,
  };
}

function toDocument(key: StoredKey): ApiKeyRecord {
  return {
    _id: key.id,
    provider: key.provider,
    label: key.label,
    encryptedKey: key.encryptedKey,
    maskedHint: key.maskedHint,
    fingerprint: key.fingerprint,
    status: key.status,
    requestsToday: key.requestsToday,
    totalRequests: key.totalRequests,
    failureCount: key.failureCount,
    lastUsed: key.lastUsedAt ? new Date(key.lastUsedAt) : undefined,
    cooldownUntil: key.cooldownUntil ? new Date(key.cooldownUntil) : undefined,
  };
}

function normalizeLegacyKey(value: unknown): StoredKey | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const record = value as Record<string, unknown>;
  if (
    typeof record.id !== 'string' ||
    !isProvider(record.provider) ||
    typeof record.label !== 'string' ||
    typeof record.encryptedKey !== 'string' ||
    typeof record.maskedHint !== 'string' ||
    typeof record.fingerprint !== 'string'
  ) {
    return null;
  }
  return {
    id: record.id,
    provider: record.provider,
    label: record.label,
    encryptedKey: record.encryptedKey,
    maskedHint: record.maskedHint,
    fingerprint: record.fingerprint,
    status: record.status === 'exhausted' || record.status === 'disabled' ? 'exhausted' : 'active',
    requestsToday: typeof record.requestsToday === 'number' ? record.requestsToday : 0,
    totalRequests: typeof record.totalRequests === 'number' ? record.totalRequests : 0,
    failureCount: typeof record.failureCount === 'number' ? record.failureCount : 0,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : new Date().toISOString(),
    lastUsedAt: typeof record.lastUsedAt === 'string' ? record.lastUsedAt : undefined,
    cooldownUntil: typeof record.cooldownUntil === 'string' ? record.cooldownUntil : undefined,
  };
}

class MongoKeyStore {
  private cache = new Map<string, StoredKey>();
  private dirty = new Set<string>();
  private statsDate = todayKey();
  private flushTimer: NodeJS.Timeout | null = null;

  async init(): Promise<void> {
    await Promise.all([ApiKey.init(), VaultMeta.init()]);

    const meta = await VaultMeta.findById(META_ID).lean<{ statsDate: string }>();
    this.statsDate = meta?.statsDate ?? todayKey();

    const count = await ApiKey.estimatedDocumentCount();
    if (count === 0) {
      await this.migrateLegacyJson();
    }

    const documents = await ApiKey.find().lean<ApiKeyRecord[]>();
    this.cache = new Map(documents.map((document) => [document._id, toStoredKey(document)]));

    if (!meta) {
      await VaultMeta.create({ _id: META_ID, statsDate: this.statsDate });
    }
    if (this.statsDate !== todayKey()) {
      await this.resetDaily(todayKey());
    }
  }

  getStatsDate(): string {
    return this.statsDate;
  }

  getAll(): StoredKey[] {
    return structuredClone([...this.cache.values()]);
  }

  async add(key: StoredKey): Promise<void> {
    await ApiKey.create(toDocument(key));
    this.cache.set(key.id, structuredClone(key));
  }

  async remove(id: string): Promise<boolean> {
    const result = await ApiKey.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return false;
    }
    this.cache.delete(id);
    this.dirty.delete(id);
    return true;
  }

  update(id: string, mutator: (key: StoredKey) => void): boolean {
    const key = this.cache.get(id);
    if (!key) {
      return false;
    }
    mutator(key);
    this.dirty.add(id);
    this.scheduleFlush();
    return true;
  }

  async resetDaily(date: string): Promise<void> {
    this.statsDate = date;
    for (const key of this.cache.values()) {
      key.requestsToday = 0;
    }
    await ApiKey.updateMany({}, { $set: { requestsToday: 0 } });
    await VaultMeta.updateOne({ _id: META_ID }, { $set: { statsDate: date } }, { upsert: true });
  }

  async flush(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.dirty.size === 0) {
      return;
    }
    const ids = [...this.dirty];
    this.dirty.clear();
    const operations = ids
      .map((id) => this.cache.get(id))
      .filter((key): key is StoredKey => Boolean(key))
      .map((key) => ({
        updateOne: {
          filter: { _id: key.id },
          update: {
            $set: {
              status: key.status,
              requestsToday: key.requestsToday,
              totalRequests: key.totalRequests,
              failureCount: key.failureCount,
              lastUsed: key.lastUsedAt ? new Date(key.lastUsedAt) : null,
              cooldownUntil: key.cooldownUntil ? new Date(key.cooldownUntil) : null,
            },
          },
        },
      }));
    if (operations.length > 0) {
      await ApiKey.bulkWrite(operations, { ordered: false });
    }
  }

  private scheduleFlush(): void {
    if (this.flushTimer) {
      return;
    }
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      void this.flush().catch(() => {
        log('error', 'api_key_persist_failed');
      });
    }, 1_500);
    this.flushTimer.unref();
  }

  private async migrateLegacyJson(): Promise<void> {
    const legacyPath = path.join(env.dataDir, 'keys.json');
    try {
      const raw = await fs.readFile(legacyPath, 'utf8');
      const parsed = JSON.parse(raw) as { keys?: unknown[] };
      if (!Array.isArray(parsed.keys)) {
        return;
      }
      const keys = parsed.keys
        .map(normalizeLegacyKey)
        .filter((key): key is StoredKey => Boolean(key));
      if (keys.length === 0) {
        return;
      }
      await ApiKey.insertMany(keys.map(toDocument), { ordered: false });
      await fs.rename(legacyPath, `${legacyPath}.migrated`).catch(() => undefined);
      log('info', 'legacy_keys_migrated', { count: keys.length });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return;
      }
      log('warn', 'legacy_keys_migration_failed', {
        name: error instanceof Error ? error.name : 'UnknownError',
      });
    }
  }
}

export const keyStore = new MongoKeyStore();
