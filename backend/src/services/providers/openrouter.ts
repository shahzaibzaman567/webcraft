import { env } from '../../config/env';
import { ProviderError } from '../../lib/errors';
import { AiRequest, AiTextResult, ProviderOperationArgs } from '../../types/ai';
import { postJson } from './http';

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

export async function callOpenRouter(
  args: ProviderOperationArgs & { request: AiRequest },
): Promise<AiTextResult> {
  const { apiKey, request } = args;
  const model = env.models.openrouter;
  const body = {
    model,
    messages: [
      { role: 'system', content: request.system },
      { role: 'user', content: request.user },
    ],
    temperature: request.temperature ?? 0.4,
    max_tokens: request.maxTokens ?? 8192,
    ...(request.jsonMode ? { response_format: { type: 'json_object' } } : {}),
  };

  const data = (await postJson(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      authorization: `Bearer ${apiKey}`,
      'http-referer': env.frontendUrl,
      'x-title': 'Webcraft AI Builder',
    },
    body,
  )) as ChatCompletionResponse;

  const text = data.choices?.[0]?.message?.content ?? '';
  if (!text.trim()) {
    throw new ProviderError(502, 'AI_EMPTY_RESPONSE', 'AI provider returned an empty response', {
      retryable: true,
      cooldownMs: 15_000,
    });
  }

  return { text, model };
}
