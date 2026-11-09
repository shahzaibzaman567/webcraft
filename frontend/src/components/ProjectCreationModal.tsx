import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  Database,
  Cloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Layers,
  FileCode2,
  Plus
} from 'lucide-react';
import { useConnectedServices } from '../context/ConnectedServicesContext.tsx';
import { ServiceId } from '../types/services.ts';

export const ProjectCreationModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isProjectModalOpen,
    setIsProjectModalOpen,
    services,
    setActiveConnectModal,
  } = useConnectedServices();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [selectedDb, setSelectedDb] = useState<ServiceId | 'none'>('supabase');
  const [selectedHosting, setSelectedHosting] = useState<ServiceId | 'zip_only'>('netlify');

  if (!isProjectModalOpen) return null;

  const handleClose = () => {
    setIsProjectModalOpen(false);
    setStep(1);
  };

  const handleCreate = () => {
    const appName = projectName.trim() || 'Untitled Full-Stack App';
    const baseDescription =
      projectDesc.trim() || 'Generated with Webcraft Full-Stack AI Builder';
    const architecture = [
      selectedDb !== 'none' ? `Preferred database: ${selectedDb}.` : '',
      selectedHosting !== 'zip_only' ? `Deployment target: ${selectedHosting}.` : '',
    ].filter(Boolean);
    const description = architecture.length
      ? `${baseDescription}\n\n${architecture.join(' ')}`
      : baseDescription;

    handleClose();
    navigate(
      `/builder?name=${encodeURIComponent(appName)}&prompt=${encodeURIComponent(description)}`,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#070c24] border border-slate-200 dark:border-blue-500/30 shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-900 dark:text-white">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">New Full-Stack AI Project</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Step {step} of 4:</span>
                <span className="font-medium text-blue-600 dark:text-cyan-400">
                  {step === 1 && 'Project Specification'}
                  {step === 2 && 'Connect Database'}
                  {step === 3 && 'Connect Hosting & Deployment'}
                  {step === 4 && 'Architecture Review'}
                </span>
              </div>
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

        {/* Progress Stepper Bar */}
        <div className="grid grid-cols-4 gap-2 my-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Project Details */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Application Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Apex Dashboard & CRM"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Application Purpose &amp; Domain
              </label>
              <textarea
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                rows={3}
                placeholder="e.g., A subscription billing SaaS with team management, client onboarding, and automated email reports."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-left space-y-1">
              <span className="text-[11px] font-bold text-blue-700 dark:text-cyan-300 uppercase tracking-wider">
                Full-Stack Architecture Standard
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Webcarft synthesizes a modular React 19 + Tailwind CSS frontend with a Node.js/Express.js RESTful API layer. You can connect your database and hosting accounts in the next steps.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Database Connection */}
        {step === 2 && (
          <div className="space-y-4 py-2 text-left">
            <div>
              <h4 className="text-sm font-bold">Select Database Architecture</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose the database provider for schemas and query models. You connect your own account.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Supabase Option */}
              <div
                onClick={() => setSelectedDb('supabase')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedDb === 'supabase'
                    ? 'bg-blue-50/80 dark:bg-[#0c1645] border-blue-500 dark:border-cyan-400 ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-[#060c23] border-slate-200 dark:border-blue-900/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-sm">Supabase</span>
                  </div>
                  {services.supabase.status === 'connected' ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                      Not Linked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  PostgreSQL database with built-in Auth, Row Level Security, and real-time streams.
                </p>

                {services.supabase.status !== 'connected' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveConnectModal('supabase');
                    }}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-blue-600 dark:text-cyan-400 bg-blue-100/60 dark:bg-blue-950/60 hover:bg-blue-200/60 transition-colors"
                  >
                    Connect Supabase Account
                  </button>
                )}
              </div>

              {/* MongoDB Atlas Option */}
              <div
                onClick={() => setSelectedDb('mongodb')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedDb === 'mongodb'
                    ? 'bg-blue-50/80 dark:bg-[#0c1645] border-blue-500 dark:border-cyan-400 ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-[#060c23] border-slate-200 dark:border-blue-900/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm">MongoDB Atlas</span>
                  </div>
                  {services.mongodb.status === 'connected' ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                      Not Linked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  Document database with flexible JSON collections and Mongoose ODM models.
                </p>

                {services.mongodb.status !== 'connected' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveConnectModal('mongodb');
                    }}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-blue-600 dark:text-cyan-400 bg-blue-100/60 dark:bg-blue-950/60 hover:bg-blue-200/60 transition-colors"
                  >
                    Connect MongoDB Atlas
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDb('none')}
              className={`text-xs p-2.5 rounded-xl border w-full text-center cursor-pointer transition-colors ${
                selectedDb === 'none'
                  ? 'border-purple-500 font-bold text-purple-600 dark:text-purple-300 bg-purple-500/10'
                  : 'border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Skip for now (I will configure the database manually later)
            </button>
          </div>
        )}

        {/* Step 3: Deployment & Hosting Connection */}
        {step === 3 && (
          <div className="space-y-4 py-2 text-left">
            <div>
              <h4 className="text-sm font-bold">Select Deployment Platform</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deploy directly to your own hosting account or export as a clean ZIP package.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Netlify Option */}
              <div
                onClick={() => setSelectedHosting('netlify')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedHosting === 'netlify'
                    ? 'bg-blue-50/80 dark:bg-[#0c1645] border-blue-500 dark:border-cyan-400 ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-[#060c23] border-slate-200 dark:border-blue-900/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-sm">Netlify</span>
                  </div>
                  {services.netlify.status === 'connected' ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                      Not Linked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  Automatic Git builds, serverless edge functions, and free custom domain SSL.
                </p>

                {services.netlify.status !== 'connected' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveConnectModal('netlify');
                    }}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-blue-600 dark:text-cyan-400 bg-blue-100/60 dark:bg-blue-950/60 hover:bg-blue-200/60 transition-colors"
                  >
                    Connect Netlify Account
                  </button>
                )}
              </div>

              {/* Vercel Option */}
              <div
                onClick={() => setSelectedHosting('vercel')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedHosting === 'vercel'
                    ? 'bg-blue-50/80 dark:bg-[#0c1645] border-blue-500 dark:border-cyan-400 ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-[#060c23] border-slate-200 dark:border-blue-900/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-sm">Vercel</span>
                  </div>
                  {services.vercel.status === 'connected' ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                      Not Linked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  Global edge network deployment optimized for React, Next.js, and serverless APIs.
                </p>

                {services.vercel.status !== 'connected' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveConnectModal('vercel');
                    }}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-blue-600 dark:text-cyan-400 bg-blue-100/60 dark:bg-blue-950/60 hover:bg-blue-200/60 transition-colors"
                  >
                    Connect Vercel Account
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedHosting('zip_only')}
              className={`text-xs p-2.5 rounded-xl border w-full text-center cursor-pointer transition-colors ${
                selectedHosting === 'zip_only'
                  ? 'border-purple-500 font-bold text-purple-600 dark:text-purple-300 bg-purple-500/10'
                  : 'border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Export ZIP only (Deploy manually later)
            </button>
          </div>
        )}

        {/* Step 4: Architecture Review */}
        {step === 4 && (
          <div className="space-y-4 py-2 text-left">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0c143d] border border-slate-200 dark:border-blue-900/50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {projectName || 'Untitled Project'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 font-semibold">
                  Full-Stack Architecture
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">Frontend:</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">React 19 + Tailwind CSS</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Backend API:</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">Node.js + Express.js</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Database Provider:</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                    {selectedDb === 'none' ? 'Manual configuration' : selectedDb}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Hosting &amp; Edge:</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                    {selectedHosting === 'zip_only' ? 'Direct ZIP Download' : selectedHosting}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-300">
              <strong>100% Code Ownership:</strong> Your project files and configurations belong entirely to you with zero vendor lock-in.
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreate}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Building</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
