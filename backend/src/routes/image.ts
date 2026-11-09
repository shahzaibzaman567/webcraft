import { Router } from 'express';
import { log } from '../lib/logger';
import { asyncHandler } from '../middleware/asyncHandler';
import { imageLimiter } from '../middleware/rateLimiters';
import { requireUser } from '../middleware/requireUser';
import { validateBody } from '../middleware/validate';
import { generateTogetherImages } from '../services/aiRouter';
import { imageRequestSchema } from '../services/requestSchemas';
import { sanitizePrompt } from '../utils/sanitize';

const router = Router();

function pollinationsUrls(
  prompt: string,
  width: number,
  height: number,
  count: number,
  seed?: number,
): string[] {
  const baseSeed = seed ?? Math.floor(Math.random() * 1_000_000);
  return Array.from({ length: count }, (_, index) => {
    const params = new URLSearchParams({
      width: String(width),
      height: String(height),
      seed: String(baseSeed + index * 997),
      nologo: 'true',
      model: 'flux',
    });
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
  });
}

router.post('/', requireUser, imageLimiter, validateBody(imageRequestSchema), asyncHandler(async (req, res) => {
  const prompt = sanitizePrompt(req.body.prompt, 1000);
  const width = req.body.width ?? 1024;
  const height = req.body.height ?? 1024;
  const count = req.body.count ?? 1;
  const engine = req.body.engine ?? 'pollinations';
  const requestId = String(res.locals.requestId ?? '');

  if (engine === 'together') {
    try {
      const together = await generateTogetherImages(
        {
          prompt,
          width,
          height,
          count,
          seed: req.body.seed,
        },
        '/api/image',
      );
      res.json({
        success: true,
        data: {
          prompt,
          width,
          height,
          images: together.urls.map((url) => ({ url, provider: 'together' })),
        },
        meta: {
          engine: 'together',
          model: together.model,
          latencyMs: together.latencyMs,
          fallback: false,
        },
        requestId,
      });
      return;
    } catch (error) {
      log('warn', 'image_together_failed_falling_back', {
        requestId,
        code: error instanceof Error ? error.name : 'UnknownError',
      });
    }
  }

  const urls = pollinationsUrls(prompt, width, height, count, req.body.seed);
  res.json({
    success: true,
    data: {
      prompt,
      width,
      height,
      images: urls.map((url) => ({ url, provider: 'pollinations' })),
    },
    meta: { engine: 'pollinations', fallback: engine === 'together' },
    requestId,
  });
}));

export const imageRouter = router;
