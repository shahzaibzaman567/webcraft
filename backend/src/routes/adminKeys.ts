import { Router } from 'express';
import { z } from 'zod';
import { errors } from '../lib/errors';
import { requireAdmin } from '../middleware/adminAuth';
import { asyncHandler } from '../middleware/asyncHandler';
import { adminLimiter } from '../middleware/rateLimiters';
import { validateBody, validateParams } from '../middleware/validate';
import { keyPoolManager } from '../services/keyPoolManager';
import { addKeyRequestSchema } from '../services/requestSchemas';

const router = Router();

const idParamsSchema = z.object({ id: z.string().uuid() });

router.use(adminLimiter, requireAdmin);

router.get('/', (_req, res) => {
  const keys = keyPoolManager.listKeys();
  const stats = keyPoolManager.getStats();
  res.json({
    success: true,
    data: { keys, stats },
    requestId: String(res.locals.requestId ?? ''),
  });
});

router.post('/', validateBody(addKeyRequestSchema), asyncHandler(async (req, res) => {
  const key = await keyPoolManager.addKey({
    provider: req.body.provider,
    label: req.body.label,
    key: req.body.key,
  });
  res.status(201).json({
    success: true,
    data: { key },
    requestId: String(res.locals.requestId ?? ''),
  });
}));

router.delete('/:id', validateParams(idParamsSchema), asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw errors.validation('Key id is required');
  }
  await keyPoolManager.removeKey(id);
  res.json({
    success: true,
    data: { removed: true, id },
    requestId: String(res.locals.requestId ?? ''),
  });
}));

export const adminKeysRouter = router;
