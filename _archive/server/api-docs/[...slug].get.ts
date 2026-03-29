import { getDocDetailForViewer } from '~/server/utils/docs';

export default defineEventHandler(async (event) => {
  const slugParam = event.context.params?.slug;
  const slug = typeof slugParam === 'string' ? slugParam.replace(/^\/+|\/+$/g, '') : '';

  if (!slug) {
    throw createError({ statusCode: 404, message: '文档不存在' });
  }

  const doc = await getDocDetailForViewer(event, slug);

  if (doc.visibility !== 'public') {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return {
    success: true,
    doc
  };
});
