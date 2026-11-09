import crypto from 'node:crypto';
import { Request, Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireUser } from '../middleware/requireUser';
import { validateBody, validateParams } from '../middleware/validate';
import { errors } from '../lib/errors';
import { Project, ProjectRecord } from '../models/Project';
import { User } from '../models/User';
import {
  createProjectSchema,
  projectIdParamsSchema,
  updateProjectSchema,
} from '../services/requestSchemas';
import { mirrorProject, removeMirroredProject } from '../services/supabaseMirror';
import { serializeProject, syncProjectCount } from '../services/userService';

const router = Router();

function ownerEmail(req: Request): string {
  const email = req.authUser?.email;
  if (!email) {
    throw errors.loginRequired();
  }
  return email;
}

function routeProjectId(req: Request): string {
  const id = String(req.params.id ?? '');
  if (!id) {
    throw errors.badRequest('Project id is required');
  }
  return id;
}

function normalizeProjectFiles(files: Array<{ path: string; content: string; language?: string }>) {
  return files.map((file) => ({
    path: file.path,
    content: file.content,
    language: file.language ?? 'text',
  }));
}

router.get('/', requireUser, asyncHandler(async (req, res) => {
  const email = ownerEmail(req);
  const projects = await Project.find({ userEmail: email })
    .select('-files -prompts')
    .sort({ updatedAt: -1 })
    .limit(100)
    .lean();

  res.json({
    success: true,
    data: projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description ?? '',
      framework: project.framework,
      status: project.status,
      thumbnail: project.thumbnail ?? '',
      exportsCount: project.exportsCount ?? 0,
      createdAt: new Date(project.createdAt ?? Date.now()).toISOString(),
      updatedAt: new Date(project.updatedAt ?? Date.now()).toISOString(),
    })),
  });
}));

router.get('/:id', requireUser, validateParams(projectIdParamsSchema), asyncHandler(async (req, res) => {
  const email = ownerEmail(req);
  const project = await Project.findOne({ id: routeProjectId(req), userEmail: email }).lean();
  if (!project) {
    throw errors.notFound('Project not found');
  }
  res.json({ success: true, data: serializeProject(project as ProjectRecord) });
}));

router.post('/', requireUser, validateBody(createProjectSchema), asyncHandler(async (req, res) => {
  const email = ownerEmail(req);
  const owner = await User.findOne({ email }).select('_id').lean();
  const projectId = `proj_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

  const project = await Project.create({
    id: projectId,
    userId: owner?._id,
    userEmail: email,
    name: req.body.name,
    description: req.body.description ?? '',
    framework: req.body.framework ?? 'react',
    status: req.body.status ?? 'ready',
    files: normalizeProjectFiles(req.body.files ?? []),
    prompts: (req.body.prompts ?? []).map((prompt: { role: string; content: string; timestamp?: number }) => ({
      role: prompt.role,
      content: prompt.content,
      timestamp: prompt.timestamp ?? Date.now(),
    })),
    thumbnail: req.body.thumbnail ?? '',
    exportsCount: 0,
  });

  await syncProjectCount(email);
  await mirrorProject(project.toObject() as ProjectRecord);

  res.status(201).json({ success: true, data: serializeProject(project.toObject() as ProjectRecord) });
}));

router.patch('/:id', requireUser, validateParams(projectIdParamsSchema), validateBody(updateProjectSchema), asyncHandler(async (req, res) => {
  const email = ownerEmail(req);
  const patch: Record<string, unknown> = { ...req.body };

  if (req.body.files) {
    patch.files = normalizeProjectFiles(req.body.files);
  }
  if (req.body.prompts) {
    patch.prompts = req.body.prompts.map((prompt: { role: string; content: string; timestamp?: number }) => ({
      role: prompt.role,
      content: prompt.content,
      timestamp: prompt.timestamp ?? Date.now(),
    }));
  }

  const project = await Project.findOneAndUpdate(
    { id: routeProjectId(req), userEmail: email },
    { $set: patch },
    { new: true },
  );

  if (!project) {
    throw errors.notFound('Project not found');
  }

  await mirrorProject(project.toObject() as ProjectRecord);
  res.json({ success: true, data: serializeProject(project.toObject() as ProjectRecord) });
}));

router.delete('/:id', requireUser, validateParams(projectIdParamsSchema), asyncHandler(async (req, res) => {
  const email = ownerEmail(req);
  const result = await Project.deleteOne({ id: routeProjectId(req), userEmail: email });
  if (result.deletedCount === 0) {
    throw errors.notFound('Project not found');
  }

  await syncProjectCount(email);
  await removeMirroredProject(routeProjectId(req));
  res.status(204).send();
}));

export const projectsRouter = router;
