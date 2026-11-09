import { Schema, model } from 'mongoose';

export type IntegrationService = 'mongodb' | 'supabase' | 'vercel' | 'netlify';

export interface IntegrationAccountDetails {
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

export interface IntegrationRecord {
  _id?: string;
  userEmail: string;
  service: IntegrationService;
  status: 'connected';
  accountDetails: IntegrationAccountDetails;
  encryptedCredentials: string;
  maskedHint: string;
  connectedAt: Date;
  lastVerifiedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const integrationSchema = new Schema<IntegrationRecord>(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    service: {
      type: String,
      enum: ['mongodb', 'supabase', 'vercel', 'netlify'],
      required: true,
    },
    status: { type: String, enum: ['connected'], default: 'connected' },
    accountDetails: { type: Schema.Types.Mixed, default: {} },
    encryptedCredentials: { type: String, required: true },
    maskedHint: { type: String, required: true },
    connectedAt: { type: Date, required: true },
    lastVerifiedAt: { type: Date, required: true },
  },
  { timestamps: true, collection: 'integrations', versionKey: false },
);

integrationSchema.index({ userEmail: 1, service: 1 }, { unique: true });

export const Integration = model<IntegrationRecord>('Integration', integrationSchema);
