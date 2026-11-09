import { env } from '../../config/env';
import { ProviderError } from '../../lib/errors';
import { ProviderOperationArgs } from '../../types/ai';
import { postJson } from './http';

interface TogetherImageResponse {
  data?: Array<{ url?: string; b64_json?: string }>;
}

export async function callTogetherImage(
  args: ProviderOperationArgs & {
    prompt: string;
    width: number;
    height: number;
    count: number;
    seed?: number;
  },
): Promise<{ urls: string[]; model: string }> {
  const { apiKey, prompt, width, height, count, seed } = args;
  const model = env.models.togetherImage;
  const body = {
    model,
    prompt,
    width,
    height,
    steps: 4,
    n: count,
    response_format: 'url',
    ...(seed === undefined ? {} : { seed }),
  };

  const data = (await postJson(
    'https://api.together.xyz/v1/images/generations',
    { authorization: `Bearer ${apiKey}` },
    body,
  )) as TogetherImageResponse;

  const urls = (data.data ?? [])
    .map((item) => item.url)
    .filter((url): url is string => typeof url === 'string' && url.length > 0);

  if (urls.length === 0) {
    throw new ProviderError(502, 'AI_EMPTY_RESPONSE', 'Image provider returned no images', {
      retryable: true,
      cooldownMs: 15_000,
    });
  }

  return { urls, model };
}
