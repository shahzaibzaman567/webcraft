import { env } from '../config/env';
import { log } from '../lib/logger';
import { PlatformSettings, PlatformSettingsRecord } from '../models/PlatformSettings';

function defaults(): PlatformSettingsRecord {
  return {
    maintenanceMode: false,
    adsEnabled: true,
    popunderUrl: env.adsterra.popunderUrl,
    smartLinkUrl: env.adsterra.smartLinkUrl,
    popunderOnZip: true,
    loadingBannerEnabled: true,
    dashboardBannerEnabled: true,
  };
}

export async function ensureSettings(): Promise<void> {
  const exists = await PlatformSettings.exists({});
  if (!exists) {
    await PlatformSettings.create(defaults());
    log('info', 'platform_settings_defaults_created');
  }
}

export async function getSettings(): Promise<PlatformSettingsRecord> {
  const settings = await PlatformSettings.findOne().lean<PlatformSettingsRecord>();
  if (settings) {
    return settings;
  }
  const created = await PlatformSettings.create(defaults());
  return created.toObject() as PlatformSettingsRecord;
}

export async function updateSettings(
  patch: Partial<PlatformSettingsRecord>,
): Promise<PlatformSettingsRecord> {
  const settings = await PlatformSettings.findOneAndUpdate(
    {},
    { $set: patch },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean<PlatformSettingsRecord>();
  return settings ?? (await getSettings());
}
