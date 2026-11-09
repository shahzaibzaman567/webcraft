import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Database,
  Cloud,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Key,
  Layers,
  ArrowRight,
  Sparkles,
  CreditCard,
  User,
  Camera,
  Upload,
  Check,
  Building,
} from 'lucide-react';
import { useConnectedServices } from '../context/ConnectedServicesContext.tsx';
import { getCurrentUser, updateLocalUser } from '../lib/auth';
import { getMe, updateMe } from '../lib/userApi';
import { ServiceId } from '../types/services.ts';

export const SettingsPage: React.FC = () => {
  const { services, setActiveConnectModal, disconnectService } = useConnectedServices();
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'billing' | 'env'>('profile');
  const initialUser = getCurrentUser();

  // User Profile States
  const [fullName, setFullName] = useState(initialUser?.name || '');
  const [email, setEmail] = useState(initialUser?.email || '');
  const [username, setUsername] = useState(initialUser?.username || '');
  const [workspaceName, setWorkspaceName] = useState(initialUser?.workspaceName || '');
  const [avatar, setAvatar] = useState(
    initialUser?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(initialUser?.name || 'Webcraft User')}&background=2563eb&color=ffffff&size=250`,
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const connectedCount = Object.values(services).filter((service) => service.status === 'connected').length;

  useEffect(() => {
    let active = true;
    getMe()
      .then((account) => {
        if (!active) return;
        setFullName(account.name);
        setEmail(account.email);
        setUsername(account.username);
        setWorkspaceName(account.workspaceName);
        setAvatar(
          account.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name || 'Webcraft User')}&background=2563eb&color=ffffff&size=250`,
        );
      })
      .catch(() => {
        if (!active) return;
        setProfileError('Could not load your account details.');
      });
    return () => {
      active = false;
    };
  }, []);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    try {
      const account = await updateMe({
        name: fullName.trim(),
        username: username.trim() || undefined,
        workspaceName: workspaceName.trim() || undefined,
        avatar,
      });
      updateLocalUser({
        name: account.name,
        username: account.username,
        workspaceName: account.workspaceName,
        avatar: account.avatar,
      });
      setSavedSuccess(true);
      window.setTimeout(() => setSavedSuccess(false), 2500);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Could not save your profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const databaseKeys: ServiceId[] = ['mongodb', 'supabase'];
  const hostingKeys: ServiceId[] = ['netlify', 'vercel'];

  return (
    <div className="py-10 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-blue-900/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 mb-2">
          <Settings className="w-3.5 h-3.5 text-purple-500" />
          <span>ACCOUNT &amp; INFRASTRUCTURE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings &amp; Connected Services
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your external database credentials, hosting authorizations, and environment configurations.
        </p>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 dark:border-white/10 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:text-cyan-400 dark:border-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Workspace</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'services'
                ? 'border-blue-600 text-blue-600 dark:text-cyan-400 dark:border-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
          >
            <Layers className="w-4 h-4" />
            <span>Connected Services ({connectedCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'billing'
                ? 'border-blue-600 text-blue-600 dark:text-cyan-400 dark:border-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Billing &amp; BYO Quotas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('env')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${activeTab === 'env'
                ? 'border-blue-600 text-blue-600 dark:text-cyan-400 dark:border-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
          >
            <Key className="w-4 h-4" />
            <span>Environment Secrets</span>
          </button>
        </div>
      </div>

      {/* Tab 0: Profile & Workspace (Requested Feature!) */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-8">

          {/* Profile Picture & Avatar Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              <span>Profile Picture &amp; Avatar</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/30 shadow-lg"
                />
                <label className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white cursor-pointer shadow-md hover:bg-blue-500 transition-colors">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setAvatar(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Choose a preset avatar or upload your custom photo:
                </div>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  {presetAvatars.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${avatar === url ? 'border-blue-500 scale-110 shadow-md ring-2 ring-blue-500/40' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Details & Workspace Info */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-500" />
              <span>Personal &amp; Workspace Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  readOnly
                  value={email}
                  title="Email is managed by Clerk"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-[#07090e] text-slate-500 dark:text-slate-400 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Username / Handle</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Plan Badge info */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Plan: Live Webcraft Workspace</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">Account, projects, and AI usage are stored in your live workspace.</div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500 text-black">
                Active
              </span>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between gap-4 pt-2">
              {profileError ? (
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{profileError}</span>
                </div>
              ) : savedSuccess ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile settings saved successfully!</span>
                </div>
              ) : <div />}

              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 1: Connected Services */}
      {activeTab === 'services' && (
        <div className="space-y-10">
          {/* Databases Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-500" />
                  <span>Database Providers</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Connect your MongoDB Atlas cluster or Supabase PostgreSQL instance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {databaseKeys.map((key) => {
                const s = services[key];
                const isConnected = s.status === 'connected';

                return (
                  <div
                    key={s.id}
                    className="rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-900/40 p-6 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                              {s.name}
                            </h3>
                            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                              Database Engine
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${isConnected
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50'
                              : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
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

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {s.tagline}
                      </p>

                      {/* Details Card if Connected */}
                      {isConnected && s.accountDetails && (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/40 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                          {s.id === 'mongodb' && (
                            <>
                              <div><span className="text-slate-400">Cluster:</span> {s.accountDetails.clusterName}</div>
                              <div><span className="text-slate-400">Target DB:</span> {s.accountDetails.databaseName}</div>
                              <div className="truncate"><span className="text-slate-400">URI:</span> {s.accountDetails.maskedUri}</div>
                            </>
                          )}
                          {s.id === 'supabase' && (
                            <>
                              <div className="truncate"><span className="text-slate-400">URL:</span> {s.accountDetails.projectUrl}</div>
                              <div><span className="text-slate-400">Ref:</span> {s.accountDetails.projectRef}</div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveConnectModal(s.id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${isConnected
                            ? 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-800 dark:text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                          }`}
                      >
                        {isConnected ? 'Edit Credentials' : `Connect ${s.name}`}
                      </button>

                      {isConnected && (
                        <button
                          type="button"
                          onClick={() => { void disconnectService(s.id).catch(() => undefined); }}
                          className="py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
                        >
                          Disconnect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hosting & Deployment Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-500" />
                  <span>Deployment &amp; Hosting</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Securely link your Netlify or Vercel accounts for deployment workflows.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hostingKeys.map((key) => {
                const s = services[key];
                const isConnected = s.status === 'connected';

                return (
                  <div
                    key={s.id}
                    className="rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-900/40 p-6 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                            <Cloud className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                              {s.name}
                            </h3>
                            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-cyan-400">
                              Hosting Platform
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${isConnected
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50'
                              : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
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

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {s.tagline}
                      </p>

                      {/* Details Card if Connected */}
                      {isConnected && s.accountDetails && (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/40 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                          {s.id === 'vercel' && (
                            <div><span className="text-slate-400">Team / User:</span> {s.accountDetails.username}</div>
                          )}
                          {s.id === 'netlify' && (
                            <div><span className="text-slate-400">Account:</span> {s.accountDetails.accountName}</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveConnectModal(s.id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${isConnected
                            ? 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-800 dark:text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                          }`}
                      >
                        {isConnected ? 'Edit Authorization' : `Connect ${s.name}`}
                      </button>

                      {isConnected && (
                        <button
                          type="button"
                          onClick={() => { void disconnectService(s.id).catch(() => undefined); }}
                          className="py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
                        >
                          Disconnect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Billing & Quotas */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-900/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Webcarft Studio Plan ($0 – Forever)
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Active Free Developer Plan
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Webcarft is completely free for project generation, full-stack code synthesis, inspector previews, and clean ZIP source export. You own 100% of the code without recurring subscription fees or platform markups.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/40 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Third-Party Cloud Quotas &amp; Direct Provider Billing</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You are in full control of your infrastructure budget. Any usage limits, egress costs, or tier upgrades are managed directly within your respective provider accounts:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href="https://cloud.mongodb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs hover:border-blue-500 transition-colors"
              >
                <span>MongoDB Cloud Console &amp; Invoices</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="https://supabase.com/dashboard/account/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs hover:border-blue-500 transition-colors"
              >
                <span>Supabase Billing &amp; Usage Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="https://vercel.com/dashboard/usage"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs hover:border-blue-500 transition-colors"
              >
                <span>Vercel Edge Bandwidth &amp; Execution</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="https://app.netlify.com/teams"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs hover:border-blue-500 transition-colors"
              >
                <span>Netlify Build Minutes &amp; Team Limits</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Environment Secrets */}
      {activeTab === 'env' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-900/40 space-y-4 text-left">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Environment Variables &amp; Git Push Protection
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            When you export or push full-stack projects to GitHub or Netlify, Webcarft automatically sets up a secure template:
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 font-mono text-xs text-blue-300 space-y-1.5 border border-slate-800">
            <div># .env.example (Safe for version control)</div>
            <div>PORT=3000</div>
            <div>MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/production</div>
            <div>SUPABASE_URL=https://&lt;project-id&gt;.supabase.co</div>
            <div>SUPABASE_ANON_KEY=&lt;your-anon-key&gt;</div>
            <div>CLERK_PUBLISHABLE_KEY=pk_test_...</div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real secret keys are injected directly into your Netlify / Vercel dashboard and never committed into public repository commits.
          </p>
        </div>
      )}
    </div>
  );
};
