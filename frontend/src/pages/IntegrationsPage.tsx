import React from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { useConnectedServices } from '../context/ConnectedServicesContext.tsx';
import { ServiceId } from '../types/services.ts';

export const IntegrationsPage: React.FC = () => {
  const { services, setActiveConnectModal, disconnectService } = useConnectedServices();

  const categories = [
    {
      id: 'database',
      title: 'Database Providers',
      description: 'Persistent cloud databases and relational tables for application data storage.',
      icon: Database,
      badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      serviceIds: ['mongodb', 'supabase'] as ServiceId[],
    },
    {
      id: 'hosting',
      title: 'Deployment & Edge Hosting',
      description: 'Continuous automated builds, global edge CDN delivery, and custom domain routing.',
      icon: Cloud,
      badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      serviceIds: ['vercel', 'netlify'] as ServiceId[],
    },
  ];

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-900 dark:text-white transition-colors">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
          <Zap className="w-3.5 h-3.5 text-purple-500" />
          <span>CONNECTED CLOUD INFRASTRUCTURE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Integrations &amp; Cloud Services
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Connect your own accounts to empower AI-generated full-stack applications. You retain 100% control over database credentials, file encryption, quotas, and deployment pipelines.
        </p>
      </div>

      {/* Categories Loop */}
      <div className="space-y-10">
        {categories.map((category) => (
          <div key={category.id} className="space-y-5">
            {/* Category Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
              <div className={`p-2 rounded-xl border ${category.badgeColor}`}>
                <category.icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{category.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{category.description}</p>
              </div>
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.serviceIds.map((serviceId) => {
                const s = services[serviceId];
                if (!s) return null;
                const isConnected = s.status === 'connected';

                return (
                  <div
                    key={s.id}
                    className="rounded-3xl bg-white dark:bg-[#070c24] border border-slate-200 dark:border-blue-900/40 p-6 shadow-sm flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500/50 transition-all"
                  >
                    <div className="space-y-4">
                      {/* Top Row: Service Name & Status Badge */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{s.name}</span>
                            <a
                              href={s.docsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-blue-500 transition-colors"
                              title="Official Documentation"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </h3>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Auth Type: <span className="font-semibold uppercase">{s.authType}</span>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                            isConnected
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                          }`}
                        >
                          {isConnected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {s.tagline}
                      </p>

                      {/* Setup Instructions Box */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#030619] border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <div className="font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
                          <Info className="w-3.5 h-3.5 text-blue-500" />
                          <span>Setup Guide</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          {s.id === 'mongodb' && 'Obtain connection URI from MongoDB Atlas Database > Connect > Drivers. Credentials are verified, encrypted, and never returned to the browser.'}
                          {s.id === 'supabase' && 'Generate API credentials under Project Settings > API in your Supabase dashboard.'}
                          {s.id === 'vercel' && 'Create a Personal Access Token with scope under Vercel Account Settings > Tokens.'}
                          {s.id === 'netlify' && 'Generate a Personal Access Token from Netlify User Settings > Applications.'}
                        </p>
                      </div>

                      {/* Connected Account Details */}
                      {isConnected && s.accountDetails && (
                        <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs font-mono space-y-1 text-slate-700 dark:text-slate-200">
                          {s.accountDetails.clusterName && <div>Cluster: {s.accountDetails.clusterName}</div>}
                          {s.accountDetails.projectRef && <div>Project Ref: {s.accountDetails.projectRef}</div>}
                          {s.accountDetails.megaEmail && <div>Account: {s.accountDetails.megaEmail}</div>}
                          {s.accountDetails.username && <div>User: {s.accountDetails.username}</div>}
                          {s.accountDetails.accountName && <div>Account: {s.accountDetails.accountName}</div>}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 flex items-center gap-3">
                      {isConnected ? (
                        <button
                          type="button"
                          onClick={() => {
                            void disconnectService(s.id).catch(() => undefined);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        >
                          Disconnect Service
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveConnectModal(s.id)}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Connect Account</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
