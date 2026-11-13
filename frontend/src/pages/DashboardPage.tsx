import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUp,
  ChevronDown,
  Compass,
  Hammer,
  Mic,
  Plus,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';
import { useAppShell } from '../components/AppShell';
import { triggerPopunder } from '../lib/ads';
import { usePublicSettings } from '../hooks/usePublicSettings';
import { AdsterraBanner } from '../components/AdsterraBanner';

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

// 4 clean, emoji-free, 2-line descriptive prompts (per user instruction)
const QUICK_PROMPTS = [
  'Build a Netflix-style streaming platform with movie hero trailers, responsive category carousels, video preview modals and smart search',
  'Build a comprehensive SaaS admin dashboard with real-time analytics charts, revenue metric cards, user management tables and activity feeds',
  'Build an interactive Kanban project board with drag-and-drop task cards, customizable sprint columns, priority tags and team assignments',
  'Build a modern cloud file manager with file explorer view, folder tree hierarchy, instant search and storage quota breakdown',
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDark } = useAppShell();
  const { settings } = usePublicSettings();

  const [promptInput, setPromptInput] = useState('');
  const [mode, setMode] = useState<BuildMode>('Build');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimVoiceText, setInterimVoiceText] = useState('');
  const [attachments, setAttachments] = useState<PromptAttachment[]>([]);
  const [attachmentError, setAttachmentError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // ChatGPT-style voice recognition with wave visualizer
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      // User clicked again -> Stop and commit text
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    setIsListening(true);
    setInterimVoiceText('');

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      const currentSpeech = (finalTranscript || interim).trim();
      setInterimVoiceText(currentSpeech);

      if (finalTranscript.trim()) {
        setPromptInput((prev) => {
          const base = prev.trim();
          return base ? `${base} ${finalTranscript.trim()}` : finalTranscript.trim();
        });
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (interimVoiceText.trim()) {
        setPromptInput((prev) => {
          const base = prev.trim();
          const spoken = interimVoiceText.trim();
          if (base.includes(spoken)) return base;
          return base ? `${base} ${spoken}` : spoken;
        });
      }
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    };

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

  const firstName = user?.name ? user.name.split(' ')[0] : 'Shahzaib';
  const modeMeta = MODE_META[mode];
  const ModeIcon = modeMeta.icon;

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8 sm:px-6">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[450px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-500/12 via-purple-500/10 to-pink-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
        {/* Top Feature Pill (Lovable Style) */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-cyan-300 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          <span>Build full-stack web applications with AI</span>
        </div>

        {/* Clean Heading (Lovable Style: "Ready to build, Shahzaib?") */}
        <h1 className={`mb-6 text-center text-3xl font-extrabold tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Ready to build, {firstName}?
        </h1>

        {/* Lovable-Style Compact Prompt Box */}
        <form
          onSubmit={handlePromptGenerate}
          className={`w-full rounded-2xl sm:rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'border-white/10 bg-[#0c101a] shadow-black/40 focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/20'
              : 'border-slate-200 bg-white shadow-slate-200/60 focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/20'
          }`}
        >
          <div className="p-3.5 sm:p-4">
            {isListening ? (
              /* ChatGPT-style live wave animation */
              <div className="flex min-h-[64px] flex-col items-center justify-center py-2 space-y-2">
                <div className="flex items-center gap-1.5 h-8">
                  <span className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-blue-500 animate-soundwave" style={{ height: '24px', animationDelay: '0ms' }} />
                  <span className="w-1.5 rounded-full bg-gradient-to-t from-blue-500 to-indigo-500 animate-soundwave" style={{ height: '36px', animationDelay: '120ms' }} />
                  <span className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-purple-500 animate-soundwave" style={{ height: '48px', animationDelay: '240ms' }} />
                  <span className="w-1.5 rounded-full bg-gradient-to-t from-purple-500 to-pink-500 animate-soundwave" style={{ height: '30px', animationDelay: '360ms' }} />
                  <span className="w-1.5 rounded-full bg-gradient-to-t from-pink-500 to-rose-500 animate-soundwave" style={{ height: '52px', animationDelay: '180ms' }} />
                  <span className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-blue-500 animate-soundwave" style={{ height: '34px', animationDelay: '300ms' }} />
                  <span className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-blue-400 animate-soundwave" style={{ height: '20px', animationDelay: '80ms' }} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-blue-500 dark:text-cyan-400 animate-pulse">
                    {interimVoiceText || 'Listening... speak your prompt, click mic again to finish'}
                  </p>
                </div>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={promptInput}
                onChange={(event) => setPromptInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Webcraft to build..."
                rows={2}
                className={`w-full resize-none bg-transparent text-sm leading-relaxed outline-none sm:text-base ${
                  isDark
                    ? 'text-white placeholder:text-slate-500'
                    : 'text-slate-900 placeholder:text-slate-400'
                }`}
              />
            )}

            {/* Attached files preview */}
            {attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-white/5">
                {attachments.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300"
                  >
                    <span className="max-w-40 truncate">{file.name}</span>
                    <span className="text-blue-400">{Math.max(1, Math.round(file.size / 1024))} KB</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))
                      }
                      className="rounded-full p-0.5 hover:bg-blue-500/20 cursor-pointer"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {attachmentError && (
              <p className="mt-1 text-[11px] font-medium text-rose-500">{attachmentError}</p>
            )}
          </div>

          {/* Lovable-Style Bottom Toolbar: "+" on Left, Mode & Mic & Submit on Right */}
          <div className="flex items-center justify-between px-3.5 pb-3 sm:px-4">
            {/* Left: Plus attachment button */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title="Attach a text or code file"
                aria-label="Attach file"
              >
                <Plus className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.md,.markdown,.json,.js,.jsx,.ts,.tsx,.css,.scss,.html,.sql,.env,.yml,.yaml,.csv,text/*"
                onChange={(event) => void handleFiles(event.target.files)}
                className="hidden"
              />
            </div>

            {/* Right: Mode dropdown + Mic + Submit */}
            <div className="flex items-center gap-2">
              {/* Build mode selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModeDropdown((open) => !open)}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    isDark
                      ? 'text-slate-300 hover:bg-white/10'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ModeIcon className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-xs">{mode}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {showModeDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowModeDropdown(false)} />
                    <div
                      className={`absolute bottom-full right-0 z-50 mb-2 w-44 rounded-xl border p-1 shadow-2xl ${
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
                            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                              mode === item
                                ? 'bg-blue-600 text-white font-bold'
                                : isDark
                                  ? 'text-slate-200 hover:bg-white/5'
                                  : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span>{meta.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Mic / Voice with active pulse */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40 ring-2 ring-rose-400/50 animate-pulse'
                    : isDark
                      ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Click to speak'}
                aria-label="Voice input"
              >
                <Mic className="h-3.5 w-3.5" />
              </button>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!promptInput.trim()}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                  promptInput.trim()
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 hover:bg-blue-500 hover:scale-105 active:scale-95 cursor-pointer'
                    : isDark
                      ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                aria-label="Generate"
              >
                <ArrowUp className="h-3.5 w-3.5 font-bold" />
              </button>
            </div>
          </div>
        </form>

        {/* 4 Detailed 2-Line Default Prompts (No Emojis) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
          {QUICK_PROMPTS.map((promptText, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setPromptInput(promptText);
                textareaRef.current?.focus();
              }}
              className={`flex flex-col text-left rounded-xl border p-3 text-xs leading-relaxed transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-[#0c101a]/70 text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-500/40 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
              }`}
            >
              <span className="line-clamp-2 font-medium">{promptText}</span>
            </button>
          ))}
        </div>

        {/* Adsterra Banner Ad (Pure banner, NO background box, NO "sponsored" wrapper) */}
        <div className="mt-8 flex w-full justify-center">
          <AdsterraBanner placement="dashboard" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
