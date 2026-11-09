import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Code2,
  Layers,
  FileCode2,
  Lock,
  Eye,
  Rocket,
  Palette,
  Monitor
} from 'lucide-react';

interface SpecialistAgent {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  icon: React.ElementType;
  task: string;
  status: 'completed' | 'in-progress' | 'queued';
  progress: number;
  completedSteps: { title: string; time: string; detail: string }[];
}

export const AgentWorkspaceProgress: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('frontend');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'agents' | 'code' | 'export'>('agents');
  const [codeTab, setCodeTab] = useState<'frontend' | 'backend' | 'database' | 'package'>('frontend');

  const agents: SpecialistAgent[] = [
    {
      id: 'frontend',
      name: 'Frontend UI Architect',
      role: 'React 19 & Tailwind CSS',
      avatarColor: 'from-blue-500 to-indigo-600',
      icon: Code2,
      task: 'Assemble responsive React 19 views, Tailwind CSS styles, client state, and API integration hooks',
      status: 'completed',
      progress: 100,
      completedSteps: [
        {
          title: 'Component Hierarchy & State',
          time: '0.4s',
          detail: 'Generated modular React 19 component tree with client hooks, interactive controls, and responsive views.'
        },
        {
          title: 'Tailwind CSS Layout Styling',
          time: '0.5s',
          detail: 'Configured mobile-first Tailwind utilities with fluid responsiveness and accessible contrast across themes.'
        },
        {
          title: 'Client API Service Layer',
          time: '0.3s',
          detail: 'Created typed HTTP client consuming backend endpoints with loading skeletons and error boundaries.'
        }
      ]
    },
    {
      id: 'backend',
      name: 'Backend & API Engineer',
      role: 'Node.js & Express.js',
      avatarColor: 'from-purple-600 to-pink-600',
      icon: Layers,
      task: 'Scaffold Node.js/Express server, RESTful endpoints, request validation, and CORS security headers',
      status: 'completed',
      progress: 100,
      completedSteps: [
        {
          title: 'Express REST Router Setup',
          time: '0.4s',
          detail: 'Configured modular API route handlers for resources, pagination, filtering, and JSON responses.'
        },
        {
          title: 'Middleware & Input Validation',
          time: '0.3s',
          detail: 'Implemented Zod schema validation, rate-limiting, and error middleware to prevent invalid payloads.'
        },
        {
          title: 'Environment Config & Secrets',
          time: '0.3s',
          detail: 'Structured safe .env configuration ensuring server secrets are never exposed to the client bundle.'
        }
      ]
    },
    {
      id: 'database',
      name: 'MongoDB & Supabase Engineer',
      role: 'Mongoose & Postgres Schemas',
      avatarColor: 'from-emerald-500 to-teal-600',
      icon: FileCode2,
      task: 'Design schemas, indexes, and connection pooling for user-connected MongoDB Atlas or Supabase',
      status: 'completed',
      progress: 100,
      completedSteps: [
        {
          title: 'Schema Scaffolding & Types',
          time: '0.4s',
          detail: 'Generated Mongoose schemas and Supabase table migrations with strict TypeScript type definitions.'
        },
        {
          title: 'BYO Database Integration',
          time: '0.3s',
          detail: 'Connected user-provided connection strings without storing unencrypted credentials on Webcarft.'
        },
        {
          title: 'Query Optimization & Indexes',
          time: '0.2s',
          detail: 'Configured compound indexes for fast lookups and connection pool reuse across serverless requests.'
        }
      ]
    },
    {
      id: 'auth',
      name: 'Auth & Security Auditor',
      role: 'Clerk, JWT & RBAC Controls',
      avatarColor: 'from-amber-500 to-rose-600',
      icon: Lock,
      task: 'Verify JWT tokens, session persistence, role-based route guards, and zero credential leakage',
      status: 'completed',
      progress: 100,
      completedSteps: [
        {
          title: 'Authentication Middleware',
          time: '0.3s',
          detail: 'Added bearer token verification for protected endpoints supporting Clerk and Supabase Auth.'
        },
        {
          title: 'Zero Public Key Leakage Audit',
          time: '0.2s',
          detail: 'Audited Git push configs to guarantee no database URIs or private API keys ever enter source repositories.'
        },
        {
          title: 'CSRF & Security Headers',
          time: '0.3s',
          detail: 'Enabled strict Helmet headers, CSP policies, and CORS origin whitelisting.'
        }
      ]
    },
    {
      id: 'devops',
      name: 'DevOps & Netlify Deploy Agent',
      role: 'BYO Hosting & Vercel/Netlify CI',
      avatarColor: 'from-blue-600 to-cyan-500',
      icon: Rocket,
      task: 'Prepare full-stack deployment scripts to publish directly to user’s own Netlify or Vercel account',
      status: 'completed',
      progress: 100,
      completedSteps: [
        {
          title: 'Netlify & Vercel Build Configs',
          time: '0.3s',
          detail: 'Generated netlify.toml and vercel.json with serverless function routing and redirect rules.'
        },
        {
          title: 'Clean ZIP Code Export',
          time: '0.4s',
          detail: 'Bundled complete project with frontend, backend, schemas, and package scripts for immediate offline run.'
        },
        {
          title: 'Environment Injection Flow',
          time: '0.3s',
          detail: 'Mapped user-managed cloud environment variables directly into their own Netlify dashboard.'
        }
      ]
    }
  ];

  const activeAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const codeSnippets = {
    frontend: `// src/components/DataDashboard.tsx (React 19 + Tailwind CSS)
import React, { useEffect, useState } from 'react';
import { Database, Server, RefreshCw } from 'lucide-react';

export const DataDashboard: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/v1/records')
      .then((res) => res.json())
      .then((data) => setRecords(data.items || []))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#060c23] border border-blue-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <span>Full-Stack Live Data Feed</span>
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
          Connected to BYO Database
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-3">
        Showing real-time records synchronized from your own MongoDB Atlas or Supabase instance.
      </p>
    </div>
  );
};`,
    backend: `// server/routes/records.ts (Node.js & Express.js REST API)
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { RecordModel } from '../models/record.js';

const router = Router();

// GET /api/v1/records - Protected Endpoint
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await RecordModel.find({ ownerId: userId }).limit(20).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve database records' });
  }
});

export default router;`,
    database: `// server/models/record.ts (MongoDB / Mongoose Schema)
import mongoose, { Schema, Document } from 'mongoose';

export interface IRecord extends Document {
  ownerId: string;
  title: string;
  status: 'draft' | 'published';
  createdAt: Date;
}

const RecordSchema = new Schema<IRecord>({
  ownerId: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
});

export const RecordModel = mongoose.model<IRecord>('Record', RecordSchema);`,
    package: `{
  "name": "webcarft-fullstack-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "concurrently \\"vite\\" \\"tsx server.ts\\"",
    "build": "vite build && tsc -p server",
    "start": "node dist-server/server.js"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "express": "^4.21.0",
    "mongoose": "^8.8.0",
    "@supabase/supabase-js": "^2.46.0",
    "@clerk/clerk-react": "^5.0.0",
    "lucide-react": "^0.475.0"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.2.0"
  }
}`
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>AI FULL-STACK AGENT ORCHESTRATION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Specialist Agents Assembling Your Application
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            See how Webcarft&apos;s specialist agents collaborate to engineer your React frontend, Express API routes, MongoDB and Supabase schemas, and BYO Netlify deployment pipeline.
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="inline-flex p-1.5 rounded-full bg-slate-100 dark:bg-[#060c23] border border-slate-200 dark:border-blue-900/40 mt-4 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('agents')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeWorkspaceTab === 'agents'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Specialist Agents</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('code')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeWorkspaceTab === 'code'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Code Inspector</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('export')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeWorkspaceTab === 'export'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Rocket className="w-4 h-4" />
              <span>ZIP Export &amp; BYO Hosting</span>
            </button>
          </div>
        </div>

        {/* 1. AGENTS TELEMETRY VIEW */}
        {activeWorkspaceTab === 'agents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Specialist Agent Roster */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>ACTIVE SPECIALIST AGENTS</span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>5 of 5 Ready</span>
                </span>
              </div>

              {agents.map((agent) => {
                const Icon = agent.icon;
                const isSelected = agent.id === activeAgent.id;

                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-white dark:bg-[#081033] border-blue-500 dark:border-cyan-400/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                        : 'bg-white/80 dark:bg-[#060c23]/80 border-slate-200 dark:border-blue-900/40 hover:border-slate-300 dark:hover:border-blue-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${agent.avatarColor} flex items-center justify-center text-white shadow-sm shrink-0`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {agent.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {agent.role}
                          </div>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Ready</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mb-2.5">
                      {agent.task}
                    </p>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Detailed Telemetry for Selected Agent */}
            <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/30 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeAgent.avatarColor} flex items-center justify-center text-white shadow-md shrink-0`}
                  >
                    <activeAgent.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                      {activeAgent.role}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {activeAgent.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Status: Verified</span>
                  </span>
                </div>
              </div>

              {/* Current Assigned Task */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/80 dark:border-white/5 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Mission &amp; Deliverable
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                  {activeAgent.task}
                </div>
              </div>

              {/* Verified Completed Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>COMPLETED STEPS ({activeAgent.completedSteps.length})</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Verified deliverables
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeAgent.completedSteps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-blue-950 flex items-start gap-3 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1 text-left flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {step.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clean Output Notice */}
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-[11px] text-blue-700 dark:text-cyan-300 flex items-center gap-2">
                <Eye className="w-4 h-4 shrink-0 text-blue-500 dark:text-cyan-400" />
                <span>
                  <strong>Full-Stack Architecture:</strong> Clean React 19 views, typed Express.js routes, Mongoose & Supabase models, and standard package scripts with zero proprietary lock-in.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. CODE INSPECTOR VIEW */}
        {activeWorkspaceTab === 'code' && (
          <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900 border border-blue-500/25 shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] text-slate-400 font-sans font-semibold">
                  Webcarft Full-Stack Application Source Code
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setCodeTab('frontend')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    codeTab === 'frontend'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Frontend (React 19)
                </button>
                <button
                  type="button"
                  onClick={() => setCodeTab('backend')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    codeTab === 'backend'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Backend (Express.js)
                </button>
                <button
                  type="button"
                  onClick={() => setCodeTab('database')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    codeTab === 'database'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Database (MongoDB / Supabase)
                </button>
                <button
                  type="button"
                  onClick={() => setCodeTab('package')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    codeTab === 'package'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  package.json
                </button>
              </div>
            </div>

            <div className="p-5 overflow-x-auto text-blue-200 leading-relaxed max-h-[460px] overflow-y-auto">
              <pre>
                <code>{codeSnippets[codeTab]}</code>
              </pre>
            </div>
          </div>
        )}

        {/* 3. ZIP EXPORT & HOSTING VIEW */}
        {activeWorkspaceTab === 'export' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Standalone ZIP Export Card */}
              <div className="rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 p-6 sm:p-8 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <FileCode2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                      FULL CODE SOVEREIGNTY
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Complete Full-Stack ZIP Download
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Download the entire application codebase including React 19 frontend views, Node.js/Express API routes, Mongoose schemas, and build tooling. Run locally with npm install and npm run dev.
                </p>

                <div className="rounded-xl bg-slate-900 p-3.5 font-mono text-[11px] text-slate-300 space-y-2 border border-slate-800">
                  <div className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Frontend client + backend API server structure</span>
                  </div>
                  <div className="text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>MongoDB Mongoose &amp; Supabase client bindings</span>
                  </div>
                  <div className="text-blue-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% code ownership with zero proprietary lock-in</span>
                  </div>
                </div>
              </div>

              {/* Deploy Through Your Own Hosting (Netlify & Vercel) */}
              <div className="rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 p-6 sm:p-8 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                      BRING YOUR OWN HOSTING
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Deploy to Your Netlify &amp; Vercel
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Connect your own Netlify or Vercel account for automated deployment. You maintain full control over your hosting plan, custom domain DNS, SSL, and serverless compute limits.
                </p>

                <div className="rounded-xl bg-slate-900 p-3.5 font-mono text-[11px] text-slate-300 space-y-2 border border-slate-800">
                  <div className="text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Deploys into your personal/team Netlify or Vercel</span>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>You manage third-party hosting tiers and usage limits</span>
                  </div>
                  <div className="text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Webcarft never stores unencrypted API keys</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
