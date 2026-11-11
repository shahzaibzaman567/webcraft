import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Cloud,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Link2,
  Lock,
  LogIn,
} from 'lucide-react';
import { useConnectedServices } from '../context/ConnectedServicesContext.tsx';
import { isAuthenticated } from '../lib/auth';
import { ServiceId } from '../types/services.ts';

export const ConnectServicesSection: React.FC = () => {
  const { services, setActiveConnectModal } = useConnectedServices();
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(isAuthenticated());
    syncAuth();
    window.addEventListener('webcraft-auth-change', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('webcraft-auth-change', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const serviceList: ServiceId[] = ['mongodb', 'supabase', 'vercel', 'netlify'];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="connect-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800/40">
            <Link2 className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span>BRING YOUR OWN INFRASTRUCTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Connect Your Databases &amp; Hosting
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Webcarft synthesizes your full-stack application code and securely verifies your connected accounts. You retain full control over your data, quotas, and cloud budgets.
          </p>
        </div>

        {/* 4 Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceList.map((serviceKey) => {
            const s = services[serviceKey];
            const isConnected = s.status === 'connected';

            return (
              <div
                key={s.id}
                className="rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200/90 dark:border-blue-500/25 p-6 shadow-xl flex flex-col justify-between hover:border-blue-400 dark:hover:border-cyan-400/60 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                        s.category === 'database'
                          ? 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                          : s.category === 'storage'
                          ? 'bg-gradient-to-tr from-red-600 to-rose-600'
                          : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                      }`}
                    >
                      {s.category === 'database' ? (
                        <Database className="w-6 h-6" />
                      ) : s.category === 'storage' ? (
                        <HardDrive className="w-6 h-6" />
                      ) : (
                        <Cloud className="w-6 h-6" />
                      )}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isConnected
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <span>Disconnected</span>
                      )}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {s.name}
                    </h3>
                    <div className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mt-0.5">
                      {s.category === 'database'
                        ? 'Database Provider'
                        : s.category === 'storage'
                        ? 'Encrypted File Storage'
                        : 'Edge Hosting Platform'}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.tagline}
                  </p>

                  {/* Account Summary if Connected */}
                  {isConnected && s.accountDetails && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/40 text-[11px] text-slate-700 dark:text-slate-300 font-mono space-y-0.5">
                      {s.id === 'mongodb' && (
                        <div className="truncate">Cluster: {s.accountDetails.clusterName}</div>
                      )}
                      {s.id === 'supabase' && (
                        <div className="truncate">Ref: {s.accountDetails.projectRef}</div>
                      )}
                      {s.id === 'mega' && (
                        <div className="truncate">Account: {s.accountDetails.megaEmail}</div>
                      )}
                      {s.id === 'vercel' && (
                        <div className="truncate">Team: {s.accountDetails.username}</div>
                      )}
                      {s.id === 'netlify' && (
                        <div className="truncate">Account: {s.accountDetails.accountName}</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveConnectModal(s.id)}
                    disabled={!isLoggedIn}
                    title={
                      isLoggedIn
                        ? undefined
                        : 'Sign in and create your profile before connecting a real provider account.'
                    }
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-55'
                    } ${
                      isConnected
                        ? 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/15'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    }`}
                  >
                    {isLoggedIn ? (
                      <>
                        <span>{isConnected ? 'Manage Connection' : `Connect ${s.name}`}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Create account to connect</span>
                      </>
                    )}
                  </button>

                  {!isLoggedIn && (
                    <div className="text-center">
                      <Link
                        to="/signup"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>Create account</span>
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
                    <a
                      href={s.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 text-blue-500 dark:text-cyan-400"
                    >
                      <span>Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={s.pricingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      View Pricing
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparent BYO Infrastructure Callout Box */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-indigo-900/10 border border-slate-200 dark:border-blue-500/25 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500 dark:text-cyan-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Developer Autonomy &amp; Transparent Billing
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Webcarft never marks up hosting or database fees. You manage your free or paid tiers directly with MongoDB, Supabase, Vercel, and Netlify. You retain 100% intellectual property and code sovereignty.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <a
                href="/pricing"
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white transition-colors"
              >
                Review $0 Free Plan
              </a>
              <a
                href="/docs"
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors"
              >
                Integration Guides
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
