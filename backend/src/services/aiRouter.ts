import { ZodType } from 'zod';
import { AiRequest, AiTextResult, FailoverResult } from '../types/ai';
import { ProviderId } from '../types/keys';
import { validateJsonResponse } from './jsonParser';
import { keyPoolManager } from './keyPoolManager';
import { callGemini } from './providers/gemini';
import { callGroq } from './providers/groq';
import { callOpenRouter } from './providers/openrouter';
import { callTogetherImage } from './providers/together';

const TEXT_PROVIDERS: ProviderId[] = ['gemini', 'groq', 'openrouter'];

type TextCaller = (args: {
  apiKey: string;
  provider: ProviderId;
  keyId: string;
  request: AiRequest;
}) => Promise<AiTextResult>;

const callers: Record<'gemini' | 'groq' | 'openrouter', TextCaller> = {
  gemini: callGemini,
  groq: callGroq,
  openrouter: callOpenRouter,
};

export interface AiTextResponse extends AiTextResult {
  provider: ProviderId;
  attempts: number;
  latencyMs: number;
}

export async function generateAiText(
  request: AiRequest,
  endpoint = '/api/ai',
): Promise<AiTextResponse> {
  const response: FailoverResult<AiTextResult> = await keyPoolManager.executeWithFailover(
    TEXT_PROVIDERS,
    ({ apiKey, provider, keyId }) => {
      const caller = callers[provider as 'gemini' | 'groq' | 'openrouter'];
      return caller({ apiKey, provider, keyId, request });
    },
    { endpoint },
  );

  return {
    text: response.result.text,
    model: response.result.model,
    provider: response.provider,
    attempts: response.attempts,
    latencyMs: response.latencyMs,
  };
}

export async function generateAiJson<T>(
  request: AiRequest,
  schema: ZodType<T>,
  endpoint = '/api/ai',
): Promise<{ data: T; provider: ProviderId; model: string; attempts: number; latencyMs: number }> {
  const response = await generateAiText({ ...request, jsonMode: true }, endpoint);
  const data = validateJsonResponse(response.text, schema);
  return {
    data,
    provider: response.provider,
    model: response.model,
    attempts: response.attempts,
    latencyMs: response.latencyMs,
  };
}

export async function generateTogetherImages(
  input: {
    prompt: string;
    width: number;
    height: number;
    count: number;
    seed?: number;
  },
  endpoint = '/api/image',
): Promise<{ urls: string[]; model: string; provider: ProviderId; latencyMs: number }> {
  const response = await keyPoolManager.executeWithFailover(
    ['together'],
    ({ apiKey, provider, keyId }) => callTogetherImage({ apiKey, provider, keyId, ...input }),
    { endpoint },
  );
  return {
    urls: response.result.urls,
    model: response.result.model,
    provider: response.provider,
    latencyMs: response.latencyMs,
  };
}
