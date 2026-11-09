import { Router } from 'express';
import { env } from '../config/env';
import { asyncHandler } from '../middleware/asyncHandler';
import { getSettings } from '../services/settingsService';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const settings = await getSettings().catch(() => ({
    maintenanceMode: false,
    adsEnabled: Boolean(env.adsterra.popunderUrl || env.adsterra.smartLinkUrl),
    popunderUrl: env.adsterra.popunderUrl,
    smartLinkUrl: env.adsterra.smartLinkUrl,
    popunderOnZip: true,
    loadingBannerEnabled: true,
    dashboardBannerEnabled: true,
  }));

  res.setHeader('Cache-Control', 'public, max-age=30');
  res.json({
    success: true,
    data: {
      maintenanceMode: settings.maintenanceMode,
      adsEnabled: settings.adsEnabled,
      popunderUrl: settings.popunderUrl,
      smartLinkUrl: settings.smartLinkUrl,
      popunderOnZip: settings.popunderOnZip,
      loadingBannerEnabled: settings.loadingBannerEnabled,
      dashboardBannerEnabled: settings.dashboardBannerEnabled,
    },
  });
}));

export const publicSettingsRouter = router;
