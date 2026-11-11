import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * AdsterraPopunder Component
 *
 * Injects the Adsterra popunder script strictly on authorized pages.
 * User rule:
 * - Excluded routes: '/', '/login', '/signup', '/admin'
 * - Active routes: '/dashboard', '/builder', '/docs', '/guides', '/blog', etc.
 */

const POPUNDER_SRC = 'https://abscloud.org/1/44d7bc8ee0fa1857b4412db0fe4a133b';

export const AdsterraPopunder: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, '') || '/';

    // Strictly exclude Home, Login, Signup, and Admin
    const isExcluded =
      path === '/' ||
      path === '/login' ||
      path === '/signup' ||
      path.startsWith('/admin');

    if (isExcluded) {
      // Remove any active popunder script from head
      const existing = document.querySelector(`script[src="${POPUNDER_SRC}"]`);
      if (existing) {
        existing.remove();
      }
      return;
    }

    // Check if already injected
    if (!document.querySelector(`script[src="${POPUNDER_SRC}"]`)) {
      const script = document.createElement('script');
      script.setAttribute('data-cfasync', 'false');
      script.src = POPUNDER_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  }, [location.pathname]);

  return null;
};

export default AdsterraPopunder;

