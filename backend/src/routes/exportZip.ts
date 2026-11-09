import { ZipArchive } from 'archiver';
import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { exportLimiter } from '../middleware/rateLimiters';
import { requireUser } from '../middleware/requireUser';
import { validateBody } from '../middleware/validate';
import { normalizeFiles } from '../services/fileService';
import { exportRequestSchema } from '../services/requestSchemas';
import { sanitizeFileName } from '../utils/sanitize';

const router = Router();

router.post('/', requireUser, exportLimiter, validateBody(exportRequestSchema), asyncHandler(async (req, res) => {
  const files = normalizeFiles(req.body.files);
  const projectName = sanitizeFileName(req.body.projectName ?? 'webcraft-project');

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${projectName}.zip"`);
  res.setHeader('Cache-Control', 'no-store');

  const archive = new ZipArchive({ zlib: { level: 9 } });

  archive.on('warning', () => undefined);
  archive.on('error', (error) => {
    if (!res.headersSent) {
      res.destroy(error);
      return;
    }
    res.destroy();
  });

  res.on('close', () => {
    if (!res.writableEnded) {
      archive.destroy();
    }
  });

  archive.pipe(res);
  for (const file of files) {
    archive.append(file.content, { name: file.path });
  }
  await archive.finalize();
}));

export const exportZipRouter = router;
