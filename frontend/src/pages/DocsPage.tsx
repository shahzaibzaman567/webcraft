import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Code2,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
  Compass,
  GitBranch,
  Rocket,
  Globe,
  Server,
  Database,
  Download,
  Terminal,
} from 'lucide-react';
import { DOCS_TOPICS } from '../data/landingData.ts';
import { AdsterraBanner } from '../components/AdsterraBanner.tsx';

export const DocsPage: React.FC = () => {
  const { topic } = useParams<{ topic?: string }>();
  const activeSlug = topic || 'getting-started';
  const currentDoc = DOCS_TOPICS.find((d) => d.slug === activeSlug) || DOCS_TOPICS[0];

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [docSearch, setDocSearch] = useState<string>('');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getTopicIcon = (slug: string) => {
    switch (slug) {
      case 'getting-started':
        return BookOpen;
      case 'build-mode':
        return Sparkles;
      case 'plan-mode':
        return Compass;
      case 'tailwind-styling':
        return Code2;
      case 'code-export':
        return Download;
      case 'deployments':
        return Rocket;
      case 'custom-domains':
        return Globe;
      default:
        return Terminal;
    }
  };

  const filteredTopics = DOCS_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(docSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(docSearch.toLowerCase())
  );

  const currentIndex = DOCS_TOPICS.findIndex((d) => d.slug === currentDoc.slug);
  const prevDoc = currentIndex > 0 ? DOCS_TOPICS[currentIndex - 1] : null;
  const nextDoc = currentIndex < DOCS_TOPICS.length - 1 ? DOCS_TOPICS[currentIndex + 1] : null;

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner / Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/docs" className="hover:text-blue-500">Documentation</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium">{currentDoc.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 rounded-2xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 p-4 shadow-sm lg:sticky lg:top-24 space-y-4">
          {/* Docs Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder="Search docs..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <nav className="space-y-1 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Table of Contents
            </div>
            {filteredTopics.map((docItem) => {
              const Icon = getTopicIcon(docItem.slug);
              const isSelected = docItem.slug === currentDoc.slug;

              return (
                <Link
                  key={docItem.id}
                  to={`/docs/${docItem.slug}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{docItem.title}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 p-6 sm:p-10 shadow-xl space-y-8">
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-white/10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300">
              <span>{currentDoc.category}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {currentDoc.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentDoc.description}
            </p>
            <div className="text-xs text-slate-400">
              {currentDoc.lastUpdated}
            </div>
          </div>

          {/* Doc Sections */}
          <div className="space-y-8">
            {currentDoc.content.map((section, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {section.heading}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {section.text}
                </p>

                {section.code && (
                  <div className="relative rounded-2xl bg-slate-900 p-4 border border-blue-500/20 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner">
                    <button
                      type="button"
                      onClick={() => handleCopy(section.code!)}
                      aria-label="Copy code to clipboard"
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCode === section.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <pre className="text-cyan-300 leading-relaxed pr-8">
                      <code>{section.code}</code>
                    </pre>
                  </div>
                )}

                {section.tips && (
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 space-y-1.5">
                    <div className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                      Pro Tips:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {section.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Adsterra Sponsored Developer Tools Banner */}
          <div className="pt-8">
            <AdsterraBanner placement="docs" format="728x90" />
          </div>

          {/* Pagination: Previous & Next Topic */}
          <div className="pt-8 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-4 text-xs sm:text-sm">
            {prevDoc ? (
              <Link
                to={`/docs/${prevDoc.slug}`}
                className="p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 text-left transition-colors group"
              >
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Previous</div>
                <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-500">
                  ← {prevDoc.title}
                </div>
              </Link>
            ) : <div />}

            {nextDoc && (
              <Link
                to={`/docs/${nextDoc.slug}`}
                className="p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 text-right transition-colors group ml-auto"
              >
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Next</div>
                <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-500">
                  {nextDoc.title} →
                </div>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
