import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireUser } from '../middleware/requireUser';
import { validateBody } from '../middleware/validate';
import { errors } from '../lib/errors';
import { User, UserRecord } from '../models/User';
import { updateAccountSchema } from '../services/requestSchemas';
import { serializeUser } from '../services/userService';

const router = Router();

router.get('/me', requireUser, asyncHandler(async (req, res) => {
  const email = req.authUser?.email;
  if (!email) {
    throw errors.loginRequired();
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    throw errors.notFound('User account not found');
  }

  res.json({ success: true, data: serializeUser(user as UserRecord) });
}));

router.patch('/me', requireUser, validateBody(updateAccountSchema), asyncHandler(async (req, res) => {
  const email = req.authUser?.email;
  if (!email) {
    throw errors.loginRequired();
  }

  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        ...req.body,
        lastActive: new Date(),
      },
    },
    { new: true, runValidators: true },
  ).lean();

  if (!user) {
    throw errors.notFound('User account not found');
  }

  res.json({ success: true, data: serializeUser(user as UserRecord) });
}));

export const accountRouter = router;
