import { verifyAdminAuth } from '~/server/utils/adminAuth';
import { DOC_VISIBILITIES, updateDocConfig } from '~/server/utils/docs';

export default defineEventHandler(async (event) => {
  verifyAdminAuth(event);

  const body = await readBody<{
    docId?: string;
    visibility?: string;
    published?: boolean;
    sortOrder?: number;
  }>(event);

  if (!body.docId) {
    throw createError({ statusCode: 400, message: '缺少文档 ID' });
  }

  const updates: {
    visibility?: 'public' | 'restricted' | 'internal';
    published?: boolean;
    sortOrder?: number;
  } = {};

  if (typeof body.visibility === 'string') {
    if (!DOC_VISIBILITIES.includes(body.visibility as any)) {
      throw createError({ statusCode: 400, message: '无效的可见度' });
    }
    updates.visibility = body.visibility as 'public' | 'restricted' | 'internal';
  }

  if (typeof body.published === 'boolean') {
    updates.published = body.published;
  }

  if (typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder)) {
    updates.sortOrder = body.sortOrder;
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, message: '没有可更新的字段' });
  }

  const doc = await updateDocConfig(body.docId, updates);

  return {
    success: true,
    doc: {
      id: doc.id,
      slug: doc.slug,
      title: doc.title,
      summary: doc.summary,
      category: doc.category,
      sourceVisibility: doc.sourceVisibility,
      visibility: doc.visibility,
      published: doc.published,
      sortOrder: doc.sortOrder,
      path: doc.path
    }
  };
});
