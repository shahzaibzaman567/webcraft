import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  FolderGit2,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import {
  getCurrentUser,
  isSuperAdmin,
  logout,
  updateLocalUser,
  type WebcraftUser,
} from '../lib/auth';
import { getMe, getProjects, type ApiProjectSummary } from '../lib/userApi';

interface AppShellContextValue {
  user: WebcraftUser | null;
  projects: ApiProjectSummary[];
  filteredProjects: ApiProjectSummary[];
  loadingProjects: boolean;
  refreshProjects: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const AppShellContext = createContext<AppShellContextValue | undefined>(undefined);

export function useAppShell(): AppShellContextValue {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShell');
  }
  return context;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'My Projects',
  '/settings': 'Settings',
  '/integrations': 'Connectors & APIs',
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<WebcraftUser | null>(() => getCurrentUser());
  const [projects, setProjects] = useState<ApiProjectSummary[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.classList.contains('dark');
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loadError, setLoadError] = useState('');

  const refreshProjects = useCallback(async () => {
    try {
      const liveProjects = await getProjects();
      setProjects(liveProjects);
      setLoadError('');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not load your projects.');
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadShellData() {
      setLoadingProjects(true);
      try {
        const [liveProjects, account] = await Promise.all([getProjects(), getMe()]);
        if (!active) return;
        setProjects(liveProjects);
        const syncedUser = updateLocalUser({
          id: account.id,
          name: account.name,
          username: account.username,
          workspaceName: account.workspaceName,
          avatar: account.avatar,
          role: account.role,
        });
        if (syncedUser) setUser(syncedUser);
        setLoadError('');
      } catch (error) {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : 'Could not load your workspace.');
      } finally {
        if (active) setLoadingProjects(false);
      }
    }

    void loadShellData();

    const handleAuth = (event: Event) => {
      setUser((event as CustomEvent<WebcraftUser | null>).detail);
    };
    const handleTheme = (event: Event) => {
      setIsDark(Boolean((event as CustomEvent<boolean>).detail));
    };
    window.addEventListener('webcraft-auth-change', handleAuth);
    window.addEventListener('webcarft-theme-change', handleTheme);
    return () => {
      active = false;
      window.removeEventListener('webcraft-auth-change', handleAuth);
      window.removeEventListener('webcarft-theme-change', handleTheme);
    };
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) =>
      [project.name, project.description, project.framework, project.status]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [projects, searchQuery]);

  const workspaceName =
    user?.workspaceName ||
    (user?.name ? `${user.name.split(' ')[0]}'s Workspace` : 'Webcraft Workspace');
  const accountInitial = (user?.name || 'W').charAt(0).toUpperCase();
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const pageTitle = PAGE_TITLES[currentPath] || 'Workspace';

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

  const surface = isDark ? 'bg-[#0a0d14] border-white/10' : 'bg-white border-slate-200';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const hover = isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900';
  const activeItem = isDark ? 'bg-white/10 text-white' : 'bg-slate-900 text-white';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: `My Projects (${projects.length})`, path: '/projects', icon: FolderGit2 },
    { label: 'Connectors & APIs', path: '/integrations', icon: Link2 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <AppShellContext.Provider
      value={{
        user,
        projects,
        filteredProjects,
        loadingProjects,
        refreshProjects,
        searchQuery,
        setSearchQuery,
        isDark,
        toggleTheme,
      }}
    >
      <div
        className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${
          isDark ? 'bg-[#07090e] text-slate-100' : 'bg-[#f4f6fb] text-slate-900'
        }`}
      >
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col overflow-hidden border-r transition-transform duration-300 lg:static lg:translate-x-0 ${surface} ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className={`border-b p-3 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2 px-1 py-1 group">
                <img src="/assets/logo.png" alt="Webcraft" className="h-6 w-auto object-contain" />
                <span className={`text-sm font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Webcraft
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className={`rounded-lg p-1.5 lg:hidden ${muted} ${hover}`}
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              className={`mt-2 flex items-center gap-2.5 rounded-xl border p-2 ${
                isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-xs font-bold text-white">
                {accountInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`truncate text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {workspaceName}
                </div>
                <div className="truncate text-[10px] font-medium text-emerald-500">Free workspace</div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => navigate('/builder')}
                className="flex w-full items-center gap-2.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition-all hover:bg-blue-500"
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </button>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  navigate('/projects');
                }}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                  isDark
                    ? 'border-white/10 bg-white/5 focus-within:border-blue-500/50'
                    : 'border-slate-200 bg-slate-50 focus-within:border-blue-500/50'
                }`}
              >
                <Search className={`h-3.5 w-3.5 shrink-0 ${muted}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search AI projects..."
                  className={`w-full bg-transparent text-xs outline-none ${
                    isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={`shrink-0 rounded p-0.5 ${muted} ${hover}`}
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </form>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive(item.path) ? activeItem : `${muted} ${hover}`
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}

              {isSuperAdmin() && (
                <Link
                  to="/admin"
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive('/admin')
                      ? activeItem
                      : isDark
                        ? 'text-purple-300 hover:bg-purple-600/20 hover:text-white'
                        : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Superadmin Hub</span>
                </Link>
              )}
            </div>

            <div className="space-y-1">
              <div className={`px-3 text-[10px] font-bold uppercase tracking-wider ${muted}`}>
                {searchQuery ? `Search results (${filteredProjects.length})` : 'Recent projects'}
              </div>

              {loadingProjects ? (
                <div className={`px-3 py-2 text-xs animate-pulse ${muted}`}>Loading projects...</div>
              ) : filteredProjects.length === 0 ? (
                <div className={`px-3 py-2 text-xs italic ${muted}`}>
                  {searchQuery ? 'No matching projects' : 'No projects yet'}
                </div>
              ) : (
                filteredProjects.slice(0, 6).map((project) => (
                  <Link
                    key={project.id}
                    to={`/builder?id=${project.id}`}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                      isDark ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                    <span className="truncate">{project.name || 'Untitled Project'}</span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className={`space-y-2 border-t p-3 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                isDark
                  ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="Toggle dark / light theme"
            >
              <span className="flex items-center gap-2">
                {isDark ? <Moon className="h-3.5 w-3.5 text-blue-400" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
                <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </span>
              <span className={`text-[10px] font-bold uppercase ${muted}`}>{isDark ? 'ON' : 'OFF'}</span>
            </button>

            <Link
              to="/settings"
              className={`flex items-center gap-2.5 rounded-xl px-1 py-1 transition-colors ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
              }`}
            >
              <div className="relative">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-xs font-bold text-white">
                    {accountInitial}
                  </div>
                )}
                <span
                  className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ${
                    isDark ? 'ring-[#0a0d14]' : 'ring-white'
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`truncate text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {user?.name || 'Webcraft User'}
                </div>
                <div className="flex items-center gap-1 truncate text-[10px] font-semibold text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Live workspace</span>
                </div>
              </div>
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className={`flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 backdrop-blur md:px-6 ${
              isDark ? 'border-white/10 bg-[#07090e]/90' : 'border-slate-200 bg-white/90'
            }`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className={`rounded-lg p-2 lg:hidden ${muted} ${hover}`}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <div className={`truncate text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {pageTitle}
                </div>
                <div className={`hidden truncate text-[11px] sm:block ${muted}`}>
                  {workspaceName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${muted}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search projects..."
                  className={`w-56 rounded-full border py-1.5 pl-8 pr-3 text-xs outline-none transition-colors ${
                    isDark
                      ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-blue-500/50'
                      : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500/50'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className={`rounded-full border p-2 transition-colors ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-amber-400 hover:bg-white/10'
                    : 'border-slate-200 bg-slate-50 text-purple-600 hover:bg-slate-100'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2 transition-colors ${
                    isDark
                      ? 'border-white/10 bg-white/5 hover:bg-white/10'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-[10px] font-bold text-white">
                      {accountInitial}
                    </div>
                  )}
                  <span className={`hidden max-w-28 truncate text-xs font-semibold sm:block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {user?.name || 'Account'}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 ${muted}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div
                      className={`absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border shadow-2xl ${
                        isDark ? 'border-white/10 bg-[#0f1420]' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`border-b p-3 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                        <div className={`truncate text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {user?.name || 'Webcraft User'}
                        </div>
                        <div className={`truncate text-[10px] ${muted}`}>{user?.email || 'Signed in'}</div>
                      </div>
                      <div className="p-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('/settings');
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${muted} ${hover}`}
                        >
                          <Settings className="h-3.5 w-3.5" />
                          <span>Settings</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('/projects');
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${muted} ${hover}`}
                        >
                          <FolderGit2 className="h-3.5 w-3.5" />
                          <span>My Projects</span>
                        </button>
                        {isSuperAdmin() && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate('/admin');
                            }}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                              isDark
                                ? 'text-purple-300 hover:bg-purple-500/10'
                                : 'text-purple-700 hover:bg-purple-50'
                            }`}
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Admin Panel</span>
                          </button>
                        )}
                      </div>
                      <div className={`border-t p-1.5 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-500 transition-colors ${
                            isDark ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'
                          }`}
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-y-auto">
            {loadError && (
              <div className="mx-4 mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-medium text-amber-700 dark:text-amber-300">
                {loadError}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </AppShellContext.Provider>
  );
};

export default AppShell;
