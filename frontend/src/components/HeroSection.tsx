import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, ChevronDown, Mic } from 'lucide-react';

interface HeroSectionProps {
  onOpenSignUp?: () => void;
  onOpenDemo?: () => void;
}

const ROTATING_EXAMPLES = [
  'a full-stack SaaS with Supabase auth & PostgreSQL',
  'a booking platform with Express APIs & MongoDB Atlas',
  'an e-commerce portal with Stripe APIs & Netlify deploy',
  'a customer dashboard with MEGA storage & JWT auth',
  'a real-time team tracker with REST endpoints & custom DB',
  'a membership community with Supabase & Vercel edge deploy',
];

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [promptInput, setPromptInput] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_EXAMPLES.length);
        setIsTransitioning(false);
      }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalPrompt = promptInput.trim() || `Build ${ROTATING_EXAMPLES[wordIndex]}`;
    navigate(`/builder?prompt=${encodeURIComponent(finalPrompt)}`);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#fafbfc] dark:bg-[#030619] text-slate-950 dark:text-white transition-colors duration-300 pt-10 sm:pt-14 pb-16"
    >
      {/* Wireframe Matrix Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-start justify-center opacity-40 dark:opacity-45">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4 md:gap-5 w-[140%] max-w-none transform -translate-y-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="h-28 sm:h-36 md:h-44 rounded-2xl sm:rounded-3xl border border-slate-900/5 dark:border-blue-500/20 bg-gradient-to-b from-blue-500/5 via-indigo-500/5 to-transparent dark:from-blue-600/10 dark:via-blue-950/20 dark:to-transparent"
            />
          ))}
        </div>
      </div>

      {/* Central Ambient Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[450px] sm:h-[600px] bg-gradient-to-b from-blue-500/20 via-indigo-600/15 to-transparent dark:from-blue-600/25 dark:via-indigo-600/20 dark:to-transparent blur-[120px] pointer-events-none" />

      {/* Left Ribbon */}
      <div className="absolute -left-28 sm:-left-20 bottom-12 w-72 sm:w-96 h-[480px] pointer-events-none opacity-30 dark:opacity-90 hidden md:block z-0">
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-900 via-blue-600 to-cyan-400 filter blur-xl opacity-60 transform rotate-45" />
        <div className="absolute inset-0 rounded-[48px] border-8 border-cyan-400/30 shadow-[0_0_80px_rgba(6,182,212,0.4)] transform -rotate-12 translate-y-16 bg-gradient-to-br from-blue-600/30 via-indigo-800/40 to-transparent" />
      </div>

      {/* Right Ribbon */}
      <div className="absolute -right-28 sm:-right-20 bottom-12 w-72 sm:w-96 h-[480px] pointer-events-none opacity-30 dark:opacity-90 hidden md:block z-0">
        <div className="w-full h-full rounded-full bg-gradient-to-tl from-indigo-900 via-blue-600 to-cyan-400 filter blur-xl opacity-60 transform -rotate-45" />
        <div className="absolute inset-0 rounded-[48px] border-8 border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.4)] transform rotate-12 translate-y-16 bg-gradient-to-bl from-indigo-600/30 via-blue-900/40 to-transparent" />
      </div>

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full flex flex-col items-center justify-center">
        {/* Kicker Pill */}
        <div className="flex items-center justify-center gap-3 mb-5 sm:mb-6">
          <div className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-blue-500/60 dark:to-cyan-400/60" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800/50 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-300" />
            <span>A.I Driven Full-Stack</span>
          </div>
          <div className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-blue-500/60 dark:to-cyan-400/60" />
        </div>

        {/* Headline */}
        <div className="max-w-4xl mx-auto space-y-4 mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12]">
            Build Full-Stack Websites{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-300">
              with AI.
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Generate complete websites, backend APIs, authentication and database integrations through prompts. Connect MongoDB Atlas, Supabase, MEGA, Vercel and Netlify.
          </p>
        </div>

        {/* Lovable-Style White Prompt Card */}
        <form
          onSubmit={handleGenerate}
          className="w-full max-w-xl mx-auto px-2"
        >
          <div className="relative group">
            {/* Ambient aura glow */}
            <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-r from-blue-500/25 via-indigo-500/20 to-purple-500/25 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Pure White Card */}
            <div className="relative rounded-[24px] sm:rounded-[28px] bg-white text-slate-800 shadow-[0_16px_50px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)] p-4 sm:p-5 flex flex-col justify-between min-h-[100px] sm:min-h-[110px]">
              {/* Top: Prompt Input */}
              <div className="flex items-start gap-2 mb-2">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={`Ask Webcarft to create ${isTransitioning ? '' : ROTATING_EXAMPLES[wordIndex]}`}
                  className={`w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-sm md:text-base font-normal focus:outline-none transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                />
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {/* (+) button left */}
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Add attachment"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Build + Mic right */}
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 transition-colors cursor-pointer"
                  >
                    <span>Build</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                    title="Voice input"
                  >
                    <Mic className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Bottom tech pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
            ● Bring Your Own Accounts (Supabase / MongoDB / Netlify)
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
            ● Full Frontend &amp; Backend Code Export
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
            ● You Manage Your Own Infrastructure &amp; Limits
          </span>
        </div>
      </div>
    </section>
  );
};
