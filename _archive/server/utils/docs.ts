import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { H3Event } from 'h3';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

import { verifyUserToken } from '~/server/utils/jwt';

export const DOC_VISIBILITIES = ['public', 'restricted', 'internal'] as const;

export type DocVisibility = typeof DOC_VISIBILITIES[number];
export type DocsViewerRole = 'guest' | 'user' | 'internal' | 'admin';

export interface DocsViewer {
  authenticated: boolean;
  role: DocsViewerRole;
}

interface DocFrontmatter {
  title?: unknown;
  summary?: unknown;
  category?: unknown;
  order?: unknown;
  published?: unknown;
}

interface StoredDocConfig {
  visibility?: DocVisibility;
  published?: boolean;
  sortOrder?: number;
}

type DocsConfigStore = Record<string, StoredDocConfig>;

interface BaseDocRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  sourceVisibility: DocVisibility;
  visibility: DocVisibility;
  published: boolean;
  sortOrder: number;
  path: string;
}

export interface DocsListItem extends BaseDocRecord {}

export interface DocsAdminItem extends BaseDocRecord {
  filePath: string;
}

export interface DocsDetail extends BaseDocRecord {
  body: string;
  html: string;
}

const DOCS_ROOT = path.resolve(process.cwd(), 'docs-content');
const RUNTIME_DATA_DIR = path.resolve(process.cwd(), 'runtime-data');
const DOC_CONFIG_PATH = path.join(RUNTIME_DATA_DIR, 'docs-visibility.json');

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
});

const firstHeading = (content: string) => {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
};

const humanizeSegment = (segment: string) =>
  segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const buildSlug = (relativeFilePath: string) => {
  const normalized = relativeFilePath.replace(/\\/g, '/').replace(/\.md$/i, '');
  if (normalized === 'index') {
    return '';
  }
  if (normalized.endsWith('/index')) {
    return normalized.slice(0, -'/index'.length);
  }
  return normalized;
};

const buildDocPath = (slug: string) => (slug ? `/docs/${slug}` : '/docs');

const parseNumber = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const ensureDocsConfigDir = async () => {
  await fs.mkdir(RUNTIME_DATA_DIR, { recursive: true });
};

const readDocsConfigStore = async (): Promise<DocsConfigStore> => {
  try {
    const raw = await fs.readFile(DOC_CONFIG_PATH, 'utf8');
    const parsed = JSON.parse(raw) as DocsConfigStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
};

const writeDocsConfigStore = async (store: DocsConfigStore) => {
  await ensureDocsConfigDir();
  await fs.writeFile(DOC_CONFIG_PATH, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
};

const walkMarkdownFiles = async (dirPath: string): Promise<string[]> => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return walkMarkdownFiles(fullPath);
      }
      if (entry.isFile() && entry.name.endsWith('.md')) {
        return [fullPath];
      }
      return [];
    })
  );
  return files.flat().sort((left, right) => left.localeCompare(right));
};

const loadRawDocs = async () => {
  const docs: Array<{
    id: string;
    slug: string;
    title: string;
    summary: string;
    category: string;
    sourceVisibility: DocVisibility;
    published: boolean;
    sortOrder: number;
    filePath: string;
  }> = [];

  for (const visibility of DOC_VISIBILITIES) {
    const visibilityRoot = path.join(DOCS_ROOT, visibility);
    try {
      const stat = await fs.stat(visibilityRoot);
      if (!stat.isDirectory()) {
        continue;
      }
    } catch (error: any) {
      if (error?.code === 'ENOENT') {
        continue;
      }
      throw error;
    }

    const files = await walkMarkdownFiles(visibilityRoot);
    for (const filePath of files) {
      const relativeFilePath = path.relative(visibilityRoot, filePath);
      const slug = buildSlug(relativeFilePath);
      if (!slug) {
        continue;
      }

      const raw = await fs.readFile(filePath, 'utf8');
      const parsed = matter(raw);
      const data = parsed.data as DocFrontmatter;

      const title =
        (typeof data.title === 'string' && data.title.trim()) ||
        firstHeading(parsed.content) ||
        humanizeSegment(path.basename(slug));
      const summary =
        (typeof data.summary === 'string' && data.summary.trim()) ||
        parsed.content
          .split('\n')
          .map((line) => line.trim())
          .find((line) => line && !line.startsWith('#')) ||
        title;
      const category =
        (typeof data.category === 'string' && data.category.trim()) ||
        humanizeSegment(slug.split('/')[0] || visibility);

      docs.push({
        id: slug,
        slug,
        title,
        summary,
        category,
        sourceVisibility: visibility,
        published: typeof data.published === 'boolean' ? data.published : true,
        sortOrder: parseNumber(data.order, 0),
        filePath
      });
    }
  }

  return docs;
};

const mergeDocRecord = (
  rawDoc: Awaited<ReturnType<typeof loadRawDocs>>[number],
  config: StoredDocConfig | undefined
): DocsAdminItem => {
  const visibility = config?.visibility ?? rawDoc.sourceVisibility;
  const published = typeof config?.published === 'boolean' ? config.published : rawDoc.published;
  const sortOrder = typeof config?.sortOrder === 'number' ? config.sortOrder : rawDoc.sortOrder;

  return {
    id: rawDoc.id,
    slug: rawDoc.slug,
    title: rawDoc.title,
    summary: rawDoc.summary,
    category: rawDoc.category,
    sourceVisibility: rawDoc.sourceVisibility,
    visibility,
    published,
    sortOrder,
    path: buildDocPath(rawDoc.slug),
    filePath: rawDoc.filePath
  };
};

const sortDocs = <T extends { category: string; sortOrder: number; title: string }>(docs: T[]) =>
  docs.sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }
    if (left.category !== right.category) {
      return left.category.localeCompare(right.category, 'zh-CN');
    }
    return left.title.localeCompare(right.title, 'zh-CN');
  });

export const getDocsViewer = (event: H3Event): DocsViewer => {
  const token = getCookie(event, 'auth_token');
  if (!token) {
    return { authenticated: false, role: 'guest' };
  }

  const payload = verifyUserToken(token) as { role?: string } | null;
  if (!payload) {
    return { authenticated: false, role: 'guest' };
  }

  const role = payload.role === 'admin' || payload.role === 'internal' ? payload.role : 'user';

  return {
    authenticated: true,
    role
  };
};

export const canViewerAccessDoc = (viewer: DocsViewer, visibility: DocVisibility) => {
  if (visibility === 'public') {
    return true;
  }
  if (visibility === 'restricted') {
    return viewer.authenticated;
  }
  return viewer.role === 'internal' || viewer.role === 'admin';
};

export const listDocsForAdmin = async (): Promise<DocsAdminItem[]> => {
  const [rawDocs, configStore] = await Promise.all([loadRawDocs(), readDocsConfigStore()]);
  return sortDocs(rawDocs.map((doc) => mergeDocRecord(doc, configStore[doc.id])));
};

export const listDocsForViewer = async (event: H3Event): Promise<{ viewer: DocsViewer; docs: DocsListItem[] }> => {
  const viewer = getDocsViewer(event);
  const docs = (await listDocsForAdmin())
    .filter((doc) => doc.published && canViewerAccessDoc(viewer, doc.visibility))
    .map(({ filePath: _filePath, ...doc }) => doc);

  return {
    viewer,
    docs
  };
};

export const getDocDetailForViewer = async (event: H3Event, slug: string): Promise<DocsDetail> => {
  const viewer = getDocsViewer(event);
  const docs = await listDocsForAdmin();
  const target = docs.find((doc) => doc.slug === slug);

  if (!target || !target.published) {
    throw createError({ statusCode: 404, message: '文档不存在' });
  }

  if (!canViewerAccessDoc(viewer, target.visibility)) {
    if (target.visibility === 'internal') {
      throw createError({ statusCode: 404, message: '文档不存在' });
    }
    throw createError({
      statusCode: viewer.authenticated ? 403 : 401,
      message: viewer.authenticated ? '无权访问该文档' : '请先登录后查看'
    });
  }

  const raw = await fs.readFile(target.filePath, 'utf8');
  const parsed = matter(raw);

  return {
    id: target.id,
    slug: target.slug,
    title: target.title,
    summary: target.summary,
    category: target.category,
    sourceVisibility: target.sourceVisibility,
    visibility: target.visibility,
    published: target.published,
    sortOrder: target.sortOrder,
    path: target.path,
    body: parsed.content,
    html: markdown.render(parsed.content)
  };
};

export const updateDocConfig = async (
  docId: string,
  updates: { visibility?: DocVisibility; published?: boolean; sortOrder?: number }
) => {
  const docs = await listDocsForAdmin();
  const existing = docs.find((doc) => doc.id === docId);
  if (!existing) {
    throw createError({ statusCode: 404, message: '文档不存在' });
  }

  const store = await readDocsConfigStore();
  const current = store[docId] || {};
  const next: StoredDocConfig = {
    ...current
  };

  if (updates.visibility) {
    next.visibility = updates.visibility;
  }
  if (typeof updates.published === 'boolean') {
    next.published = updates.published;
  }
  if (typeof updates.sortOrder === 'number' && Number.isFinite(updates.sortOrder)) {
    next.sortOrder = updates.sortOrder;
  }

  store[docId] = next;
  await writeDocsConfigStore(store);

  return mergeDocRecord(
    {
      id: existing.id,
      slug: existing.slug,
      title: existing.title,
      summary: existing.summary,
      category: existing.category,
      sourceVisibility: existing.sourceVisibility,
      published: existing.published,
      sortOrder: existing.sortOrder,
      filePath: existing.filePath
    },
    next
  );
};
