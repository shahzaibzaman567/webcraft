import { Project, ProjectRecord } from '../models/Project';
import { User, UserRecord } from '../models/User';

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  username: string;
  workspaceName: string;
  avatar: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  projectsCount: number;
  lastActive: string;
  createdAt: string;
}

export interface PublicProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface PublicProjectPrompt {
  role: string;
  content: string;
  timestamp: number;
}

export interface PublicProject {
  id: string;
  name: string;
  description: string;
  framework: string;
  status: 'building' | 'ready' | 'error';
  files: PublicProjectFile[];
  prompts: PublicProjectPrompt[];
  thumbnail: string;
  exportsCount: number;
  createdAt: string;
  updatedAt: string;
}

export function serializeUser(user: UserRecord & { _id?: unknown }): PublicUser {
  return {
    id: String(user._id ?? user.email),
    email: user.email,
    name: user.name,
    username: user.username ?? '',
    workspaceName: user.workspaceName ?? '',
    avatar: user.avatar ?? '',
    role: user.role,
    status: user.status,
    projectsCount: user.projectsCount,
    lastActive: new Date(user.lastActive).toISOString(),
    createdAt: new Date(user.createdAt ?? Date.now()).toISOString(),
  };
}

export function serializeProject(project: ProjectRecord): PublicProject {
  return {
    id: project.id,
    name: project.name,
    description: project.description ?? '',
    framework: project.framework,
    status: project.status,
    files: project.files ?? [],
    prompts: project.prompts ?? [],
    thumbnail: project.thumbnail ?? '',
    exportsCount: project.exportsCount ?? 0,
    createdAt: new Date(project.createdAt ?? Date.now()).toISOString(),
    updatedAt: new Date(project.updatedAt ?? Date.now()).toISOString(),
  };
}

export async function syncProjectCount(email: string): Promise<void> {
  const projectsCount = await Project.countDocuments({ userEmail: email });
  await User.updateOne({ email }, { $set: { projectsCount } });
}
