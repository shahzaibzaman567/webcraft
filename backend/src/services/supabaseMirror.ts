import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import { log } from '../lib/logger';
import { ProjectRecord } from '../models/Project';

let client: SupabaseClient | null | undefined;

function getClient(): SupabaseClient | null {
  if (client !== undefined) {
    return client;
  }
  if (!env.supabase.url || !env.supabase.serviceRoleKey) {
    client = null;
    return client;
  }
  client = createClient(env.supabase.url, env.supabase.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabase.url && env.supabase.serviceRoleKey);
}

export async function mirrorProject(project: ProjectRecord): Promise<void> {
  const supabase = getClient();
  if (!supabase) {
    return;
  }

  try {
    const { error } = await supabase.from('projects').upsert(
      {
        id: project.id,
        user_email: project.userEmail ?? '',
        name: project.name,
        description: project.description ?? '',
        framework: project.framework,
        status: project.status,
        files: project.files,
        prompts: project.prompts,
        thumbnail: project.thumbnail ?? '',
        exports_count: project.exportsCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    if (error) {
      throw error;
    }
  } catch (error) {
    log('warn', 'supabase_project_mirror_failed', {
      projectId: project.id,
      message: error instanceof Error ? error.message : 'Unknown Supabase error',
    });
  }
}

export async function removeMirroredProject(projectId: string): Promise<void> {
  const supabase = getClient();
  if (!supabase) {
    return;
  }

  try {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) {
      throw error;
    }
  } catch (error) {
    log('warn', 'supabase_project_delete_failed', {
      projectId,
      message: error instanceof Error ? error.message : 'Unknown Supabase error',
    });
  }
}
