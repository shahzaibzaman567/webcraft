import { z } from 'zod';
import { MAX_FILE_CHARS, MAX_FILES } from '../utils/files';

const incomingFileSchema = z.object({
  path: z.string().min(1).max(200),
  content: z.string().max(MAX_FILE_CHARS),
  language: z.string().max(30).optional(),
});

const incomingPromptSchema = z.object({
  role: z.string().min(1).max(30),
  content: z.string().min(1).max(8000),
  timestamp: z.number().int().optional(),
});

export const generateRequestSchema = z.object({
  prompt: z.string().min(3).max(4000),
  projectName: z.string().min(1).max(100).optional(),
  framework: z.literal('react').optional(),
  existingFiles: z.array(incomingFileSchema).max(MAX_FILES).optional(),
});

export const chatRequestSchema = z.object({
  prompt: z.string().min(3).max(4000),
  projectId: z.string().max(100).optional(),
  existingFiles: z.array(incomingFileSchema).max(MAX_FILES).optional(),
});

export const imageRequestSchema = z.object({
  prompt: z.string().min(3).max(1000),
  width: z.number().int().min(128).max(1536).optional(),
  height: z.number().int().min(128).max(1536).optional(),
  count: z.number().int().min(1).max(4).optional(),
  seed: z.number().int().min(0).max(2_147_483_647).optional(),
  engine: z.enum(['pollinations', 'together']).optional(),
});

export const exportRequestSchema = z.object({
  projectName: z.string().max(100).optional(),
  files: z.array(incomingFileSchema).min(1).max(MAX_FILES),
});

export const addKeyRequestSchema = z.object({
  provider: z.enum(['gemini', 'groq', 'openrouter', 'together']),
  label: z.string().min(1).max(80),
  key: z.string().min(8).max(512),
});

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  framework: z.string().max(30).optional(),
  status: z.enum(['building', 'ready', 'error']).optional(),
  files: z.array(incomingFileSchema).max(MAX_FILES).optional(),
  prompts: z.array(incomingPromptSchema).max(100).optional(),
  thumbnail: z.string().max(1_000_000).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const updateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9_-]+$/i, 'Username can only contain letters, numbers, underscores and hyphens')
    .optional(),
  workspaceName: z.string().min(1).max(100).optional(),
  avatar: z.string().max(500_000).optional(),
});

export const projectIdParamsSchema = z.object({
  id: z.string().min(1).max(100).regex(/^[A-Za-z0-9_-]+$/),
});

export const jobIdParamsSchema = z.object({
  id: z.string().min(1).max(100).regex(/^[A-Za-z0-9_-]+$/),
});

export const contactRequestSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  subject: z.string().max(150).optional(),
  message: z.string().min(5).max(5000),
});

export const integrationServiceParamsSchema = z.object({
  service: z.enum(['mongodb', 'supabase', 'vercel', 'netlify']),
});

export const connectIntegrationSchema = z.object({
  uri: z.string().min(10).max(2000).optional(),
  projectUrl: z.string().min(8).max(500).optional(),
  apiKey: z.string().min(8).max(2000).optional(),
  token: z.string().min(8).max(2000).optional(),
  clusterName: z.string().min(1).max(100).optional(),
  databaseName: z.string().min(1).max(100).optional(),
  region: z.string().min(1).max(100).optional(),
  organization: z.string().min(1).max(150).optional(),
  teamSlug: z.string().min(1).max(100).optional(),
  accountName: z.string().min(1).max(150).optional(),
}).strict();
