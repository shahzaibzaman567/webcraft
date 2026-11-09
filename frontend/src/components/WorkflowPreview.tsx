import React, { useState } from 'react';
import { Sparkles, Terminal, Code2, Eye, Rocket, Palette } from 'lucide-react';

export const WorkflowPreview: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '1',
      label: 'Prompt',
      icon: Sparkles,
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Describe your full-stack app, database models, and API endpoints.',
      mockDetails: {
        title: 'Full-Stack Specification Input',
        code: `// Prompt input:
"Create a modern SaaS workspace app with:
- React 19 frontend with real-time dashboard and dark mode
- Express.js backend with RESTful /api/v1/projects endpoints
- MongoDB or Supabase database schema for users & projects
- JWT authentication and BYO Netlify deployment configuration"`
      }
    },
    {
      num: '2',
      label: 'Generate',
      icon: Terminal,
      gradient: 'from-indigo-600 to-purple-600',
      description: 'AI generates React views, Express routes, and database models.',
      mockDetails: {
        title: 'Full-Stack Synthesis',
        code: `[Webcarft Workspace: Generating Full-Stack Architecture]
✓ Frontend Architect: React 19 views, Tailwind styles, and state management
✓ Backend Engineer: Express REST router & request validation middleware
✓ Data Engineer: MongoDB Mongoose schemas & Supabase migrations
✓ Security Auditor: Auth guards & zero public secret leakage verification`
      }
    },
    {
      num: '3',
      label: 'Connect DB',
      icon: Eye,
      gradient: 'from-purple-600 to-pink-500',
      description: 'Link your own MongoDB Atlas or Supabase account securely.',
      mockDetails: {
        title: 'Bring Your Own Database',
        code: `// Connect user-managed database credentials:
MONGODB_URI=mongodb+srv://admin:***@cluster0.mongodb.net/myapp
// or Supabase credentials:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOi...

✓ Credentials stored directly in your environment, never Webcarft`
      }
    },
    {
      num: '4',
      label: 'Inspect',
      icon: Palette,
      gradient: 'from-pink-500 to-rose-500',
      description: 'Test live API endpoints, inspect schemas, and customize code.',
      mockDetails: {
        title: 'Code & Schema Inspector',
        code: `// Interactive Testing:
GET /api/v1/projects -> Status 200 OK (5 items returned)
POST /api/v1/projects -> Validated with Zod schema & saved to DB
→ Frontend updated in real-time with responsive UI components`
      }
    },
    {
      num: '5',
      label: 'BYO Deploy',
      icon: Rocket,
      gradient: 'from-rose-500 to-blue-500',
      description: 'Deploy to your own Netlify or Vercel account or download ZIP.',
      mockDetails: {
        title: 'Deployment & Export',
        code: `✓ Download Source: fullstack-app.zip (React + Express + Schemas)
✓ Deploy: Connected to user's Netlify account
→ Build: npm run build (Success in 18s)
→ Live URL: https://my-app.netlify.app`
      }
    }
  ];

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="text-xs font-bold text-purple-600 dark:text-cyan-400 uppercase tracking-widest">
            INTERACTIVE PREVIEW
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Full-Stack Creation &amp; Deployment Flow
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Click each stage to see how Webcarft turns a natural prompt into a fully wired full-stack app deployed on your own infrastructure.
          </p>
        </div>

        {/* 5-Step Process Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200/80 dark:border-blue-500/25 shadow-xl p-6 sm:p-10 transition-all">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-3 items-start text-center pb-8 border-b border-slate-100 dark:border-white/10">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <button
                  type="button"
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className="group flex flex-col items-center cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-center focus:outline-none"
                >
                  {/* Number Circle */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${step.gradient} flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md mb-2.5 transition-all duration-200 ${
                      isSelected
                        ? 'ring-4 ring-blue-500/30 scale-105 shadow-lg'
                        : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'
                    }`}
                  >
                    <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Step Label */}
                  <div className={`text-xs sm:text-sm font-semibold transition-colors ${
                    isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {step.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Description & Code Simulation */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-cyan-400 text-xs font-bold">
                  {steps[activeStep].num}
                </span>
                <span>{steps[activeStep].label}: {steps[activeStep].description}</span>
              </div>
              <span className="text-[11px] font-mono text-purple-600 dark:text-cyan-400 bg-purple-50 dark:bg-white/5 px-2.5 py-1 rounded-md border border-purple-200/50 dark:border-white/10 self-start sm:self-auto">
                {steps[activeStep].mockDetails.title}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-slate-300 font-mono text-xs shadow-inner overflow-x-auto">
              <pre className="text-[11px] sm:text-xs text-blue-300 leading-relaxed">
                <code>{steps[activeStep].mockDetails.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
