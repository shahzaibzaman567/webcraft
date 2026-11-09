import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { aiLimiter } from '../middleware/rateLimiters';
import { requireUser } from '../middleware/requireUser';
import { validateBody } from '../middleware/validate';
import { errors } from '../lib/errors';
import { normalizeFiles } from '../services/fileService';
import { performGenerate } from '../services/aiGeneration';
import { generateRequestSchema } from '../services/requestSchemas';

const router = Router();

router.post('/', requireUser, aiLimiter, validateBody(generateRequestSchema), asyncHandler(async (req, res) => {
  const userEmail = req.authUser?.email;
  if (!userEmail) {
    throw errors.loginRequired();
  }

  const existingFiles = req.body.existingFiles ? normalizeFiles(req.body.existingFiles) : [];
  const { data, meta } = await performGenerate({
    userEmail,
    prompt: req.body.prompt,
    projectName: req.body.projectName,
    framework: req.body.framework,
    existingFiles,
  });

  res.json({
    success: true,
    data,
    meta,
    requestId: String(res.locals.requestId ?? ''),
  });
}));

export const generateRouter = router;
