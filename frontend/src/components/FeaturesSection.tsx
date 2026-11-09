import React from 'react';
import { Sparkles, Code2, GitBranch, Rocket, Download, ArrowRight } from 'lucide-react';
import { FEATURES_DATA } from '../data/landingData.ts';
import { FeatureItem } from '../types/index.ts';

interface FeaturesSectionProps {
  onSelectFeature: (feature: FeatureItem) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectFeature }) => {
  const getFeatureIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 mb-5">
            <Sparkles className="w-6 h-6" />
          </div>
        );
      case 1:
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-5">
            <Code2 className="w-6 h-6" />
          </div>
        );
      case 2:
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 mb-5">
            <GitBranch className="w-6 h-6" />
          </div>
        );
      case 3:
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 mb-5">
            <Rocket className="w-6 h-6" />
          </div>
        );
      case 4:
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 mb-5">
            <Download className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-md mb-5">
            <Sparkles className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <section id="features" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="text-xs font-bold text-purple-600 dark:text-cyan-400 uppercase tracking-widest">
            CORE PLATFORM CAPABILITIES
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything you need to launch
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Click any capability to inspect architectural blueprints, code snippets, and deployment specs.
          </p>
        </div>

        {/* 5 Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {FEATURES_DATA.map((feature, idx) => (
            <div
              key={feature.id}
              onClick={() => onSelectFeature(feature)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectFeature(feature);
                }
              }}
              className="group p-6 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200/80 dark:border-blue-500/20 shadow-sm hover:shadow-xl hover:border-blue-400/50 dark:hover:border-cyan-400/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {getFeatureIcon(idx)}

                <div className="text-[11px] font-semibold text-purple-600 dark:text-cyan-400 mb-1.5 uppercase tracking-wider">
                  {feature.badge}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                <span>View Specs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
