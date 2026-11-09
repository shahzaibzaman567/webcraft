import crypto from 'node:crypto';
import { errors } from '../lib/errors';
import { Project, ProjectRecord } from '../models/Project';
import { User } from '../models/User';
import { ChatFileChange, GeneratedFile } from '../types/ai';
import { generateAiJson } from './aiRouter';
import { chatResponseSchema, generateResponseSchema } from './aiSchemas';
import { applyFileChanges, normalizeFiles } from './fileService';
import {
  CHAT_SYSTEM_PROMPT,
  GENERATION_SYSTEM_PROMPT,
  buildChatUserPrompt,
  buildGenerationUserPrompt,
} from './promptBuilder';
import { mirrorProject } from './supabaseMirror';
import { syncProjectCount } from './userService';
import { sanitizePrompt } from '../utils/sanitize';

export interface GenerateMeta {
  provider: string;
  model: string;
  attempts: number;
  latencyMs: number;
}

export interface GenerateData {
  generationId: string;
  projectName: string;
  description: string;
  files: GeneratedFile[];
  setup?: {
    install?: string[];
    dev?: string;
    build?: string;
  };
  notes?: string[];
}

export interface ChatData {
  projectId: string | null;
  summary: string;
  files: GeneratedFile[];
  changes: ChatFileChange[];
}

export interface GenerateInput {
  userEmail: string;
  prompt: string;
  projectName?: string;
  framework?: string;
  existingFiles?: GeneratedFile[];
  generationId?: string;
}

export interface ChatInput {
  userEmail: string;
  prompt: string;
  projectId?: string;
  existingFiles: GeneratedFile[];
  requestTimestamp?: number;
}

export async function performGenerate(
  input: GenerateInput,
): Promise<{ data: GenerateData; meta: GenerateMeta }> {
  const prompt = sanitizePrompt(input.prompt);
  const existingFiles = input.existingFiles ? normalizeFiles(input.existingFiles) : [];

  const response = await generateAiJson(
    {
      system: GENERATION_SYSTEM_PROMPT,
      user: buildGenerationUserPrompt(prompt, existingFiles),
      jsonMode: true,
      temperature: 0.35,
      maxTokens: 8192,
    },
    generateResponseSchema,
    '/api/generate',
  );

  const files = normalizeFiles(response.data.files);
  if (files.length === 0) {
    throw errors.badGateway('The AI did not return any project files');
  }

  const generationId =
    input.generationId ?? `proj_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const owner = await User.findOne({ email: input.userEmail }).select('_id').lean();
  const projectName =
    input.projectName?.trim() || response.data.projectName || 'AI Generated Project';
  const projectPayload = {
    id: generationId,
    userId: owner?._id,
    userEmail: input.userEmail,
    name: projectName,
    description: response.data.description || prompt,
    framework: input.framework || 'react',
    status: 'ready' as const,
    files: files.map((file) => ({
      path: file.path,
      content: file.content,
      language: file.language || 'tsx',
    })),
    prompts: [{ role: 'user', content: prompt, timestamp: Date.now() }],
    thumbnail: `https://image.pollinations.ai/prompt/${encodeURIComponent(
      response.data.projectName || 'modern web application',
    )}?width=800&height=500&nologo=true`,
    exportsCount: 0,
  };

  const project = await Project.findOneAndUpdate(
    { id: generationId },
    { $set: projectPayload },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  await User.updateOne({ email: input.userEmail }, { $set: { lastActive: new Date() } });
  await syncProjectCount(input.userEmail);
  await mirrorProject(project.toObject() as ProjectRecord);

  return {
    data: {
      generationId,
      projectName,
      description: response.data.description,
      files,
      setup: response.data.setup,
      notes: response.data.notes,
    },
    meta: {
      provider: response.provider,
      model: response.model,
      attempts: response.attempts,
      latencyMs: response.latencyMs,
    },
  };
}

export async function performChat(
  input: ChatInput,
): Promise<{ data: ChatData; meta: GenerateMeta }> {
  const prompt = sanitizePrompt(input.prompt);
  const existingFiles = normalizeFiles(input.existingFiles);
  if (existingFiles.length === 0) {
    throw errors.validation('existingFiles is required to apply iterative edits');
  }

  const response = await generateAiJson(
    {
      system: CHAT_SYSTEM_PROMPT,
      user: buildChatUserPrompt(prompt, existingFiles),
      jsonMode: true,
      temperature: 0.3,
      maxTokens: 8192,
    },
    chatResponseSchema,
    '/api/chat',
  );

  const merged = applyFileChanges(existingFiles, response.data.files);
  const requestTimestamp = input.requestTimestamp ?? Date.now();

  if (input.projectId) {
    const project = await Project.findOneAndUpdate(
      { id: input.projectId, userEmail: input.userEmail },
      {
        $set: {
          files: merged.files,
          status: 'ready',
          description: response.data.summary,
        },
        $addToSet: {
          prompts: {
            $each: [
              { role: 'user', content: prompt, timestamp: requestTimestamp },
              { role: 'assistant', content: response.data.summary, timestamp: requestTimestamp },
            ],
          },
        },
      },
      { new: true },
    );
    if (project) {
      await mirrorProject(project.toObject() as ProjectRecord);
    }
  }

  return {
    data: {
      projectId: input.projectId ?? null,
      summary: response.data.summary,
      files: merged.files,
      changes: merged.changes,
    },
    meta: {
      provider: response.provider,
      model: response.model,
      attempts: response.attempts,
      latencyMs: response.latencyMs,
    },
  };
}
