const API_BASE = (
  (import.meta.env.VITE_BACKEND_URL as string | undefined)?.trim() ||
  'http://localhost:5000'
).replace(/\/+$/, '');

const ADMIN_SECRET_KEY = 'webcraft_admin_secret';

export type ProviderId = 'gemini' | 'groq' | 'openrouter' | 'together';
export type KeyStatus = 'active' | 'cooldown' | 'exhausted';

export interface ApiKeyRow {
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

export interface ProviderStat {
  provider: ProviderId;
  total: number;
  active: number;
  cooldown: number;
  requestsToday: number;
}

export interface KeyStats {
  total: number;
  active: number;
  cooldown: number;
  providers: ProviderStat[];
}

export interface AdminOverview {
  totalUsers: number;
  totalProjects: number;
  activeUsersToday: number;
  requestsToday: number;
  totalKeys: number;
  keyPoolStats: Array<{
    provider: ProviderId;
    total: number;
    active: number;
    requestsToday: number;
  }>;
  unresolvedErrors: number;
  recentActivity: {
    recentUsers: AdminUser[];
    recentProjects: AdminProject[];
  };
}

export interface AdminLeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'active' | 'suspended';
  projectsThisMonth: number;
  totalProjects: number;
  lastActive: string | null;
}

export interface AdminLeaderboardDay {
  date: string;
  projects: number;
}

export interface AdminLeaderboard {
  month: string;
  monthLabel: string;
  monthStart: string;
  monthEnd: string;
  totalProjectsThisMonth: number;
  activeCreatorsThisMonth: number;
  topUsers: AdminLeaderboardUser[];
  daily: AdminLeaderboardDay[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'active' | 'suspended';
  projectsCount: number;
  lastActive: string;
  joined: string;
}

export interface AdminProject {
  id: string;
  name: string;
  userEmail?: string;
  authorName?: string;
  framework: string;
  status: string;
  thumbnail?: string;
  exportsCount?: number;
  createdAt: string;
  fileCount?: number;
}

export interface AdminErrorLog {
  id: string;
  timestamp: string;
  level: 'warning' | 'error' | 'critical';
  service: string;
  endpoint: string;
  message: string;
  status: 'unresolved' | 'resolved';
}

export interface AdminSettings {
  maintenanceMode: boolean;
  adsEnabled: boolean;
  popunderUrl: string;
  smartLinkUrl: string;
  popunderOnZip: boolean;
  loadingBannerEnabled: boolean;
  dashboardBannerEnabled: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface HealthInfo {
  status: string;
  database: string;
  platform: string;
  version: string;
  uptimeSeconds: number;
  activeKeys: number;
  totalKeys: number;
  cooldownKeys: number;
  providers: ProviderStat[];
  timestamp: string;
}

export class AdminApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
    this.code = code;
  }
}

export function getStoredAdminSecret(): string {
  return sessionStorage.getItem(ADMIN_SECRET_KEY) ?? '';
}

export function storeAdminSecret(secret: string): void {
  sessionStorage.setItem(ADMIN_SECRET_KEY, secret);
}

export function clearAdminSecret(): void {
  sessionStorage.removeItem(ADMIN_SECRET_KEY);
}

export function getBackendUrl(): string {
  return API_BASE;
}

async function request<T>(
  path: string,
  options: { method?: 'GET' | 'POST' | 'DELETE'; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth !== false) {
    const secret = getStoredAdminSecret();
    if (secret) {
      headers.Authorization = `Bearer ${secret}`;
    }
    try {
      const rawUser = localStorage.getItem('webcraft_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u?.email) {
          headers['x-admin-email'] = u.email;
        }
      }
    } catch {
      // ignore
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: options.method ?? 'GET',
      headers,
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    });
  } catch {
    throw new AdminApiError(
      0,
      'NETWORK_ERROR',
      `Cannot reach the backend at ${API_BASE}. Make sure the server is running.`,
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | { success?: boolean; error?: { code?: string; message?: string } }
    | null;

  if (!response.ok) {
    throw new AdminApiError(
      response.status,
      payload?.error?.code ?? 'REQUEST_FAILED',
      payload?.error?.message ?? `Request failed (${response.status})`,
    );
  }

  return payload as T;
}

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && String(value).length > 0) {
      search.set(key, String(value));
    }
  }
  const value = search.toString();
  return value ? `?${value}` : '';
}

export async function getHealth(): Promise<HealthInfo> {
  const payload = await request<{ data: HealthInfo }>('/api/health', { auth: false });
  return payload.data;
}

export async function getOverview(): Promise<AdminOverview> {
  const payload = await request<{ data: AdminOverview }>('/api/admin/overview');
  return payload.data;
}

export async function getLeaderboard(month?: string): Promise<AdminLeaderboard> {
  const payload = await request<{ data: AdminLeaderboard }>(
    `/api/admin/leaderboard${query({ month })}`,
  );
  return payload.data;
}

export async function getUsers(params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}): Promise<{ users: AdminUser[]; pagination: Pagination }> {
  const payload = await request<{ data: { users: AdminUser[]; pagination: Pagination } }>(
    `/api/admin/users${query(params)}`,
  );
  return payload.data;
}

export async function getProjects(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<{ projects: AdminProject[]; pagination: Pagination }> {
  const payload = await request<{ data: { projects: AdminProject[]; pagination: Pagination } }>(
    `/api/admin/projects${query(params)}`,
  );
  return payload.data;
}

export async function getErrors(params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}): Promise<{ errors: AdminErrorLog[]; unresolved: number; pagination: Pagination }> {
  const payload = await request<{
    data: { errors: AdminErrorLog[]; unresolved: number; pagination: Pagination };
  }>(`/api/admin/errors${query(params)}`);
  return payload.data;
}

export async function resolveError(id: string): Promise<void> {
  await request(`/api/admin/errors/${encodeURIComponent(id)}/resolve`, { method: 'POST' });
}

export async function getSettings(): Promise<AdminSettings> {
  const payload = await request<{ data: { settings: AdminSettings } }>('/api/admin/settings');
  return payload.data.settings;
}

export async function updateSettings(patch: Partial<AdminSettings>): Promise<AdminSettings> {
  const payload = await request<{ data: { settings: AdminSettings } }>('/api/admin/settings', {
    method: 'POST',
    body: patch,
  });
  return payload.data.settings;
}

export async function getKeys(): Promise<{ keys: ApiKeyRow[]; stats: KeyStats }> {
  const payload = await request<{ data: { keys: ApiKeyRow[]; stats: KeyStats } }>(
    '/api/admin/keys',
  );
  return payload.data;
}

export async function addKey(input: {
  provider: ProviderId;
  label: string;
  key: string;
}): Promise<ApiKeyRow> {
  const payload = await request<{ data: { key: ApiKeyRow } }>('/api/admin/keys', {
    method: 'POST',
    body: input,
  });
  return payload.data.key;
}

export async function deleteKey(id: string): Promise<void> {
  await request(`/api/admin/keys/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
