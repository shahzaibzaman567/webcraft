import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Compass,
  Hammer,
  Mic,
  Paperclip,
  Wand2,
  X,
} from 'lucide-react';
import { useAppShell } from '../components/AppShell';
import { triggerPopunder } from '../lib/ads';
import { usePublicSettings } from '../hooks/usePublicSettings';

type BuildMode = 'Build' | 'Fix' | 'Plan';

const MODE_META: Record<
  BuildMode,
  { label: string; description: string; icon: React.ElementType }
> = {
  Build: { label: 'Build', description: 'Create a new app', icon: Hammer },
  Fix: { label: 'Fix', description: 'Repair the current project', icon: Wand2 },
  Plan: { label: 'Plan', description: 'Plan before building', icon: Compass },
};

const MAX_ATTACHMENT_BYTES = 200_000;
const TEXT_FILE_PATTERN = /\.(txt|md|markdown|json|js|jsx|ts|tsx|css|scss|html|sql|env|yml|yaml|csv)$/i;

interface PromptAttachment {
  name: string;
  content: string;
  size: number;
}

const QUICK_PROMPTS = [
  { emoji: '🎬', label: 'Build a Netflix clone' },
  { emoji: '📊', label: 'Build an admin dashboard' },
  { emoji: '📋', label: 'Build a kanban board' },
  { emoji: '📁', label: 'Build a file manager' },
  { emoji: '▶️', label: 'Build a YouTube clone' },
  { emoji: '🏪', label: 'Build a store page' },
  { emoji: '🏠', label: 'Build an Airbnb clone' },
  { emoji: '🎵', label: 'Build a Spotify clone' },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useAppShell();
  const { settings } = usePublicSettings();

  const [promptInput, setPromptInput] = useState('');
  const [mode, setMode] = useState<BuildMode>('Build');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState<PromptAttachment[]>([]);
  const [attachmentError, setAttachmentError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setAttachmentError('Voice input is not supported in this browser. Use Chrome or Edge.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPromptInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setAttachmentError('');
    const next = [...attachments];

    for (const file of Array.from(fileList)) {
      if (file.size > MAX_ATTACHMENT_BYTES) {
        setAttachmentError(`${file.name} is larger than 200 KB. Please attach a smaller text file.`);
        continue;
      }
      const isText = TEXT_FILE_PATTERN.test(file.name) || file.type.startsWith('text/');
      if (!isText) {
        setAttachmentError(`${file.name} is not a text/code file. Attach .txt, .md, .json, .ts, .js, .css, or .html files.`);
        continue;
      }
      const content = await file.text();
      next.push({ name: file.name, content, size: file.size });
    }

    setAttachments(next);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePromptGenerate = (event?: React.FormEvent) => {
    event?.preventDefault();
    const basePrompt = promptInput.trim();
    if (!basePrompt) return;

    let attachmentsParam = '';
    if (attachments.length > 0) {
      const attachmentId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(
        `webcraft_attachment_${attachmentId}`,
        JSON.stringify(attachments.map(({ name, content }) => ({ name, content }))),
      );
      attachmentsParam = `&attachments=${encodeURIComponent(attachmentId)}`;
    }

    triggerPopunder(settings, 'dashboard_generate');
    navigate(
      `/builder?prompt=${encodeURIComponent(basePrompt)}&mode=${encodeURIComponent(mode)}${attachmentsParam}`,
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handlePromptGenerate();
    }
  };

  const modeMeta = MODE_META[mode];
  const ModeIcon = modeMeta.icon;

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center">
        {/* Top Logo + Brand Hero */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 p-0.5 shadow-xl shadow-blue-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#07090e]">
              <img
                src="/assets/logo.png"
                alt="Webcraft"
                className="h-8 w-auto object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              />
            </div>
          </div>
          <h1 className={`text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Build Something with Webcraft
          </h1>
          <p className={`mt-2.5 text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Create apps and websites by chatting with AI
          </p>
        </div>

        {/* Large Prompt Input Card (KaifGenUI / Builder style) */}
        <form
          onSubmit={handlePromptGenerate}
          className={`w-full overflow-hidden rounded-2xl border shadow-2xl transition-all ${
            isDark
              ? 'border-white/10 bg-[#0f1420]/95 shadow-blue-500/5 focus-within:border-blue-500/50'
              : 'border-slate-200 bg-white shadow-slate-200/50 focus-within:border-blue-500/50'
          }`}
        >
          <div className="p-4 sm:p-6">
            <textarea
              ref={textareaRef}
              value={promptInput}
              onChange={(event) => setPromptInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What would you like to build?"
              rows={4}
              className={`w-full resize-none bg-transparent text-sm leading-relaxed outline-none sm:text-base ${
                isDark
                  ? 'text-white placeholder:text-slate-500'
                  : 'text-slate-900 placeholder:text-slate-400'
              }`}
            />

            {/* Attached files preview */}
            {attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
                {attachments.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300"
                  >
                    <span className="max-w-40 truncate">{file.name}</span>
                    <span className="text-blue-400">{Math.max(1, Math.round(file.size / 1024))} KB</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))
                      }
                      className="rounded-full p-0.5 hover:bg-blue-500/20"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {attachmentError && (
              <p className="mt-2 text-xs font-medium text-rose-500">{attachmentError}</p>
            )}
          </div>

          {/* Bottom Card Toolbar */}
          <div
            className={`flex items-center justify-between border-t px-4 py-3 sm:px-6 ${
              isDark ? 'border-white/10 bg-[#0c101a]/80' : 'border-slate-100 bg-slate-50/80'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Paperclip attach file */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-lg p-2 transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title="Attach a text or code file"
                aria-label="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.md,.markdown,.json,.js,.jsx,.ts,.tsx,.css,.scss,.html,.sql,.env,.yml,.yaml,.csv,text/*"
                onChange={(event) => void handleFiles(event.target.files)}
                className="hidden"
              />

              {/* Mode selector (Build / Fix / Plan) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModeDropdown((open) => !open)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    isDark
                      ? 'bg-white/10 text-slate-200 hover:bg-white/15'
                      : 'bg-slate-200/80 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ModeIcon className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold uppercase">{mode}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {showModeDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowModeDropdown(false)} />
                    <div
                      className={`absolute bottom-full left-0 z-50 mb-2 w-48 rounded-xl border p-1 shadow-2xl ${
                        isDark ? 'border-white/10 bg-[#0f1420]' : 'border-slate-200 bg-white'
                      }`}
                    >
                      {(Object.keys(MODE_META) as BuildMode[]).map((item) => {
                        const meta = MODE_META[item];
                        const Icon = meta.icon;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setMode(item);
                              setShowModeDropdown(false);
                            }}
                            className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                              mode === item
                                ? 'bg-blue-600 text-white'
                                : isDark
                                  ? 'text-slate-200 hover:bg-white/5'
                                  : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span>
                              <span className="block text-xs font-bold">{meta.label}</span>
                              <span
                                className={`block text-[10px] ${
                                  mode === item
                                    ? 'text-blue-100'
                                    : isDark
                                      ? 'text-slate-400'
                                      : 'text-slate-500'
                                }`}
                              >
                                {meta.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Voice recognition */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`rounded-lg p-2 transition-colors ${
                  isListening
                    ? 'animate-pulse bg-rose-500 text-white'
                    : isDark
                      ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                      : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title={isListening ? 'Listening... Click to stop' : 'Click to speak your prompt'}
                aria-label="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>

              {/* Enter hint */}
              <span
                className={`hidden items-center gap-1.5 text-xs sm:flex ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <kbd
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Enter
                </kbd>
                <span>to submit</span>
              </span>
            </div>

            {/* Submit arrow button */}
            <button
              type="submit"
              disabled={!promptInput.trim()}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                promptInput.trim()
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 hover:bg-blue-500 hover:scale-105 active:scale-95 cursor-pointer'
                  : isDark
                    ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              aria-label="Generate project"
            >
              <ArrowUp className="h-4 w-4 font-bold" />
            </button>
          </div>
        </form>

        {/* Default Quick Prompt Chips (KaifGenUI style) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              onClick={() => {
                setPromptInput(prompt.label);
                textareaRef.current?.focus();
              }}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-[#0f1420]/80 text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white shadow-lg shadow-black/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-500/40 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
              }`}
            >
              <span className="text-sm">{prompt.emoji}</span>
              <span>{prompt.label}</span>
            </button>
          ))}
        </div>

        <Link
          to="/projects"
          className={`mt-6 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
            isDark
              ? 'border-white/10 text-slate-300 hover:border-blue-500/40 hover:bg-white/5 hover:text-white'
              : 'border-slate-200 text-slate-600 hover:border-blue-500/40 hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          View all projects
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
