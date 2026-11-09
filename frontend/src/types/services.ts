export type ServiceId = 'mongodb' | 'supabase' | 'mega' | 'vercel' | 'netlify';
export type ServiceCategory = 'database' | 'storage' | 'hosting';

export interface ServiceAccountDetails {
  // MongoDB Atlas
  clusterName?: string;
  databaseName?: string;
  maskedUri?: string;
  region?: string;

  // Supabase
  projectUrl?: string;
  projectRef?: string;
  organization?: string;

  // MEGA File Storage
  megaEmail?: string;
  megaApiKey?: string;
  megaStorageFolder?: string;

  // Vercel
  username?: string;
  teamName?: string;
  userEmail?: string;

  // Netlify
  accountName?: string;
  defaultSite?: string;
}

export interface ConnectedServiceState {
  id: ServiceId;
  name: string;
  category: ServiceCategory;
  tagline: string;
  badgeColor: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  accountDetails?: ServiceAccountDetails;
  connectedAt?: string;
  errorMessage?: string;
  docsUrl: string;
  authType: 'oauth' | 'token' | 'connection_string';
  quotaNotice: string;
  pricingUrl: string;
}

export interface ProjectDraft {
  id: string;
  name: string;
  description: string;
  framework: string;
  backend: string;
  databaseService?: ServiceId;
  storageService?: ServiceId;
  hostingService?: ServiceId;
  createdAt: string;
  status: 'draft' | 'synthesizing' | 'ready' | 'deployed';
}
