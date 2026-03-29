import { DOC_VISIBILITIES, listDocsForViewer } from '~/server/utils/docs';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const requestedScope = typeof query.scope === 'string' ? query.scope : '';
  const { viewer, docs } = await listDocsForViewer(event);
  const scope = DOC_VISIBILITIES.includes(requestedScope as any) ? requestedScope : 'all';

  const filteredDocs =
    scope === 'all' ? docs : docs.filter((doc) => doc.visibility === scope);

  return {
    success: true,
    viewer,
    scope,
    counts: {
      all: docs.length,
      public: docs.filter((doc) => doc.visibility === 'public').length,
      restricted: docs.filter((doc) => doc.visibility === 'restricted').length,
      internal: docs.filter((doc) => doc.visibility === 'internal').length
    },
    docs: filteredDocs
  };
});
