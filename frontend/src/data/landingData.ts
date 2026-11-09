import { FeatureItem, PricingPlan, FAQItem, BlogPost, DocTopic, GuideItem } from '../types/index.ts';

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: 'fullstack-generation',
    title: 'AI Full-Stack Project Generation',
    tagline: 'Generate complete applications with frontend, backend, APIs, and databases',
    description: 'Describe any full-stack web application in natural language. Webcarft synthesizes responsive React/Next.js client interfaces, modular Node.js/Express backend APIs, database models, and authentication in seconds.',
    deepDive: 'Our specialized generative engine translates conversational requirements into complete full-stack architectures. It crafts production-grade React 19 components with Tailwind CSS, wires Node.js/Express server endpoints, configures database schemas, and sets up authentication handlers without repetitive boilerplate.',
    benefits: [
      'End-to-end code generation: React frontend, Express REST APIs, database models, and auth',
      'Modern React 19, Next.js, TypeScript, and Tailwind CSS client stack',
      'Modular Node.js/Express server architecture with structured route controllers',
      'Iterative refinement: update frontend components, backend endpoints, or data models anytime'
    ],
    icon: 'Sparkles',
    color: 'from-blue-500 to-indigo-600',
    codeSnippet: `// Webcarft Full-Stack Generation Pipeline
const app = await webcarft.generate({
  prompt: "SaaS platform with user auth, billing API, and database models",
  frontend: "react-19-tailwind",
  backend: "nodejs-express-rest",
  database: "supabase-postgresql", // or "mongodb-atlas"
  deployment: "byo-netlify"
});`,
    badge: 'Core Engine'
  },
  {
    id: 'database-integrations',
    title: 'MongoDB & Supabase Database Integrations',
    tagline: 'Connect your own databases with type-safe schemas and queries',
    description: 'Seamlessly integrate MongoDB Atlas or Supabase PostgreSQL into your generated application. Webcarft writes Mongoose schemas or Supabase SQL tables and controllers that connect directly to your own database accounts.',
    deepDive: 'You retain complete control of your data. Connect your existing free or paid MongoDB Atlas cluster or Supabase project by providing your connection URI or API keys. Webcarft configures connection pooling, indexing, and type-safe query controllers without holding or proxying your data.',
    benefits: [
      'First-class support for MongoDB Atlas (Mongoose ODM) and Supabase (PostgreSQL)',
      'Connect your own database accounts with your own keys and connection URIs',
      'You control database storage limits, security rules, and infrastructure billing',
      'Automated type-safe query controllers and schema validation'
    ],
    icon: 'Database',
    color: 'from-emerald-500 to-teal-600',
    codeSnippet: `// Connect your own MongoDB Atlas or Supabase
// In your project .env (stored locally or in your hosting vault):
MONGODB_URI="mongodb+srv://<user>:<pwd>@cluster.mongodb.net/myapp"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"`,
    badge: 'BYO Database'
  },
  {
    id: 'auth-apis',
    title: 'Authentication & API Integration',
    tagline: 'Production-ready user authentication and REST/GraphQL endpoints',
    description: 'Generate secure user signup, login, session management, and API routes. Integrate Clerk, Supabase Auth, or standard JWT token verification with protected route middleware.',
    deepDive: 'Webcarft scaffolds robust authentication workflows. Protect sensitive backend routes, manage role-based user permissions, and handle credential validation securely using your own identity provider credentials.',
    benefits: [
      'Support for Clerk, Supabase Auth, and custom JWT authentication',
      'Pre-built signup, login, password recovery, and user profile components',
      'Secure middleware guarding protected backend API endpoints',
      'Clean separation between public client assets and authenticated server routes'
    ],
    icon: 'Lock',
    color: 'from-purple-500 to-pink-600',
    codeSnippet: `// Protected Express Route Middleware
router.get('/api/user/profile', requireAuth, async (req, res) => {
  const profile = await getUserProfile(req.auth.userId);
  res.json({ success: true, profile });
});`,
    badge: 'Auth & APIs'
  },
  {
    id: 'file-storage',
    title: 'Cloud File Storage Integration',
    tagline: 'Connect AWS S3, Supabase Storage, or Cloudinary via your own accounts',
    description: 'Integrate asset uploads, document storage, and media delivery. Webcarft generates upload handlers that stream directly to your own bucket or cloud storage provider.',
    deepDive: 'Easily handle file uploads such as avatars, documents, and user media. Webcarft configures signed URL generation and upload endpoints using your own cloud storage credentials, ensuring you manage your own storage limits and costs.',
    benefits: [
      'Integrate with AWS S3, Supabase Storage, Cloudinary, or Firebase Storage',
      'Connect your own buckets with your own API credentials',
      'Signed URL generation for secure, direct client-to-bucket uploads',
      'No intermediary file storage fees charged by Webcarft'
    ],
    icon: 'HardDrive',
    color: 'from-amber-500 to-orange-600',
    codeSnippet: `// Direct Storage Upload using your own AWS S3 / Supabase bucket
const uploadUrl = await storage.getSignedUploadUrl({
  bucket: process.env.USER_STORAGE_BUCKET,
  fileName: "avatar.png"
});`,
    badge: 'BYO Storage'
  },
  {
    id: 'netlify-deployment',
    title: 'Deploy Through Your Own Hosting (Netlify & Vercel)',
    tagline: 'One-click deployment directly into your personal hosting accounts',
    description: 'Deploy frontend assets and serverless backend functions straight to your own Netlify or Vercel account. You control custom domains, build limits, and bandwidth subscriptions.',
    deepDive: 'Webcarft never forces you to rely on proprietary hosting servers. Connect your own Netlify or Vercel account via OAuth or personal tokens. Webcarft triggers automated builds, edge routing, and environment variable configuration directly within your personal account.',
    benefits: [
      '1-click deployment to Netlify, Vercel, or custom Docker/Node servers',
      'Deploy to your own hosting account with your own domain and SSL',
      'You control hosting tiers, team members, and usage limits directly',
      'Complete ZIP source-code export with standard package.json and Vite configs'
    ],
    icon: 'Rocket',
    color: 'from-cyan-500 to-blue-600',
    codeSnippet: `// 1-Click Deployment to your own Netlify account
await webcarft.deploy({
  provider: 'netlify',
  account: 'user-connected-account',
  siteName: 'my-fullstack-app',
  envVars: { MONGODB_URI: process.env.MONGODB_URI }
});
// Published to: https://my-fullstack-app.netlify.app 🚀`,
    badge: 'BYO Hosting'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Describe your full-stack application',
    subtitle: 'Conversational natural language specification',
    description: 'Enter your project vision in clear English. Specify frontend UI requirements, backend API routes, database collections (MongoDB or Supabase), and authentication needs.',
    highlight: 'No complex manual project scaffolding required.',
    icon: 'MessageSquareText'
  },
  {
    step: '02',
    title: 'Let AI synthesize frontend, backend & schemas',
    subtitle: 'Automated full-stack code generation',
    description: 'Webcarft synthesizes modular React components, Node.js/Express server routes, database schema models, and authentication handlers in real time.',
    highlight: 'Outputs clean, production-grade TypeScript and React code.',
    icon: 'Cpu'
  },
  {
    step: '03',
    title: 'Connect your accounts & deploy on Netlify',
    subtitle: 'Bring your own databases, storage, and hosting',
    description: 'Link your own MongoDB Atlas or Supabase credentials, connect your Netlify account, or download the complete source code as a ZIP archive for local development.',
    highlight: 'You retain 100% code sovereignty and manage your own service tiers.',
    icon: 'Rocket'
  }
];

export const WHY_CHOOSE_ITEMS = [
  {
    title: 'Complete Full-Stack Architecture',
    description: 'Generate real applications with frontend UI, backend Express routes, database schemas, authentication, and file storage—not just static templates.',
    icon: 'Zap'
  },
  {
    title: 'Bring Your Own Infrastructure (BYO)',
    description: 'Connect your own database (MongoDB / Supabase), cloud storage (S3), and hosting (Netlify). You manage your own service subscriptions and usage limits directly.',
    icon: 'Cloud'
  },
  {
    title: '100% Clean Code Sovereignty',
    description: 'Every project outputs standard React 19, TypeScript, and Node.js code with zero proprietary lock-in. Download your full source ZIP or push to GitHub anytime.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Deploy to Your Own Netlify Account',
    description: 'Publish production builds directly to your personal Netlify account with custom domains, free automatic SSL, and worldwide edge CDN delivery.',
    icon: 'Rocket'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'studio-free',
    name: 'Webcarft Studio',
    priceMonthly: 0,
    priceAnnually: 0,
    description: 'Start building full-stack applications for free today. Generate code, preview live, and connect your own third-party infrastructure accounts.',
    features: [
      'AI full-stack application code generation',
      'Frontend (React 19, Tailwind) & Backend (Express, Node.js)',
      'MongoDB Atlas & Supabase database schema integrations',
      'Authentication & API endpoint scaffolding',
      'Interactive live preview and multi-file code inspector',
      'Complete ZIP source-code export with standard configs',
      'Deploy through your own Netlify account',
      'Bring your own database, hosting & storage accounts'
    ],
    ctaText: 'Start Building Free'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is Webcarft and what can I build with it?',
    answer: 'Webcarft is a Full-Stack AI Website and Application Builder. It allows you to generate complete, production-grade web applications using AI, including responsive frontend interfaces (React 19, Next.js, Tailwind CSS), backend server endpoints (Node.js/Express), database integrations (MongoDB and Supabase), user authentication, and file storage.'
  },
  {
    id: 'faq-2',
    category: 'billing',
    question: 'Who pays for database, hosting, and cloud storage services?',
    answer: 'Webcarft operates on a Bring Your Own Infrastructure (BYO) model. Webcarft generates the source code and manages your development experience. You connect your own accounts for third-party infrastructure (such as MongoDB Atlas, Supabase, Netlify, and AWS S3). You manage your own usage limits, free tiers, and subscriptions directly with those providers. Webcarft does not charge infrastructure markups or provide paid third-party resources.'
  },
  {
    id: 'faq-3',
    category: 'technical',
    question: 'Which databases are supported by Webcarft?',
    answer: 'Webcarft natively supports MongoDB Atlas (using Mongoose ODM schemas, indexing, and connection caching) and Supabase (PostgreSQL tables, migrations, and Supabase client SDK). You supply your own database connection URI or API keys in your environment configuration.'
  },
  {
    id: 'faq-4',
    category: 'technical',
    question: 'How does deployment to Netlify work?',
    answer: 'You can deploy your generated application directly to your personal Netlify account. Webcarft compiles production-ready builds, configures client-side redirects, and guides you in setting up your environment variables (such as MONGODB_URI or SUPABASE_URL) in your Netlify site settings. You can also connect your own custom domain.'
  },
  {
    id: 'faq-5',
    category: 'general',
    question: 'Do I really own the generated source code?',
    answer: 'Yes, 100%. Webcarft grants you full copyright and commercial intellectual property rights to all generated frontend and backend code. You can download the complete source code as a ZIP archive, push it to GitHub, or run it locally in VS Code with zero proprietary runtime lock-in.'
  },
  {
    id: 'faq-6',
    category: 'technical',
    question: 'Can I integrate user authentication and file storage?',
    answer: 'Yes. Webcarft generates complete authentication flows (via Clerk, Supabase Auth, or standard JWT token verification) with protected route middleware. For file storage, it scaffolds upload handlers that connect to your own AWS S3 buckets or Supabase Storage.'
  },
  {
    id: 'faq-7',
    category: 'technical',
    question: 'What technology stack does Webcarft output?',
    answer: 'Webcarft outputs standard, production-ready React 19, TypeScript, and Tailwind CSS on the client side, paired with a lightweight Node.js/Express server for REST APIs and database controllers. All code adheres to open-source industry standards.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'architecting-fullstack-apps-with-ai-2026',
    title: 'Architecting Full-Stack Applications with AI: From Prompt to Production in 2026',
    category: 'AI & Full-Stack',
    readTime: '5 min read',
    date: 'Oct 28, 2026',
    excerpt: 'Explore how conversational prompts and AST synthesis generate complete architectures across frontend UI, Express APIs, and MongoDB/Supabase databases.',
    author: {
      name: 'Shahzaib Zaman',
      role: 'Founder & Lead Architect',
      avatar: '/assets/owner.png'
    },
    tags: ['Full-Stack', 'React 19', 'Express', 'MongoDB', 'Supabase'],
    content: [
      'Web development has evolved beyond manual boilerplate. Modern builders use AI to synthesize not just surface-level UI templates, but complete full-stack architectures including backend routes, database models, and authentication.',
      'Webcarft was founded on code sovereignty: you generate clean, standard TypeScript, React, and Node.js code, while retaining the freedom to connect your own databases and deploy to your own hosting accounts.',
      'By integrating directly with your own MongoDB Atlas or Supabase PostgreSQL instances, you control your data security, storage policies, and infrastructure tiers.',
      'Whether you are building an MVP or a production business tool, Webcarft collapses development timelines from weeks to minutes.'
    ]
  },
  {
    id: 'blog-2',
    slug: 'deploying-fullstack-apps-to-netlify',
    title: 'Deploying Modern Full-Stack Web Apps to Netlify: Complete Step-by-Step Guide',
    category: 'DevOps & Deployment',
    readTime: '4 min read',
    date: 'Oct 15, 2026',
    excerpt: 'Learn how to deploy your generated Webcarft full-stack project to your personal Netlify account with custom domains and secure environment variables.',
    author: {
      name: 'Shahzaib Zaman',
      role: 'Founder & Lead Architect',
      avatar: '/assets/owner.png'
    },
    tags: ['Netlify', 'Deployment', 'BYO Hosting', 'Full-Stack'],
    content: [
      'Netlify offers world-class edge hosting, automated builds, and serverless functions. Connecting your own Netlify account gives you direct control over your build limits, custom domains, and SSL certificates.',
      'Webcarft generates clean build scripts and routing configurations that integrate seamlessly with Netlify. Environment variables like database connection URIs are stored securely in your Netlify dashboard.',
      'In minutes, your complete full-stack application is live on global edge networks with automated HTTPS.'
    ]
  },
  {
    id: 'blog-3',
    slug: 'byo-infrastructure-model-explained',
    title: 'Why Bring-Your-Own (BYO) Infrastructure is the Best Choice for Developers',
    category: 'Cloud Strategy',
    readTime: '4 min read',
    date: 'Sep 24, 2026',
    excerpt: 'Understand why connecting your own MongoDB, Supabase, and Netlify accounts avoids vendor lock-in, eliminates hidden markups, and preserves data privacy.',
    author: {
      name: 'Shahzaib Zaman',
      role: 'Founder & Lead Architect',
      avatar: '/assets/owner.png'
    },
    tags: ['Cloud Infrastructure', 'BYO', 'MongoDB', 'Supabase', 'Netlify'],
    content: [
      'Many closed AI website builders force users into expensive proprietary hosting and hidden database markups. Webcarft takes the opposite approach: Bring Your Own Infrastructure (BYO).',
      'With Webcarft, you generate standard open-source code and connect your own accounts on Supabase, MongoDB Atlas, Netlify, or AWS. You choose your own free tiers or paid subscriptions directly with each provider.',
      'This guarantees that your data stays under your direct control, with zero vendor lock-in and zero unexpected infrastructure charges.'
    ]
  },
  {
    id: 'blog-4',
    slug: 'plan-mode-vs-build-mode-fullstack',
    title: 'Plan Mode vs Build Mode: Structuring Full-Stack Architectures with AI',
    category: 'Product Updates',
    readTime: '4 min read',
    date: 'Sep 10, 2026',
    excerpt: 'How Plan Mode maps out API contracts, database schemas, and navigation flow before Build Mode synthesizes the production code.',
    author: {
      name: 'Shahzaib Zaman',
      role: 'Founder & Lead Architect',
      avatar: '/assets/owner.png'
    },
    tags: ['Plan Mode', 'Build Mode', 'Architecture', 'Full-Stack'],
    content: [
      'Building production full-stack software requires thoughtful design before code generation. Webcarft provides a dual-mode workflow: Plan Mode and Build Mode.',
      'Plan Mode serves as your systems architect. You can define multi-page routes, design REST API contracts, specify database entity models for MongoDB or Supabase, and plan authentication flows.',
      'Once your blueprint is ready, Build Mode executes the plan, compiling clean React components, Express endpoints, and database connection handlers with precision.'
    ]
  }
];

export const DOCS_TOPICS: DocTopic[] = [
  {
    id: 'getting-started',
    slug: 'getting-started',
    title: 'Getting Started with Webcarft',
    category: 'Introduction',
    description: 'Learn how to generate your first full-stack application with frontend, backend APIs, and database integration.',
    lastUpdated: 'Updated November 2026',
    content: [
      {
        heading: 'Introduction to Full-Stack Webcarft',
        text: 'Webcarft is a Full-Stack AI Website and Application Builder. It translates natural conversational requirements into clean React 19 interfaces, Node.js/Express server endpoints, MongoDB or Supabase database models, and authentication workflows.'
      },
      {
        heading: 'Bring Your Own Infrastructure (BYO)',
        text: 'Webcarft generates clean source code and manages your development experience. You connect your own database (MongoDB Atlas or Supabase), cloud storage (AWS S3), and hosting (Netlify or Vercel). You manage your own service tiers and limits directly with each provider.'
      },
      {
        heading: 'Creating Your First Project',
        text: 'Enter a clear prompt describing your application, required endpoints, and preferred database in the Webcarft prompt console.',
        code: `// Example Full-Stack Prompt
"Build a customer portal application with:
- React 19 client with dark navy theme #030619
- Node.js Express backend with /api/projects and /api/inquiries
- MongoDB Atlas Mongoose schema (or Supabase PostgreSQL)
- User authentication and file upload integration
- 1-click deployment configuration for Netlify"`
      }
    ]
  },
  {
    id: 'build-mode',
    slug: 'build-mode',
    title: 'Build Mode & Real-Time Synthesis',
    category: 'Core Features',
    description: 'Generate frontend UI, backend Express routes, and database models in real time.',
    lastUpdated: 'Updated November 2026',
    content: [
      {
        heading: 'What is Build Mode?',
        text: 'Build Mode is Webcarft’s real-time synthesis engine. In Build Mode, your conversational prompts are translated into clean React 19 components, Express REST endpoints, and database controllers, previewed live in the simulator.'
      },
      {
        heading: 'Prompting for Full-Stack Features',
        text: 'You can request granular updates across your stack without regenerating the entire project.',
        tips: [
          'Request specific backend APIs (e.g. "Add an Express endpoint /api/orders with validation")',
          'Define database collections (e.g. "Create a Mongoose User schema with timestamps and role")',
          'Configure hosting (e.g. "Add Netlify redirects and serverless functions configuration")'
        ]
      }
    ]
  },
  {
    id: 'plan-mode',
    slug: 'plan-mode',
    title: 'Plan Mode & Architecture Blueprints',
    category: 'Core Features',
    description: 'Architect user journeys, REST API contracts, and database models before synthesizing code.',
    lastUpdated: 'Updated November 2026',
    content: [
      {
        heading: 'System Architecture Blueprints',
        text: 'Plan Mode allows you to align on high-level architecture before generating code. It outputs multi-page route blueprints, database schema specifications, and API endpoint contracts.'
      },
      {
        heading: 'Transitioning to Build Mode',
        text: 'Once your architectural plan is verified, click "Execute Plan" to trigger automated frontend, backend, and schema generation in Build Mode.'
      }
    ]
  },
  {
    id: 'database-setup',
    slug: 'database-setup',
    title: 'Connecting MongoDB & Supabase',
    category: 'Databases',
    description: 'How to connect your own MongoDB Atlas URI or Supabase credentials.',
    lastUpdated: 'Updated November 2026',
    content: [
      {
        heading: 'Connecting MongoDB Atlas (Mongoose)',
        text: 'Webcarft generates Mongoose document models with connection pooling and caching. To connect your database, add your MongoDB Atlas URI to your local .env or hosting environment variables.',
        code: `// server/lib/mongodb.ts
import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDatabase() {
  if (!MONGODB_URI) throw new Error('Define MONGODB_URI in your environment');
  return mongoose.connect(MONGODB_URI);
}`
      },
      {
        heading: 'Connecting Supabase (PostgreSQL)',
        text: 'For relational data and real-time subscriptions, Webcarft generates Supabase client configurations and SQL table schemas. Provide your SUPABASE_URL and SUPABASE_ANON_KEY from your Supabase dashboard.'
      }
    ]
  },
  {
    id: 'netlify-deployment',
    slug: 'netlify-deployment',
    title: 'Deploying to Your Own Netlify Account',
    category: 'Deployment',
    description: 'Step-by-step guide on publishing full-stack applications to your personal Netlify account.',
    lastUpdated: 'Updated November 2026',
    content: [
      {
        heading: 'Netlify 1-Click Publishing',
        text: 'Connect your personal Netlify account via OAuth or personal access token. Webcarft builds production bundles, configures netlify.toml redirects, and triggers an automated edge deployment.'
      },
      {
        heading: 'Environment Variable Configuration',
        text: 'Configure your database URIs (MONGODB_URI, SUPABASE_URL) and API secrets in your Netlify site dashboard (Site Configuration > Environment Variables). Server variables are shielded from client JavaScript bundles.'
      }
    ]
  },
  {
    id: 'code-export',
    slug: 'code-export',
    title: 'Exporting Complete Source Code (ZIP)',
    category: 'Ownership',
    description: 'Download clean, self-contained TypeScript, React, and Node.js project files for local development.',
    lastUpdated: 'Updated November 2026',
    content: [
      {
        heading: '100% Code Ownership & Zero Lock-in',
        text: 'Click "Download ZIP" anytime to export your complete project. The archive contains standard React 19 components, Express server routes, database schemas, tsconfig.json, and package.json ready to run locally.'
      },
      {
        heading: 'Local Setup',
        text: 'Unzip the downloaded file, run npm install, configure your .env file with your database URI, and run npm run dev.'
      }
    ]
  }
];

export const GUIDES_DATA: GuideItem[] = [
  {
    id: 'guide-fullstack-app',
    slug: 'build-fullstack-app-5-minutes',
    title: 'How to Build a Full-Stack Web App with MongoDB & Netlify',
    difficulty: 'Beginner',
    duration: '5 min read',
    description: 'Step-by-step tutorial on generating a complete full-stack web app, connecting MongoDB Atlas, and publishing to Netlify.',
    category: 'Full-Stack Apps',
    steps: [
      {
        stepNumber: 1,
        title: 'Specify Your Full-Stack Application Requirements',
        details: 'Describe your product, required backend API routes, database collections, and preferred authentication method in Webcarft.'
      },
      {
        stepNumber: 2,
        title: 'Review and Refine Code in Live Studio',
        details: 'Inspect the generated React components, Express route handlers, and database models in the dual-screen editor.'
      },
      {
        stepNumber: 3,
        title: 'Connect Your MongoDB Atlas or Supabase Database',
        details: 'Insert your connection string into your project environment settings. Your database credentials connect directly to your own account.'
      },
      {
        stepNumber: 4,
        title: 'Deploy to Your Personal Netlify Account',
        details: 'Connect your Netlify account to publish your site live with automated SSL encryption and custom domain support.'
      }
    ]
  },
  {
    id: 'guide-supabase-integration',
    slug: 'integrating-supabase-database-auth',
    title: 'Connecting Supabase Database, Authentication & File Storage',
    difficulty: 'Intermediate',
    duration: '6 min read',
    description: 'Learn how to integrate your own Supabase project for PostgreSQL data, user authentication, and cloud asset storage.',
    category: 'Databases & Auth',
    steps: [
      {
        stepNumber: 1,
        title: 'Create a Free Project on Supabase.com',
        details: 'Log into Supabase and obtain your project URL and public anon key from the API Settings tab.'
      },
      {
        stepNumber: 2,
        title: 'Add Supabase Keys in Webcarft Project Settings',
        details: 'Provide your Supabase URL and anon key. Webcarft scaffolds Supabase client queries and auth hooks.'
      },
      {
        stepNumber: 3,
        title: 'Run Table Schemas and Test Queries',
        details: 'Verify generated table schemas and test real-time data synchronization directly in the preview inspector.'
      }
    ]
  },
  {
    id: 'guide-netlify-deploy',
    slug: 'deploying-to-netlify-step-by-step',
    title: 'Deploying Your Full-Stack App to Netlify with Custom Domains',
    difficulty: 'Beginner',
    duration: '4 min read',
    description: 'Learn how to publish your Webcarft application to your own Netlify account with custom domains and free SSL.',
    category: 'Deployment',
    steps: [
      {
        stepNumber: 1,
        title: 'Authorize Your Netlify Account',
        details: 'Connect your Netlify account securely to enable direct 1-click deployments.'
      },
      {
        stepNumber: 2,
        title: 'Configure Production Environment Variables',
        details: 'Set your database connection strings (MONGODB_URI, SUPABASE_URL) in your Netlify site settings.'
      },
      {
        stepNumber: 3,
        title: 'Bind Your Custom Domain',
        details: 'Add your domain name in Netlify for free automated Let’s Encrypt TLS/SSL certificates.'
      }
    ]
  }
];

export const SECURITY_FEATURES = [
  {
    title: 'Authentication & Session Security',
    description: 'Enterprise-grade identity integration via Clerk, Supabase Auth, or JWT tokens. Includes multi-factor authentication (2FA) and encrypted session cookies.',
    icon: 'Lock',
    badge: 'Auth Protocol'
  },
  {
    title: 'Data Privacy & BYO Infrastructure Isolation',
    description: 'Webcarft operates on a Bring Your Own Infrastructure model. Your database records, file uploads, and user data remain inside your own Supabase, MongoDB Atlas, and AWS accounts.',
    icon: 'ShieldCheck',
    badge: 'Data Sovereignty'
  },
  {
    title: '100% Code Ownership & IP Protection',
    description: 'You retain full commercial and personal copyright over every line of generated frontend and backend code. No black-box runtimes or proprietary platform lock-in.',
    icon: 'FileCode2',
    badge: 'Code Sovereignty'
  },
  {
    title: 'Zero-Secret Git & Deployment Protection',
    description: 'Sensitive connection URIs (MONGODB_URI, JWT_SECRET) are blocked from Git commits via strict .gitignore rules and configured directly in your Netlify or Vercel settings.',
    icon: 'KeyRound',
    badge: 'Secret Vault'
  },
  {
    title: 'Clean Code Export Guarantee',
    description: 'Exported ZIP archives contain clean, readable TypeScript, React, and Node.js code with zero injected tracking pixels or hidden telemetry.',
    icon: 'Download',
    badge: 'Clean Output'
  }
];
