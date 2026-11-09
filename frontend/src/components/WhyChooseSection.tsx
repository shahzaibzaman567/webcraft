import React from 'react';
import { Zap, Code2, Shield, Layers } from 'lucide-react';

export const WhyChooseSection: React.FC = () => {
  const items = [
    {
      icon: <Zap className="w-6 h-6 text-pink-500" />,
      title: 'Fast from Idea to Full-Stack App',
      desc: 'Skip the blank page—start from complete frontend and backend code.'
    },
    {
      icon: <Code2 className="w-6 h-6 text-pink-500" />,
      title: 'Real, Exportable Code',
      desc: 'Standard React, Next.js, and Node.js code you can inspect, edit, and export.'
    },
    {
      icon: <Shield className="w-6 h-6 text-pink-500" />,
      title: '100% Code Ownership',
      desc: 'Download your full source ZIP or push directly to your personal GitHub.'
    },
    {
      icon: <Layers className="w-6 h-6 text-pink-500" />,
      title: 'Full-Stack Control',
      desc: 'No coding required to generate, with unlimited customization for developers.'
    }
  ];

  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            WHY WEBCARFT
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Why choose Webcarft?
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[200px]"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
                {item.icon}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
