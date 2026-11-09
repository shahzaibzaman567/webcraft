import React from 'react';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onOpenSignUp: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenSignUp }) => {
  return (
    <section id="pricing" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            PRICING
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Start free
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Paid plans will be announced soon.
          </p>
        </div>

        {/* Centered Free Card matching Image 8 */}
        <div className="max-w-md mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Free
          </h3>

          <div className="space-y-3 text-left max-w-xs mx-auto mb-8">
            <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <Check className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>AI website generation</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <Check className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>Live preview &amp; editor</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <Check className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>Source code download</span>
            </div>
          </div>

          <button
            onClick={onOpenSignUp}
            className="w-full py-3.5 px-6 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-sm transition-all duration-200 cursor-pointer"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </section>
  );
};
