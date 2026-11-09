import { Router } from 'express';
import { errors } from '../lib/errors';
import { asyncHandler } from '../middleware/asyncHandler';
import { aiLimiter } from '../middleware/rateLimiters';
import { requireUser } from '../middleware/requireUser';
import { validateBody } from '../middleware/validate';
import { performChat } from '../services/aiGeneration';
import { normalizeFiles } from '../services/fileService';
import { chatRequestSchema } from '../services/requestSchemas';

const router = Router();

router.post('/', requireUser, aiLimiter, validateBody(chatRequestSchema), asyncHandler(async (req, res) => {
  const userEmail = req.authUser?.email;
  if (!userEmail) {
    throw errors.loginRequired();
  }

  const existingFiles = req.body.existingFiles ? normalizeFiles(req.body.existingFiles) : [];
  if (existingFiles.length === 0) {
    throw errors.validation('existingFiles is required to apply iterative edits');
  }

  const { data, meta } = await performChat({
    userEmail,
    prompt: req.body.prompt,
    projectId: req.body.projectId,
    existingFiles,
  });

  res.json({
    success: true,
    data,
    meta,
    requestId: String(res.locals.requestId ?? ''),
  });
}));

export const chatRouter = router;
