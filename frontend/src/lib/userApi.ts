import { CLERK_ENABLED, getClerkToken, getCurrentUser } from './auth';

const API_BASE = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '');

export interface ApiProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface ApiProjectPrompt {
  role: string;
  content: string;
  timestamp: number;
}

export interface ApiProjectSummary {
  id: string;
  name: string;
  description: string;
  framework: string;
  status: 'building' | 'ready' | 'error';
  thumbnail: string;
  exportsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProject extends ApiProjectSummary {
  files: ApiProjectFile[];
  prompts: ApiProjectPrompt[];
}

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  username: string;
  workspaceName: string;
  avatar: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  projectsCount: number;
  lastActive: string;
  createdAt: string;
}

export interface PublicSettings {
  maintenanceMode: boolean;
  adsEnabled: boolean;
  popunderUrl: string;
  smartLinkUrl: string;
  popunderOnZip: boolean;
  loadingBannerEnabled: boolean;
  dashboardBannerEnabled: boolean;
}

export interface GenerateResult {
  generationId: string;
  projectName: string;
  description: string;
  files: ApiProjectFile[];
  setup?: {
    install?: string[];
    dev?: string;
    build?: string;
  };
  notes?: string[];
}

export interface ChatResult {
  projectId: string | null;
  summary: string;
  files: ApiProjectFile[];
  changes: Array<{ path: string; action: string; language?: string }>;
}

export interface AiJobMeta {
  provider?: string;
  model?: string;
  attempts?: number;
  latencyMs?: number;
}

export type AiJobStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface AiJobStartResult {
  jobId: string;
  status: AiJobStatus;
}

export interface AiJob<T> {
  id: string;
  type: 'generate' | 'chat';
  status: AiJobStatus;
  generationId?: string;
  result?: {
    data: T;
    meta?: AiJobMeta;
  } | null;
  error?: string;
  attempts: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export type ApiIntegrationService = 'mongodb' | 'supabase' | 'vercel' | 'netlify';

export interface ApiIntegrationDetails {
  clusterName?: string;
  databaseName?: string;
  region?: string;
  maskedUri?: string;
  projectUrl?: string;
  projectRef?: string;
  organization?: string;
  username?: string;
  teamName?: string;
  userEmail?: string;
  accountName?: string;
  defaultSite?: string;
}

export interface ApiIntegration {
  id: string;
  service: ApiIntegrationService;
  status: 'connected';
  accountDetails: ApiIntegrationDetails;
  maskedHint: string;
  connectedAt: string;
  lastVerifiedAt: string;
}

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

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: { message?: string; code?: string };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function authHeaders(requireAuth: boolean): Promise<Record<string, string>> {
  if (!requireAuth) return {};

  if (CLERK_ENABLED) {
    const token = await getClerkToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    throw new ApiError(401, 'Your session expired. Please sign in again.');
  }

  const user = getCurrentUser();
  if (!user?.email) {
    throw new ApiError(401, 'Please sign in to continue.');
  }
  return { 'X-User-Email': user.email };
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  requireAuth = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const auth = await authHeaders(requireAuth);
  for (const [key, value] of Object.entries(auth)) {
    headers.set(key, value);
  }

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? ((await response.json()) as ApiEnvelope<T>) : null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.error?.message || `Request failed with status ${response.status}`,
      payload?.error?.code,
    );
  }

  if (!payload) {
    throw new ApiError(response.status, 'The server returned an empty response.');
  }

  return payload.data;
}

export async function getProjects(): Promise<ApiProjectSummary[]> {
  return request<ApiProjectSummary[]>('/api/projects');
}

export async function getProject(id: string): Promise<ApiProject> {
  return request<ApiProject>(`/api/projects/${encodeURIComponent(id)}`);
}

export async function createProject(input: {
  name: string;
  description?: string;
  framework?: string;
  status?: 'building' | 'ready' | 'error';
  files?: ApiProjectFile[];
  prompts?: ApiProjectPrompt[];
  thumbnail?: string;
}): Promise<ApiProject> {
  return request<ApiProject>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateProject(
  id: string,
  input: Partial<{
    name: string;
    description: string;
    framework: string;
    status: 'building' | 'ready' | 'error';
    files: ApiProjectFile[];
    prompts: ApiProjectPrompt[];
    thumbnail: string;
  }>,
): Promise<ApiProject> {
  return request<ApiProject>(`/api/projects/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await fetch(`${API_BASE}/api/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: await authHeaders(true),
  }).then((response) => {
    if (!response.ok && response.status !== 204) {
      throw new ApiError(response.status, 'Could not delete the project.');
    }
  });
}

export async function getMe(): Promise<ApiUser> {
  return request<ApiUser>('/api/account/me');
}

export async function updateMe(input: {
  name?: string;
  username?: string;
  workspaceName?: string;
  avatar?: string;
}): Promise<ApiUser> {
  return request<ApiUser>('/api/account/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function getPublicSettings(): Promise<PublicSettings> {
  return request<PublicSettings>('/api/settings/public', {}, false);
}

export async function generateProject(input: {
  prompt: string;
  projectName?: string;
  framework?: 'react';
  existingFiles?: ApiProjectFile[];
}): Promise<GenerateResult> {
  return request<GenerateResult>('/api/generate', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function chatProject(input: {
  prompt: string;
  projectId?: string;
  existingFiles: ApiProjectFile[];
}): Promise<ChatResult> {
  return request<ChatResult>('/api/chat', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function startGenerateJob(input: {
  prompt: string;
  projectName?: string;
  framework?: 'react';
  existingFiles?: ApiProjectFile[];
}): Promise<AiJobStartResult> {
  return request<AiJobStartResult>('/api/jobs/generate', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function startChatJob(input: {
  prompt: string;
  projectId?: string;
  existingFiles: ApiProjectFile[];
}): Promise<AiJobStartResult> {
  return request<AiJobStartResult>('/api/jobs/chat', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getAiJob<T>(jobId: string): Promise<AiJob<T>> {
  return request<AiJob<T>>(`/api/jobs/${encodeURIComponent(jobId)}`);
}

export async function waitForAiJob<T>(
  jobId: string,
  options: {
    timeoutMs?: number;
    intervalMs?: number;
    onStatus?: (job: AiJob<T>) => void;
  } = {},
): Promise<{ data: T; meta?: AiJobMeta }> {
  const timeoutMs = options.timeoutMs ?? 15 * 60 * 1000;
  let intervalMs = options.intervalMs ?? 1200;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const job = await getAiJob<T>(jobId);
    options.onStatus?.(job);

    if (job.status === 'completed') {
      if (!job.result) {
        throw new ApiError(502, 'The AI job completed without a result.');
      }
      return job.result;
    }

    if (job.status === 'failed') {
      throw new ApiError(502, job.error || 'The AI job failed. Please try again.');
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, intervalMs);
    });
    intervalMs = Math.min(5000, Math.round(intervalMs * 1.25));
  }

  throw new ApiError(
    504,
    'The AI job is still running in the background. You can safely retry or refresh in a moment.',
  );
}

export async function downloadProjectZip(projectName: string, files: ApiProjectFile[]): Promise<Blob> {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  for (const [key, value] of Object.entries(await authHeaders(true))) {
    headers.set(key, value);
  }
  const response = await fetch(`${API_BASE}/api/export-zip`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ projectName, files }),
  });
  if (!response.ok) {
    throw new ApiError(response.status, 'Could not prepare the ZIP download.');
  }
  return response.blob();
}

export async function sendContactMessage(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<void> {
  await request<{ sent: boolean }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(input),
  }, false);
}

export async function getIntegrations(): Promise<ApiIntegration[]> {
  return request<ApiIntegration[]>('/api/integrations');
}

export async function connectIntegration(
  service: ApiIntegrationService,
  credentials: IntegrationCredentials,
): Promise<ApiIntegration> {
  return request<ApiIntegration>(`/api/integrations/${encodeURIComponent(service)}`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function disconnectIntegration(service: ApiIntegrationService): Promise<void> {
  await request<{ removed: boolean }>(`/api/integrations/${encodeURIComponent(service)}`, {
    method: 'DELETE',
  });
}

export function getApiBaseUrl(): string {
  return API_BASE;
}
