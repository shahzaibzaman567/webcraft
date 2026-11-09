import { Schema, model } from 'mongoose';

export type ErrorLevel = 'warning' | 'error' | 'critical';
export type ErrorStatus = 'unresolved' | 'resolved';

export interface ErrorLogRecord {
  timestamp: Date;
  level: ErrorLevel;
  service: string;
  endpoint: string;
  message: string;
  status: ErrorStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const errorLogSchema = new Schema<ErrorLogRecord>(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    level: { type: String, enum: ['warning', 'error', 'critical'], default: 'error' },
    service: { type: String, required: true, trim: true },
    endpoint: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['unresolved', 'resolved'], default: 'unresolved', index: true },
  },
  { timestamps: true, collection: 'error_logs', versionKey: false },
);

errorLogSchema.index({ timestamp: -1 });

export const ErrorLog = model<ErrorLogRecord>('ErrorLog', errorLogSchema);
