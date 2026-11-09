import mongoose from 'mongoose';
import { isProduction } from '../config/env';
import { encryptSecret } from '../lib/crypto';
import { errors } from '../lib/errors';
import { log } from '../lib/logger';
import {
  IntegrationAccountDetails,
  IntegrationRecord,
  IntegrationService,
} from '../models/Integration';

export interface IntegrationCredentials {
  uri?: string;
  projectUrl?: string;
  apiKey?: string;
  token?: string;
  clusterName?: string;
  databaseName?: string;
  region?: string;
  organization?: string;
  teamSlug?: string;
  accountName?: string;
}

interface ValidationResult {
  accountDetails: IntegrationAccountDetails;
  maskedHint: string;
}

const REQUEST_TIMEOUT_MS = 10_000;

function fail(message: string): never {
  throw errors.badRequest(message);
}

function isPrivateHost(hostname: string): boolean {
  const host = hostname.trim().toLowerCase().replace(/^\[|\]$/g, '');
  if (
    !host ||
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host === '::1'
  ) {
    return true;
  }
  if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host)) {
    return true;
  }
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) {
    return true;
  }
  if (/^169\.254\./.test(host) || /^0\.0\.0\.0$/.test(host)) {
    return true;
  }
  if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(host)) {
    return true;
  }
  if (/^(fc|fd|fe80)/i.test(host) && host.includes(':')) {
    return true;
  }
  return false;
}

function assertPublicHost(hostname: string, service: string): void {
  if (isProduction && isPrivateHost(hostname)) {
    fail(`${service} hosts on private networks are not allowed in production`);
  }
}

function maskValue(value: string, prefix: string): string {
  const suffix = value.slice(-4);
  return `${prefix}****${suffix}`;
}

async function fetchProvider(url: string, init: RequestInit, service: string): Promise<Response> {
  try {
    return await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    log('warn', 'integration_provider_unreachable', {
      service,
      name: error instanceof Error ? error.name : 'UnknownError',
    });
    throw errors.badGateway(`Could not reach ${service}. Check your network and try again`);
  }
}

async function validateMongoCredentials(input: IntegrationCredentials): Promise<ValidationResult> {
  const uri = input.uri?.trim();
  if (!uri || !/^mongodb(\+srv)?:\/\//i.test(uri)) {
    fail('Enter a valid MongoDB connection URI');
  }

  let parsed: URL;
  try {
    parsed = new URL(uri);
  } catch {
    fail('Enter a valid MongoDB connection URI');
  }

  assertPublicHost(parsed.hostname, 'MongoDB');

  const connection = mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 8_000,
    connectTimeoutMS: 8_000,
    maxPoolSize: 1,
  });

  try {
    await connection.asPromise();
    if (!connection.db) {
      throw new Error('MongoDB connection has no database handle');
    }
    await connection.db.admin().ping();
  } catch (error) {
    log('warn', 'integration_mongodb_verify_failed', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
    throw errors.badRequest(
      'MongoDB connection failed. Check the URI, database user permissions, and IP allowlist',
    );
  } finally {
    await connection.close().catch(() => undefined);
  }

  const maskedUri = uri.replace(
    /^(mongodb(?:\+srv)?:\/\/)([^:@/]+):([^@]+)@/i,
    (_match, scheme: string, user: string) => `${scheme}${user}:****@`,
  );

  return {
    accountDetails: {
      clusterName: input.clusterName?.trim() || parsed.hostname,
      databaseName: input.databaseName?.trim() || parsed.pathname.replace(/^\//, '') || 'default',
      region: input.region?.trim() || 'Not specified',
      maskedUri,
    },
    maskedHint: maskedUri,
  };
}

async function validateSupabaseCredentials(input: IntegrationCredentials): Promise<ValidationResult> {
  const projectUrl = input.projectUrl?.trim().replace(/\/+$/, '');
  const apiKey = input.apiKey?.trim();
  if (!projectUrl || !apiKey) {
    fail('Supabase project URL and API key are required');
  }

  let parsed: URL;
  try {
    parsed = new URL(projectUrl);
  } catch {
    fail('Enter a valid Supabase project URL');
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    fail('Supabase project URL must start with https://');
  }

  assertPublicHost(parsed.hostname, 'Supabase');

  const response = await fetchProvider(
    `${projectUrl}/rest/v1/`,
    {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    },
    'Supabase',
  );

  if (response.status === 401 || response.status === 403) {
    fail('Supabase rejected the API key');
  }
  if (!response.ok) {
    throw errors.badGateway(`Supabase project check failed with status ${response.status}`);
  }

  const projectRef = parsed.hostname.endsWith('.supabase.co')
    ? parsed.hostname.split('.')[0]!
    : parsed.hostname;

  return {
    accountDetails: {
      projectUrl,
      projectRef,
      organization: input.organization?.trim() || 'Personal Workspace',
    },
    maskedHint: maskValue(apiKey, 'sb_'),
  };
}

async function validateVercelCredentials(input: IntegrationCredentials): Promise<ValidationResult> {
  const token = input.token?.trim();
  if (!token) {
    fail('Vercel personal access token is required');
  }

  const response = await fetchProvider(
    'https://api.vercel.com/v2/user',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
    'Vercel',
  );

  if (response.status === 401 || response.status === 403) {
    fail('Vercel rejected the access token');
  }
  if (!response.ok) {
    throw errors.badGateway(`Vercel verification failed with status ${response.status}`);
  }

  const payload = (await response.json().catch(() => ({}))) as {
    user?: { username?: string; email?: string; name?: string };
  };
  const user = payload.user;
  const username = user?.username || user?.name || user?.email || 'Vercel account';

  return {
    accountDetails: {
      username,
      teamName: input.teamSlug?.trim() || 'Personal Account',
      userEmail: user?.email || '',
    },
    maskedHint: maskValue(token, 'vc_'),
  };
}

async function validateNetlifyCredentials(input: IntegrationCredentials): Promise<ValidationResult> {
  const token = input.token?.trim();
  if (!token) {
    fail('Netlify personal access token is required');
  }

  const response = await fetchProvider(
    'https://api.netlify.com/api/v1/user',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
    'Netlify',
  );

  if (response.status === 401 || response.status === 403) {
    fail('Netlify rejected the access token');
  }
  if (!response.ok) {
    throw errors.badGateway(`Netlify verification failed with status ${response.status}`);
  }

  const payload = (await response.json().catch(() => ({}))) as {
    email?: string;
    full_name?: string;
    name?: string;
  };
  const accountName =
    input.accountName?.trim() || payload.full_name || payload.name || payload.email || 'Netlify account';

  return {
    accountDetails: {
      accountName,
      defaultSite: 'Not configured',
    },
    maskedHint: maskValue(token, 'nf_'),
  };
}

export async function validateIntegration(
  service: IntegrationService,
  credentials: IntegrationCredentials,
): Promise<{ encryptedCredentials: string; accountDetails: IntegrationAccountDetails; maskedHint: string }> {
  let result: ValidationResult;
  let storedCredentials: IntegrationCredentials;

  switch (service) {
    case 'mongodb':
      result = await validateMongoCredentials(credentials);
      storedCredentials = { uri: credentials.uri?.trim() };
      break;
    case 'supabase':
      result = await validateSupabaseCredentials(credentials);
      storedCredentials = {
        projectUrl: credentials.projectUrl?.trim().replace(/\/+$/, ''),
        apiKey: credentials.apiKey?.trim(),
      };
      break;
    case 'vercel':
      result = await validateVercelCredentials(credentials);
      storedCredentials = { token: credentials.token?.trim() };
      break;
    case 'netlify':
      result = await validateNetlifyCredentials(credentials);
      storedCredentials = { token: credentials.token?.trim() };
      break;
    default:
      fail('This integration is not available yet');
  }

  return {
    encryptedCredentials: encryptSecret(JSON.stringify(storedCredentials)),
    accountDetails: result.accountDetails,
    maskedHint: result.maskedHint,
  };
}

export function serializeIntegration(record: IntegrationRecord) {
  return {
    id: String(record._id ?? ''),
    service: record.service,
    status: record.status,
    accountDetails: record.accountDetails ?? {},
    maskedHint: record.maskedHint,
    connectedAt: new Date(record.connectedAt).toISOString(),
    lastVerifiedAt: new Date(record.lastVerifiedAt).toISOString(),
  };
}
