import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';
import {
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  ArrowRight,
  Sparkles,
  BookOpen,
  FileCode2,
  ShieldCheck,
  Building2,
  Compass,
  MessageSquare,
  Github,
  Linkedin,
  Instagram,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track login status using the Clerk-aware auth helper.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => isAuthenticated());

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(isAuthenticated());
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('webcraft-auth-change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('webcraft-auth-change', checkAuth);
    };
  }, [location.pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const solutionsItems = [
    {
      title: 'Full-Stack Build Mode',
      description: 'AI code generation for React 19, Node.js/Express, and APIs',
      href: '/docs/build-mode',
      icon: Sparkles,
      color: 'text-purple-400',
    },
    {
      title: 'Architecture & Plan Mode',
      description: 'Model database schemas, REST endpoints, and UI state flows',
      href: '/docs/plan-mode',
      icon: Compass,
      color: 'text-blue-400',
    },
    {
      title: 'Connect Services',
      description: 'Link your MongoDB Atlas, Supabase, Vercel & Netlify accounts',
      href: '/settings',
      icon: Zap,
      color: 'text-emerald-400',
    },
    {
      title: 'Deploy to Netlify & Vercel',
      description: 'Connect your own hosting accounts with custom domain routing',
      href: '/docs/deployment',
      icon: Building2,
      color: 'text-cyan-400',
    },
  ];

  const resourcesItems = [
    {
      title: 'Documentation',
      description: 'Guides, components, styling, and export workflows',
      href: '/docs',
      icon: BookOpen,
      color: 'text-blue-400',
    },
    {
      title: 'Guides & Tutorials',
      description: 'Step-by-step walkthroughs for creating landing pages',
      href: '/guides',
      icon: FileCode2,
      color: 'text-emerald-400',
    },
    {
      title: 'Blog & Insights',
      description: 'Landing page design tips, prompting ideas, and tutorials',
      href: '/blog',
      icon: Sparkles,
      color: 'text-pink-400',
    },
    {
      title: 'Security & Trust',
      description: 'Account protection, code sovereignty, and clean export',
      href: '/security',
      icon: ShieldCheck,
      color: 'text-indigo-400',
    },
  ];

  const communityItems = [
    {
      title: 'GitHub Profile',
      description: 'View open repositories, stars, and code contributions',
      href: 'https://github.com/shahzaibzaman567',
      external: true,
      icon: Github,
      color: 'text-slate-300',
    },
    {
      title: 'LinkedIn Network',
      description: 'Connect with founder Shahzaib Zaman on LinkedIn',
      href: 'https://www.linkedin.com/in/shahzaib-zaman465/',
      external: true,
      icon: Linkedin,
      color: 'text-blue-400',
    },
    {
      title: 'Instagram Updates',
      description: 'Follow design drops, product sneak peeks, and behind-the-scenes',
      href: 'https://www.instagram.com/shahzaibzaman.official/',
      external: true,
      icon: Instagram,
      color: 'text-pink-400',
    },
    {
      title: 'Contact & Support',
      description: 'Direct inquiry line with the Webcraft founder team',
      href: '/contact',
      icon: MessageSquare,
      color: 'text-purple-400',
    },
    {
      title: 'About Webcraft',
      description: 'Meet founder Shahzaib Zaman and our mission',
      href: '/about',
      icon: Compass,
      color: 'text-blue-400',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Floating Translucent Capsule Navbar matching Lovable style */}
      <header className="sticky top-3.5 z-40 w-full px-3 sm:px-6 lg:px-8 transition-all duration-300">
        <div
          ref={dropdownRef}
          className="max-w-7xl mx-auto rounded-full bg-white/85 dark:bg-[#040819]/85 backdrop-blur-2xl border border-slate-200/80 dark:border-blue-500/25 shadow-lg dark:shadow-[0_8px_32px_rgba(4,8,25,0.7)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4 transition-all"
        >
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none rounded-lg shrink-0"
          >
            <img
              src="/assets/logo.png"
              alt="Webcraft Logo"
              className="h-7 sm:h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-105 transition-transform"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
              Webcraft
            </span>
          </Link>

          {/* Desktop Navigation Links & Dropdowns */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {/* Solutions Dropdown on Hover */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('solutions')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer py-1 ${openDropdown === 'solutions' || location.pathname.startsWith('/docs')
                    ? 'text-blue-600 dark:text-cyan-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'solutions' ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {openDropdown === 'solutions' && (
                <div className="absolute top-full left-0 mt-1 w-80 rounded-2xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/25 shadow-2xl p-3 grid gap-2 z-50">
                  {solutionsItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-start gap-3 group"
                    >
                      <item.icon className={`w-5 h-5 mt-0.5 shrink-0 ${item.color}`} />
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Dropdown on Hover */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('resources')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer py-1 ${openDropdown === 'resources' ||
                    location.pathname.startsWith('/blog') ||
                    location.pathname.startsWith('/guides')
                    ? 'text-blue-600 dark:text-cyan-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'resources' ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {openDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-1 w-80 rounded-2xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/25 shadow-2xl p-3 grid gap-2 z-50">
                  {resourcesItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-start gap-3 group"
                    >
                      <item.icon className={`w-5 h-5 mt-0.5 shrink-0 ${item.color}`} />
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Community Dropdown on Hover */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('community')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer py-1 ${openDropdown === 'community'
                    ? 'text-blue-600 dark:text-cyan-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <span>Community</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {openDropdown === 'community' && (
                <div className="absolute top-full left-0 mt-1 w-80 rounded-2xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/25 shadow-2xl p-3 grid gap-2 z-50">
                  {communityItems.map((item) =>
                    item.external ? (
                      <a
                        key={item.title}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpenDropdown(null)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-start gap-3 group"
                      >
                        <item.icon className={`w-5 h-5 mt-0.5 shrink-0 ${item.color}`} />
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <Link
                        key={item.title}
                        to={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-start gap-3 group"
                      >
                        <item.icon className={`w-5 h-5 mt-0.5 shrink-0 ${item.color}`} />
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>

            <Link
              to="/enterprise"
              className={`text-xs sm:text-sm font-medium transition-colors py-1 ${isActive('/enterprise')
                  ? 'text-blue-600 dark:text-cyan-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Enterprise
            </Link>

            <Link
              to="/pricing"
              className={`text-xs sm:text-sm font-medium transition-colors py-1 ${isActive('/pricing')
                  ? 'text-blue-600 dark:text-cyan-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Pricing
            </Link>

            <Link
              to="/security"
              className={`text-xs sm:text-sm font-medium transition-colors py-1 ${isActive('/security')
                  ? 'text-blue-600 dark:text-cyan-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Security
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Functional Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle theme mode"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 sm:p-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-amber-400 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              ) : (
                <Moon className="w-4 h-4 text-purple-600 drop-shadow-[0_0_6px_rgba(147,51,234,0.3)]" />
              )}
            </button>

            {/* If Logged In: Show 'Open Webcraft' (Matching Image 3 of Lovable) */}
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-950 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
              >
                <span>Open Webcraft</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              /* If Not Logged In: Show Log In & Get Started (Matching Image 2 of Lovable) */
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <span>Get started</span>
                </Link>
              </>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Left-Side Sliding Mobile Navigation Sidebar */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Left Drawer */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-[#040819] border-r border-slate-200 dark:border-blue-900/40 shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-blue-900/30">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <img
                    src="/assets/logo.png"
                    alt="Webcraft Logo"
                    className="h-7 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                  />
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    Webcraft
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categorized Navigation Links */}
              <div className="mt-5 space-y-6">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
                    Pages
                  </div>
                  <nav className="flex flex-col space-y-1">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/builder"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${isActive('/builder')
                          ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-bold'
                          : 'text-purple-600 dark:text-purple-400 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>AI Builder Studio</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Developer Dashboard
                    </Link>
                    <Link
                      to="/integrations"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/integrations')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Integrations &amp; Cloud
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/settings')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Connect Services
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/about')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      About &amp; Founder
                    </Link>
                    <Link
                      to="/pricing"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/pricing')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Pricing ($0 Free Plan)
                    </Link>
                    <Link
                      to="/security"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/security')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Security &amp; Trust
                    </Link>
                    <Link
                      to="/enterprise"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/enterprise')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Enterprise
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/contact')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Contact Us
                    </Link>
                  </nav>
                </div>

                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
                    Learning &amp; Content
                  </div>
                  <nav className="flex flex-col space-y-1">
                    <Link
                      to="/docs"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/docs')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Documentation Portal
                    </Link>
                    <Link
                      to="/guides"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/guides')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Guides &amp; Tutorials
                    </Link>
                    <Link
                      to="/blog"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/blog')
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      Blog &amp; Articles
                    </Link>
                  </nav>
                </div>
              </div>
            </div>

            {/* Bottom Actions inside Mobile Drawer */}
            <div className="pt-6 border-t border-slate-200 dark:border-blue-900/30 space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Theme</span>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="flex items-center gap-2 text-xs font-medium py-1.5 px-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-purple-600" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>

              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-center text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-md"
                >
                  Open Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl text-center text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl text-center text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
