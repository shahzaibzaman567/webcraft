import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Layers, Database, Code2, CheckCircle2 } from 'lucide-react';
import { AdsterraBanner } from './AdsterraBanner';

export interface WebcraftLoaderProps {
  /**
   * Display mode:
   * - 'fullscreen': Full-page overlay with ambient background glow (ideal for page routing & project load)
   * - 'generation': Embedded inside AI chat / builder canvas during code synthesis with stage stepper
   * - 'compact': Minimalist inline loader for cards, buttons, or fast API fetches
   */
  variant?: 'fullscreen' | 'generation' | 'compact';
  title?: string;
  subtitle?: string;
  showAdSlot?: boolean;
  adSlotId?: string;
  className?: string;
}

const GENERATION_STAGES = [
  { icon: Cpu, label: 'Initializing Neural Engine...', detail: 'Allocating high-speed compute cluster' },
  { icon: Layers, label: 'Architecting Full-Stack Blueprint...', detail: 'Scaffolding React 19 + Express microservices' },
  { icon: Database, label: 'Wiring Database & Hybrid Sync...', detail: 'Connecting Supabase Postgres & MongoDB schemas' },
  { icon: Code2, label: 'Synthesizing Tailwind 4 & Logic...', detail: 'Generating responsive UI and live endpoints' },
  { icon: Sparkles, label: 'Optimizing Production Output...', detail: 'Injecting security headers & instant preview' },
];

export const WebcraftLoader: React.FC<WebcraftLoaderProps> = ({
  variant = 'fullscreen',
  title = 'Webcraft AI Engine',
  subtitle,
  showAdSlot = false,
  adSlotId,
  className = '',
}) => {
  const [stageIndex, setStageIndex] = useState(0);

  // Progressive status cycling every 2.4 seconds
  useEffect(() => {
    if (variant === 'compact') return;
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % GENERATION_STAGES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [variant]);

  const currentStage = GENERATION_STAGES[stageIndex];

  // -------------------------------------------------------------
  // COMPACT VARIANT (Minimalist spinner for inline controls)
  // -------------------------------------------------------------
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <div className="relative w-7 h-7 flex items-center justify-center">
          {/* Outer glowing spin ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-indigo-500 animate-spin" />
          {/* Inner counter spin ring */}
          <div className="absolute inset-1 rounded-full border border-transparent border-b-purple-400 border-l-pink-500 animate-[spin_1.5s_linear_infinite_reverse]" />
          {/* Center core pulse */}
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 animate-ping" />
        </div>
        <span className="text-xs font-medium text-slate-400 animate-pulse">
          {title || 'Loading...'}
        </span>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GENERATION VARIANT (Designed for AI synthesis / Code compilation)
  // -------------------------------------------------------------
  if (variant === 'generation') {
    const StageIcon = currentStage.icon;
    return (
      <div
        className={`w-full max-w-xl mx-auto p-6 rounded-2xl bg-[#070b18]/90 backdrop-blur-xl border border-indigo-500/20 shadow-[0_0_50px_rgba(79,70,229,0.15)] flex flex-col items-center text-center relative overflow-hidden ${className}`}
      >
        {/* Ambient background rays */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Signature Orbital Brand Mark */}
        <div className="relative w-24 h-24 mb-5 flex items-center justify-center">
          {/* Pulse Ripple Wave */}
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping duration-1000" />

          {/* Outer Orbital Ring 1 (Clockwise) */}
          <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-[spin_8s_linear_infinite]" />

          {/* Outer Orbital Ring 2 with glowing gradient (Counter-Clockwise) */}
          <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-indigo-500 border-r-purple-500 border-b-cyan-400 animate-[spin_3s_linear_infinite_reverse]" />

          {/* Orbiting Satellite Dot */}
          <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] -top-1 left-1/2 -translate-x-1/2 absolute" />
          </div>

          {/* Center Glass Sphere with Webcraft Mark */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0c142b] to-[#060a17] border border-white/15 shadow-[inset_0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center group overflow-hidden">
            <img
              src="/assets/logo.png"
              alt="Webcraft Logo"
              className="w-8 h-8 object-contain filter drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"
              onError={(e) => {
                // Fallback to Icon if logo image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Sparkles className="w-6 h-6 text-cyan-400 absolute opacity-70 animate-pulse pointer-events-none" />
          </div>
        </div>

        {/* Active Stage Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-2 shadow-sm">
          <StageIcon className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>{currentStage.label}</span>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight mb-1">
          {title}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          {subtitle || currentStage.detail}
        </p>

        {/* High-Tech Animated Indeterminate Progress Bar */}
        <div className="w-full max-w-md h-1.5 bg-slate-800/80 rounded-full overflow-hidden relative mb-4 border border-slate-700/50">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500 rounded-full animate-[progress_1.8s_ease-in-out_infinite]" />
        </div>

        {/* Micro Step Ticker Dots */}
        <div className="flex items-center justify-center gap-2">
          {GENERATION_STAGES.map((_, idx) => (
            <div
              key={idx}
              className={`transition-all duration-300 rounded-full ${idx === stageIndex
                  ? 'w-6 h-1.5 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_8px_#38bdf8]'
                  : idx < stageIndex
                    ? 'w-1.5 h-1.5 bg-indigo-500/70'
                    : 'w-1.5 h-1.5 bg-slate-700'
                }`}
            />
          ))}
        </div>

        {/* High-CPM Adsterra Slot for long AI synthesis */}
        {showAdSlot && (
          <div className="mt-5 w-full pt-4 border-t border-slate-800/80">
            <AdsterraBanner placement="loading" format="300x250" />
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULLSCREEN VARIANT (The Flagship Brand Transition Loader)
  // -------------------------------------------------------------
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030612]/95 backdrop-blur-2xl transition-all duration-500 ${className}`}
    >
      {/* Background Cyber-Grid Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(79,70,229,0.18),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      {/* Main Core Container */}
      <div className="relative flex flex-col items-center text-center z-10 px-4">
        {/* Iconic Webcraft Orbital Geometry */}
        <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
          {/* Deep Ambient Glow Sphere */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/30 to-purple-600/20 blur-2xl animate-pulse" />

          {/* Outer Ring 1: Hexagonal Particle Ring (Clockwise) */}
          <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 animate-[spin_12s_linear_infinite]" />

          {/* Outer Ring 2: Dual-Arc Neon Blade (Counter-Clockwise) */}
          <div className="absolute -inset-1 rounded-full border-2 border-transparent border-t-cyan-400 border-b-purple-500 animate-[spin_4s_cubic-bezier(0.4,0,0.2,1)_infinite_reverse] shadow-[0_0_20px_rgba(56,189,248,0.2)]" />

          {/* Ring 3: Concentric Internal Track */}
          <div className="absolute inset-3 rounded-full border border-indigo-500/30 animate-[spin_6s_linear_infinite]" />

          {/* 4 Quantum Orbital Satellites */}
          <div className="absolute inset-0 animate-[spin_5s_linear_infinite]">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_12px_#38bdf8]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_12px_#c084fc]" />
          </div>
          <div className="absolute inset-0 animate-[spin_7s_linear_infinite_reverse]">
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]" />
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-pink-400 rounded-full shadow-[0_0_10px_#f472b6]" />
          </div>

          {/* Center Brand Glass Core */}
          <div className="relative w-20 h-20 rounded-3xl bg-[#070c1e]/90 border border-white/20 shadow-[0_0_30px_rgba(79,70,229,0.4),inset_0_0_20px_rgba(255,255,255,0.08)] flex items-center justify-center overflow-hidden backdrop-blur-xl group">
            <img
              src="/assets/logo.png"
              alt="Webcraft"
              className="w-11 h-11 object-contain filter drop-shadow-[0_0_14px_rgba(56,189,248,0.9)] animate-[pulse_2.5s_easeInOut_infinite]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000" />
          </div>
        </div>

        {/* Brand Name with Cosmic Glow */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Webcraft
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 rounded-md shadow-sm">
            AI Studio
          </span>
        </div>

        {/* Dynamic Stage Pill */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-indigo-500/30 text-indigo-200 text-xs font-mono mb-4 shadow-lg backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{currentStage.label}</span>
        </div>

        {/* Smooth Neon Progress Bar */}
        <div className="w-64 sm:w-72 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative shadow-inner">
          <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full animate-[progress_1.6s_ease-in-out_infinite] shadow-[0_0_12px_#6366f1]" />
        </div>

        {/* Subtitle / Tech Quote */}
        <p className="mt-4 text-xs font-medium text-slate-500 font-mono tracking-wide">
          {subtitle || 'Zero limits • Infinite builds • Powered by Webcraft Core'}
        </p>
      </div>

      {/* Footer Branding Trademark */}
      <div className="absolute bottom-6 text-[11px] font-mono text-slate-600 flex items-center gap-2">
        <span>Architected by</span>
        <span className="text-slate-400 font-semibold">Shahzaib Zaman</span>
        <span>•</span>
        <span className="text-cyan-500/80">Webcraft v2.0</span>
      </div>
    </div>
  );
};

export default WebcraftLoader;

