import { Schema, model } from 'mongoose';

export interface UserRecord {
  clerkId?: string;
  email: string;
  name: string;
  username?: string;
  workspaceName?: string;
  avatar?: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  projectsCount: number;
  lastActive: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<UserRecord>(
  {
    clerkId: { type: String, trim: true, index: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    username: { type: String, trim: true, lowercase: true, default: '' },
    workspaceName: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    projectsCount: { type: Number, default: 0, min: 0 },
    lastActive: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true, collection: 'users', versionKey: false },
);

export const User = model<UserRecord>('User', userSchema);
