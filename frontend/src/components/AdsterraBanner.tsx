import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export type AdsterraFormat =
  | '728x90' // Leaderboard
  | '468x60' // Standard Banner
  | '300x250' // Medium Rectangle
  | '320x50' // Mobile Leaderboard
  | '160x600' // Skyscraper
  | '160x300'; // Half Skyscraper

interface BannerConfig {
  key: string;
  width: number;
  height: number;
}

const AD_CONFIGS: Record<AdsterraFormat, BannerConfig> = {
  '728x90': {
    key: 'f0a885f4b63b415ea4c0ee62721c480b',
    width: 728,
    height: 90,
  },
  '468x60': {
    key: 'abc128e7de07110b1d349aab1b1bde39',
    width: 468,
    height: 60,
  },
  '300x250': {
    key: '5c7b719c16b7080a815712f145a51dfa',
    width: 300,
    height: 250,
  },
  '320x50': {
    key: '7c74b4efa033b17b50314d0080e8f602',
    width: 320,
    height: 50,
  },
  '160x600': {
    key: '4fd877395def94807a828c495615e04f',
    width: 160,
    height: 600,
  },
  '160x300': {
    key: '8f52ab2bd22a97347369e3545a865d7c',
    width: 160,
    height: 300,
  },
};

export interface AdsterraBannerProps {
  /**
   * Explicit size or semantic placement:
   * - 'dashboard' defaults to 728x90 (or 320x50 on mobile)
   * - 'loading' defaults to 300x250
   * - 'builder' defaults to 300x250
   */
  placement?: 'dashboard' | 'loading' | 'builder' | 'docs' | 'sidebar';
  format?: AdsterraFormat;
  className?: string;
  smartLinkFallback?: boolean;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({
  placement = 'dashboard',
  format,
  className = '',
}) => {
  const location = useLocation();

  // Determine active ad format based on prop or placement
  const chosenFormat: AdsterraFormat = useMemo(() => {
    if (format) return format;
    switch (placement) {
      case 'loading':
      case 'builder':
        return '300x250';
      case 'sidebar':
        return '160x600';
      case 'docs':
      case 'dashboard':
      default:
        return '728x90';
    }
  }, [format, placement]);

  const config = AD_CONFIGS[chosenFormat];

  // Strictly enforce user exclusion rules: NEVER show on Home, Login, Signup, or Admin
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const isExcluded =
    path === '/' ||
    path === '/login' ||
    path === '/signup' ||
    path.startsWith('/admin');

  if (isExcluded) {
    return null;
  }

  // Safe isolated sandbox HTML for the ad iframe
  const adHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${config.key}',
      'format' : 'iframe',
      'height' : ${config.height},
      'width' : ${config.width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://bauval.org/22/${config.key}"></script>
</body>
</html>`;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-transparent ${className}`}
      style={{
        width: `${config.width}px`,
        maxWidth: '100%',
        height: `${config.height}px`,
      }}
    >
      <iframe
        title={`adsterra-${config.key}`}
        srcDoc={adHtml}
        width={config.width}
        height={config.height}
        scrolling="no"
        frameBorder="0"
        className="border-0 overflow-hidden"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

export default AdsterraBanner;
