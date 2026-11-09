import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, Sparkles, Github, Linkedin, Instagram, ExternalLink } from 'lucide-react';
import { sendContactMessage } from '../lib/userApi';

export const ContactPage: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrorMessage('');
    try {
      await sendContactMessage(formData);
      setFormSent(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not send your message. Please try again.',
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* 1. Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          <span>GET IN TOUCH</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          We&apos;d love to hear from you.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Let&apos;s talk.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Have a question, feedback on full-stack web application generation, or an architecture inquiry? Reach out below.
        </p>
      </section>

      {/* 2. Form & Contact Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Direct Founder Contact
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Reach founder Shahzaib Zaman directly for product feedback, support, and collaboration inquiries.
              </p>
              <div className="pt-2">
                <a
                  href="mailto:shahzaibzaman.official@gmail.com"
                  className="text-sm font-bold text-blue-600 dark:text-cyan-400 hover:underline break-all"
                >
                  shahzaibzaman.official@gmail.com
                </a>
              </div>
            </div>

            {/* Social Channels Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Verified Social Channels</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Connect directly with founder Shahzaib Zaman across professional and developer networks:
              </p>
              <div className="space-y-2.5 pt-1">
                <a
                  href="https://github.com/shahzaibzaman567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2.5">
                    <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    <span>GitHub: @shahzaibzaman567</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>

                <a
                  href="https://www.linkedin.com/in/shahzaib-zaman465/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2.5">
                    <Linkedin className="w-4 h-4 text-blue-500" />
                    <span>LinkedIn: Shahzaib Zaman</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>

                <a
                  href="https://www.instagram.com/shahzaibzaman.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span>Instagram: @shahzaibzaman.official</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/20 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Rapid Response Time
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We review inbound inquiries continuously. Expect a personalized response within <strong>24 business hours</strong>.
              </p>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#060c23] border border-slate-200 dark:border-blue-500/25 p-8 sm:p-12 shadow-2xl">
            {formSent ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Message Dispatched!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your message has been routed to our team. We will get back to you at <strong>{formData.email}</strong> promptly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSent(false);
                    setFormData({ name: '', email: '', subject: 'General Question', message: '' });
                  }}
                  className="mt-4 px-6 py-2 rounded-full text-xs font-semibold bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fill in the form below and we will get back to you promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Full-Stack Technical Support">Full-Stack Technical Support</option>
                    <option value="Enterprise Consultation">Enterprise Consultation</option>
                    <option value="Feedback & Feature Request">Feedback &amp; Feature Request</option>
                    <option value="Partnership Proposal">Partnership Proposal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project, question, or inquiry in detail..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {errorMessage && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-500 hover:to-pink-400 shadow-xl shadow-purple-950/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
