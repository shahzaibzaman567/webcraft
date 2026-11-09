import { Request, Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { aiLimiter } from '../middleware/rateLimiters';
import { requireUser } from '../middleware/requireUser';
import { validateBody, validateParams } from '../middleware/validate';
import { errors } from '../lib/errors';
import { AiJob, AiJobRecord } from '../models/AiJob';
import { normalizeFiles } from '../services/fileService';
import { createAiJob, enqueueAiJob, serializeAiJob } from '../services/aiJobs';
import {
  chatRequestSchema,
  generateRequestSchema,
  jobIdParamsSchema,
} from '../services/requestSchemas';
import { sanitizePrompt } from '../utils/sanitize';

const router = Router();

function ownerEmail(req: Request): string {
  const email = req.authUser?.email;
  if (!email) {
    throw errors.loginRequired();
  }
  return email;
}

router.post(
  '/generate',
  requireUser,
  aiLimiter,
  validateBody(generateRequestSchema),
  asyncHandler(async (req, res) => {
    const userEmail = ownerEmail(req);
    const job = await createAiJob({
      userEmail,
      type: 'generate',
      input: {
        prompt: sanitizePrompt(req.body.prompt),
        projectName: req.body.projectName?.trim() || undefined,
        framework: req.body.framework,
        existingFiles: req.body.existingFiles ? normalizeFiles(req.body.existingFiles) : undefined,
      },
    });

    await enqueueAiJob(job);

    res.status(202).json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
      },
      requestId: String(res.locals.requestId ?? ''),
    });
  }),
);

router.post(
  '/chat',
  requireUser,
  aiLimiter,
  validateBody(chatRequestSchema),
  asyncHandler(async (req, res) => {
    const userEmail = ownerEmail(req);
    const existingFiles = req.body.existingFiles ? normalizeFiles(req.body.existingFiles) : [];
    if (existingFiles.length === 0) {
      throw errors.validation('existingFiles is required to apply iterative edits');
    }

    const job = await createAiJob({
      userEmail,
      type: 'chat',
      input: {
        prompt: sanitizePrompt(req.body.prompt),
        projectId: req.body.projectId,
        existingFiles,
      },
    });

    await enqueueAiJob(job);

    res.status(202).json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
      },
      requestId: String(res.locals.requestId ?? ''),
    });
  }),
);

router.get(
  '/:id',
  requireUser,
  validateParams(jobIdParamsSchema),
  asyncHandler(async (req, res) => {
    const userEmail = ownerEmail(req);
    const job = await AiJob.findOne({ id: String(req.params.id), userEmail }).lean();
    if (!job) {
      throw errors.notFound('AI job not found');
    }

    res.json({
      success: true,
      data: serializeAiJob(job as AiJobRecord),
      requestId: String(res.locals.requestId ?? ''),
    });
  }),
);

export const jobsRouter = router;
