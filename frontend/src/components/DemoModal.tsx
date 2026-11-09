import React, { useState, useEffect } from 'react';
import { X, Play, RefreshCw, Sparkles } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onOpenSignUp }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveStep(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Natural Language Prompting',
      desc: 'Type your website vision: business model, sections, and preferred style.',
      demo: '“Build a modern SaaS landing page for an AI website builder with live preview and dark theme.”'
    },
    {
      title: '2. Live Component Synthesis',
      desc: 'Webcarft compiles production-ready React components and responsive styling.',
      demo: '✓ Responsive header with logo\n✓ Dynamic hero banner\n✓ Interactive feature cards\n✓ Full mobile drawer'
    },
    {
      title: '3. One-Click Global Deployment',
      desc: 'Push directly to GitHub or deploy worldwide to Vercel/Netlify with custom domain.',
      demo: '🚀 Building production bundle...\n⚡ Deploying to edge network...\n🎉 Live at https://my-site.vercel.app'
    }
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setActiveStep(current);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Webcarft Interactive Demo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 text-slate-900 dark:text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close demo"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Platform Walkthrough
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              From natural thought to published website in 3 simple steps
            </p>
          </div>
        </div>

        {/* Step tabs */}
        <div className="grid grid-cols-3 gap-2 mb-5 p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                activeStep === idx
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>

        {/* Display Pane */}
        <div className="p-5 rounded-2xl bg-[#0b1324] text-slate-200 mb-6 font-mono text-xs leading-relaxed space-y-3">
          <div className="text-pink-400 font-semibold">{steps[activeStep].title}</div>
          <p className="text-slate-400 font-sans text-xs">{steps[activeStep].desc}</p>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 whitespace-pre-line text-cyan-300">
            {steps[activeStep].demo}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 py-2 px-3 rounded-full bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating...' : 'Auto Replay'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenSignUp();
            }}
            className="py-2.5 px-6 rounded-full font-semibold text-white text-xs bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Building Free</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
