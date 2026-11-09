import { getPublicSettings, PublicSettings } from './userApi';

const POPUNDER_COOLDOWN_MS = 10 * 60 * 1000;
const LAST_POPUNDER_KEY = 'webcraft_last_popunder_at';

let settingsPromise: Promise<PublicSettings> | null = null;

export function loadPublicSettings(force = false): Promise<PublicSettings> {
  if (force || !settingsPromise) {
    settingsPromise = getPublicSettings().catch((error) => {
      settingsPromise = null;
      throw error;
    });
  }
  return settingsPromise;
}

export function triggerPopunder(settings: PublicSettings | null, source: string): void {
  if (!settings?.adsEnabled) return;

  const now = Date.now();
  const last = Number(sessionStorage.getItem(LAST_POPUNDER_KEY) ?? '0');
  if (Number.isFinite(last) && now - last < POPUNDER_COOLDOWN_MS) {
    return;
  }

  const url = settings.popunderUrl || settings.smartLinkUrl;
  if (!url) return;

  sessionStorage.setItem(LAST_POPUNDER_KEY, String(now));
  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (popup) {
    popup.opener = null;
  }
  sessionStorage.setItem('webcraft_popunder_source', source);
}

export function openSmartLink(settings: PublicSettings | null): void {
  if (!settings?.adsEnabled || !settings.smartLinkUrl) return;
  window.open(settings.smartLinkUrl, '_blank', 'noopener,noreferrer');
}
