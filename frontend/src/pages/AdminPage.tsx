import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  BarChart3,
  DollarSign,
  Cpu,
  Sliders,
  Settings,
  AlertOctagon,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  HardDrive,
  Activity,
  Key,
  Database,
  Radio,
  Check,
  X,
  ShieldCheck,
  Zap,
  LogOut,
  Loader2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  AdminApiError,
  AdminErrorLog,
  AdminOverview,
  AdminProject,
  AdminSettings,
  AdminUser,
  ApiKeyRow,
  HealthInfo,
  KeyStats,
  Pagination,
  ProviderId,
  addKey,
  clearAdminSecret,
  deleteKey,
  getBackendUrl,
  getErrors,
  getHealth,
  getKeys,
  getOverview,
  getProjects,
  getSettings,
  getStoredAdminSecret,
  getUsers,
  resolveError,
  storeAdminSecret,
  updateSettings,
} from '../lib/adminApi';

const PROVIDER_LABELS: Record<ProviderId, string> = {
  gemini: 'Google Gemini',
  groq: 'Groq Cloud',
  openrouter: 'OpenRouter',
  together: 'Together AI',
};

const PROVIDER_COLORS: Record<ProviderId, string> = {
  gemini: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  groq: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  openrouter: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  together: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const DEFAULT_SETTINGS: AdminSettings = {
  maintenanceMode: false,
  adsEnabled: true,
  popunderUrl: '',
  smartLinkUrl: '',
  popunderOnZip: true,
  loadingBannerEnabled: true,
  dashboardBannerEnabled: true,
};

type NavView =
  | 'dashboard'
  | 'users'
  | 'projects'
  | 'analytics'
  | 'ads'
  | 'apis'
  | 'limits'
  | 'errors'
  | 'settings';

function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return '—';
  return value.toLocaleString();
}

function formatDate(value: string | undefined | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatRelative(value: string | undefined | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

function formatUptime(seconds: number | undefined): string {
  if (!seconds && seconds !== 0) return '—';
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function StatusPill({ status }: { status: string }) {
  const style =
    status === 'active'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : status === 'cooldown'
        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        : status === 'exhausted' || status === 'suspended'
          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          : 'bg-slate-500/10 text-slate-300 border-slate-500/20';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer disabled:opacity-50 ${
        checked ? 'bg-purple-600' : 'bg-slate-700'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function PaginationBar({
  pagination,
  onChange,
}: {
  pagination: Pagination | null;
  onChange: (page: number) => void;
}) {
  if (!pagination || pagination.pages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 text-xs text-slate-400">
      <span>
        Page {pagination.page} of {pagination.pages} · {pagination.total.toLocaleString()} total
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.pages}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function AdminGate({
  checking,
  error,
  isDark,
  onUnlock,
}: {
  checking: boolean;
  error: string;
  isDark: boolean;
  onUnlock: (secret: string) => void;
}) {
  const [value, setValue] = useState('');
  return (
    <div
      className={`h-screen w-screen flex items-center justify-center p-4 ${
        isDark ? 'bg-[#080c16] text-white' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border p-7 space-y-5 shadow-2xl ${
          isDark ? 'bg-[#0c1222] border-white/10' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Webcraft" className="h-10 w-auto object-contain" />
          <div>
            <div className="text-lg font-black tracking-tight">Webcraft</div>
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Admin Access</div>
          </div>
        </div>

        <div>
          <h1 className="text-lg font-black">Admin secret required</h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Enter the server&apos;s <span className="font-mono">ADMIN_API_SECRET</span>. It is kept in this
            browser session only and never stored in the build.
          </p>
        </div>

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const secret = value.trim();
            if (secret) onUnlock(secret);
          }}
        >
          <input
            type="password"
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Admin API secret"
            className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-[11px] text-rose-300">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={checking || !value.trim()}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{checking ? 'Verifying…' : 'Unlock Admin Panel'}</span>
          </button>
        </form>

        <Link
          to="/dashboard"
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export const AdminPage: React.FC = () => {
  const [secret, setSecret] = useState(() => getStoredAdminSecret());
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState('');

  const [activeNav, setActiveNav] = useState<NavView>('dashboard');

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const [toastMessage, setToastMessage] = useState('');
  const toastTimer = useRef<number | null>(null);

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  const [health, setHealth] = useState<HealthInfo | null>(null);

  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [keyStats, setKeyStats] = useState<KeyStats | null>(null);
  const [keysLoading, setKeysLoading] = useState(false);

  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const [userList, setUserList] = useState<AdminUser[]>([]);
  const [userPagination, setUserPagination] = useState<Pagination | null>(null);
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  const [projectList, setProjectList] = useState<AdminProject[]>([]);
  const [projectPagination, setProjectPagination] = useState<Pagination | null>(null);
  const [projectPage, setProjectPage] = useState(1);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [errorList, setErrorList] = useState<AdminErrorLog[]>([]);
  const [errorPagination, setErrorPagination] = useState<Pagination | null>(null);
  const [errorPage, setErrorPage] = useState(1);
  const [errorSearch, setErrorSearch] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [errorsLoading, setErrorsLoading] = useState(false);

  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [newProvider, setNewProvider] = useState<ProviderId>('gemini');
  const [newLabel, setNewLabel] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [keySubmitting, setKeySubmitting] = useState(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(''), 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const handleApiError = useCallback(
    (error: unknown, fallback: string) => {
      if (error instanceof AdminApiError && error.status === 401) {
        clearAdminSecret();
        setSecret('');
        setAuthError('Admin session expired. Enter the secret again.');
        return;
      }
      showToast(error instanceof Error ? error.message : fallback);
    },
    [showToast],
  );

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !isDark;
    if (next) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('webcarft_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('webcarft_theme', 'light');
    }
    setIsDark(next);
    window.dispatchEvent(new CustomEvent('webcarft-theme-change', { detail: next }));
  };

  const signOut = () => {
    clearAdminSecret();
    setSecret('');
    setAuthError('');
    setOverview(null);
    setKeys([]);
    setKeyStats(null);
    setUserList([]);
    setProjectList([]);
    setErrorList([]);
  };

  const loadOverview = useCallback(
    async (silent = false) => {
      if (!silent) setOverviewLoading(true);
      try {
        setOverview(await getOverview());
      } catch (error) {
        handleApiError(error, 'Could not load overview');
      } finally {
        if (!silent) setOverviewLoading(false);
      }
    },
    [handleApiError],
  );

  const loadHealth = useCallback(async () => {
    try {
      setHealth(await getHealth());
    } catch {
      setHealth(null);
    }
  }, []);

  const loadKeys = useCallback(
    async (silent = false) => {
      if (!silent) setKeysLoading(true);
      try {
        const data = await getKeys();
        setKeys(data.keys);
        setKeyStats(data.stats);
      } catch (error) {
        handleApiError(error, 'Could not load API keys');
      } finally {
        if (!silent) setKeysLoading(false);
      }
    },
    [handleApiError],
  );

  const loadSettings = useCallback(async () => {
    try {
      setSettings(await getSettings());
      setSettingsLoaded(true);
    } catch (error) {
      handleApiError(error, 'Could not load platform settings');
    }
  }, [handleApiError]);

  const loadUsers = useCallback(
    async (page: number, search: string, status: string, silent = false) => {
      if (!silent) setUsersLoading(true);
      try {
        const data = await getUsers({ page, limit: 10, search, status });
        setUserList(data.users);
        setUserPagination(data.pagination);
      } catch (error) {
        handleApiError(error, 'Could not load users');
      } finally {
        if (!silent) setUsersLoading(false);
      }
    },
    [handleApiError],
  );

  const loadProjects = useCallback(
    async (page: number, search: string, silent = false) => {
      if (!silent) setProjectsLoading(true);
      try {
        const data = await getProjects({ page, limit: 9, search });
        setProjectList(data.projects);
        setProjectPagination(data.pagination);
      } catch (error) {
        handleApiError(error, 'Could not load projects');
      } finally {
        if (!silent) setProjectsLoading(false);
      }
    },
    [handleApiError],
  );

  const loadErrors = useCallback(
    async (page: number, search: string, status: string, silent = false) => {
      if (!silent) setErrorsLoading(true);
      try {
        const data = await getErrors({ page, limit: 20, search, status });
        setErrorList(data.errors);
        setErrorPagination(data.pagination);
      } catch (error) {
        handleApiError(error, 'Could not load error logs');
      } finally {
        if (!silent) setErrorsLoading(false);
      }
    },
    [handleApiError],
  );

  useEffect(() => {
    if (!secret) {
      setAuthChecking(false);
      return;
    }

    let cancelled = false;
    setAuthChecking(true);
    setAuthError('');

    getOverview()
      .then((data) => {
        if (cancelled) return;
        setOverview(data);
        setAuthChecking(false);
        void loadHealth();
        void loadKeys();
        void loadSettings();
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof AdminApiError && error.status === 401) {
          clearAdminSecret();
          setSecret('');
          setAuthError('Invalid admin secret. Check the backend ADMIN_API_SECRET and try again.');
        } else {
          setAuthError(error instanceof Error ? error.message : 'Could not reach the backend');
          showToast(error instanceof Error ? error.message : 'Could not reach the backend');
        }
        setAuthChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [secret, loadHealth, loadKeys, loadSettings, showToast]);

  useEffect(() => {
    if (!secret) return;
    const timer = window.setInterval(() => {
      void loadOverview(true);
      void loadHealth();
      void loadKeys(true);
      if (activeNav === 'errors') {
        void loadErrors(errorPage, errorSearch, errorStatus, true);
      }
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [secret, activeNav, errorPage, errorSearch, errorStatus, loadOverview, loadHealth, loadKeys, loadErrors]);

  useEffect(() => {
    if (!secret || activeNav !== 'users') return;
    const timer = window.setTimeout(() => {
      void loadUsers(userPage, userSearch, userStatus);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [secret, activeNav, userPage, userSearch, userStatus, loadUsers]);

  useEffect(() => {
    if (!secret || activeNav !== 'projects') return;
    const timer = window.setTimeout(() => {
      void loadProjects(projectPage, projectSearch);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [secret, activeNav, projectPage, projectSearch, loadProjects]);

  useEffect(() => {
    if (!secret || activeNav !== 'errors') return;
    const timer = window.setTimeout(() => {
      void loadErrors(errorPage, errorSearch, errorStatus);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [secret, activeNav, errorPage, errorSearch, errorStatus, loadErrors]);

  useEffect(() => {
    if (!secret || (activeNav !== 'ads' && activeNav !== 'settings')) return;
    void loadSettings();
  }, [secret, activeNav, loadSettings]);

  const handleUnlock = (value: string) => {
    setAuthError('');
    setAuthChecking(true);
    storeAdminSecret(value);
    setSecret(value);
  };

  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    setSettingsSaving(true);
    try {
      const saved = await updateSettings(settings);
      setSettings(saved);
      setSettingsLoaded(true);
      showToast('Platform settings saved');
    } catch (error) {
      handleApiError(error, 'Could not save settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleAddKey = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newKeyValue.trim()) return;
    setKeySubmitting(true);
    try {
      await addKey({
        provider: newProvider,
        label: newLabel.trim() || `${PROVIDER_LABELS[newProvider]} key`,
        key: newKeyValue.trim(),
      });
      setNewKeyValue('');
      setNewLabel('');
      setShowAddKeyModal(false);
      showToast('API key added to the rotation pool');
      await Promise.all([loadKeys(true), loadOverview(true)]);
    } catch (error) {
      handleApiError(error, 'Could not add the API key');
    } finally {
      setKeySubmitting(false);
    }
  };

  const handleDeleteKey = async (key: ApiKeyRow) => {
    if (!window.confirm(`Remove ${key.label} from the key pool?`)) return;
    try {
      await deleteKey(key.id);
      showToast('Key removed from the pool');
      await Promise.all([loadKeys(true), loadOverview(true)]);
    } catch (error) {
      handleApiError(error, 'Could not remove the key');
    }
  };

  const handleResolveError = async (id: string) => {
    try {
      await resolveError(id);
      showToast('Error marked as resolved');
      await Promise.all([
        loadErrors(errorPage, errorSearch, errorStatus, true),
        loadOverview(true),
      ]);
    } catch (error) {
      handleApiError(error, 'Could not resolve the error');
    }
  };

  const handleResolveAllVisible = async () => {
    const unresolved = errorList.filter((entry) => entry.status === 'unresolved');
    if (unresolved.length === 0) {
      showToast('No unresolved errors on this page');
      return;
    }
    try {
      await Promise.all(unresolved.map((entry) => resolveError(entry.id)));
      showToast(`${unresolved.length} error${unresolved.length === 1 ? '' : 's'} resolved`);
      await Promise.all([
        loadErrors(errorPage, errorSearch, errorStatus, true),
        loadOverview(true),
      ]);
    } catch (error) {
      handleApiError(error, 'Could not resolve all errors');
    }
  };

  if (!secret) {
    return (
      <AdminGate
        checking={authChecking}
        error={authError}
        isDark={isDark}
        onUnlock={handleUnlock}
      />
    );
  }

  if (authChecking && !overview) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#080c16] text-slate-200">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
          Connecting to live admin telemetry…
        </div>
      </div>
    );
  }

  const providers = overview?.keyPoolStats ?? keyStats?.providers ?? [];
  const maxProviderRequests = Math.max(1, ...providers.map((provider) => provider.requestsToday));
  const unresolvedCount = overview?.unresolvedErrors ?? 0;
  const databaseConnected = health?.database === 'connected';
  const operational = health?.status === 'operational';

  const recentActivity = [
    ...(overview?.recentActivity.recentUsers ?? []).map((user) => ({
      id: `user-${user.id}`,
      label: `${user.name || user.email} registered`,
      detail: user.email,
      timestamp: user.joined,
      color: 'bg-emerald-400',
      type: 'user' as const,
    })),
    ...(overview?.recentActivity.recentProjects ?? []).map((project) => ({
      id: `project-${project.id}`,
      label: `${project.name} created`,
      detail: project.authorName || project.userEmail || 'Unknown author',
      timestamp: project.createdAt,
      color: 'bg-blue-400',
      type: 'project' as const,
    })),
  ]
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
    .slice(0, 6);

  const navItems: Array<{ id: NavView; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'users',
      label: 'Users',
      icon: <Users className="w-4 h-4" />,
      badge: overview ? formatNumber(overview.totalUsers) : undefined,
    },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ads', label: 'Ads & Monetization', icon: <DollarSign className="w-4 h-4" /> },
    {
      id: 'apis',
      label: 'API Management',
      icon: <Cpu className="w-4 h-4" />,
      badge: `${keys.length} Keys`,
    },
    { id: 'limits', label: 'System Health', icon: <Sliders className="w-4 h-4" /> },
    {
      id: 'errors',
      label: 'Error Logs & Crash',
      icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
      badge: unresolvedCount > 0 ? String(unresolvedCount) : undefined,
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div
      className={`h-screen overflow-hidden flex ${
        isDark ? 'bg-[#080c16] text-slate-100' : 'bg-slate-50 text-slate-900'
      } font-sans`}
    >
      <aside
        className={`w-64 shrink-0 flex flex-col justify-between border-r ${
          isDark ? 'bg-[#0c1222] border-white/5' : 'bg-white border-slate-200'
        } transition-all duration-200`}
      >
        <div>
          <div className="p-5 flex items-center gap-3 border-b border-white/5">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <img src="/assets/logo.png" alt="Webcraft Logo" className="h-9 w-auto object-contain" />
              <div>
                <div className="text-base font-black tracking-tight">
                  <span>Webcraft</span>
                </div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Admin Panel
                </div>
              </div>
            </Link>
          </div>

          <div className="p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeNav === item.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-white/5">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Administrator</div>
              <div className="text-[10px] text-slate-400 truncate">
                {databaseConnected ? 'MongoDB connected' : 'Backend offline'}
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              title="Sign out of admin"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header
          className={`mt-3 mx-3 px-5 py-3 flex flex-wrap items-center justify-between gap-3 border rounded-2xl ${
            isDark
              ? 'bg-[#0c1222]/80 border-white/5 backdrop-blur-md'
              : 'bg-white/80 border-slate-200 backdrop-blur-md'
          } sticky top-3 z-20`}
        >
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-slate-400">
              <Database className="w-3.5 h-3.5" />
              <span className="font-mono">{getBackendUrl()}</span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border ${
                operational
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}
            >
              <Radio className="w-3 h-3" />
              {health ? (operational ? 'All Systems Operational' : 'Degraded') : 'Connecting…'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>

            <button
              onClick={() => setActiveNav('errors')}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={`${unresolvedCount} unresolved errors`}
            >
              <Bell className="w-4 h-4" />
              {unresolvedCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                  {unresolvedCount > 9 ? '9+' : unresolvedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => void loadOverview()}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh live data"
            >
              <RefreshCw className={`w-4 h-4 ${overviewLoading ? 'animate-spin' : ''}`} />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin</span>
              <button
                type="button"
                onClick={signOut}
                className="ml-1 text-purple-300/70 hover:text-white cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        </header>

        {toastMessage && (
          <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {!overview && (
          <div className="mx-6 mt-4 flex items-start gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div className="flex-1">
              <div className="font-bold">Live telemetry unavailable</div>
              <div className="mt-0.5 text-amber-300/80">{authError || 'Could not reach the backend.'}</div>
            </div>
            <button
              type="button"
              onClick={() => void loadOverview()}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        <div className="p-6 space-y-6">
          {activeNav === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Live Platform Overview</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Telemetry pulled directly from MongoDB and the AI key pool.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Auto-refresh 30s
                  </span>
                  <Link
                    to="/builder"
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-xs font-bold text-white shadow-md shadow-purple-600/25 transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Live Builder</span>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Users',
                    value: formatNumber(overview?.totalUsers),
                    detail: `${formatNumber(overview?.activeUsersToday)} active in 24h`,
                    icon: <Users className="w-5 h-5" />,
                    tone: 'text-purple-400 bg-purple-500/15 border-purple-500/20',
                  },
                  {
                    label: 'Total Projects',
                    value: formatNumber(overview?.totalProjects),
                    detail: 'Stored in MongoDB',
                    icon: <FolderGit2 className="w-5 h-5" />,
                    tone: 'text-blue-400 bg-blue-500/15 border-blue-500/20',
                  },
                  {
                    label: 'AI Requests Today',
                    value: formatNumber(overview?.requestsToday),
                    detail: `${formatNumber(overview?.totalKeys)} pooled keys`,
                    icon: <Zap className="w-5 h-5" />,
                    tone: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
                  },
                  {
                    label: 'Unresolved Errors',
                    value: formatNumber(overview?.unresolvedErrors),
                    detail: 'ErrorLog collection',
                    icon: <AlertTriangle className="w-5 h-5" />,
                    tone: 'text-rose-400 bg-rose-500/15 border-rose-500/20',
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="p-5 rounded-2xl bg-[#0e1628] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center ${card.tone}`}
                      >
                        {card.icon}
                      </div>
                      <TrendingUp className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-black text-white">{card.value}</div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-slate-400">{card.label}</span>
                        <span className="text-slate-500 text-[10px]">{card.detail}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-purple-400" />
                      Provider Request Usage
                    </h2>
                    <button
                      onClick={() => setActiveNav('apis')}
                      className="text-[11px] text-purple-400 hover:underline font-semibold cursor-pointer"
                    >
                      Manage Keys →
                    </button>
                  </div>

                  {providers.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      No API keys yet. Add a provider key to start collecting live usage data.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {providers.map((provider) => (
                        <div key={provider.provider}>
                          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                            <span className="text-slate-300">{PROVIDER_LABELS[provider.provider]}</span>
                            <span className="text-slate-400 font-mono">
                              {provider.requestsToday.toLocaleString()} reqs · {provider.active}/
                              {provider.total} active
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                              style={{
                                width: `${Math.max(
                                  3,
                                  Math.round((provider.requestsToday / maxProviderRequests) * 100),
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-white/5">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Active Keys</div>
                      <div className="text-lg font-black text-white mt-0.5">{keyStats?.active ?? 0}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Cooldown</div>
                      <div className="text-lg font-black text-amber-400 mt-0.5">{keyStats?.cooldown ?? 0}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Database</div>
                      <div
                        className={`text-lg font-black mt-0.5 ${
                          databaseConnected ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {databaseConnected ? 'Online' : 'Offline'}
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Maintenance</div>
                      <div
                        className={`text-lg font-black mt-0.5 ${
                          settings.maintenanceMode ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {settings.maintenanceMode ? 'On' : 'Off'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span>Recent Activity</span>
                    </h3>
                    <button
                      onClick={() => setActiveNav('users')}
                      className="text-[11px] text-purple-400 hover:underline font-semibold cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  {recentActivity.length === 0 ? (
                    <p className="text-xs text-slate-500">No user or project activity yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {recentActivity.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 text-xs p-2.5 rounded-xl bg-white/5"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                            <div className="min-w-0">
                              <div className="text-slate-200 truncate">{item.label}</div>
                              <div className="text-[10px] text-slate-500 truncate">{item.detail}</div>
                            </div>
                          </div>
                          <span className="text-slate-500 text-[10px] whitespace-nowrap">
                            {formatRelative(item.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>Key Pool</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    {(['gemini', 'groq', 'openrouter', 'together'] as ProviderId[]).map((provider) => {
                      const stat = providers.find((item) => item.provider === provider);
                      return (
                        <div key={provider} className="flex items-center justify-between">
                          <span className="text-slate-400">{PROVIDER_LABELS[provider]}</span>
                          <span className="font-mono text-slate-300">
                            {stat?.active ?? 0}/{stat?.total ?? 0}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setActiveNav('apis')}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Configure Provider Keys →
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Monetization</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Master Ads</span>
                      <StatusPill status={settings.adsEnabled ? 'active' : 'disabled'} />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400">Popunder URL</span>
                      <span className="font-mono text-slate-300 truncate max-w-40">
                        {settings.popunderUrl || 'not set'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400">SmartLink URL</span>
                      <span className="font-mono text-slate-300 truncate max-w-40">
                        {settings.smartLinkUrl || 'not set'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveNav('ads')}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Configure Adsterra Tags →
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    <span>Error Monitoring</span>
                  </h3>
                  <div className="text-3xl font-black text-white">{unresolvedCount}</div>
                  <p className="text-xs text-slate-400">
                    Unresolved failures from provider calls, rate limits, and key validation.
                  </p>
                  <button
                    onClick={() => setActiveNav('errors')}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Open Error Logs →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-black text-white">Registered Users</h1>
                  <p className="text-xs text-slate-400">
                    {userPagination
                      ? `${userPagination.total.toLocaleString()} users in MongoDB.`
                      : 'Loading users from MongoDB…'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={userSearch}
                      onChange={(event) => {
                        setUserSearch(event.target.value);
                        setUserPage(1);
                      }}
                      placeholder="Search name or email…"
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <select
                    value={userStatus}
                    onChange={(event) => {
                      setUserStatus(event.target.value);
                      setUserPage(1);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0e1628] border border-white/10 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <button
                    onClick={() => void loadUsers(userPage, userSearch, userStatus)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer"
                    title="Refresh users"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="rounded-3xl bg-[#0e1628] border border-white/5 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Projects Built</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          {usersLoading ? 'Loading users…' : 'No users match this filter.'}
                        </td>
                      </tr>
                    ) : (
                      userList.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold">
                                  {initials(user.name || user.email)}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-white">{user.name || 'Unnamed user'}</div>
                                <div className="text-[10px] text-slate-500 capitalize">{user.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300 font-mono">{user.email}</td>
                          <td className="p-4 text-slate-200 font-semibold">{user.projectsCount} sites</td>
                          <td className="p-4 text-slate-400">{formatDate(user.joined)}</td>
                          <td className="p-4">
                            <StatusPill status={user.status} />
                          </td>
                          <td className="p-4 text-right text-slate-400">{formatRelative(user.lastActive)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <PaginationBar pagination={userPagination} onChange={setUserPage} />
              </div>
            </div>
          )}

          {activeNav === 'projects' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-black text-white">Live Platform Projects</h1>
                  <p className="text-xs text-slate-400">
                    {projectPagination
                      ? `${projectPagination.total.toLocaleString()} projects stored in MongoDB.`
                      : 'Loading projects from MongoDB…'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={projectSearch}
                      onChange={(event) => {
                        setProjectSearch(event.target.value);
                        setProjectPage(1);
                      }}
                      placeholder="Search project or author…"
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => void loadProjects(projectPage, projectSearch)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer"
                    title="Refresh projects"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${projectsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {projectList.length === 0 ? (
                <div className="p-10 rounded-3xl bg-[#0e1628] border border-white/5 text-center text-xs text-slate-500">
                  {projectsLoading ? 'Loading projects…' : 'No projects match this filter.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectList.map((project) => (
                    <div
                      key={project.id}
                      className="p-5 rounded-2xl bg-[#0e1628] border border-white/5 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-white text-sm truncate">{project.name}</div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold capitalize">
                          {project.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center justify-between gap-2">
                        <span className="truncate">
                          By {project.authorName || project.userEmail || 'Unknown'}
                        </span>
                        <span className="font-mono text-slate-500 whitespace-nowrap">
                          {project.fileCount ?? 0} files
                        </span>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-blue-400 font-mono text-[11px] uppercase">
                          {project.framework}
                        </span>
                        <span className="text-slate-500 text-[10px]">{formatDate(project.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-3xl bg-[#0e1628] border border-white/5 overflow-hidden">
                <PaginationBar pagination={projectPagination} onChange={setProjectPage} />
              </div>
            </div>
          )}

          {activeNav === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-xl font-black text-white">Live Usage Analytics</h1>
                <p className="text-xs text-slate-400">
                  Aggregated from MongoDB collections and the AI key pool. Historical charts appear as data
                  accumulates.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span>Requests Today by Provider</span>
                  </h3>
                  {providers.length === 0 ? (
                    <p className="text-xs text-slate-500">No provider usage recorded yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {providers.map((provider) => (
                        <div key={provider.provider}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300">{PROVIDER_LABELS[provider.provider]}</span>
                            <span className="text-slate-400 font-mono">
                              {provider.requestsToday.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                              style={{
                                width: `${Math.max(
                                  3,
                                  Math.round((provider.requestsToday / maxProviderRequests) * 100),
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Platform Totals</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Users</span>
                      <span className="font-bold text-white">{formatNumber(overview?.totalUsers)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Projects</span>
                      <span className="font-bold text-white">{formatNumber(overview?.totalProjects)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Active users (24h)</span>
                      <span className="font-bold text-white">{formatNumber(overview?.activeUsersToday)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">AI requests today</span>
                      <span className="font-bold text-white">{formatNumber(overview?.requestsToday)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'ads' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-xl font-black text-white">Adsterra Monetization &amp; SmartLink Engine</h1>
                <p className="text-xs text-slate-400">
                  These values are saved to MongoDB and served to clients through the backend.
                </p>
              </div>

              <form
                onSubmit={handleSaveSettings}
                className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-sm font-bold text-white">Master Ads Toggle</h3>
                    <p className="text-xs text-slate-400">Turn monetization on or off platform-wide.</p>
                  </div>
                  <Toggle
                    checked={settings.adsEnabled}
                    onChange={(next) => setSettings((current) => ({ ...current, adsEnabled: next }))}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Adsterra Popunder / Direct Link URL (triggered on ZIP download)
                    </label>
                    <input
                      type="url"
                      value={settings.popunderUrl}
                      onChange={(event) =>
                        setSettings((current) => ({ ...current, popunderUrl: event.target.value }))
                      }
                      placeholder="https://www.profitablecpmrate.com/your-adsterra-key"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Adsterra SmartLink URL (direct high-CPM monetization)
                    </label>
                    <input
                      type="url"
                      value={settings.smartLinkUrl}
                      onChange={(event) =>
                        setSettings((current) => ({ ...current, smartLinkUrl: event.target.value }))
                      }
                      placeholder="https://www.highcpmgate.com/direct-smartlink"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.popunderOnZip}
                        onChange={(event) =>
                          setSettings((current) => ({ ...current, popunderOnZip: event.target.checked }))
                        }
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-xs text-slate-300 font-semibold">
                        Trigger popunder when user clicks &quot;Download ZIP&quot;
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.loadingBannerEnabled}
                        onChange={(event) =>
                          setSettings((current) => ({
                            ...current,
                            loadingBannerEnabled: event.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-xs text-slate-300 font-semibold">
                        Show banner ad during AI generation
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.dashboardBannerEnabled}
                        onChange={(event) =>
                          setSettings((current) => ({
                            ...current,
                            dashboardBannerEnabled: event.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-xs text-slate-300 font-semibold">
                        Show sponsored banner on the dashboard
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={settingsSaving || !settingsLoaded}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-md shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {settingsSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{settingsSaving ? 'Saving…' : 'Save Monetization Settings'}</span>
                  </button>
                  {!settingsLoaded && <span className="text-[11px] text-slate-500">Loading settings…</span>}
                </div>
              </form>
            </div>
          )}

          {activeNav === 'apis' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-black text-white">Multi-Key API Pool Manager</h1>
                  <p className="text-xs text-slate-400">
                    Keys are AES-256-GCM encrypted in MongoDB. Only masked values are returned to the admin
                    panel.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddKeyModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New API Key</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/5">
                  <div className="text-xs text-slate-400">Total Keys</div>
                  <div className="text-2xl font-black text-white mt-1">{keyStats?.total ?? keys.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{keyStats?.active ?? 0} active</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/5">
                  <div className="text-xs text-slate-400">Requests Today</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {formatNumber(overview?.requestsToday)}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-semibold">Across all providers</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/5">
                  <div className="text-xs text-slate-400">Cooldown Keys</div>
                  <div className="text-2xl font-black text-amber-400 mt-1">{keyStats?.cooldown ?? 0}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Auto-recovery enabled</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/5">
                  <div className="text-xs text-slate-400">Storage</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">MongoDB</div>
                  <div className="text-[11px] text-slate-500 mt-1">Encrypted at rest</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['gemini', 'groq', 'openrouter', 'together'] as ProviderId[]).map((provider) => {
                  const stat = keyStats?.providers.find((item) => item.provider === provider);
                  return (
                    <div key={provider} className="p-4 rounded-2xl bg-[#0e1628] border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{PROVIDER_LABELS[provider]}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${PROVIDER_COLORS[provider]}`}
                        >
                          {stat?.active ?? 0} active
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-2">
                        {stat?.total ?? 0} keys · {(stat?.requestsToday ?? 0).toLocaleString()} reqs today
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-3xl bg-[#0e1628] border border-white/5 overflow-hidden">
                {keys.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-500">
                    {keysLoading
                      ? 'Loading key pool…'
                      : 'No API keys yet. Add your first provider key to enable AI generation.'}
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {keys.map((key) => (
                      <div
                        key={key.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase border ${PROVIDER_COLORS[key.provider]}`}
                          >
                            {key.provider[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{key.label}</span>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                                {key.provider}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {key.maskedKey}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-auto">
                          <span className="text-xs text-slate-400 font-mono">
                            {key.requestsToday.toLocaleString()} reqs today
                          </span>
                          <StatusPill status={key.status} />
                          <button
                            type="button"
                            onClick={() => void handleDeleteKey(key)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeNav === 'limits' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-xl font-black text-white">System Health &amp; Resource Status</h1>
                <p className="text-xs text-slate-400">
                  Live backend, database, and key-pool health from <span className="font-mono">{getBackendUrl()}</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Backend &amp; Database</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">API Status</span>
                      <span className={operational ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {health?.status ?? 'unknown'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">MongoDB</span>
                      <span
                        className={databaseConnected ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}
                      >
                        {health?.database ?? 'unknown'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Uptime</span>
                      <span className="text-slate-200 font-mono">{formatUptime(health?.uptimeSeconds)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Version</span>
                      <span className="text-slate-200 font-mono">{health?.version ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Platform</span>
                      <span className="text-slate-200">{health?.platform ?? 'Webcraft'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-purple-400" />
                    <span>Key Pool Health</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Total keys</span>
                      <span className="text-slate-200 font-mono">{health?.totalKeys ?? keyStats?.total ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Active keys</span>
                      <span className="text-emerald-400 font-mono">
                        {health?.activeKeys ?? keyStats?.active ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Cooldown keys</span>
                      <span className="text-amber-400 font-mono">
                        {health?.cooldownKeys ?? keyStats?.cooldown ?? 0}
                      </span>
                    </div>
                    <div className="space-y-2 pt-1">
                      {(health?.providers ?? keyStats?.providers ?? []).map((provider) => (
                        <div key={provider.provider} className="flex items-center justify-between">
                          <span className="text-slate-400">{PROVIDER_LABELS[provider.provider]}</span>
                          <span className="text-slate-300 font-mono">
                            {provider.active}/{provider.total} active ·{' '}
                            {provider.requestsToday.toLocaleString()} reqs
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'errors' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-black text-white flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-rose-400" />
                    System Error Logs &amp; Crash Reports
                  </h1>
                  <p className="text-xs text-slate-400">
                    Live telemetry for API rate limits, generation failures, and failover diagnostics.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={errorSearch}
                      onChange={(event) => {
                        setErrorSearch(event.target.value);
                        setErrorPage(1);
                      }}
                      placeholder="Search service, message…"
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <select
                    value={errorStatus}
                    onChange={(event) => {
                      setErrorStatus(event.target.value);
                      setErrorPage(1);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0e1628] border border-white/10 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All status</option>
                    <option value="unresolved">Unresolved</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    onClick={() => void handleResolveAllVisible()}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Resolve Visible
                  </button>
                  <button
                    onClick={() => void loadErrors(errorPage, errorSearch, errorStatus)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer"
                    title="Refresh errors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${errorsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="rounded-3xl bg-[#0e1628] border border-white/5 overflow-hidden">
                {errorList.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-500">
                    {errorsLoading ? 'Loading error logs…' : 'No error logs match this filter.'}
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {errorList.map((log) => (
                      <div key={log.id} className="p-4 hover:bg-white/5 transition-colors space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                log.level === 'critical'
                                  ? 'bg-rose-500 animate-ping'
                                  : log.level === 'error'
                                    ? 'bg-rose-400'
                                    : 'bg-amber-400'
                              }`}
                            />
                            <span className="text-xs font-bold text-white">{log.service}</span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                              {log.endpoint}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-slate-500">
                              {formatRelative(log.timestamp)}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                log.status === 'resolved'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}
                            >
                              {log.status === 'resolved' ? 'Resolved' : 'Needs Attention'}
                            </span>
                            {log.status === 'unresolved' && (
                              <button
                                type="button"
                                onClick={() => void handleResolveError(log.id)}
                                className="px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold cursor-pointer"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 pl-4.5 font-mono">{log.message}</p>
                      </div>
                    ))}
                  </div>
                )}
                <PaginationBar pagination={errorPagination} onChange={setErrorPage} />
              </div>
            </div>
          )}

          {activeNav === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-xl font-black text-white">Admin Platform Settings</h1>
                <p className="text-xs text-slate-400">
                  Global platform toggles and session security. These values are stored in MongoDB.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form
                  onSubmit={handleSaveSettings}
                  className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-5"
                >
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span>Platform Controls</span>
                  </h3>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Maintenance Mode</div>
                      <div className="text-[10px] text-slate-500">Hide builder and AI generation from users.</div>
                    </div>
                    <Toggle
                      checked={settings.maintenanceMode}
                      onChange={(next) =>
                        setSettings((current) => ({ ...current, maintenanceMode: next }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Ads Enabled</div>
                      <div className="text-[10px] text-slate-500">Master switch for all monetization.</div>
                    </div>
                    <Toggle
                      checked={settings.adsEnabled}
                      onChange={(next) => setSettings((current) => ({ ...current, adsEnabled: next }))}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={settingsSaving || !settingsLoaded}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-md shadow-purple-600/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {settingsSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{settingsSaving ? 'Saving…' : 'Save Platform Settings'}</span>
                  </button>
                </form>

                <div className="p-6 rounded-3xl bg-[#0e1628] border border-white/5 space-y-5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Admin Session</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Backend</span>
                      <span className="text-slate-200 font-mono text-[11px]">{getBackendUrl()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Admin secret</span>
                      <span className="text-slate-200 font-mono">••••••••••••</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-slate-400">Storage</span>
                      <span className="text-slate-200">Session only</span>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-400">
                    The admin secret is never bundled with the frontend. It stays in sessionStorage for this
                    tab and is sent as a Bearer token to the backend.
                  </p>

                  <button
                    type="button"
                    onClick={signOut}
                    className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out &amp; Clear Secret
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showAddKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddKeyModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#0f1424] border border-white/10 shadow-2xl p-6 space-y-5 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                  <Key className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-base font-bold">Add Pool API Key</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddKeyModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Provider</label>
                <select
                  value={newProvider}
                  onChange={(event) => setNewProvider(event.target.value as ProviderId)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#07090e] text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="groq">Groq Cloud (Llama 3.3 70B)</option>
                  <option value="gemini">Google AI Studio (Gemini 2.0 Flash)</option>
                  <option value="openrouter">OpenRouter (Qwen 2.5 Coder Free)</option>
                  <option value="together">Together AI (FLUX.1 Schnell Images)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Key Label</label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(event) => setNewLabel(event.target.value)}
                  placeholder="Gmail 4 (Backup)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#07090e] text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">API Key String</label>
                <input
                  type="password"
                  required
                  value={newKeyValue}
                  onChange={(event) => setNewKeyValue(event.target.value)}
                  placeholder="gsk_xxxxxxxxxxxxxxxxxxxx or AIzaSyxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#07090e] text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={keySubmitting}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-md shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {keySubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{keySubmitting ? 'Encrypting & Saving…' : 'Add to Key Rotation Pool'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
