import { errors } from '../lib/errors';
import { ChatFileChange, GeneratedFile } from '../types/ai';
import {
  MAX_FILES,
  assertFileBudget,
  assertFileContent,
  safeRelativePath,
} from '../utils/files';

export interface IncomingFile {
  path: string;
  content: string;
  language?: string;
}

export function normalizeFiles(files: IncomingFile[]): GeneratedFile[] {
  if (files.length > MAX_FILES) {
    throw errors.tooLarge(`A project may contain at most ${MAX_FILES} files`);
  }
  const byPath = new Map<string, GeneratedFile>();
  let total = 0;
  for (const file of files) {
    const path = safeRelativePath(file.path);
    assertFileContent(file.content);
    total += file.content.length;
    assertFileBudget(total);
    byPath.set(path, {
      path,
      content: file.content,
      language: (file.language || 'text').slice(0, 30),
    });
  }
  return [...byPath.values()];
}

export function applyFileChanges(
  existingFiles: IncomingFile[],
  changes: ChatFileChange[],
): { files: GeneratedFile[]; changes: ChatFileChange[] } {
  const base = normalizeFiles(existingFiles);
  const map = new Map<string, GeneratedFile>();
  for (const file of base) {
    map.set(file.path, file);
  }

  const applied: ChatFileChange[] = [];
  for (const change of changes) {
    const path = safeRelativePath(change.path);
    if (change.action === 'delete') {
      map.delete(path);
      applied.push({ path, action: 'delete' });
      continue;
    }
    if (typeof change.content !== 'string') {
      throw errors.badGateway('AI returned a file change without content');
    }
    assertFileContent(change.content);
    map.set(path, {
      path,
      content: change.content,
      language: (change.language || 'text').slice(0, 30),
    });
    applied.push({
      path,
      action: change.action ?? (base.some((file) => file.path === path) ? 'update' : 'create'),
      language: change.language,
    });
  }

  const files = [...map.values()];
  if (files.length > MAX_FILES) {
    throw errors.tooLarge(`A project may contain at most ${MAX_FILES} files`);
  }
  assertFileBudget(files.reduce((sum, file) => sum + file.content.length, 0));
  return { files, changes: applied };
}
