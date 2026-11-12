import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  FolderGit2,
  Plus,
  RefreshCw,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useAppShell } from '../components/AppShell';
import type { ApiProjectSummary } from '../lib/userApi';

type ProjectFilter = 'all' | 'ready' | 'building' | 'error';

const STATUS_META: Record<
  ApiProjectSummary['status'],
  { label: string; className: string; icon: React.ElementType }
> = {
  ready: {
    label: 'Ready',
    className:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    icon: CheckCircle2,
  },
  building: {
    label: 'Building',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    icon: Loader2,
  },
  error: {
    label: 'Needs attention',
    className: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    icon: AlertTriangle,
  },
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    filteredProjects,
    loadingProjects,
    refreshProjects,
    searchQuery,
    setSearchQuery,
    isDark,
  } = useAppShell();
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const visibleProjects = useMemo(() => {
    const base = searchQuery.trim() ? filteredProjects : projects;
    if (filter === 'all') return base;
    return base.filter((project) => project.status === filter);
  }, [filter, filteredProjects, projects, searchQuery]);

  const counts = useMemo(
    () => ({
      all: projects.length,
      ready: projects.filter((project) => project.status === 'ready').length,
      building: projects.filter((project) => project.status === 'building').length,
      error: projects.filter((project) => project.status === 'error').length,
    }),
    [projects],
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProjects();
    } finally {
      setRefreshing(false);
    }
  };

  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const card = isDark
    ? 'border-white/10 bg-[#0b0f19] hover:border-blue-500/40'
    : 'border-slate-200 bg-white hover:border-blue-400';

  const filters: Array<{ id: ProjectFilter; label: string }> = [
    { id: 'all', label: `All (${counts.all})` },
    { id: 'ready', label: `Ready (${counts.ready})` },
    { id: 'building', label: `Building (${counts.building})` },
    { id: 'error', label: `Needs attention (${counts.error})` },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-300">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Your AI workspaces</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">My Projects</h1>
          <p className={`mt-1 text-sm ${muted}`}>
            Every AI chat and generated application lives here. Open a project to continue building,
            review its status, or export the source.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
              isDark
                ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/25 transition-colors hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div
        className={`rounded-2xl border p-3 sm:p-4 ${
          isDark ? 'border-white/10 bg-[#0b0f19]' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${muted}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by project name, description, or status..."
              className={`w-full rounded-xl border py-2.5 pl-9 pr-9 text-sm outline-none transition-colors ${
                isDark
                  ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-blue-500/50'
                  : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500/50'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${muted} hover:text-rose-500`}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === item.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : `${muted} ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loadingProjects ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 py-20 dark:border-white/10">
          <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
          <p className={`text-sm ${muted}`}>Loading your live projects...</p>
        </div>
      ) : visibleProjects.length === 0 ? (
        <div
          className={`rounded-2xl border border-dashed p-10 text-center ${
            isDark ? 'border-white/10' : 'border-slate-300'
          }`}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-500">
            <FolderGit2 className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-base font-bold">
            {searchQuery || filter !== 'all' ? 'No projects match this view' : 'No projects yet'}
          </h2>
          <p className={`mx-auto mt-1 max-w-md text-xs ${muted}`}>
            {searchQuery || filter !== 'all'
              ? 'Try a different search term or clear the status filter.'
              : 'Start a new AI project and it will appear here with its build status and history.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            <span>Create your first project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {visibleProjects.map((project) => {
            const meta = STATUS_META[project.status] ?? STATUS_META.ready;
            const StatusIcon = meta.icon;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => navigate(`/builder?id=${project.id}`)}
                className={`group flex flex-col rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-xl ${card}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-sm font-bold">{project.name || 'Untitled Project'}</h2>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.className}`}
                      >
                        <StatusIcon
                          className={`h-3 w-3 ${project.status === 'building' ? 'animate-spin' : ''}`}
                        />
                        {meta.label}
                      </span>
                    </div>
                    <p className={`mt-1 line-clamp-2 text-xs ${muted}`}>
                      {project.description || 'No description was saved for this project yet.'}
                    </p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>

                <div className={`mt-4 grid grid-cols-2 gap-2 border-t pt-3 text-[11px] ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <div className={`flex items-center gap-1.5 ${muted}`}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>Updated {formatDate(project.updatedAt)}</span>
                  </div>
                  <div className={`flex items-center justify-end gap-1.5 ${muted}`}>
                    <span className="rounded-md bg-slate-500/10 px-2 py-0.5 font-semibold uppercase">
                      {project.framework || 'React'}
                    </span>
                  </div>
                  <div className={`col-span-2 flex items-center justify-between ${muted}`}>
                    <span>
                      Created {formatDate(project.createdAt)} · {project.exportsCount} export
                      {project.exportsCount === 1 ? '' : 's'}
                    </span>
                    <span className="font-semibold text-blue-500 group-hover:underline">Open project</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
