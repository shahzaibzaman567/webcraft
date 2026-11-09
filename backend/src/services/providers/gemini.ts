import { env } from '../../config/env';
import { ProviderError } from '../../lib/errors';
import { AiRequest, AiTextResult, ProviderOperationArgs } from '../../types/ai';
import { postJson } from './http';

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
}

export async function callGemini(
  args: ProviderOperationArgs & { request: AiRequest },
): Promise<AiTextResult> {
  const { apiKey, request } = args;
  const model = env.models.gemini;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const body = {
    systemInstruction: { parts: [{ text: request.system }] },
    contents: [{ role: 'user', parts: [{ text: request.user }] }],
    generationConfig: {
      temperature: request.temperature ?? 0.4,
      maxOutputTokens: request.maxTokens ?? 8192,
      ...(request.jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  };

  const data = (await postJson(url, { 'x-goog-api-key': apiKey }, body)) as GeminiResponse;

  if (data.promptFeedback?.blockReason) {
    throw new ProviderError(422, 'AI_BLOCKED', 'The AI refused to process this request', {
      retryable: false,
      fatal: true,
    });
  }

  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
  if (!text.trim()) {
    if (candidate?.finishReason === 'SAFETY') {
      throw new ProviderError(422, 'AI_BLOCKED', 'The AI refused to process this request', {
        retryable: false,
        fatal: true,
      });
    }
    throw new ProviderError(502, 'AI_EMPTY_RESPONSE', 'AI provider returned an empty response', {
      retryable: true,
      cooldownMs: 15_000,
    });
  }

  return { text, model };
}
