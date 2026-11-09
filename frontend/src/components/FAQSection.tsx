import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Do I need to know how to code?',
      a: 'No coding experience is required! You can generate complete websites simply by typing what you want in plain language. If you are a developer, you can also view, edit, and export the clean React & Tailwind code.'
    },
    {
      q: 'Can I download my website?',
      a: 'Yes, 100%. You can download your entire website as a ZIP archive containing standard React, TypeScript, and Tailwind CSS files that run anywhere.'
    },
    {
      q: 'Where can I host my site?',
      a: 'You can host your website anywhere you like — including 1-click deployments to Vercel and Netlify, custom servers, or cloud storage providers with your own custom domain.'
    },
    {
      q: 'Does it work with GitHub?',
      a: 'Yes. Webcarft connects directly with GitHub so you can sync your generated website to your personal or organization repository with standard version control.'
    },
    {
      q: 'Is Webcarft free?',
      a: 'Yes, you can get started completely free to create and preview websites. Additional advanced features and premium tiers will be introduced soon.'
    }
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching Image 9 */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            FAQ
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ List matching screenshot */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between text-left py-2 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
                >
                  <span className="text-base font-semibold">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-slate-600'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="pt-2 pb-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
