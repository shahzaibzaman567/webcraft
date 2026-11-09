export const PROVIDERS = ['gemini', 'groq', 'openrouter', 'together'] as const;

export type ProviderId = (typeof PROVIDERS)[number];

export type KeyStatus = 'active' | 'cooldown' | 'exhausted';

export interface StoredKey {
  id: string;
  provider: ProviderId;
  label: string;
  encryptedKey: string;
  maskedHint: string;
  fingerprint: string;
  status: KeyStatus;
  requestsToday: number;
  totalRequests: number;
  failureCount: number;
  createdAt: string;
  lastUsedAt?: string;
  cooldownUntil?: string;
}

export interface PublicKey {
  id: string;
  provider: ProviderId;
  label: string;
  maskedKey: string;
  status: KeyStatus;
  requestsToday: number;
  totalRequests: number;
  failureCount: number;
  createdAt: string;
  lastUsedAt: string | null;
  cooldownUntil: string | null;
}

export interface VaultFile {
  version: 1;
  statsDate: string;
  keys: StoredKey[];
}

export interface ProviderStats {
  provider: ProviderId;
  total: number;
  active: number;
  cooldown: number;
  requestsToday: number;
}
