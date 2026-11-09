import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  Mail,
  ArrowRight,
  Rocket,
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const securityPillars = [
    {
      title: 'Authentication & Access Control',
      icon: Lock,
      description: 'Your account is safeguarded by secure identity management via Clerk. We support multi-factor authentication (2FA), biometric passkeys, anomaly detection, and automated session termination upon credential changes.',
      points: [
        'Multi-factor authentication (SMS, Authenticator apps, TOTP)',
        'FIDO2 and WebAuthn biometric passkey authentication',
        'Strict password hashing and rate-limited brute-force protection',
        'Automatic cross-device session termination'
      ]
    },
    {
      title: 'Data Encryption in Transit',
      icon: ShieldCheck,
      description: 'All traffic between your browser and Webcarft servers is encrypted with TLS 1.3 using modern forward-secrecy cipher suites. Your account data and project files are safeguarded at all times.',
      points: [
        'Strict HTTPS enforcement with HSTS preloaded headers',
        'TLS 1.3 cryptographic transport security with PFS',
        'Secure session token management and cookie isolation',
        'Zero exposure of user credentials across network channels'
      ]
    },
    {
      title: 'API Key & Token Protection',
      icon: KeyRound,
      description: 'We adhere to a zero-client-leak architecture. Third-party provider keys, GitHub OAuth tokens, and internal generation credentials are never exposed to browser bundles or client code.',
      points: [
        'Secure server-side proxy layer for all generative AI calls',
        'Zero exposure of sensitive tokens in browser runtime memory',
        'Ephemeral build environments destroyed immediately after ZIP export',
        'Audit logs recording all authenticated credential events'
      ]
    },
    {
      title: '100% Full-Stack Code Sovereignty & Privacy',
      icon: FileCode2,
      description: 'Your ideas and source code are yours alone. We grant you 100% intellectual property ownership over all generated React views, Express routes, and MongoDB or Supabase schemas. We never train public AI models on your private applications.',
      points: [
        'Full commercial ownership and complete code export',
        'No telemetry or tracking injected into exported full-stack ZIPs',
        'Zero vendor lock-in with standard React, Express, and Mongoose/Supabase code',
        'Transparent data practices honoring developer confidentiality'
      ]
    },
    {
      title: 'BYO Infrastructure & Netlify Deployment',
      icon: Rocket,
      description: 'You connect your own third-party accounts for databases (MongoDB Atlas, Supabase) and hosting (Netlify, Vercel). You retain full sovereignty over your database data, cloud quotas, and credentials.',
      points: [
        'Database connections remain isolated in your own cloud instances',
        'Direct deployment to your personal or organization Netlify / Vercel account',
        'Environment variables configured directly in your hosting dashboard',
        'Webcarft never acts as an unverified proxy for your database records'
      ]
    }
  ];

  return (
    <div className="py-12 sm:py-20 space-y-20">
      {/* 1. Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SECURITY &amp; TRUST</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Protecting your account.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-500">
            Guaranteed code ownership.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          At Webcarft, security and code sovereignty are top priorities. We protect your account, your data, and your creative work with modern security engineering and zero vendor lock-in.
        </p>
      </section>

      {/* 2. Security Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 p-8 shadow-xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shrink-0">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {pillar.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {pillar.description}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
                {pillar.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Vulnerability Disclosure */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10 border border-slate-200 dark:border-blue-500/20 p-8 sm:p-10 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Responsible Vulnerability Disclosure
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            If you discover a security vulnerability or bug in Webcarft, please report it immediately to our founder and security team. We take all reports seriously and will investigate promptly.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <a
              href="mailto:shahzaibzaman.official@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Security: shahzaibzaman.official@gmail.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white space-y-5 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Build with complete confidence</h2>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto">
            100% code ownership, modern encryption, and clean React code export. Free forever.
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
