import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import { errors } from '../lib/errors';
import { requireAdmin } from '../middleware/adminAuth';
import { asyncHandler } from '../middleware/asyncHandler';
import { adminLimiter } from '../middleware/rateLimiters';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { ApiKey } from '../models/ApiKey';
import { ErrorLog } from '../models/ErrorLog';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { PlatformSettingsRecord } from '../models/PlatformSettings';
import { getSettings, updateSettings } from '../services/settingsService';
import { PROVIDERS, ProviderId } from '../types/keys';

const router = Router();

router.use(adminLimiter, requireAdmin);

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(100).optional().default(''),
});

const usersQuerySchema = paginationSchema.extend({
  status: z.enum(['active', 'suspended']).optional(),
});

const errorsQuerySchema = paginationSchema.extend({
  status: z.enum(['unresolved', 'resolved']).optional(),
});

const idParamsSchema = z.object({ id: z.string().min(1).max(100) });

const leaderboardQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must use YYYY-MM format')
    .optional(),
});

const settingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  adsEnabled: z.boolean().optional(),
  popunderUrl: z
    .string()
    .trim()
    .max(2000)
    .refine((value) => value === '' || /^https?:\/\//i.test(value), 'Must be a valid http(s) URL')
    .optional(),
  smartLinkUrl: z
    .string()
    .trim()
    .max(2000)
    .refine((value) => value === '' || /^https?:\/\//i.test(value), 'Must be a valid http(s) URL')
    .optional(),
  popunderOnZip: z.boolean().optional(),
  loadingBannerEnabled: z.boolean().optional(),
  dashboardBannerEnabled: z.boolean().optional(),
});

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function requestId(res: { locals: Record<string, unknown> }): string {
  return String(res.locals.requestId ?? '');
}

function monthRange(month?: string) {
  const now = new Date();
  const fallback = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  const selected = month ?? fallback;
  const [yearPart, monthPart] = selected.split('-');
  const year = Number(yearPart);
  const monthIndex = Number(monthPart) - 1;
  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 1));
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

  return {
    selected,
    start,
    end,
    daysInMonth,
    label: start.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }),
  };
}

router.get(
  '/overview',
  asyncHandler(async (_req, res) => {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [totalUsers, totalProjects, activeUsersToday, providerStats, recentUsers, recentProjects, unresolvedErrors] =
      await Promise.all([
        User.countDocuments(),
        Project.countDocuments(),
        User.countDocuments({ lastActive: { $gte: dayAgo } }),
        ApiKey.aggregate<{
          _id: ProviderId;
          total: number;
          active: number;
          requestsToday: number;
        }>([
          {
            $group: {
              _id: '$provider',
              total: { $sum: 1 },
              active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
              requestsToday: { $sum: '$requestsToday' },
            },
          },
        ]),
        User.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name email avatar role status projectsCount lastActive createdAt')
          .lean(),
        Project.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('id name userEmail framework status createdAt')
          .lean(),
        ErrorLog.countDocuments({ status: 'unresolved' }),
      ]);

    const statsByProvider = new Map(providerStats.map((stat) => [stat._id, stat]));
    const requestsToday = providerStats.reduce((sum, stat) => sum + stat.requestsToday, 0);
    const keyPoolStats = PROVIDERS.map((provider) => {
      const stat = statsByProvider.get(provider);
      return {
        provider,
        total: stat?.total ?? 0,
        active: stat?.active ?? 0,
        requestsToday: stat?.requestsToday ?? 0,
      };
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProjects,
        activeUsersToday,
        requestsToday,
        totalKeys: keyPoolStats.reduce((sum, item) => sum + item.total, 0),
        keyPoolStats,
        unresolvedErrors,
        recentActivity: {
          recentUsers: recentUsers.map((user) => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar ?? '',
            role: user.role,
            status: user.status,
            projectsCount: user.projectsCount,
            lastActive: user.lastActive,
            joined: user.createdAt,
          })),
          recentProjects: recentProjects.map((project) => ({
            id: project.id,
            name: project.name,
            authorEmail: project.userEmail ?? '',
            framework: project.framework,
            status: project.status,
            createdAt: project.createdAt,
          })),
        },
      },
      requestId: requestId(res),
    });
  }),
);

router.get(
  '/leaderboard',
  validateQuery(leaderboardQuerySchema),
  asyncHandler(async (req, res) => {
    const { month } = req.query as unknown as z.infer<typeof leaderboardQuerySchema>;
    const range = monthRange(month);
    const monthFilter = { createdAt: { $gte: range.start, $lt: range.end } };

    const [monthlyGroups, dailyGroups] = await Promise.all([
      Project.aggregate<{ _id: string; projectsThisMonth: number }>([
        {
          $match: {
            ...monthFilter,
            userEmail: { $type: 'string', $ne: '' },
          },
        },
        {
          $group: {
            _id: { $toLower: '$userEmail' },
            projectsThisMonth: { $sum: 1 },
          },
        },
        { $sort: { projectsThisMonth: -1, _id: 1 } },
      ]),
      Project.aggregate<{ _id: string; projects: number }>([
        { $match: monthFilter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
                timezone: 'UTC',
              },
            },
            projects: { $sum: 1 },
          },
        },
      ]),
    ]);

    const topGroups = monthlyGroups.slice(0, 20);
    const topEmails = topGroups.map((entry) => entry._id).filter(Boolean);
    const users = topEmails.length
      ? await User.find({ email: { $in: topEmails } })
          .select('name email avatar role status projectsCount lastActive')
          .lean()
      : [];
    const usersByEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));

    const topUsers = topGroups.map((entry, index) => {
      const user = usersByEmail.get(entry._id);
      return {
        rank: index + 1,
        userId: user?._id.toString() ?? '',
        name: user?.name ?? entry._id,
        email: user?.email ?? entry._id,
        avatar: user?.avatar ?? '',
        role: user?.role ?? 'user',
        status: user?.status ?? 'active',
        projectsThisMonth: entry.projectsThisMonth,
        totalProjects: user?.projectsCount ?? 0,
        lastActive: user?.lastActive ?? null,
      };
    });

    const dailyByDate = new Map(dailyGroups.map((entry) => [entry._id, entry.projects]));
    const daily = Array.from({ length: range.daysInMonth }, (_, index) => {
      const date = `${range.selected}-${String(index + 1).padStart(2, '0')}`;
      return { date, projects: dailyByDate.get(date) ?? 0 };
    });

    res.json({
      success: true,
      data: {
        month: range.selected,
        monthLabel: range.label,
        monthStart: range.start.toISOString(),
        monthEnd: range.end.toISOString(),
        totalProjectsThisMonth: dailyGroups.reduce((sum, entry) => sum + entry.projects, 0),
        activeCreatorsThisMonth: monthlyGroups.length,
        topUsers,
        daily,
      },
      requestId: requestId(res),
    });
  }),
);

router.get(
  '/users',
  validateQuery(usersQuerySchema),
  asyncHandler(async (req, res) => {
    const { page, limit, search, status } = req.query as unknown as z.infer<typeof usersQuerySchema>;
    const filter: Record<string, unknown> = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: pattern }, { email: pattern }];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('name email avatar role status projectsCount lastActive createdAt')
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        users: users.map((user) => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar ?? '',
          role: user.role,
          status: user.status,
          projectsCount: user.projectsCount,
          lastActive: user.lastActive,
          joined: user.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      requestId: requestId(res),
    });
  }),
);

router.get(
  '/projects',
  validateQuery(paginationSchema),
  asyncHandler(async (req, res) => {
    const { page, limit, search } = req.query as unknown as z.infer<typeof paginationSchema>;
    const match: Record<string, unknown> = {};
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      match.$or = [{ name: pattern }, { userEmail: pattern }];
    }

    const [projects, total] = await Promise.all([
      Project.aggregate<{
        id: string;
        name: string;
        userEmail?: string;
        framework: string;
        status: string;
        thumbnail?: string;
        exportsCount: number;
        createdAt: Date;
        fileCount: number;
        authorName?: string;
      }>([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            name: 1,
            userEmail: 1,
            framework: 1,
            status: 1,
            thumbnail: 1,
            exportsCount: 1,
            createdAt: 1,
            fileCount: { $size: { $ifNull: ['$files', []] } },
            authorName: {
              $ifNull: [{ $arrayElemAt: ['$author.name', 0] }, '$userEmail'],
            },
          },
        },
      ]),
      Project.countDocuments(match),
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      requestId: requestId(res),
    });
  }),
);

router.get(
  '/errors',
  validateQuery(errorsQuerySchema),
  asyncHandler(async (req, res) => {
    const { page, limit, search, status } = req.query as unknown as z.infer<typeof errorsQuerySchema>;
    const filter: Record<string, unknown> = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ service: pattern }, { message: pattern }, { endpoint: pattern }];
    }

    const [errorsList, total, unresolved] = await Promise.all([
      ErrorLog.find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ErrorLog.countDocuments(filter),
      ErrorLog.countDocuments({ status: 'unresolved' }),
    ]);

    res.json({
      success: true,
      data: {
        errors: errorsList.map((entry) => ({
          id: entry._id.toString(),
          timestamp: entry.timestamp,
          level: entry.level,
          service: entry.service,
          endpoint: entry.endpoint,
          message: entry.message,
          status: entry.status,
        })),
        unresolved,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      requestId: requestId(res),
    });
  }),
);

router.post(
  '/errors/:id/resolve',
  validateParams(idParamsSchema),
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id || !isValidObjectId(id)) {
      throw errors.validation('Invalid error log id');
    }
    const updated = await ErrorLog.findByIdAndUpdate(
      id,
      { $set: { status: 'resolved' } },
      { new: true },
    ).lean();
    if (!updated) {
      throw errors.notFound('Error log not found');
    }
    res.json({
      success: true,
      data: { id, status: 'resolved' },
      requestId: requestId(res),
    });
  }),
);

router.get(
  '/settings',
  asyncHandler(async (_req, res) => {
    const settings = await getSettings();
    res.json({
      success: true,
      data: { settings },
      requestId: requestId(res),
    });
  }),
);

router.post(
  '/settings',
  validateBody(settingsSchema),
  asyncHandler(async (req, res) => {
    const settings = await updateSettings(req.body as Partial<PlatformSettingsRecord>);
    res.json({
      success: true,
      data: { settings },
      requestId: requestId(res),
    });
  }),
);

export const adminRouter = router;
