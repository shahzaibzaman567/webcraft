import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import { Lock, ArrowUp } from 'lucide-react';
import { DevAuthPanel } from '../components/DevAuthPanel';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [canvasPrompt, setCanvasPrompt] = useState('');

  const handleCanvasPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPrompt = canvasPrompt.trim() || 'build your saas startup with auth & database';
    navigate(`/builder?prompt=${encodeURIComponent(targetPrompt)}`);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#040819] flex flex-col lg:grid lg:grid-cols-2 text-slate-900 dark:text-white transition-colors duration-300">
      {/* LEFT COLUMN: Auth */}
      <div className="flex flex-col justify-between p-6 sm:p-10 md:p-16 max-w-lg w-full mx-auto min-h-screen">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img
              src="/assets/logo.png"
              alt="Webcraft Logo"
              className="h-9 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Webcraft
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-10 mb-8">
            Create your account
          </h1>

          {CLERK_PUBLISHABLE_KEY ? (
            <div className="flex justify-center w-full">
              <SignUp
                routing="path"
                path="/signup"
                signInUrl="/login"
                forceRedirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'w-full shadow-none border border-slate-200 dark:border-white/10 rounded-3xl bg-white dark:bg-[#070c24] p-6',
                    formButtonPrimary: 'bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 rounded-2xl font-bold text-sm',
                  },
                }}
              />
            </div>
          ) : (
            <DevAuthPanel mode="signUp" onAuthenticated={() => navigate('/dashboard')} />
          )}

          <div className="text-center pt-5">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-slate-900 dark:text-white underline hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        <div className="pt-8 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure authentication powered by Clerk</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Radiant Dreamy Gradient Canvas with Centered Prompt */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden m-4 sm:m-6 rounded-[36px] bg-gradient-to-tr from-[#ff3366] via-[#9333ea] via-[#3b82f6] to-[#06b6d4] shadow-2xl shadow-purple-900/30">
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/30 pointer-events-none" />

        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <img src="/assets/logo.png" alt="Webcraft Logo" className="h-6 w-auto object-contain filter drop-shadow" />
            <span className="text-white font-bold text-lg tracking-tight">Webcraft</span>
          </div>
          <p className="text-white/70 text-sm max-w-xs">
            Build complete full-stack apps with AI in seconds
          </p>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <form
            onSubmit={handleCanvasPromptSubmit}
            className="w-full rounded-2xl bg-white backdrop-blur-xl p-2.5 sm:p-3 shadow-2xl border border-white/40 flex items-center justify-between gap-3 group transition-all hover:scale-[1.01]"
          >
            <input
              type="text"
              value={canvasPrompt}
              onChange={(e) => setCanvasPrompt(e.target.value)}
              placeholder="Ask Webcraft to build your saas startup."
              className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-500 text-xs sm:text-sm px-2 focus:outline-none"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-slate-950 hover:bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Generate Website"
            >
              <ArrowUp className="w-4 h-4 font-bold" />
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="text-[11px] font-medium text-white/80 drop-shadow-sm">
              Press Enter to start building instantly with AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
