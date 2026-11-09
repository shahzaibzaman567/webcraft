import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS } from '../data/landingData.ts';

export const PricingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const freeFeatures = [
    'AI full-stack project generation',
    'React 19 & Tailwind CSS frontend synthesis',
    'Node.js & Express REST API scaffolding',
    'MongoDB & Supabase schema generator',
    'Interactive live preview and inspector',
    'Complete full-stack ZIP source code export',
    'Deploy to your own Netlify or Vercel account',
    'Full code sovereignty & zero vendor lock-in',
  ];

  return (
    <div className="py-12 sm:py-20 space-y-20">
      {/* 1. Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>DEVELOPER-FIRST PRICING</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Full-Stack Code Generation.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            $0 Forever.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Webcarft generates and coordinates your full-stack applications for free. You connect and manage your own database and hosting providers.
        </p>
      </section>

      {/* 2. Single Premium Free Plan Card */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="relative group">
          {/* Ambient Glowing Aura */}
          <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500" />

          {/* Premium Card Container */}
          <div className="relative rounded-[28px] bg-white dark:bg-[#060c23] border-2 border-purple-500/80 shadow-2xl p-8 sm:p-12 text-slate-900 dark:text-white transition-all space-y-8">
            {/* Top Pill */}
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Webcarft Studio Plan</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>No Credit Card Required</span>
              </div>
            </div>

            {/* Price & Description */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  $0
                </span>
                <span className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  – Forever
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Start building for free today. Everything you need to create, preview, and export full-stack web applications with Webcarft, completely free.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Included in Webcarft Studio:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                {freeFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* BYO Infrastructure Transparency Box */}
            <div className="rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 p-4 border border-blue-200 dark:border-blue-800/40 text-left space-y-1.5">
              <div className="text-xs font-bold text-blue-700 dark:text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                <span>Bring Your Own Infrastructure (BYO) Model</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Webcarft creates the code and orchestrates deployment. You connect your own free or paid third-party accounts (MongoDB Atlas, Supabase, Netlify, AWS S3) and manage your own usage limits and payments directly with those services.
              </p>
            </div>

            {/* Prominent CTA Button */}
            <div className="pt-4 space-y-3">
              <Link
                to="/signup"
                className="w-full py-4 px-8 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-500 hover:to-pink-400 shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:shadow-[0_0_35px_rgba(236,72,153,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2.5 text-center cursor-pointer"
              >
                <span>Start Building Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Instant access • Export anytime • 100% code sovereignty
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Common Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            QUESTIONS &amp; ANSWERS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleFaq(item.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <span>{item.question}</span>
                {openFaq === item.id ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === item.id && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
