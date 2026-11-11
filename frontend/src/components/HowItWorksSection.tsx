import React from 'react';
import { MessageSquare, Wand2, Monitor, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      gradient: 'from-blue-500 to-indigo-600',
      icon: <MessageSquare className="w-6 h-6 text-blue-500 dark:text-cyan-400" />,
      title: 'Describe your project page in plain English',
      desc: 'Specify your product, preferred sections, color palette, and target audience in natural conversational language.'
    },
    {
      num: '02',
      gradient: 'from-purple-500 to-pink-500',
      icon: <Wand2 className="w-6 h-6 text-purple-500 dark:text-pink-400" />,
      title: 'Let AI generate your page',
      desc: 'Webcarft synthesizes responsive React 19 components and modern Tailwind CSS utility styling in seconds.'
    },
    {
      num: '03',
      gradient: 'from-pink-500 to-rose-500',
      icon: <Monitor className="w-6 h-6 text-pink-500 dark:text-rose-400" />,
      title: 'Preview, customize & launch',
      desc: 'Inspect your design across mobile and desktop, download your clean source ZIP, or publish directly to Vercel.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="text-xs font-bold text-purple-600 dark:text-cyan-400 uppercase tracking-widest">
            SIMPLE 3-STEP PROCESS
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Three steps from idea to live landing page
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            No complex setup or coding barriers. Go from an initial prompt to a finished landing page in seconds.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-8 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200/80 dark:border-blue-500/20 shadow-sm hover:shadow-xl hover:border-blue-400/40 dark:hover:border-cyan-400/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between min-h-[240px]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className={`text-3xl sm:text-4xl font-black font-mono bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent opacity-85`}>
                  {step.num}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
          >
            <span>Read full walkthrough guides &amp; tutorials</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
