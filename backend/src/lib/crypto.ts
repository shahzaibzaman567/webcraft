import crypto from 'node:crypto';
import { env } from '../config/env';
import { AppError } from './errors';

const ALGORITHM = 'aes-256-gcm';
const VERSION = 'v1';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const AAD = Buffer.from('webcraft-key-vault:v1', 'utf8');

function deriveKey(secret: string): Buffer {
  if (/^[0-9a-fA-F]{64}$/.test(secret)) {
    return Buffer.from(secret, 'hex');
  }
  return crypto.createHash('sha256').update(secret, 'utf8').digest();
}

const masterKey = deriveKey(env.masterEncryptionSecret);

export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
  cipher.setAAD(AAD);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    VERSION,
    iv.toString('base64url'),
    tag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join(':');
}

export function decryptSecret(payload: string): string {
  const parts = payload.split(':');
  if (parts.length !== 4 || parts[0] !== VERSION) {
    throw new AppError(500, 'KEY_DECRYPTION_FAILED', 'Stored credential is corrupted', false);
  }
  const iv = Buffer.from(parts[1]!, 'base64url');
  const tag = Buffer.from(parts[2]!, 'base64url');
  const encrypted = Buffer.from(parts[3]!, 'base64url');
  if (iv.length !== IV_LENGTH || tag.length !== TAG_LENGTH || encrypted.length === 0) {
    throw new AppError(500, 'KEY_DECRYPTION_FAILED', 'Stored credential is corrupted', false);
  }
  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
    decipher.setAAD(AAD);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  } catch {
    throw new AppError(500, 'KEY_DECRYPTION_FAILED', 'Stored credential could not be decrypted', false);
  }
}

export function fingerprintSecret(plainText: string): string {
  return crypto.createHmac('sha256', masterKey).update(plainText, 'utf8').digest('hex');
}

export function maskSecret(plainText: string): string {
  if (plainText.length <= 10) {
    return `${plainText.slice(0, 2)}••••${plainText.slice(-2)}`;
  }
  return `${plainText.slice(0, 8)}••••••••••••${plainText.slice(-4)}`;
}
