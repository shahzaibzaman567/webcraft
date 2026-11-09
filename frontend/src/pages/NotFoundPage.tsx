import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 sm:py-32 max-w-lg mx-auto px-4 text-center space-y-6">
      <div className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
      </p>
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/docs"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
        >
          <span>Explore Docs</span>
        </Link>
      </div>
    </div>
  );
};
