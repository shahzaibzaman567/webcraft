import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { usePublicSettings } from '../hooks/usePublicSettings';
import { openSmartLink } from '../lib/ads';

interface AdsterraBannerProps {
  placement: 'dashboard' | 'loading' | 'builder';
  className?: string;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ placement, className = '' }) => {
  const { settings } = usePublicSettings();

  if (!settings?.adsEnabled || !settings.smartLinkUrl) {
    return null;
  }
  if (placement === 'dashboard' && !settings.dashboardBannerEnabled) {
    return null;
  }
  if (placement === 'loading' && !settings.loadingBannerEnabled) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => openSmartLink(settings)}
      className={`group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40 ${className}`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Sponsored
          </span>
          <span className="block truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
            Discover tools for your next launch
          </span>
        </span>
      </span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:text-blue-500" />
    </button>
  );
};
