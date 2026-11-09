import crypto from 'node:crypto';
import { Schema, model } from 'mongoose';

export type ApiKeyStatus = 'active' | 'cooldown' | 'exhausted';
export type ApiKeyProvider = 'groq' | 'gemini' | 'openrouter' | 'together';

export interface ApiKeyRecord {
  _id: string;
  provider: ApiKeyProvider;
  label: string;
  encryptedKey: string;
  maskedHint: string;
  fingerprint: string;
  status: ApiKeyStatus;
  requestsToday: number;
  totalRequests: number;
  failureCount: number;
  lastUsed?: Date | null;
  cooldownUntil?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const apiKeySchema = new Schema<ApiKeyRecord>(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    provider: {
      type: String,
      enum: ['groq', 'gemini', 'openrouter', 'together'],
      required: true,
      index: true,
    },
    label: { type: String, required: true, trim: true },
    encryptedKey: { type: String, required: true },
    maskedHint: { type: String, required: true },
    fingerprint: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['active', 'cooldown', 'exhausted'], default: 'active' },
    requestsToday: { type: Number, default: 0, min: 0 },
    totalRequests: { type: Number, default: 0, min: 0 },
    failureCount: { type: Number, default: 0, min: 0 },
    lastUsed: { type: Date },
    cooldownUntil: { type: Date },
  },
  { timestamps: true, collection: 'api_keys', versionKey: false },
);

export const ApiKey = model<ApiKeyRecord>('ApiKey', apiKeySchema);
