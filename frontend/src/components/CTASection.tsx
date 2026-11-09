import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onOpenSignUp: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenSignUp }) => {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner matching Image 11 */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-10 sm:p-14 md:p-16 text-center shadow-xl shadow-purple-500/15">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            Your next full-stack application is one idea away.
          </h2>

          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Describe your concept, let AI build the frontend &amp; backend, and launch worldwide in seconds.
          </p>

          <button
            onClick={onOpenSignUp}
            className="px-8 py-3.5 rounded-full font-semibold text-sm text-slate-900 bg-white hover:bg-slate-50 shadow-md transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
