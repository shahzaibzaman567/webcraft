import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Tag, CheckCircle2, User } from 'lucide-react';
import { BLOG_POSTS } from '../data/landingData.ts';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="py-20 text-center max-w-xl mx-auto px-4 space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Article Not Found</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The requested article could not be located. It may have been updated or moved.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
          <span>{post.category}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500 shrink-0">
              <img
                src={post.author?.avatar || '/assets/owner.png'}
                alt={post.author?.name || 'Author'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                {post.author?.name || 'Shahzaib Zaman'}
              </div>
              <div className="text-xs text-slate-500">
                {post.author?.role || 'Founder & Lead Architect'}
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Article Body Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
        <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {post.excerpt}
        </p>

        {post.content.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}

        {/* Informative Callout */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-blue-500/20 text-slate-800 dark:text-slate-200 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            Key Takeaway
          </div>
          <p className="text-xs sm:text-sm">
            Webcarft was built on the premise that generative AI must empower builders with unpolluted, exportable code. When developers retain ownership of the output, creation velocity and code hygiene coexist harmoniously.
          </p>
        </div>
      </div>

      {/* Tags */}
      {post.tags && (
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-slate-400" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="pt-12 border-t border-slate-200 dark:border-white/10 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                to={`/blog/${related.slug}`}
                className="p-6 rounded-2xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
                  {related.category}
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  {related.title}
                </h4>
                <div className="text-xs text-slate-500 mt-3">{related.readTime}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
