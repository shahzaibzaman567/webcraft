import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Users,
  Cpu,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Send,
  Sparkles,
  Rocket,
  Palette,
} from 'lucide-react';

export const EnterprisePage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    workEmail: '',
    company: '',
    teamSize: '10-50',
    useCase: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const enterpriseFeatures = [
    {
      title: 'Custom Brand Kits & Design Tokens',
      description: 'Enforce brand consistency across all digital products. Webcarft tailors color schemes, typography, and visual assets to match your corporate design guidelines.',
      icon: Palette,
    },
    {
      title: 'Full-Stack Architecture: React & Express',
      description: 'Export complete codebases with React 19 frontend views, Node.js/Express REST APIs, and MongoDB or Supabase schemas ready for internal CI/CD.',
      icon: Cpu,
    },
    {
      title: '100% Code Sovereignty & IP Rights',
      description: 'Your team owns every line of generated code. Full commercial ownership with no recurrent royalties, licensing fees, or proprietary platform lock-in.',
      icon: ShieldCheck,
    },
    {
      title: 'Rapid Prototyping & Production Scaffolding',
      description: 'Empower product, engineering, and innovation teams to prototype and launch production-grade full-stack apps without technical bottlenecks.',
      icon: Users,
    },
    {
      title: 'Deploy to Your Own Netlify & Cloud',
      description: 'Connect your company’s own Netlify, Vercel, or cloud infrastructure. You maintain full oversight over your hosting accounts, databases, and usage limits.',
      icon: Rocket,
    },
    {
      title: 'Direct Founder & Engineering Support',
      description: 'Receive priority guidance and direct architectural assistance from founder Shahzaib Zaman and the Webcarft core team.',
      icon: Headphones,
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-20">
      {/* 1. Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/40">
          <Building2 className="w-3.5 h-3.5 text-cyan-500" />
          <span>WEBCARFT FOR TEAMS &amp; ENTERPRISE</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Supercharge development with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400">
            AI-powered full-stack applications
          </span>
          .
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Scale your engineering output without expanding technical debt. Generate, iterate, and deploy complete applications—complete with React 19 frontends, Node.js/Express APIs, MongoDB or Supabase schemas, and deployments directly into your own Netlify accounts.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#inquiry"
            className="px-7 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
          >
            Connect with Team
          </a>
          <Link
            to="/security"
            className="px-6 py-3.5 rounded-full font-semibold text-sm bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/15 transition-all"
          >
            Review Security &amp; Ownership
          </Link>
        </div>
      </section>

      {/* 2. Enterprise Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enterpriseFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 p-8 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Feature</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Inquiry Form */}
      <section id="inquiry" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/25 p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Get in Touch with Our Team
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Discuss custom design requirements, brand token integration, or team workflows directly with our team.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Thank You for Your Inquiry
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                We have received your request. Founder Shahzaib Zaman and the Webcarft team will contact you at <strong>{formData.workEmail}</strong> shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Company or Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Team Size
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1-5">1-5 members</option>
                    <option value="5-20">5-20 members</option>
                    <option value="20-50">20-50 members</option>
                    <option value="50+">50+ members</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  How can Webcarft help your team?
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  placeholder="Describe your landing page requirements, design goals, or custom needs..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send Team Inquiry</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
