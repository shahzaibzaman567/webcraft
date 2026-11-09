import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Linkedin, Instagram, Sparkles, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-blue-900/30 bg-slate-50 dark:bg-[#030614] text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Left Column */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/assets/logo.png"
                alt="Webcarft Logo"
                className="h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Webcarft
              </span>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              The Full-Stack AI Website Builder. Transform natural language prompts into complete web applications—React 19 frontends, Node.js/Express APIs, MongoDB &amp; Supabase schemas, and deployments to your own Netlify or Vercel hosting.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com/shahzaibzaman567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors shadow-xs"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/shahzaib-zaman465/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-xs"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/shahzaibzaman.official/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors shadow-xs"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:shahzaibzaman.official@gmail.com"
                className="w-9 h-9 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors shadow-xs"
                aria-label="Direct Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Pricing ($0 Free)
                </Link>
              </li>
              <li>
                <Link to="/enterprise" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Enterprise
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Security &amp; Trust
                </Link>
              </li>
              <li>
                <Link to="/docs/build-mode" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Build Mode
                </Link>
              </li>
              <li>
                <Link to="/docs/plan-mode" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Plan Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/docs" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Guides &amp; Tutorials
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Blog &amp; Articles
                </Link>
              </li>
              <li>
                <Link to="/docs/github-sync" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  GitHub Integration
                </Link>
              </li>
              <li>
                <Link to="/docs/deployments" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Vercel &amp; Netlify Deploy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  About Webcarft
                </Link>
              </li>
              <li>
                <Link to="/about#founder" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Founder Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Sign Up Free
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Log In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200 dark:border-blue-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Webcarft. Built with passion by Shahzaib Zaman. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/security" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Security
            </Link>
            <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Support
            </Link>
            <a
              href="mailto:shahzaibzaman.official@gmail.com"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              shahzaibzaman.official@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
