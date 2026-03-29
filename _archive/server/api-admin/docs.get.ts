import { listDocsForAdmin } from '~/server/utils/docs';
import { verifyAdminAuth } from '~/server/utils/adminAuth';

export default defineEventHandler(async (event) => {
  verifyAdminAuth(event);

  const docs = await listDocsForAdmin();

  return {
    success: true,
    docs: docs.map(({ filePath: _filePath, ...doc }) => doc)
  };
});
