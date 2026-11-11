import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCode2,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';
import { GUIDES_DATA } from '../data/landingData.ts';
import { AdsterraBanner } from '../components/AdsterraBanner.tsx';

export const GuidesPage: React.FC = () => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(GUIDES_DATA[0].id);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeGuide =
    GUIDES_DATA.find((g) => g.id === selectedGuideId) || GUIDES_DATA[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* 1. Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
          <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>TUTORIALS &amp; GUIDES</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Practical tutorials to build{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500">
            stunning landing pages
          </span>
          .
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Follow step-by-step walkthroughs to design high-converting landing pages, customize Tailwind CSS themes, and publish with zero hassle.
        </p>
      </section>

      {/* 2. Interactive Guide Viewer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Guide Selector Tabs */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Select a Guide
            </div>

            {GUIDES_DATA.map((guide) => {
              const isSelected = guide.id === activeGuide.id;
              return (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => setSelectedGuideId(guide.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#060c23] border-blue-500 dark:border-blue-500 shadow-xl shadow-blue-950/20'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{guide.duration}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {guide.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        guide.difficulty === 'Beginner'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {guide.difficulty}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Guide Content Detail */}
          <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 p-6 sm:p-10 shadow-xl space-y-8">
            <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>{activeGuide.category}</span>
                <span>•</span>
                <span>{activeGuide.duration}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {activeGuide.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                {activeGuide.description}
              </p>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-8">
              {activeGuide.steps.map((step) => (
                <div key={step.stepNumber} className="relative pl-10 sm:pl-12">
                  {/* Step Number Circle */}
                  <div className="absolute left-0 top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                    {step.stepNumber}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.details}
                    </p>

                    {step.codeSnippet && (
                      <div className="relative mt-3 rounded-2xl bg-slate-900 p-4 border border-blue-500/20 font-mono text-xs text-slate-200 shadow-inner overflow-x-auto">
                        <button
                          type="button"
                          onClick={() => handleCopy(step.codeSnippet!)}
                          aria-label="Copy snippet"
                          className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedCode === step.codeSnippet ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <pre className="text-cyan-300 leading-relaxed pr-8">
                          <code>{step.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <AdsterraBanner placement="docs" format="728x90" />
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Completed this guide? Try generating the site in Webcarft now.
              </span>
              <Link
                to="/signup"
                className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md"
              >
                Launch Builder
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
