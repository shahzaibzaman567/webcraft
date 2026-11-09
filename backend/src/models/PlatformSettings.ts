import { Schema, model } from 'mongoose';

export interface PlatformSettingsRecord {
  maintenanceMode: boolean;
  adsEnabled: boolean;
  popunderUrl: string;
  smartLinkUrl: string;
  popunderOnZip: boolean;
  loadingBannerEnabled: boolean;
  dashboardBannerEnabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const platformSettingsSchema = new Schema<PlatformSettingsRecord>(
  {
    maintenanceMode: { type: Boolean, default: false },
    adsEnabled: { type: Boolean, default: true },
    popunderUrl: { type: String, default: '' },
    smartLinkUrl: { type: String, default: '' },
    popunderOnZip: { type: Boolean, default: true },
    loadingBannerEnabled: { type: Boolean, default: true },
    dashboardBannerEnabled: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'platform_settings', versionKey: false },
);

export const PlatformSettings = model<PlatformSettingsRecord>('PlatformSettings', platformSettingsSchema);
