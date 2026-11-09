import path from 'node:path';
import dotenv from 'dotenv';

export const projectRoot = path.resolve(__dirname, '..', '..');

dotenv.config({ path: path.join(projectRoot, '.env') });

function readString(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function readOptionalString(name: string, fallback = ''): string {
  const value = process.env[name];
  return value === undefined || value.trim().length === 0 ? fallback : value.trim();
}

function readInteger(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  const value = raw === undefined || raw.trim() === '' ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`Environment variable ${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') {
    return fallback;
  }
  return ['1', 'true', 'yes', 'on'].includes(raw.trim().toLowerCase());
}

const masterSecret = readString('MASTER_ENCRYPTION_SECRET');
const adminSecret = readString('ADMIN_API_SECRET');
const mongodbUri = readString('MONGODB_URI');

if (masterSecret.length < 32) {
  throw new Error('MASTER_ENCRYPTION_SECRET must be at least 32 characters (64 hex characters recommended)');
}

if (adminSecret.length < 24) {
  throw new Error('ADMIN_API_SECRET must be at least 24 characters long');
}

const dataDirValue = readString('DATA_DIR', './data');
const nodeEnv = readString('NODE_ENV', 'development');
const inngestDevValue = readOptionalString('INNGEST_DEV');

export const env = {
  nodeEnv,
  port: readInteger('PORT', 5000, 1, 65535),
  frontendUrl: readString('FRONTEND_URL', 'http://localhost:3000'),
  masterEncryptionSecret: masterSecret,
  adminApiSecret: adminSecret,
  adminEmail: readOptionalString('ADMIN_EMAIL', 'shahzaibzaman.official@gmail.com'),
  mongodbUri,
  dataDir: path.isAbsolute(dataDirValue) ? dataDirValue : path.resolve(projectRoot, dataDirValue),
  adsterra: {
    popunderUrl: readOptionalString('ADSTERRA_POPUNDER_URL'),
    smartLinkUrl: readOptionalString('ADSTERRA_SMARTLINK_URL'),
  },
  clerk: {
    secretKey: readOptionalString('CLERK_SECRET_KEY'),
    publishableKey: readOptionalString('CLERK_PUBLISHABLE_KEY'),
    authorizedParties: readOptionalString('CLERK_AUTHORIZED_PARTIES')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  },
  supabase: {
    url: readOptionalString('SUPABASE_URL'),
    serviceRoleKey: readOptionalString('SUPABASE_SERVICE_ROLE_KEY'),
  },
  smtp: {
    host: readOptionalString('SMTP_HOST'),
    port: readInteger('SMTP_PORT', 587, 1, 65535),
    secure: readBoolean('SMTP_SECURE', false),
    user: readOptionalString('SMTP_USER'),
    pass: readOptionalString('SMTP_PASS'),
    from: readOptionalString('SMTP_FROM'),
  },
  inngest: {
    appId: readOptionalString('INNGEST_APP_ID', 'webcraft'),
    eventKey: readOptionalString('INNGEST_EVENT_KEY'),
    signingKey: readOptionalString('INNGEST_SIGNING_KEY'),
    baseUrl: readOptionalString('INNGEST_BASE_URL'),
    dev: inngestDevValue,
    isDev:
      ['1', 'true', 'yes', 'on'].includes(inngestDevValue.toLowerCase()) ||
      inngestDevValue.startsWith('http'),
  },
  allowDevAuth: readBoolean('ALLOW_DEV_AUTH', nodeEnv !== 'production'),
  trustProxy: readInteger('TRUST_PROXY', 0, 0, 10),
  aiTimeoutMs: readInteger('AI_TIMEOUT_MS', 60000, 5000, 180000),
  aiMaxAttempts: readInteger('AI_MAX_ATTEMPTS', 8, 1, 30),
  models: {
    gemini: readString('GEMINI_MODEL', 'gemini-2.0-flash'),
    groq: readString('GROQ_MODEL', 'llama-3.3-70b-versatile'),
    openrouter: readString('OPENROUTER_MODEL', 'qwen/qwen-2.5-coder-32b-instruct:free'),
    togetherImage: readString('TOGETHER_IMAGE_MODEL', 'black-forest-labs/FLUX.1-schnell-Free'),
  },
};

export const isProduction = env.nodeEnv === 'production';
