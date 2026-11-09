import React from 'react';
import { User, GraduationCap, Award, Mail, Github, Linkedin, Instagram, ExternalLink } from 'lucide-react';

export const FounderSection: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Founder Photo (ONLY in this section) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              {/* Soft glow behind image */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

              {/* Founder Photo Frame */}
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl shadow-blue-500/10 border border-slate-100 dark:border-slate-800 aspect-[3/4]">
                <img
                  src="/assets/owner.png"
                  alt="Shahzaib Zaman - Founder of Webcarft"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Founder Info matching Image 7 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                ABOUT WEBCARFT
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Meet the founder
              </h2>
            </div>

            {/* Official Vision Quote */}
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Webcarft was created with a clear vision: to make professional full-stack website and application creation accessible through artificial intelligence. Our goal is to empower creators, founders, and teams to turn ideas into robust, production-grade software—complete with modern frontends, backend APIs, and databases—with total code ownership.
            </p>

            {/* 4 Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Founder */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-cyan-500 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Founder</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Shahzaib Zaman
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-cyan-500 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Education</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Matriculation
                  </div>
                </div>
              </div>

              {/* Training */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-cyan-500 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Training</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Saylani Graduate
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-cyan-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Email</div>
                  <a
                    href="mailto:shahzaibzaman.official@gmail.com"
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors break-all"
                  >
                    shahzaibzaman.official@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social Connect Bar for Founder */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/shahzaibzaman567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href="https://www.linkedin.com/in/shahzaib-zaman465/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors border border-blue-200 dark:border-blue-800/40 shadow-xs"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href="https://www.instagram.com/shahzaibzaman.official/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 text-xs font-semibold transition-colors border border-pink-200 dark:border-pink-800/40 shadow-xs"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
