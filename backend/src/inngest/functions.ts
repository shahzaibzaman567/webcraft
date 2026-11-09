import { inngest } from './client';
import { AI_CHAT_EVENT, AI_GENERATE_EVENT, AiJobEventData } from './events';
import { failAiJob, processAiJob } from '../services/aiJobs';

const generateProjectFunction = inngest.createFunction(
  {
    id: 'webcraft-ai-generate',
    name: 'Webcraft AI project generation',
    retries: 3,
    concurrency: { limit: 5 },
    triggers: [{ event: AI_GENERATE_EVENT }],
    onFailure: async ({ event, error }) => {
      const original = event.data.event?.data as AiJobEventData | undefined;
      if (original?.jobId) {
        await failAiJob(original.jobId, error);
      }
    },
  },
  async ({ event, step }) => {
    const data = event.data as AiJobEventData;
    if (!data.jobId) {
      throw new Error('Missing AI job id');
    }
    await step.run('process-ai-generation', async () => {
      await processAiJob(data.jobId, false);
      return { jobId: data.jobId };
    });
    return { jobId: data.jobId };
  },
);

const chatProjectFunction = inngest.createFunction(
  {
    id: 'webcraft-ai-chat',
    name: 'Webcraft AI project chat',
    retries: 3,
    concurrency: { limit: 10 },
    triggers: [{ event: AI_CHAT_EVENT }],
    onFailure: async ({ event, error }) => {
      const original = event.data.event?.data as AiJobEventData | undefined;
      if (original?.jobId) {
        await failAiJob(original.jobId, error);
      }
    },
  },
  async ({ event, step }) => {
    const data = event.data as AiJobEventData;
    if (!data.jobId) {
      throw new Error('Missing AI job id');
    }
    await step.run('process-ai-chat', async () => {
      await processAiJob(data.jobId, false);
      return { jobId: data.jobId };
    });
    return { jobId: data.jobId };
  },
);

export const inngestFunctions = [generateProjectFunction, chatProjectFunction];
