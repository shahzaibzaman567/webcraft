export const AI_GENERATE_EVENT = 'webcraft/ai.generate';
export const AI_CHAT_EVENT = 'webcraft/ai.chat';

export interface AiJobEventData {
  jobId: string;
  userEmail: string;
}
