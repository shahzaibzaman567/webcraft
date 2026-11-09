import React from 'react';

export const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Image 8 */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            BLOG
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Articles coming soon
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Guides and updates about building websites with AI will appear here.
          </p>
        </div>
      </div>
    </section>
  );
};
