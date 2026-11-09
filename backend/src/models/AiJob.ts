import { Schema, model } from 'mongoose';

export type AiJobType = 'generate' | 'chat';
export type AiJobStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface AiJobFile {
  path: string;
  content: string;
  language: string;
}

export interface AiJobInput {
  prompt: string;
  projectName?: string;
  framework?: string;
  projectId?: string;
  existingFiles?: AiJobFile[];
}

export interface AiJobMeta {
  provider?: string;
  model?: string;
  attempts?: number;
  latencyMs?: number;
}

export interface AiJobResult {
  data: Record<string, unknown>;
  meta?: AiJobMeta;
}

export interface AiJobRecord {
  id: string;
  userEmail: string;
  type: AiJobType;
  status: AiJobStatus;
  input: AiJobInput;
  generationId?: string;
  result?: AiJobResult;
  error?: string;
  inngestRunId?: string;
  attempts: number;
  startedAt?: Date;
  completedAt?: Date;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const fileSchema = new Schema<AiJobFile>(
  {
    path: { type: String, required: true },
    content: { type: String, default: '' },
    language: { type: String, default: 'text' },
  },
  { _id: false },
);

const jobSchema = new Schema<AiJobRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    type: { type: String, enum: ['generate', 'chat'], required: true },
    status: {
      type: String,
      enum: ['queued', 'running', 'completed', 'failed'],
      default: 'queued',
      index: true,
    },
    input: {
      prompt: { type: String, required: true },
      projectName: { type: String },
      framework: { type: String },
      projectId: { type: String },
      existingFiles: { type: [fileSchema], default: undefined },
    },
    generationId: { type: String },
    result: { type: Schema.Types.Mixed },
    error: { type: String },
    inngestRunId: { type: String },
    attempts: { type: Number, default: 0, min: 0 },
    startedAt: { type: Date },
    completedAt: { type: Date },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true, collection: 'ai_jobs', versionKey: false },
);

jobSchema.index({ createdAt: -1 });
jobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AiJob = model<AiJobRecord>('AiJob', jobSchema);
