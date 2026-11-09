import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Database,
  Cloud,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Key,
  Server,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  LogIn,
} from 'lucide-react';
import { useConnectedServices } from '../context/ConnectedServicesContext.tsx';
import { isAuthenticated } from '../lib/auth';
import { ServiceId } from '../types/services.ts';

export const ConnectServiceModal: React.FC = () => {
  const { services, activeConnectModal, setActiveConnectModal, connectService, disconnectService } =
    useConnectedServices();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Form states
  // MongoDB
  const [mongoUri, setMongoUri] = useState('');
  const [mongoCluster, setMongoCluster] = useState('Cluster0');
  const [mongoDbName, setMongoDbName] = useState('production');
  const [mongoRegion, setMongoRegion] = useState('aws-us-east-1');

  // Supabase
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [supabaseOrg, setSupabaseOrg] = useState('');

  // MEGA File Storage
  const [megaEmail, setMegaEmail] = useState('');
  const [megaApiKey, setMegaApiKey] = useState('');
  const [megaFolder, setMegaFolder] = useState('webcraft-uploads');

  // Vercel
  const [vercelToken, setVercelToken] = useState('');
  const [vercelTeam, setVercelTeam] = useState('');

  // Netlify
  const [netlifyToken, setNetlifyToken] = useState('');
  const [netlifyAccount, setNetlifyAccount] = useState('');

  if (!activeConnectModal) return null;

  const currentService = services[activeConnectModal];
  const isConnected = currentService.status === 'connected';

  const handleClose = () => {
    setError(null);
    setActiveConnectModal(null);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError('Sign in and create your profile before connecting a real provider account.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      if (activeConnectModal === 'mongodb') {
        if (!mongoUri.trim()) {
          throw new Error('Please provide your MongoDB Atlas Connection URI.');
        }
        if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
          throw new Error('Invalid connection URI. It must begin with mongodb:// or mongodb+srv://');
        }
        await connectService('mongodb', {
          uri: mongoUri.trim(),
          clusterName: mongoCluster.trim() || undefined,
          databaseName: mongoDbName.trim() || undefined,
          region: mongoRegion.trim() || undefined,
        });
      } else if (activeConnectModal === 'supabase') {
        if (!supabaseUrl.trim() || !supabaseKey.trim()) {
          throw new Error('Please provide both your Supabase Project URL and API Key.');
        }
        await connectService('supabase', {
          projectUrl: supabaseUrl.trim(),
          apiKey: supabaseKey.trim(),
          organization: supabaseOrg.trim() || undefined,
        });
      } else if (activeConnectModal === 'vercel') {
        if (!vercelToken.trim()) {
          throw new Error('Please enter your Vercel Personal Access Token.');
        }
        await connectService('vercel', {
          token: vercelToken.trim(),
          teamSlug: vercelTeam.trim() || undefined,
        });
      } else if (activeConnectModal === 'netlify') {
        if (!netlifyToken.trim()) {
          throw new Error('Please enter your Netlify Personal Access Token.');
        }
        await connectService('netlify', {
          token: netlifyToken.trim(),
          accountName: netlifyAccount.trim() || undefined,
        });
      } else if (activeConnectModal === 'mega') {
        throw new Error('MEGA integration is not available yet.');
      }

      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!activeConnectModal) return;
    if (!isLoggedIn) {
      setError('Sign in to manage this connection.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await disconnectService(activeConnectModal);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not disconnect this service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#070c24] border border-slate-200 dark:border-blue-500/30 shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-900 dark:text-white">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100 dark:border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                currentService.category === 'database'
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
              }`}
            >
              {currentService.category === 'database' ? (
                <Database className="w-6 h-6" />
              ) : (
                <Cloud className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{currentService.name}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                  {currentService.category === 'database' ? 'Database Provider' : 'Hosting & Edge'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentService.tagline}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Important Transparency Notice */}
        <div className="my-5 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
          <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-cyan-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-blue-950 dark:text-cyan-300">
              Bring Your Own Infrastructure (BYO) Notice:
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              {currentService.quotaNotice}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        {!isLoggedIn ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Sign in required
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Provider credentials stay disabled until you sign in and your Webcraft profile is created.
                This prevents real connection details from being entered by anonymous visitors.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-1">
              <Link
                to="/login?redirect=/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
              >
                Create account
              </Link>
            </div>
          </div>
        ) : isConnected ? (
          <div className="space-y-6 py-2">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Account Connected &amp; Verified</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Connected: {currentService.connectedAt ? new Date(currentService.connectedAt).toLocaleDateString() : 'Active'}
                </span>
              </div>

              {/* Show Connected Details */}
              <div className="pt-2 text-xs text-slate-700 dark:text-slate-300 space-y-1 font-mono">
                {activeConnectModal === 'mongodb' && (
                  <>
                    <div><span className="text-slate-400">Cluster:</span> {currentService.accountDetails?.clusterName}</div>
                    <div><span className="text-slate-400">Database:</span> {currentService.accountDetails?.databaseName}</div>
                    <div><span className="text-slate-400">Region:</span> {currentService.accountDetails?.region}</div>
                    <div className="truncate"><span className="text-slate-400">URI:</span> {currentService.accountDetails?.maskedUri}</div>
                  </>
                )}
                {activeConnectModal === 'supabase' && (
                  <>
                    <div className="truncate"><span className="text-slate-400">Project URL:</span> {currentService.accountDetails?.projectUrl}</div>
                    <div><span className="text-slate-400">Project Ref:</span> {currentService.accountDetails?.projectRef}</div>
                    <div><span className="text-slate-400">Workspace:</span> {currentService.accountDetails?.organization}</div>
                  </>
                )}
                {activeConnectModal === 'vercel' && (
                  <>
                    <div><span className="text-slate-400">Team / User:</span> {currentService.accountDetails?.username}</div>
                    <div><span className="text-slate-400">Scope:</span> Full Deployments Access</div>
                  </>
                )}
                {activeConnectModal === 'netlify' && (
                  <>
                    <div><span className="text-slate-400">Netlify Account:</span> {currentService.accountDetails?.accountName}</div>
                    <div><span className="text-slate-400">Default Site:</span> {currentService.accountDetails?.defaultSite}</div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <a
                href={currentService.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View {currentService.name} Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer"
              >
                Disconnect Account
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConnect} className="space-y-4">
            {activeConnectModal === 'mongodb' && (
              <>
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>MongoDB Connection URI</span>
                    <a
                      href="https://www.mongodb.com/docs/atlas/connect-to-database-deployment/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <span>Where to find this?</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={mongoUri}
                      onChange={(e) => setMongoUri(e.target.value)}
                      placeholder="mongodb+srv://user:password@cluster0.mongodb.net/dbname"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Your password will be masked. Webcarft connects via Mongoose connection pooling for local generation.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Cluster Name
                    </label>
                    <input
                      type="text"
                      value={mongoCluster}
                      onChange={(e) => setMongoCluster(e.target.value)}
                      placeholder="Cluster0"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Target Database
                    </label>
                    <input
                      type="text"
                      value={mongoDbName}
                      onChange={(e) => setMongoDbName(e.target.value)}
                      placeholder="production"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {activeConnectModal === 'supabase' && (
              <>
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Supabase Project URL</span>
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <span>Supabase Dashboard</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzabcdefghijklm.supabase.co"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Supabase Anon / Public API Key
                  </label>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Organization / Workspace Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={supabaseOrg}
                    onChange={(e) => setSupabaseOrg(e.target.value)}
                    placeholder="Acme Corp Production"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {activeConnectModal === 'vercel' && (
              <>
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Vercel Personal Access Token</span>
                    <a
                      href="https://vercel.com/account/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <span>Create Token in Vercel</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <input
                    type="password"
                    value={vercelToken}
                    onChange={(e) => setVercelToken(e.target.value)}
                    placeholder="vca_tok_********************************"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    Enables 1-click publishing directly into your Vercel projects and custom domains.
                  </p>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Vercel Team Slug / Username (Optional)
                  </label>
                  <input
                    type="text"
                    value={vercelTeam}
                    onChange={(e) => setVercelTeam(e.target.value)}
                    placeholder="my-team-slug"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {activeConnectModal === 'mega' && (
              <>
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>MEGA Account Email</span>
                    <a
                      href="https://mega.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-red-500 hover:underline flex items-center gap-1"
                    >
                      <span>MEGA Cloud</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <input
                    type="email"
                    value={megaEmail}
                    onChange={(e) => setMegaEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    MEGA API Key / Master Key
                  </label>
                  <input
                    type="password"
                    value={megaApiKey}
                    onChange={(e) => setMegaApiKey(e.target.value)}
                    placeholder="mg_key_********************************"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    Provides zero-knowledge encrypted cloud storage for your user-generated media and uploads.
                  </p>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Cloud Folder
                  </label>
                  <input
                    type="text"
                    value={megaFolder}
                    onChange={(e) => setMegaFolder(e.target.value)}
                    placeholder="webcraft-uploads"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </>
            )}

            {activeConnectModal === 'netlify' && (
              <>
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Netlify Personal Access Token</span>
                    <a
                      href="https://app.netlify.com/user/applications#personal-access-tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Get Netlify Token</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <input
                    type="password"
                    value={netlifyToken}
                    onChange={(e) => setNetlifyToken(e.target.value)}
                    placeholder="nfp_********************************"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    Used to provision and deploy serverless sites into your personal or team Netlify dashboard.
                  </p>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Netlify Account / Team Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={netlifyAccount}
                    onChange={(e) => setNetlifyAccount(e.target.value)}
                    placeholder="Main Organization"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Verify &amp; Connect {currentService.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
