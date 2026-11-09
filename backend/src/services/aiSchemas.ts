import { z } from 'zod';
import { MAX_FILE_CHARS, MAX_FILES } from '../utils/files';

const fileSchema = z.object({
  path: z.string().min(1).max(200),
  content: z.string().max(MAX_FILE_CHARS),
  language: z.string().min(1).max(30).optional().default('text'),
});

export const generateResponseSchema = z.object({
  projectName: z.string().min(1).max(100),
  description: z.string().max(2000).optional().default(''),
  files: z.array(fileSchema).min(1).max(MAX_FILES),
  setup: z
    .object({
      install: z.array(z.string().max(200)).max(20).optional(),
      dev: z.string().max(200).optional(),
      build: z.string().max(200).optional(),
    })
    .optional(),
  notes: z.array(z.string().max(300)).max(20).optional(),
});

export const chatResponseSchema = z.object({
  summary: z.string().min(1).max(2000),
  files: z
    .array(
      z.object({
        path: z.string().min(1).max(200),
        content: z.string().max(MAX_FILE_CHARS).optional(),
        language: z.string().min(1).max(30).optional().default('text'),
        action: z.enum(['create', 'update', 'delete']).optional(),
      }),
    )
    .max(MAX_FILES),
});

export type GenerateResponse = z.infer<typeof generateResponseSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
