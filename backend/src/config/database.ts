import mongoose from 'mongoose';
import { env } from './env';
import { log } from '../lib/logger';

export async function connectDB(uri: string = env.mongodbUri): Promise<void> {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10_000,
      maxPoolSize: 10,
    });
    log('info', 'mongodb_connected', { database: mongoose.connection.name });
  } catch (error) {
    const name = error instanceof Error ? error.name : 'UnknownError';
    log('error', 'mongodb_connection_failed', { name });
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  log('info', 'mongodb_disconnected');
}

export function isDatabaseReady(): boolean {
  return mongoose.connection.readyState === 1;
}
