import { Router } from 'express';
import { errors } from '../lib/errors';
import { log } from '../lib/logger';
import { asyncHandler } from '../middleware/asyncHandler';
import { contactLimiter } from '../middleware/rateLimiters';
import { validateBody } from '../middleware/validate';
import { isMailConfigured, sendContactMessage } from '../services/mailer';
import { contactRequestSchema } from '../services/requestSchemas';

const router = Router();

router.post('/', contactLimiter, validateBody(contactRequestSchema), asyncHandler(async (req, res) => {
  if (!isMailConfigured()) {
    throw errors.unavailable('Email service is not configured yet');
  }

  try {
    await sendContactMessage(req.body);
  } catch (error) {
    log('error', 'contact_email_failed', {
      message: error instanceof Error ? error.message : 'Unknown mail error',
    });
    throw errors.badGateway('Could not send your message right now');
  }

  res.json({ success: true, data: { sent: true } });
}));

export const contactRouter = router;
