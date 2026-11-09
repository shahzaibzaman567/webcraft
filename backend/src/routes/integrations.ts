import { Request, Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { integrationLimiter } from '../middleware/rateLimiters';
import { requireUser } from '../middleware/requireUser';
import { validateBody, validateParams } from '../middleware/validate';
import { errors } from '../lib/errors';
import { Integration, IntegrationService } from '../models/Integration';
import {
  connectIntegrationSchema,
  integrationServiceParamsSchema,
} from '../services/requestSchemas';
import { serializeIntegration, validateIntegration } from '../services/integrations';

const router = Router();

function ownerEmail(req: Request): string {
  const email = req.authUser?.email;
  if (!email) {
    throw errors.loginRequired();
  }
  return email;
}

router.get('/', requireUser, asyncHandler(async (req, res) => {
  const email = ownerEmail(req);
  const integrations = await Integration.find({ userEmail: email })
    .sort({ service: 1 })
    .lean();

  res.json({
    success: true,
    data: integrations.map((integration) => serializeIntegration(integration)),
  });
}));

router.post(
  '/:service',
  requireUser,
  integrationLimiter,
  validateParams(integrationServiceParamsSchema),
  validateBody(connectIntegrationSchema),
  asyncHandler(async (req, res) => {
    const email = ownerEmail(req);
    const service = req.params.service as IntegrationService;
    const verified = await validateIntegration(service, req.body);
    const now = new Date();

    const integration = await Integration.findOneAndUpdate(
      { userEmail: email, service },
      {
        $set: {
          status: 'connected',
          accountDetails: verified.accountDetails,
          encryptedCredentials: verified.encryptedCredentials,
          maskedHint: verified.maskedHint,
          connectedAt: now,
          lastVerifiedAt: now,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    if (!integration) {
      throw errors.internal();
    }

    res.status(201).json({
      success: true,
      data: serializeIntegration(integration),
    });
  }),
);

router.delete(
  '/:service',
  requireUser,
  validateParams(integrationServiceParamsSchema),
  asyncHandler(async (req, res) => {
    const email = ownerEmail(req);
    const service = req.params.service;
    const result = await Integration.deleteOne({ userEmail: email, service });

    if (result.deletedCount === 0) {
      throw errors.notFound('Integration is not connected');
    }

    res.json({ success: true, data: { removed: true } });
  }),
);

export const integrationsRouter = router;
