import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  RotateCcw,
  Download,
  Code2,
  FileCode2,
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  Mic,
  X,
  ExternalLink,
  Globe,
  Rocket,
  Share2,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Search,
  Settings,
  Folder,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Bell,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Layers,
  Link2,
} from 'lucide-react';
import { useConnectedServices } from '../context/ConnectedServicesContext.tsx';
import {
  ApiProjectFile,
  ChatResult,
  GenerateResult,
  deleteProject,
  downloadProjectZip,
  getMe,
  getProject,
  startChatJob,
  startGenerateJob,
  updateProject,
  waitForAiJob,
} from '../lib/userApi';
import { usePublicSettings } from '../hooks/usePublicSettings';
import { triggerPopunder } from '../lib/ads';
import { getCurrentUser, updateLocalUser } from '../lib/auth';
import { AdsterraBanner } from '../components/AdsterraBanner';

interface GeneratedFile {
  name: string;
  path: string;
  language: string;
  folder: string;
  content: string;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results?: Array<Array<{ transcript?: string }>> }) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
}

function toGeneratedFiles(list: ApiProjectFile[]): GeneratedFile[] {
  return list.map((file) => {
    const path = file.path.replace(/\\/g, '/');
    const segments = path.split('/');
    return {
      name: segments[segments.length - 1] || path,
      path,
      language: file.language || 'text',
      folder: segments.length > 1 ? segments[0] : 'root',
      content: file.content,
    };
  });
}

function toApiFiles(files: GeneratedFile[]): ApiProjectFile[] {
  return files.map((file) => ({
    path: file.path,
    content: file.content,
    language: file.language,
  }));
}

function pickDefaultFile(files: GeneratedFile[]): string {
  return (
    files.find((file) => file.path === 'src/App.tsx')?.path ||
    files.find((file) => file.path === 'index.html')?.path ||
    files[0]?.path ||
    ''
  );
}

function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return 'Just now';
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function findFile(files: GeneratedFile[], reference: string): GeneratedFile | undefined {
  const clean = reference.replace(/^\.?\//, '');
  return (
    files.find((file) => file.path === clean) ||
    files.find((file) => file.path.endsWith(`/${clean}`)) ||
    files.find((file) => file.name === clean)
  );
}

function buildPreviewDocument(files: GeneratedFile[]): string | null {
  const htmlFile = files.find((file) => file.path === 'index.html' || file.path.endsWith('/index.html'));
  if (!htmlFile) return null;

  let html = htmlFile.content;
  const hasReactEntry =
    files.some((file) => /(^|\/)main\.(tsx|jsx)$/.test(file.path)) ||
    /<script[^>]+src=["'][^"']*main\.(tsx|jsx)["']/i.test(html);

  if (hasReactEntry) return null;

  html = html.replace(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi, (match, href: string) => {
    const cssFile = findFile(files, href);
    return cssFile ? `<style>${cssFile.content}</style>` : match;
  });

  html = html.replace(/<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi, (match, src: string) => {
    const scriptFile = findFile(files, src);
    if (!scriptFile || /\.(tsx|jsx)$/i.test(scriptFile.path)) return match;
    return `<script>${scriptFile.content.replace(/<\/script>/gi, '<\\/script>')}</script>`;
  });

  const css = files
    .filter((file) => file.path.endsWith('.css'))
    .map((file) => file.content)
    .join('\n');

  if (css) {
    html = html.includes('</head>')
      ? html.replace('</head>', `<style>${css}</style></head>`)
      : `<style>${css}</style>${html}`;
  }

  return html;
}

export const BuilderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPrompt = searchParams.get('prompt') || '';
  const initialProjectName = searchParams.get('name') || '';
  const projectParamId = searchParams.get('project') || searchParams.get('id') || '';
  const { projects, refreshProjects } = useConnectedServices();
  const { settings } = usePublicSettings();
  const currentUser = getCurrentUser();

  // Layout states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatWidth, setChatWidth] = useState(380);
  const [isDragging, setIsDragging] = useState(false);

  // Project & Workspace info
  const [projectId, setProjectId] = useState(projectParamId);
  const [projectName, setProjectName] = useState(initialProjectName || 'Untitled Project');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState<'building' | 'ready' | 'error' | 'draft'>('draft');
  const [projectUpdatedAt, setProjectUpdatedAt] = useState<string>('');
  const [loadingProject, setLoadingProject] = useState(Boolean(projectParamId));
  const [editingName, setEditingName] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(currentUser?.workspaceName || 'Webcraft Workspace');
  const [accountName, setAccountName] = useState(currentUser?.name || 'Webcraft User');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showNotificationBar, setShowNotificationBar] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const initialPromptHandled = useRef(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

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

  // View & preview states
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const standalonePreview = searchParams.get('preview') === '1';

  // Code Explorer states
  const [fileSearch, setFileSearch] = useState('');
  const [selectedFilePath, setSelectedFilePath] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    public: false,
    root: true,
  });
  const [copied, setCopied] = useState(false);

  // Chat & AI states
  const [chatInput, setChatInput] = useState('');
  const [buildModeDropdown, setBuildModeDropdown] = useState(false);
  const [buildMode, setBuildMode] = useState<'Build' | 'Plan' | 'Fix'>('Build');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    sender: 'user' | 'assistant';
    time: string;
    text: string;
    images?: string[];
  }>>([]);

  // Export & Modals
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Generated project files
  const [files, setFiles] = useState<GeneratedFile[]>([]);

  const activeFile = files.find((f) => f.path === selectedFilePath) || files[0];
  const loadedProjectRef = useRef('');
  const accountInitial = (accountName || 'W').charAt(0).toUpperCase();
  const shareUrl = projectId
    ? `${window.location.origin}/builder?project=${encodeURIComponent(projectId)}`
    : window.location.href;

  const saveProjectName = async () => {
    setEditingName(false);
    const nextName = projectName.trim() || 'Untitled Project';
    setProjectName(nextName);
    if (!projectId) return;
    try {
      const updated = await updateProject(projectId, { name: nextName });
      setProjectName(updated.name);
      void refreshProjects();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not rename the project.');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPreviewKey((k) => k + 1);
    try {
      if (projectId) {
        const project = await getProject(projectId);
        const nextFiles = toGeneratedFiles(project.files);
        setProjectName(project.name);
        setProjectDescription(project.description);
        setProjectStatus(project.status);
        setProjectUpdatedAt(project.updatedAt);
        setFiles(nextFiles);
        setChatHistory(
          project.prompts.map((prompt) => ({
            sender: prompt.role === 'assistant' ? 'assistant' : 'user',
            time: formatTimestamp(prompt.timestamp),
            text: prompt.content,
          })),
        );
        if (!nextFiles.some((file) => file.path === selectedFilePath)) {
          setSelectedFilePath(pickDefaultFile(nextFiles));
        }
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not refresh the project.');
    } finally {
      window.setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const handleOpenPreview = () => {
    if (!projectId) {
      setLoadError('Generate a project before opening the full preview.');
      return;
    }
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    const previewWindow = window.open(
      `/builder?preview=1&project=${encodeURIComponent(projectId)}`,
      'webcraft_preview',
      `popup=yes,width=${width},height=${height},left=0,top=0`,
    );
    if (previewWindow) {
      previewWindow.focus();
      previewWindow.resizeTo(width, height);
      previewWindow.moveTo(0, 0);
    }
  };

  const handleCopyCode = () => {
    if (!activeFile) return;
    void navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    if (files.length === 0) {
      setLoadError('Generate a project before downloading the ZIP.');
      return;
    }
    setExportLoading(true);
    setLoadError('');
    triggerPopunder(settings, 'zip');
    try {
      const blob = await downloadProjectZip(projectName, toApiFiles(files));
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${projectName.replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '') || 'webcraft-project'}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not prepare the ZIP download.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const runGeneration = async (
    rawPrompt: string,
    options: { desiredName?: string; replaceUrl?: boolean } = {},
  ) => {
    const text = rawPrompt.trim();
    if (!text || isGenerating) return;

    const modePrefix =
      buildMode === 'Plan'
        ? 'Create a clear implementation plan first, then implement it fully. '
        : buildMode === 'Fix'
          ? 'Fix the existing project and improve the broken parts. '
          : '';
    const prompt = `${modePrefix}${text}`;
    setIsGenerating(true);
    setLoadError('');
    setViewMode('preview');
    setProjectStatus('building');
    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', time: formatTimestamp(), text },
    ]);

    try {
      if (projectId && files.length > 0) {
        const job = await startChatJob({
          prompt,
          projectId,
          existingFiles: toApiFiles(files),
        });
        const { data: result } = await waitForAiJob<ChatResult>(job.jobId);
        const nextFiles = toGeneratedFiles(result.files);
        setFiles(nextFiles);
        setProjectStatus('ready');
        setProjectUpdatedAt(new Date().toISOString());
        if (!nextFiles.some((file) => file.path === selectedFilePath)) {
          setSelectedFilePath(pickDefaultFile(nextFiles));
        }
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'assistant',
            time: formatTimestamp(),
            text: result.summary || 'Project updated.',
          },
        ]);
        void refreshProjects();
      } else {
        const desiredName =
          options.desiredName ||
          (projectId ? undefined : projectName !== 'Untitled Project' ? projectName : undefined);
        const job = await startGenerateJob({ prompt, projectName: desiredName });
        const { data: result } = await waitForAiJob<GenerateResult>(job.jobId);
        const nextFiles = toGeneratedFiles(result.files);
        if (projectId) {
          try {
            await deleteProject(projectId);
          } catch {
            // The new generation is still usable if the empty draft cannot be removed.
          }
        }
        setProjectId(result.generationId);
        loadedProjectRef.current = result.generationId;
        setProjectName(result.projectName || desiredName || 'AI Project');
        setProjectDescription(result.description || text);
        setProjectStatus('ready');
        setProjectUpdatedAt(new Date().toISOString());
        setFiles(nextFiles);
        setSelectedFilePath(pickDefaultFile(nextFiles));
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'assistant',
            time: formatTimestamp(),
            text:
              result.description ||
              result.notes?.join(' ') ||
              `Created ${result.projectName} with ${nextFiles.length} files.`,
          },
        ]);
        if (options.replaceUrl !== false) {
          navigate(`/builder?project=${encodeURIComponent(result.generationId)}`, { replace: true });
        }
        void refreshProjects();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The AI request failed.';
      setLoadError(message);
      setProjectStatus('error');
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'assistant',
          time: formatTimestamp(),
          text: `I could not complete that request. ${message}`,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = () => {
    const userMsg = chatInput.trim();
    if (!userMsg || isGenerating) return;
    setChatInput('');
    void runGeneration(userMsg);
  };

  const handleShareCopy = () => {
    void navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 2000);
  };

  const handleVoiceInput = () => {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setLoadError('Voice input is not supported in this browser.');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setChatInput((prev) => `${prev}${prev ? ' ' : ''}${transcript}`);
      }
    };
    recognition.onerror = () => setLoadError('Voice input could not start.');
    recognition.start();
  };

  const enableNotifications = () => {
    setShowNotificationBar(false);
    if (!('Notification' in window)) {
      setLoadError('Browser notifications are not supported.');
      return;
    }
    void Notification.requestPermission();
  };

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderKey]: !(prev[folderKey] ?? true),
    }));
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(fileSearch.toLowerCase()) ||
    f.path.toLowerCase().includes(fileSearch.toLowerCase()),
  );
  const folderKeys = Array.from(new Set(filteredFiles.map((file) => file.folder))).sort((a, b) => {
    if (a === 'src') return -1;
    if (b === 'src') return 1;
    if (a === 'root') return -1;
    if (b === 'root') return 1;
    return a.localeCompare(b);
  });
  const previewDocument = buildPreviewDocument(files);

  useEffect(() => {
    let active = true;
    getMe()
      .then((me) => {
        if (!active) return;
        setAccountName(me.name || me.email.split('@')[0] || 'Webcraft User');
        setWorkspaceName(me.workspaceName || `${me.name || 'Webcraft'} Workspace`);
        updateLocalUser({
          name: me.name,
          workspaceName: me.workspaceName,
          avatar: me.avatar,
          username: me.username,
        });
      })
      .catch(() => {
        // The builder still works with the locally synced Clerk profile.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!projectParamId) {
      setLoadingProject(false);
      return;
    }
    if (loadedProjectRef.current === projectParamId) return;
    loadedProjectRef.current = projectParamId;
    let active = true;
    setLoadingProject(true);
    setLoadError('');

    getProject(projectParamId)
      .then((project) => {
        if (!active) return;
        const nextFiles = toGeneratedFiles(project.files);
        setProjectId(project.id);
        setProjectName(project.name);
        setProjectDescription(project.description);
        setProjectStatus(project.status);
        setProjectUpdatedAt(project.updatedAt);
        setFiles(nextFiles);
        setSelectedFilePath(pickDefaultFile(nextFiles));
        setViewMode(nextFiles.length > 0 ? 'preview' : 'code');
        setChatHistory(
          project.prompts.map((prompt) => ({
            sender: prompt.role === 'assistant' ? 'assistant' : 'user',
            time: formatTimestamp(prompt.timestamp),
            text: prompt.content,
          })),
        );
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : 'Could not load the project.');
      })
      .finally(() => {
        if (active) setLoadingProject(false);
      });

    return () => {
      active = false;
    };
  }, [projectParamId]);

  useEffect(() => {
    const prompt = initialPrompt.trim();
    if (projectParamId || !prompt || initialPromptHandled.current) return;
    initialPromptHandled.current = true;
    void runGeneration(prompt, { desiredName: initialProjectName || undefined });
    // This effect intentionally runs only for the prompt passed on first navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draggable Splitter Event Handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const sidebarOffset = sidebarOpen ? 256 : 0;
      const calculatedWidth = e.clientX - sidebarOffset;

      if (calculatedWidth < 160) {
        setChatOpen(false);
        setIsDragging(false);
      } else {
        setChatOpen(true);
        const maxWidth = Math.max(260, window.innerWidth - sidebarOffset - 320);
        setChatWidth(Math.min(Math.max(calculatedWidth, 260), maxWidth));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, sidebarOpen]);

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none transition-colors duration-300 studio-shell ${isDark ? 'bg-[#07090e] text-slate-100' : 'bg-[#f4f6fb] text-slate-900 studio-light'
        }`}
    >

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ─── TOP NAVIGATION BAR (Exact Lovable Style) ─────────────── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <header className={`h-12 shrink-0 bg-[#0a0d14] border-b border-white/10 flex items-center justify-between px-3 gap-2 z-30 ${standalonePreview ? 'hidden' : ''}`}>

        {/* LEFT SECTION: Logo, Workspace, Sidebar Toggle, Project Name, Timestamp, Chat Toggle */}
        <div className="flex items-center gap-2 min-w-0">

          {/* Lovable/Webcraft App Icon */}
          <Link
            to="/dashboard"
            className="flex items-center shrink-0 hover:opacity-90 transition-opacity"
            title="Go to Dashboard"
          >
            <img src="/assets/logo.png" alt="Webcraft Logo" className="h-6 w-auto object-contain" />
          </Link>

          {/* Sidebar Toggle Button (Panel Left) */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-lg border text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 ${sidebarOpen ? 'border-white/10 bg-white/5' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
              }`}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
          </button>

          {/* Project Name dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowProjectMenu(!showProjectMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              {editingName ? (
                <input
                  autoFocus
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onBlur={() => void saveProjectName()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void saveProjectName();
                  }}
                  className="bg-transparent border-b border-blue-500 text-xs font-semibold text-white focus:outline-none w-36"
                />
              ) : (
                <span className="truncate max-w-[150px]">{projectName}</span>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showProjectMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-56 rounded-xl bg-[#0f1420] border border-white/10 shadow-2xl p-1.5 z-50">
                <button
                  type="button"
                  onClick={() => { setEditingName(true); setShowProjectMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-slate-200 transition-colors"
                >
                  Rename project
                </button>
                <button
                  type="button"
                  onClick={() => { navigate('/dashboard'); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-slate-200 transition-colors"
                >
                  All projects
                </button>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <span className="text-[11px] text-slate-500 hidden md:inline shrink-0">
            {projectUpdatedAt
              ? new Date(projectUpdatedAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : 'Unsaved draft'}
          </span>

          {/* ─── MESSAGE / CHAT TOGGLE BUTTON (Requested Feature!) ─── */}
          {/* When project is full size (chat collapsed), this button is highlighted so users can re-open chat */}
          <button
            type="button"
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 ${!chatOpen
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            title={chatOpen ? 'Collapse chat to view full-size project' : 'Open chat window'}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
            {!chatOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* CENTER SECTION: Mode pills [Preview] [Code], Route bar */}
        <div className="flex items-center gap-2">

          {/* View Mode Switcher Pill */}
          <div className="inline-flex rounded-lg bg-white/5 border border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${viewMode === 'preview'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${viewMode === 'code'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Code</span>
            </button>
          </div>

          {/* Preview Route & Refresh Bar (Preview Mode) */}
          {viewMode === 'preview' && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={handleRefresh}
                className={`p-1 text-slate-400 hover:text-white cursor-pointer ${isRefreshing ? 'animate-spin text-blue-400' : ''}`}
                title="Reload preview"
              >
                <RotateCcw className="w-3 h-3" />
              </button>

              <span className="px-1 text-slate-400">
                {files.length} file{files.length === 1 ? '' : 's'} · {projectStatus}
              </span>

              <button
                type="button"
                onClick={handleOpenPreview}
                disabled={!projectId}
                className="p-1 text-slate-400 hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                title="Open project in a full-size new window"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Responsive devices, Share, Publish */}
        <div className="flex items-center gap-2">

          {/* Device viewport toggles in Preview */}
          {viewMode === 'preview' && (
            <div className="hidden lg:flex items-center gap-1 border-r border-white/10 pr-2">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${previewDevice === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                title="Desktop view"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${previewDevice === 'tablet' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                title="Tablet view"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${previewDevice === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                title="Mobile view"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Code Mode: Read only badge & Export */}
          {viewMode === 'code' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                Read only
              </span>

              {/* Export Button (Red box in screenshot 3) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={files.length === 0 || exportLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5 text-slate-300" />
                  <span>{exportLoading ? 'Exporting...' : 'Export'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showExportMenu && (
                  <div className="absolute top-full right-0 mt-1.5 w-48 rounded-xl bg-[#0f1420] border border-white/10 shadow-2xl p-1.5 z-50">
                    <button
                      type="button"
                      onClick={() => void handleDownloadZip()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-slate-200 transition-colors text-left"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <span>Download with ZIP</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Share Button */}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            disabled={!projectId}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Deploy Button */}
          <button
            type="button"
            onClick={() => setShowPublishModal(true)}
            disabled={files.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Deploy</span>
          </button>

        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ─── MAIN BODY (Sidebar + Chat + Canvas) ───────────────────── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ─── 1. COLLAPSIBLE LEFT SIDEBAR (Lovable style) ──────────── */}
        {sidebarOpen && !standalonePreview && (
          <aside className="w-64 shrink-0 bg-[#0a0d14] border-r border-white/10 flex flex-col h-full overflow-hidden z-20 transition-all duration-200">

            {/* Workspace Selector */}
            <div className="p-3 border-b border-white/10 relative">
              <button
                type="button"
                onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 border border-white/5 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {accountInitial}
                  </div>
                  <span className="text-xs font-bold text-white truncate">{workspaceName}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Workspace Popup Menu (Screenshot 2) */}
              {showWorkspaceMenu && (
                <div className="absolute top-full left-3 right-3 mt-1.5 rounded-2xl bg-[#0f1420] border border-white/10 shadow-2xl p-3 space-y-3 z-50">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      S
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{workspaceName}</div>
                      <div className="text-[11px] text-emerald-400 font-medium">Live workspace · {accountName}</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => { navigate('/settings'); setShowWorkspaceMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Workspace settings</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <button
                      type="button"
                      onClick={() => { navigate('/settings'); setShowWorkspaceMenu(false); }}
                      className="w-full flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer px-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Edit workspace</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">

              {/* Main Quick Actions */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => navigate('/builder')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-300" />
                  <span>New</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Projects</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/integrations')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Link2 className="w-4 h-4" />
                  <span>Connectors</span>
                </button>
              </div>

              {/* Projects section */}
              <div className="space-y-1">
                <div className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Projects
                </div>
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    to={`/builder?project=${encodeURIComponent(project.id)}`}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-colors ${project.id === projectId
                      ? 'font-semibold text-white bg-white/10 border border-white/10'
                      : 'font-medium text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${project.status === 'ready' ? 'bg-emerald-500' : project.status === 'synthesizing' ? 'bg-amber-500' : 'bg-slate-500'}`} />
                    <span className="truncate">{project.name}</span>
                  </Link>
                ))}
                {projects.length === 0 && (
                  <div className="px-3 py-2 text-xs text-slate-500 italic">No projects yet</div>
                )}
                <Link
                  to="/dashboard"
                  className="block px-3 py-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline"
                >
                  See all projects
                </Link>
              </div>

              {/* Recent chats */}
              <div className="space-y-1">
                <div className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Recent prompts
                </div>
                {chatHistory
                  .filter((message) => message.sender === 'user')
                  .slice(-3)
                  .reverse()
                  .map((message, index) => (
                    <button
                      key={`${message.time}-${index}`}
                      type="button"
                      onClick={() => setChatInput(message.text)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-white/5 truncate transition-colors"
                    >
                      {message.text}
                    </button>
                  ))}
                {chatHistory.every((message) => message.sender !== 'user') && (
                  <div className="px-3 py-2 text-xs text-slate-500 italic">No prompts yet</div>
                )}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-white/10 space-y-2">
              {/* Dark / Light Mode Toggle Button (Requested feature!) */}
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

              <Link
                to="/settings"
                className="flex items-center gap-2.5 px-1 py-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer block"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {accountInitial}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0a0d14]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{accountName}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{currentUser?.role === 'admin' ? 'Admin access' : 'Active account'}</span>
                  </div>
                </div>
              </Link>
            </div>
          </aside>
        )}

        {/* ─── 2. CHAT PANEL (Resizable & Collapsible) ─────────────── */}
        {chatOpen && !standalonePreview && (
          <div
            style={{ width: `${chatWidth}px` }}
            className="chat-panel shrink-0 flex flex-col h-full bg-[#0d111c] border-r border-white/10 relative overflow-hidden"
          >
            {/* Chat Header */}
            <div className="h-10 shrink-0 px-4 border-b border-white/10 flex items-center justify-between bg-[#0a0d14]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{projectName}</span>
                <span className="text-[10px] text-slate-500 font-normal shrink-0">
                  {isGenerating ? 'Building' : `${files.length} files`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Collapse chat window"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">

              {chatHistory.length === 0 && !isGenerating && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-400">
                  <p className="font-semibold text-slate-200">Start building</p>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    Describe the website or app you want. The AI will generate files, persist the
                    project to your account, and keep every follow-up edit in the same project.
                  </p>
                </div>
              )}

              {loadError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-3 text-[11px] text-red-300">
                  {loadError}
                </div>
              )}

              {chatHistory.map((msg, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-400">
                      {msg.sender === 'user' ? 'Prompt' : 'Webcraft Assistant'}
                    </span>
                    <span>{msg.time}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed ${msg.sender === 'user'
                      ? 'bg-blue-600/10 border border-blue-500/20 text-slate-200'
                      : 'bg-white/5 border border-white/10 text-slate-300'
                      }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Image Gallery Cards (Screenshot 4) */}
                    {msg.images && msg.images.length > 0 && (
                      <div className="mt-3.5 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          {msg.images.slice(0, 6).map((imgUrl, i) => (
                            <div
                              key={i}
                              className="relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 group cursor-pointer"
                            >
                              <img
                                src={imgUrl}
                                alt={`Generated Asset ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {i === 5 && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center font-bold text-white text-xs">
                                  +6 more
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Action feedback bar */}
                        <div className="flex items-center gap-3 pt-2 text-slate-500">
                          <button type="button" className="hover:text-white cursor-pointer" title="Helpful">
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="hover:text-white cursor-pointer" title="Not helpful">
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="hover:text-white cursor-pointer" title="Copy reply">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="hover:text-white cursor-pointer ml-auto">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-blue-400">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    <span>Synthesizing changes &amp; regenerating preview...</span>
                  </div>

                  <AdsterraBanner placement="loading" />
                </div>
              )}

              {/* Quick Prompt Suggestion Pill */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setChatInput('Fix the intermittent crash and improve hero layout')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
                >
                  Fix the intermittent crash
                </button>
              </div>
            </div>

            {/* Bottom Notification Banner (Screenshot 4) */}
            {showNotificationBar && (
              <div className="px-4 py-2 border-t border-white/5 bg-[#0a0d14]/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Bell className="w-3 h-3 text-blue-400" />
                  <span>Get notified when Webcraft finishes</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={enableNotifications}
                    className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium cursor-pointer"
                  >
                    Enable
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNotificationBar(false)}
                    className="text-slate-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Input Area (Lovable style prompt box) */}
            <div className="p-3 border-t border-white/10 bg-[#0a0d14]">
              <div className="rounded-2xl bg-[#141926] border border-white/10 p-2.5 space-y-2 focus-within:border-blue-500/50 transition-colors">
                <textarea
                  id="builder-chat-input"
                  rows={2}
                  value={chatInput}
                  disabled={isGenerating || loadingProject}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={isGenerating ? 'Building your project...' : 'Describe what to build or change...'}
                  className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed disabled:opacity-60"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => document.getElementById('builder-chat-input')?.focus()}
                      className="w-6 h-6 rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Focus prompt"
                    >
                      <Plus className="w-3 h-3" />
                    </button>

                    {/* Mode Selector Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setBuildModeDropdown(!buildModeDropdown)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <span>{buildMode}</span>
                        <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                      </button>

                      {buildModeDropdown && (
                        <div className="absolute bottom-full left-0 mb-1 w-28 rounded-xl bg-[#0f1420] border border-white/10 shadow-xl p-1 z-50">
                          {(['Build', 'Plan', 'Fix'] as const).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => { setBuildMode(mode); setBuildModeDropdown(false); }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${buildMode === mode ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                                }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      disabled={isGenerating || loadingProject}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                      title="Voice input"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isGenerating || loadingProject}
                      className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-3.5 h-3.5 font-bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── 3. DRAGGABLE SPLITTER (Mouse cursor se barh bi sakat ho or kam bi) ─── */}
        {chatOpen && !standalonePreview && (
          <div
            onMouseDown={() => setIsDragging(true)}
            className="w-1.5 shrink-0 bg-transparent hover:bg-blue-500/50 active:bg-blue-500 cursor-col-resize transition-colors relative z-20 group"
            title="Drag to resize chat and project window"
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-10 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-0.5 h-1 bg-white rounded-full" />
              <div className="w-0.5 h-1 bg-white rounded-full" />
              <div className="w-0.5 h-1 bg-white rounded-full" />
            </div>
          </div>
        )}

        {/* ─── 4. PROJECT CANVAS (Preview / Code Mode) ──────────────── */}
        <main className="project-canvas flex-1 flex flex-col overflow-hidden bg-[#07090e] relative min-w-0">

          {/* ═══════ CODE MODE (Screenshot 3) ═══════ */}
          {viewMode === 'code' && !standalonePreview && (
            <div className="flex-1 flex overflow-hidden">

              {/* Code File Explorer Sidebar */}
              <div className="w-60 xl:w-64 shrink-0 bg-[#0a0d14] border-r border-white/10 flex flex-col overflow-hidden">

                {/* Search Code Input */}
                <div className="p-3 border-b border-white/10">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fileSearch}
                      onChange={(e) => setFileSearch(e.target.value)}
                      placeholder="Search code"
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* File Tree List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs font-mono">
                  {folderKeys.map((folder) => (
                    <div key={folder}>
                      <button
                        type="button"
                        onClick={() => toggleFolder(folder)}
                        className="w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        {(expandedFolders[folder] ?? true) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        <Folder className={`w-3.5 h-3.5 ${folder === 'src' ? 'text-blue-400' : folder === 'public' ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{folder === 'root' ? 'project root' : folder}</span>
                      </button>
                      {(expandedFolders[folder] ?? true) && (
                        <div className="pl-6 space-y-0.5">
                          {filteredFiles
                            .filter((file) => file.folder === folder)
                            .map((file) => (
                              <button
                                key={file.path}
                                type="button"
                                onClick={() => setSelectedFilePath(file.path)}
                                className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-colors cursor-pointer ${selectedFilePath === file.path ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                                  }`}
                              >
                                <FileCode2 className="w-3.5 h-3.5" />
                                <span className="truncate">{file.name}</span>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {folderKeys.length === 0 && (
                    <div className="px-3 py-4 text-[11px] leading-relaxed text-slate-500">
                      {files.length === 0
                        ? 'No files yet. Generate a project from the chat panel.'
                        : 'No files match your search.'}
                    </div>
                  )}
                </div>
              </div>
              {/* Code Editor Area */}
              <div className="flex-1 flex flex-col bg-[#05070c] overflow-hidden">
                {/* Editor Tab Bar */}
                <div className="h-10 shrink-0 px-4 border-b border-white/10 flex items-center justify-between bg-[#0a0d14]">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{activeFile?.path || 'No file selected'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    disabled={!activeFile}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Code Text Area with Line Numbers */}
                {activeFile ? (
                  <div className="flex-1 overflow-auto p-4 flex font-mono text-xs leading-relaxed select-text">
                    <div className="pr-4 select-none text-slate-600 text-right space-y-0.5">
                      {activeFile.content.split('\n').map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <pre className="text-slate-200 overflow-visible whitespace-pre">
                      <code>{activeFile.content}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-slate-500">
                    <FileCode2 className="h-9 w-9" />
                    <p className="text-xs">
                      {loadingProject
                        ? 'Loading project files...'
                        : 'No files yet. Generate a project from the chat panel.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════ PREVIEW MODE (Screenshot 4) ═══════ */}
          {(viewMode === 'preview' || standalonePreview) && (
            <div className="preview-stage flex-1 flex flex-col overflow-hidden bg-[#0a0c14]">
              <div key={previewKey} className={`flex-1 flex items-center justify-center overflow-auto ${standalonePreview ? 'p-0' : 'p-2 sm:p-4'}`}>
                <div
                  className={`h-full max-h-full rounded-2xl bg-[#07090e] text-white border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                    previewDevice === 'mobile'
                      ? 'w-[375px]'
                      : previewDevice === 'tablet'
                        ? 'w-[768px]'
                        : 'w-full'
                  }`}
                >
                  {loadingProject || isGenerating ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                      <p className="text-xs">
                        {loadingProject ? 'Loading project...' : 'Generating project...'}
                      </p>
                    </div>
                  ) : previewDocument ? (
                    <iframe
                      title={`${projectName} preview`}
                      srcDoc={previewDocument}
                      sandbox="allow-scripts allow-forms allow-modals allow-popups"
                      className="h-full w-full bg-white"
                    />
                  ) : files.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                      <Globe className="h-10 w-10 text-slate-600" />
                      <h3 className="text-sm font-bold text-white">No preview yet</h3>
                      <p className="max-w-sm text-xs leading-relaxed text-slate-400">
                        Describe your app in the chat panel to generate the first version.
                      </p>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                      <Code2 className="h-10 w-10 text-slate-600" />
                      <h3 className="text-sm font-bold text-white">{projectName}</h3>
                      <p className="max-w-md text-xs leading-relaxed text-slate-400">
                        This project was generated as React source. Use the Code tab to inspect it, or
                        export the ZIP and run it locally. Static HTML projects render directly here.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setViewMode('code')}
                          className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/15"
                        >
                          View code
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDownloadZip()}
                          disabled={exportLoading}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                        >
                          {exportLoading ? 'Exporting...' : 'Download ZIP'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ─── MODALS: PUBLISH, SHARE, GITHUB PUSH ──────────────────── */}
      {/* ══════════════════════════════════════════════════════════════ */}

      {/* DEPLOY MODAL */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowPublishModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#0f1420] border border-white/10 shadow-2xl p-6 space-y-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Deploy Project</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hosting providers are connected from your integrations settings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">Current options</p>
              <p>
                Download the production-ready ZIP now. Automatic Netlify or Vercel deployment
                becomes available after you connect those services.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => void handleDownloadZip()}
                disabled={exportLoading}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                {exportLoading ? 'Preparing ZIP...' : 'Download ZIP'}
              </button>
              <Link
                to="/integrations"
                onClick={() => setShowPublishModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Link2 className="w-3.5 h-3.5" />
                Open Integrations
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-[#0f1420] border border-white/10 shadow-2xl p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Share Project</h2>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Share this project link with people who have access to your Webcraft account.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 text-xs font-mono text-slate-300">
              <span className="truncate">{shareUrl}</span>
              <button
                type="button"
                onClick={handleShareCopy}
                className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs shrink-0 cursor-pointer"
              >
                {shareCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Backdrop for outside click menus */}
      {(showExportMenu || showProjectMenu || showWorkspaceMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowExportMenu(false);
            setShowProjectMenu(false);
            setShowWorkspaceMenu(false);
          }}
        />
      )}
    </div>
  );
};
