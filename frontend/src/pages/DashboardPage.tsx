import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Search,
  Link2,
  ChevronDown,
  ChevronRight,
  Settings,
  Rocket,
  Mic,
  MoreHorizontal,
  Clock,
  Layers,
  Sun,
  Moon,
  X,
  CheckCircle2,
  ArrowUp,
  FolderGit2,
  ExternalLink,
  Code2,
  LogOut,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { AdsterraBanner } from '../components/AdsterraBanner';
import { getCurrentUser, logout, isSuperAdmin, updateLocalUser, type WebcraftUser } from '../lib/auth';
import { triggerPopunder } from '../lib/ads';
import { usePublicSettings } from '../hooks/usePublicSettings';
import { getMe, getProjects, type ApiProjectSummary } from '../lib/userApi';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<WebcraftUser | null>(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState<'mine' | 'recent' | 'templates'>('mine');
  const [promptInput, setPromptInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<'react' | 'nextjs' | 'html5'>('react');
  const [showFrameworkDropdown, setShowFrameworkDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Live Projects loaded from the backend
  const [projects, setProjects] = useState<ApiProjectSummary[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const { settings } = usePublicSettings();

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  // Load live account and project data from MongoDB
  useEffect(() => {
    async function loadData() {
      try {
        const [liveProjects, account] = await Promise.all([getProjects(), getMe()]);
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
      } catch (error) {
        console.error('Failed to load live dashboard data:', error);
      } finally {
        setLoadingProjects(false);
      }
    }
    void loadData();

    const handleAuth = (e: Event) => {
      setUser((e as CustomEvent<WebcraftUser | null>).detail);
    };
    window.addEventListener('webcraft-auth-change', handleAuth);
    return () => window.removeEventListener('webcraft-auth-change', handleAuth);
  }, []);

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

  // Speech to Text (Voice input for prompt)
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPromptInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handlePromptGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    triggerPopunder(settings, 'dashboard_generate');
    navigate(`/builder?prompt=${encodeURIComponent(promptInput.trim())}&framework=${selectedFramework}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredProjects = projects.filter((p) =>
    (p.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (p.description || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const workspaceName =
    user?.workspaceName ||
    (user?.name ? `${user.name.split(' ')[0]}'s Workspace` : 'Webcraft Workspace');

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans select-none transition-colors duration-300 ${
        isDark ? 'bg-[#07090e] text-slate-100' : 'bg-[#f4f6fb] text-slate-900'
      }`}
    >
      {/* ─── LEFT SIDEBAR (Clean Lovable style) ─── */}
      <aside className="w-64 shrink-0 bg-[#0a0d14] border-r border-white/10 flex flex-col h-full overflow-hidden z-20">
        {/* Top: Logo + Workspace Dropdown */}
        <div className="p-3 border-b border-white/10 relative">
          <Link to="/" className="flex items-center gap-2 px-1 mb-2.5 group">
            <img src="/assets/logo.png" alt="Webcraft" className="h-6 w-auto object-contain" />
            <span className="font-extrabold text-sm tracking-tight text-white">Webcraft</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 border border-white/5 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {(user?.name || 'S')[0].toUpperCase()}
              </div>
              <span className="text-xs font-bold text-white truncate">
                {workspaceName}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Workspace Popup Menu (Without Invite option, as requested) */}
          {showWorkspaceMenu && (
            <div className="absolute top-full left-3 right-3 mt-1.5 rounded-2xl bg-[#0f1420] border border-white/10 shadow-2xl p-3 space-y-2.5 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {(user?.name || 'S')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{user?.name || 'Webcraft User'}</div>
                  <div className="text-[10px] text-emerald-400 font-medium">Unlimited Free Plan · Active</div>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setShowWorkspaceMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Workspace Settings</span>
                </button>

                {isSuperAdmin() && (
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/admin');
                      setShowWorkspaceMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-purple-300 hover:bg-purple-500/10 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin Panel</span>
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate('/builder')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const searchInput = document.getElementById('dashboard-project-search');
                searchInput?.focus();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Projects</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mine')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'mine' ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>My Projects ({projects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/integrations')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Link2 className="w-4 h-4 text-blue-400" />
              <span>Connectors &amp; APIs</span>
            </button>

            {isSuperAdmin() && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-600/20 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Superadmin Hub</span>
              </button>
            )}
          </div>

          {/* Real Live Projects List in Sidebar */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Recent Projects
            </div>

            {loadingProjects ? (
              <div className="px-3 py-2 text-xs text-slate-500 animate-pulse">Loading live projects...</div>
            ) : projects.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-500 italic">No projects yet</div>
            ) : (
              projects.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  to={`/builder?id=${p.id}`}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors truncate block"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <span className="truncate">{p.name || 'Untitled Project'}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Footer: Theme Toggle + User Info */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Dark / Light Theme"
          >
            <span className="flex items-center gap-2">
              {isDark ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500">{isDark ? 'ON' : 'OFF'}</span>
          </button>

          {/* User profile item */}
          <Link
            to="/settings"
            className="flex items-center gap-2.5 px-1 py-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {(user?.name || 'S')[0].toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0a0d14]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{user?.name || 'Webcraft User'}</div>
              <div className="text-[10px] text-emerald-400 font-semibold truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Live workspace</span>
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* ─── MAIN CANVAS ─── */}
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        {/* Dreamy Aurora Gradient Mesh Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[480px] bg-gradient-to-b from-[#3b82f6]/30 via-[#a855f7]/20 to-[#ec4899]/15 blur-3xl" />
          <div className="absolute top-20 left-1/3 w-[600px] h-[300px] bg-gradient-to-tr from-blue-500/20 via-pink-500/20 to-purple-500/20 rounded-full blur-3xl" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-6 md:p-10 flex flex-col items-center max-w-6xl w-full mx-auto space-y-8">
          {/* Greeting */}
          <div className="w-full max-w-2xl text-center pt-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Ready to build, {user?.name?.split(' ')[0] || 'Builder'}? 👋
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Describe your idea. Webcraft will synthesize a full-stack website with React &amp; Node.js Express.
            </p>
          </div>

          {/* Top Floating Prompt Box */}
          <form onSubmit={handlePromptGenerate} className="w-full max-w-2xl">
            <div className="rounded-2xl bg-white/95 dark:bg-[#0f1420]/95 backdrop-blur-xl p-3 shadow-2xl border border-slate-200 dark:border-white/15 flex items-center justify-between gap-3 transition-all hover:border-blue-500/50">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask Webcraft to build: e.g. A modern pizza restaurant with online table booking & cart..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-sm px-2 focus:outline-none"
              />

              <div className="flex items-center gap-2 shrink-0">
                {/* Framework Selector Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFrameworkDropdown(!showFrameworkDropdown)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="uppercase font-bold text-[10px]">{selectedFramework}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {showFrameworkDropdown && (
                    <div className="absolute right-0 top-full mt-1.5 w-32 rounded-xl bg-[#0f1420] border border-white/10 shadow-2xl p-1 z-50">
                      {(['react', 'nextjs', 'html5'] as const).map((fw) => (
                        <button
                          key={fw}
                          type="button"
                          onClick={() => {
                            setSelectedFramework(fw);
                            setShowFrameworkDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase ${
                            selectedFramework === fw ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          {fw}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                  title={isListening ? 'Listening... Click to stop' : 'Click to speak your prompt'}
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Submit / Generate Button */}
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-500/25"
                >
                  <ArrowUp className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>
          </form>

          {/* ─── Main Projects Container ─── */}
          <div className="w-full rounded-[28px] bg-white/95 dark:bg-[#0a0d14]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 md:p-8 space-y-6">
            {/* Header Tabs: Search, My projects, Recently viewed, Templates, Browse all */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search Input Pill */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="dashboard-project-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your projects..."
                    className="pl-8 pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none w-44 sm:w-56"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('mine')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'mine'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  My projects ({projects.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('recent')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'recent'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Recently viewed
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('templates')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'templates'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Templates
                </button>
              </div>

              {/* Browse All Link */}
              <button
                type="button"
                onClick={() => navigate('/builder')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline transition-colors cursor-pointer"
              >
                <span>Open Builder</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Real Projects Grid (No Dummy Data) */}
            {loadingProjects ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Loading your projects from database...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              /* Clean Empty State (When no projects exist yet) */
              <div className="py-12 px-6 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {searchQuery ? 'No matching projects found' : 'No projects created yet'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {searchQuery
                      ? 'Try adjusting your search keywords.'
                      : 'Enter a prompt above or click below to build your first AI full-stack application.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/builder')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start New AI Project</span>
                </button>
              </div>
            ) : (
              /* Real Projects Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/builder?id=${p.id}`)}
                    className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all shadow-md hover:shadow-2xl cursor-pointer overflow-hidden flex flex-col"
                  >
                    <div className="relative h-48 w-full bg-[#070c24] flex items-center justify-center p-6 overflow-hidden">
                      {p.thumbnail && (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url('${p.thumbnail}')` }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      <div className="relative z-10 w-full max-w-xs p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 text-center shadow-xl">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {p.framework || 'React'}
                        </span>
                        <h4 className="text-sm font-extrabold text-white truncate">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {p.description || 'Full-stack application built with AI.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/80 flex items-center justify-between border-t border-white/5">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white text-xs group-hover:text-blue-400 transition-colors truncate">
                          {p.name}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          Updated {new Date(p.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 text-[10px] font-bold">
                        Open →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Live Adsterra slot controlled from the admin panel */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
              <AdsterraBanner placement="dashboard" />
            </div>
          </div>
        </div>
      </main>

      {/* Backdrop for outside click */}
      {showWorkspaceMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowWorkspaceMenu(false)} />
      )}
    </div>
  );
};
