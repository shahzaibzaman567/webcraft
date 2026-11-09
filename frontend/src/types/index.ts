export interface FeatureItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deepDive: string;
  benefits: string[];
  icon: string;
  color: string;
  codeSnippet?: string;
  badge?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  description: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'billing';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author?: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string[];
  tags?: string[];
}

export interface DocTopic {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  lastUpdated: string;
  content: {
    heading: string;
    text: string;
    code?: string;
    tips?: string[];
  }[];
}

export interface GuideItem {
  id: string;
  slug: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  category: string;
  steps: {
    stepNumber: number;
    title: string;
    details: string;
    codeSnippet?: string;
  }[];
}
