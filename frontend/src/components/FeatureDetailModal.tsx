import React, { useEffect } from 'react';
import { X, Check, ArrowRight, Sparkles, Code2, GitBranch, Rocket, Download } from 'lucide-react';
import { FeatureItem } from '../types/index.ts';

interface FeatureDetailModalProps {
  feature: FeatureItem | null;
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  feature,
  onClose,
  onOpenSignUp,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && feature) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [feature, onClose]);

  useEffect(() => {
    if (feature) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [feature]);

  if (!feature) return null;

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-pink-500" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-purple-500" />;
      case 'GitBranch':
        return <GitBranch className="w-6 h-6 text-blue-500" />;
      case 'Rocket':
        return <Rocket className="w-6 h-6 text-pink-500" />;
      case 'Download':
        return <Download className="w-6 h-6 text-cyan-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-pink-500" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={feature.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 text-slate-900 dark:text-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close feature details"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
            {renderIcon(feature.icon)}
          </div>
          <div>
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              {feature.badge || 'Platform Feature'}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {feature.title}
            </h3>
          </div>
        </div>

        {/* Tagline & Deep Dive */}
        <p className="text-sm font-medium text-slate-700 dark:text-purple-300 mb-3">
          {feature.tagline}
        </p>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
          {feature.deepDive}
        </p>

        {/* Benefits list */}
        <div className="mb-6 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Key Capabilities
          </h4>
          <ul className="space-y-2">
            {feature.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Code / Workflow Preview */}
        {feature.codeSnippet && (
          <div className="mb-6">
            <div className="text-[11px] font-mono text-slate-500 mb-1.5 flex items-center justify-between">
              <span>Code / Command Sample</span>
              <span className="text-[10px] text-slate-400 font-sans">Ready-to-use</span>
            </div>
            <pre className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[12px] font-mono text-slate-200 overflow-x-auto leading-relaxed">
              <code>{feature.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenSignUp();
            }}
            className="flex-1 py-3 px-5 rounded-full font-semibold text-white text-xs bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Try {feature.title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-full font-medium text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
