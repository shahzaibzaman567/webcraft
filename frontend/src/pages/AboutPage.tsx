import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Code2,
  Rocket,
  Mail,
  GraduationCap,
  Award,
  ArrowRight,
  Palette,
  Github,
  Linkedin,
  Instagram,
  ExternalLink,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 space-y-20">
      {/* 1. Hero / Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800/40">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ABOUT WEBCARFT</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Democratizing web creation with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            pure code sovereignty
          </span>
          .
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Webcarft is a developer-first AI full-stack website and application builder engineered to eliminate the friction between an idea and a production-ready product. We turn conversational prompts into complete applications built with React 19, Node.js/Express, MongoDB Atlas, and Supabase—giving developers 100% code sovereignty with their own infrastructure.
        </p>
      </section>

      {/* 2. Mission & Values Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Zero Vendor Lock-in
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We never trap your work in closed formats or proprietary platforms. Every Webcarft project outputs standard, open-source React 19, Express, and database models that you can run locally, customize freely, or host anywhere.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Full-Stack Architecture &amp; DBs
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every generated project includes frontend views, backend REST routes, and schemas for MongoDB Atlas or Supabase. You maintain full ownership and connect your own database instances.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              BYO Netlify &amp; Vercel Hosting
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Deploy through your own personal or team hosting accounts. You control your bandwidth, custom domains, and compute limits with full peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Meet Founder Shahzaib Zaman Section (Uploaded photo used exclusively here) */}
      <section id="founder" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/25 p-8 sm:p-12 shadow-2xl space-y-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Founder Photograph with Gradient Ring */}
            <div className="relative shrink-0">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-white dark:border-[#040819] shadow-2xl shadow-purple-950/40 relative z-10">
                <img
                  src="/assets/owner.png"
                  alt="Shahzaib Zaman - Founder of Webcarft"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 blur-lg opacity-70 -z-0" />
            </div>

            {/* Founder Biography */}
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                <Award className="w-3.5 h-3.5" />
                <span>Founder &amp; Lead Architect</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Shahzaib Zaman
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Shahzaib Zaman is a dedicated self-taught developer who honed his software engineering foundation through the{' '}
                <strong className="text-slate-900 dark:text-white">Saylani Mass IT Training (SMIT)</strong> program. Passionate about modern React, Tailwind CSS, and AI-assisted design, he built Webcarft to empower creators, founders, and developers to build stunning landing pages quickly, cleanly, and completely free.
              </p>

              {/* Verified Credentials */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                  <span>Matriculation Complete</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <Award className="w-3.5 h-3.5 text-purple-500" />
                  <span>Saylani Mass IT Graduate</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <Mail className="w-3.5 h-3.5 text-pink-500" />
                  <a
                    href="mailto:shahzaibzaman.official@gmail.com"
                    className="hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    shahzaibzaman.official@gmail.com
                  </a>
                </div>
              </div>

              {/* Verified Social Connect Links for Shahzaib Zaman */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href="https://github.com/shahzaibzaman567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href="https://www.linkedin.com/in/shahzaib-zaman465/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors border border-blue-200 dark:border-blue-800/40 shadow-xs"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href="https://www.instagram.com/shahzaibzaman.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 text-xs font-semibold transition-colors border border-pink-200 dark:border-pink-800/40 shadow-xs"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Vision Quote */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-pink-900/10 border border-slate-200 dark:border-blue-500/20 text-slate-700 dark:text-slate-200 italic text-center md:text-left text-sm sm:text-base leading-relaxed">
            &ldquo;I believe web creation should not be restricted by complex coding requirements or expensive subscription walls. Anyone with a compelling vision deserves the power to design, customize, and export clean, modern landing pages with complete code ownership.&rdquo;
            <div className="not-italic font-bold text-slate-900 dark:text-white text-xs mt-3">
              — Shahzaib Zaman, Founder of Webcarft
            </div>
          </div>
        </div>
      </section>

      {/* 4. Engineering Foundation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            ENGINEERING FOUNDATION
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Built on proven open standards
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Every project outputs clean, exportable code without black-box runtimes or proprietary lock-in.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-sm">
            <div className="text-lg font-bold text-slate-900 dark:text-white">React 19</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Modular Component UI</div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-sm">
            <div className="text-lg font-bold text-slate-900 dark:text-white">Tailwind CSS</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Responsive Utility Styling</div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-sm">
            <div className="text-lg font-bold text-slate-900 dark:text-white">TypeScript</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Type Safety &amp; Clean Props</div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-sm">
            <div className="text-lg font-bold text-slate-900 dark:text-white">Vite</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fast Dev &amp; Build Pipeline</div>
          </div>
        </div>
      </section>

      {/* 5. CTA to Get Started */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white space-y-5 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to build your next landing page?</h2>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto">
            Experience fast, intuitive AI landing page generation with clean React code and zero vendor lock-in.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm bg-white text-slate-950 hover:bg-slate-100 shadow-xl transition-all"
            >
              <span>Start Building for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
