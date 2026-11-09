import crypto from 'node:crypto';
import { AiJob, AiJobInput, AiJobRecord, AiJobType } from '../models/AiJob';
import { log } from '../lib/logger';
import { inngest, isInngestEnabled } from '../inngest/client';
import { AI_CHAT_EVENT, AI_GENERATE_EVENT, AiJobEventData } from '../inngest/events';
import { performChat, performGenerate } from './aiGeneration';

export interface CreateAiJobInput {
  userEmail: string;
  type: AiJobType;
  input: AiJobInput;
}

export interface SerializedAiJob {
  id: string;
  type: AiJobType;
  status: AiJobRecord['status'];
  generationId?: string;
  result?: AiJobRecord['result'];
  error?: string;
  attempts: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

function jobError(error: unknown): string {
  return error instanceof Error ? error.message : 'The AI job failed';
}

export function serializeAiJob(job: AiJobRecord): SerializedAiJob {
  return {
    id: job.id,
    type: job.type,
    status: job.status,
    generationId: job.generationId,
    result: job.result,
    error: job.error,
    attempts: job.attempts,
    createdAt: new Date(job.createdAt ?? Date.now()).toISOString(),
    updatedAt: new Date(job.updatedAt ?? Date.now()).toISOString(),
    startedAt: job.startedAt ? new Date(job.startedAt).toISOString() : undefined,
    completedAt: job.completedAt ? new Date(job.completedAt).toISOString() : undefined,
  };
}

export async function createAiJob(input: CreateAiJobInput): Promise<AiJobRecord> {
  const id = `job_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const generationId =
    input.type === 'generate'
      ? `proj_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`
      : undefined;

  const job = await AiJob.create({
    id,
    userEmail: input.userEmail,
    type: input.type,
    status: 'queued',
    input: input.input,
    generationId,
    attempts: 0,
  });

  return job.toObject() as AiJobRecord;
}

export async function enqueueAiJob(job: AiJobRecord): Promise<void> {
  const eventName = job.type === 'generate' ? AI_GENERATE_EVENT : AI_CHAT_EVENT;
  const data: AiJobEventData = { jobId: job.id, userEmail: job.userEmail };

  if (isInngestEnabled()) {
    try {
      const sent = await inngest.send({ name: eventName, data });
      const runId = sent.ids?.[0];
      if (runId) {
        await AiJob.updateOne({ id: job.id }, { $set: { inngestRunId: runId } });
      }
      return;
    } catch (error) {
      log('warn', 'inngest_send_failed', {
        jobId: job.id,
        message: jobError(error),
      });
    }
  }

  setImmediate(() => {
    void processAiJob(job.id, true).catch((error: unknown) => {
      log('error', 'local_ai_job_failed', {
        jobId: job.id,
        message: jobError(error),
      });
    });
  });
}

export async function processAiJob(jobId: string, markFailure = false): Promise<void> {
  const job = await AiJob.findOneAndUpdate(
    { id: jobId, status: 'queued' },
    {
      $set: { status: 'running', startedAt: new Date() },
      $inc: { attempts: 1 },
    },
    { new: true },
  ).lean();

  if (!job) {
    const current = await AiJob.findOne({ id: jobId }).select('status').lean();
    if (!current || current.status === 'completed' || current.status === 'failed') {
      return;
    }

    const error = new Error('The AI job is already running');
    if (markFailure) {
      await failAiJob(jobId, error);
    }
    throw error;
  }

  try {
    if (job.type === 'generate') {
      const { data, meta } = await performGenerate({
        userEmail: job.userEmail,
        prompt: job.input.prompt,
        projectName: job.input.projectName,
        framework: job.input.framework,
        existingFiles: job.input.existingFiles,
        generationId: job.generationId,
      });
      await AiJob.updateOne(
        { id: jobId },
        {
          $set: {
            status: 'completed',
            result: { data, meta },
            completedAt: new Date(),
          },
          $unset: { error: 1 },
        },
      );
      return;
    }

    const { data, meta } = await performChat({
      userEmail: job.userEmail,
      prompt: job.input.prompt,
      projectId: job.input.projectId,
      existingFiles: job.input.existingFiles ?? [],
      requestTimestamp: job.createdAt ? new Date(job.createdAt).getTime() : undefined,
    });
    await AiJob.updateOne(
      { id: jobId },
      {
        $set: {
          status: 'completed',
          result: { data, meta },
          completedAt: new Date(),
        },
        $unset: { error: 1 },
      },
    );
  } catch (error) {
    if (markFailure) {
      await failAiJob(jobId, error);
    } else {
      await AiJob.updateOne(
        { id: jobId, status: 'running' },
        {
          $set: { status: 'queued' },
          $unset: { error: 1, startedAt: 1 },
        },
      );
    }
    throw error;
  }
}

export async function failAiJob(jobId: string, error: unknown): Promise<void> {
  await AiJob.updateOne(
    { id: jobId, status: { $ne: 'completed' } },
    {
      $set: {
        status: 'failed',
        error: jobError(error),
        completedAt: new Date(),
      },
    },
  );
}
