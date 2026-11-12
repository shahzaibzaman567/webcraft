/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ScrollToTop } from './components/ScrollToTop.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { isAuthenticated, isSuperAdmin, CLERK_ENABLED } from './lib/auth';

// Dedicated Pages
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { PricingPage } from './pages/PricingPage.tsx';
import { SecurityPage } from './pages/SecurityPage.tsx';
import { EnterprisePage } from './pages/EnterprisePage.tsx';
import { BlogPage } from './pages/BlogPage.tsx';
import { BlogPostPage } from './pages/BlogPostPage.tsx';
import { DocsPage } from './pages/DocsPage.tsx';
import { GuidesPage } from './pages/GuidesPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { SignUpPage } from './pages/SignUpPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { BuilderPage } from './pages/BuilderPage.tsx';
import { IntegrationsPage } from './pages/IntegrationsPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { AppShell } from './components/AppShell.tsx';

// Connect Services State & Modals
import { ConnectedServicesProvider } from './context/ConnectedServicesContext.tsx';
import { ConnectServiceModal } from './components/ConnectServiceModal.tsx';
import { ProjectCreationModal } from './components/ProjectCreationModal.tsx';
import { WebcraftLoader } from './components/WebcraftLoader.tsx';
import { AdsterraPopunder } from './components/AdsterraPopunder.tsx';

// ─── Protected Route Wrapper (Auth Gate) ───
// Uses Clerk's useAuth() hook directly so we never rely on stale localStorage
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (CLERK_ENABLED) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isLoaded, isSignedIn } = useAuth();
    if (!isLoaded) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#040819] text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
        </div>
      );
    }
    if (!isSignedIn) {
      return <Navigate to="/login" replace />;
    }
  } else {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
  }
  return <>{children}</>;
}

// ─── Superadmin Route Wrapper (shahzaibzaman.official@gmail.com) ───
function AdminRoute({ children }: { children: React.ReactNode }) {
  if (CLERK_ENABLED) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isLoaded, isSignedIn } = useAuth();
    if (!isLoaded) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#040819] text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
        </div>
      );
    }
    if (!isSignedIn) {
      return <Navigate to="/login" replace />;
    }
  } else {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
  }
  if (!isSuperAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// ─── Authenticated app page (shared sidebar shell) ───
function AppPage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

// ─── Inner layout wrapper (uses useLocation inside BrowserRouter) ───
function AppLayout({ isDarkMode, toggleTheme }: { isDarkMode: boolean; toggleTheme: () => void }) {
  const location = useLocation();

  // Pages that should be full-screen without the public Navbar/Footer
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const isFullScreen =
    normalizedPath.startsWith('/dashboard') ||
    normalizedPath.startsWith('/projects') ||
    normalizedPath.startsWith('/settings') ||
    normalizedPath.startsWith('/integrations') ||
    normalizedPath.startsWith('/builder') ||
    normalizedPath.startsWith('/admin');

  if (isFullScreen) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-[#fafbfc] dark:bg-[#030619] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <React.Suspense fallback={<WebcraftLoader variant="fullscreen" />}>
          <Routes>
            <Route path="/dashboard" element={<AppPage><DashboardPage /></AppPage>} />
            <Route path="/dashboard/*" element={<AppPage><DashboardPage /></AppPage>} />
            <Route path="/projects" element={<AppPage><ProjectsPage /></AppPage>} />
            <Route path="/settings" element={<AppPage><SettingsPage /></AppPage>} />
            <Route path="/integrations" element={<AppPage><IntegrationsPage /></AppPage>} />
            <Route path="/builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
            <Route path="/builder/*" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
          </Routes>
        </React.Suspense>
        <ConnectServiceModal />
        <ProjectCreationModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#040819] text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white transition-colors duration-300 relative flex flex-col justify-between">
      {/* Soft Dreamy Ambient Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-purple-100/50 dark:bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-10 w-[600px] h-[600px] bg-pink-100/40 dark:bg-pink-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Universal Sticky Top Navigation */}
        <Navbar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

        {/* Dedicated Page Routes */}
        <main className="flex-1">
          <React.Suspense fallback={<WebcraftLoader variant="fullscreen" />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/enterprise" element={<EnterprisePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/docs/:topic" element={<DocsPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </React.Suspense>
        </main>

        {/* Universal Footer */}
        <Footer />
      </div>

      {/* Interactive Global Modals */}
      <ConnectServiceModal />
      <ProjectCreationModal />
    </div>
  );
}

export default function App() {
  // Theme state: defaults to dark mode (#040819)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('webcarft_theme');
      if (saved) return saved === 'dark';
      return true; // Default to dark mode
    }
    return true;
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      setIsDarkMode(Boolean((event as CustomEvent<boolean>).detail));
    };
    window.addEventListener('webcarft-theme-change', handleThemeChange);
    return () => window.removeEventListener('webcarft-theme-change', handleThemeChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      localStorage.setItem('webcarft_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
      localStorage.setItem('webcarft_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <ConnectedServicesProvider>
        <ScrollToTop />
        <AdsterraPopunder />
        <AppLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </ConnectedServicesProvider>
    </BrowserRouter>
  );
}
