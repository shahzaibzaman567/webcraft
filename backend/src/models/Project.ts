import { Schema, model } from 'mongoose';

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface ProjectPrompt {
  role: string;
  content: string;
  timestamp: number;
}

export interface ProjectRecord {
  id: string;
  userId?: Schema.Types.ObjectId;
  userEmail?: string;
  name: string;
  description?: string;
  framework: string;
  status: 'building' | 'ready' | 'error';
  files: ProjectFile[];
  prompts: ProjectPrompt[];
  thumbnail?: string;
  exportsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const fileSchema = new Schema<ProjectFile>(
  {
    path: { type: String, required: true },
    content: { type: String, default: '' },
    language: { type: String, default: 'text' },
  },
  { _id: false },
);

const promptSchema = new Schema<ProjectPrompt>(
  {
    role: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, default: () => Date.now() },
  },
  { _id: false },
);

const projectSchema = new Schema<ProjectRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    userEmail: { type: String, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    framework: { type: String, default: 'react' },
    status: { type: String, enum: ['building', 'ready', 'error'], default: 'ready' },
    files: { type: [fileSchema], default: [] },
    prompts: { type: [promptSchema], default: [] },
    thumbnail: { type: String, default: '' },
    exportsCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, collection: 'projects', versionKey: false },
);

projectSchema.index({ createdAt: -1 });

export const Project = model<ProjectRecord>('Project', projectSchema);
