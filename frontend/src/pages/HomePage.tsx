import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection.tsx';
import { TechStackMarquee } from '../components/TechStackMarquee.tsx';
import { FeaturesSection } from '../components/FeaturesSection.tsx';
import { HowItWorksSection } from '../components/HowItWorksSection.tsx';
import { WorkflowPreview } from '../components/WorkflowPreview.tsx';
import { AgentWorkspaceProgress } from '../components/AgentWorkspaceProgress.tsx';
import { ConnectServicesSection } from '../components/ConnectServicesSection.tsx';
import { FeatureDetailModal } from '../components/FeatureDetailModal.tsx';
import { FeatureItem } from '../types/index.ts';
import {
  Sparkles,
  Compass,
  ArrowRight,
  CheckCircle2,
  Code2,
  Layers,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);
  const [activeModeTab, setActiveModeTab] = useState<'build' | 'plan'>('build');

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section with visual-only AI prompt box */}
      <HeroSection />

      {/* 1.5. Floating Tech Stack Logo Marquee — "Works with your stack" */}
      <TechStackMarquee />

      {/* 2. Main Platform Features */}
      <FeaturesSection onSelectFeature={(feat) => setSelectedFeature(feat)} />

      {/* 3. Build Mode and Plan Mode Showcase */}
      <section className="py-12 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
              DUAL WORKFLOW ENGINE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Build Mode &amp; Plan Mode
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Switch seamlessly between structural planning and rapid visual generation.
            </p>

            {/* Mode Selector Pill */}
            <div className="inline-flex p-1.5 rounded-full bg-slate-100 dark:bg-[#060c23] border border-slate-200 dark:border-blue-900/40 mt-4 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveModeTab('build')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeModeTab === 'build'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Build Mode</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModeTab('plan')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeModeTab === 'plan'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Plan Mode</span>
              </button>
            </div>
          </div>

          {/* Interactive Mode Content Card */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/25 shadow-xl p-6 sm:p-10 transition-all">
            {activeModeTab === 'build' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Full-Stack Code Synthesis</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Instant Output: React 19, Express &amp; Databases
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Build Mode turns your prompts directly into complete full-stack applications: responsive React 19 views, Node.js/Express REST APIs, and MongoDB or Supabase schemas. Connect your own infrastructure and deploy without vendor lock-in.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>React 19 frontend + Express.js backend API architecture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>MongoDB Atlas and Supabase schema scaffolding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>BYO Netlify and Vercel deployment with complete ZIP export</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      to="/docs/build-mode"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                    >
                      <span>Explore Build Mode documentation</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 p-4 border border-blue-500/20 font-mono text-xs text-slate-300 shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <span>server/routes/api.ts</span>
                  </div>
                  <pre className="pt-3 text-[11px] leading-relaxed overflow-x-auto text-blue-300">
                    <code>{`// Express.js API + MongoDB Handler
import { Router } from 'express';
import { ProjectModel } from '../models/project.js';

export const router = Router();

router.get('/projects', async (req, res) => {
  const items = await ProjectModel.find({}).limit(10);
  res.json({ success: true, data: items });
});

router.post('/projects', async (req, res) => {
  const newProject = await ProjectModel.create(req.body);
  res.status(201).json({ success: true, project: newProject });
});`}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-pink-300">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Architectural Alignment</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Architecture, Data &amp; Schema First
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Plan Mode acts as your lead system architect. Model database schemas, map RESTful route contracts, define authentication boundaries, and plan UI views before generating code.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>Full-stack architecture blueprint &amp; entity relationship models</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>REST &amp; GraphQL endpoint contract planning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>Role-based access rules &amp; BYO database configuration</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      to="/docs/plan-mode"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-purple-600 dark:text-pink-400 hover:underline"
                    >
                      <span>Explore Plan Mode documentation</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 p-5 border border-purple-500/20 font-mono text-xs text-slate-300 shadow-2xl overflow-hidden space-y-3">
                  <div className="text-[11px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Full-Stack Architecture Plan</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2 rounded bg-purple-950/40 border border-purple-800/40 text-purple-200">
                      Tier 1: React 19 Frontend (Responsive Views + Auth Guards)
                    </div>
                    <div className="p-2 rounded bg-blue-950/40 border border-blue-800/40 text-blue-200">
                      Tier 2: Express.js API Gateway (/api/v1/projects, /api/v1/users)
                    </div>
                    <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                      Tier 3: BYO Database (MongoDB Atlas / Supabase Tables)
                    </div>
                    <div className="p-2 rounded bg-slate-800/60 border border-slate-700 text-slate-300">
                      Tier 4: BYO Hosting (User Netlify / Vercel Edge Pipeline)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Specialist Agents AI Workspace */}
      <AgentWorkspaceProgress />

      {/* 5. Connect Third-Party Services (MongoDB Atlas, Supabase, Vercel, Netlify) */}
      <ConnectServicesSection />

      {/* 6. How Webcarft Works (3 Steps) */}
      <HowItWorksSection />

      {/* 6. Live Preview Simulator */}
      <WorkflowPreview />

      {/* 7. About Webcarft Introduction Card */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10 border border-slate-200 dark:border-blue-500/20 p-8 sm:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl shadow-xl">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Story</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Engineered for developers who build full-stack with true code ownership.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Founded by Shahzaib Zaman, a dedicated self-taught software engineer and Saylani Mass IT graduate, Webcarft was built to make full-stack web application development fast, accessible, and developer-first—generating clean React, Express, MongoDB, and Supabase code you own 100%.
              </p>
              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  <span>Read our story &amp; meet founder Shahzaib Zaman</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-xl shadow-purple-950/30">
                <img
                  src="/assets/owner.png"
                  alt="Shahzaib Zaman"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Shahzaib Zaman
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Founder &amp; Lead Architect
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final Signup CTA */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-8 sm:p-14 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Your next full-stack app is one prompt away.
              </h2>
              <p className="text-sm sm:text-base text-white/90">
                Generate complete React 19 frontends, Node.js/Express backends, MongoDB or Supabase schemas, and deploy to your own Netlify account with complete code ownership.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-3.5 rounded-full font-bold text-sm bg-white text-slate-950 hover:bg-slate-100 shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Start Building for Free
                </Link>
                <Link
                  to="/pricing"
                  className="px-7 py-3.5 rounded-full font-semibold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all duration-200"
                >
                  View $0 Free Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
        onOpenSignUp={() => {
          setSelectedFeature(null);
          window.location.href = '/signup';
        }}
      />
    </div>
  );
};
