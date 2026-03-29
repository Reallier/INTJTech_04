<script setup lang="ts">
const route = useRoute();
const slug = computed(() => {
  const raw = route.params.slug;
  if (Array.isArray(raw)) {
    return raw.join('/');
  }
  return typeof raw === 'string' ? raw : '';
});

const { data, error, pending, refresh } = await useFetch(() => `/api/docs/${slug.value}`, {
  credentials: 'include'
});

const statusCode = computed(() => error.value?.statusCode || error.value?.status || 0);

if (statusCode.value === 401) {
  await navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`);
}

const doc = computed(() => data.value?.doc || null);

watchEffect(() => {
  if (!doc.value) {
    return;
  }

  useSeoMeta({
    title: `${doc.value.title} | 文档中心`,
    description: doc.value.summary,
    robots: doc.value.visibility === 'public' ? 'index,follow' : 'noindex,nofollow,noarchive'
  });
});
</script>

<template>
  <div class="doc-detail-page">
    <div class="doc-shell">
      <NuxtLink to="/docs" class="back-link">返回文档中心</NuxtLink>

      <div v-if="pending" class="state-card">文档加载中...</div>

      <div v-else-if="statusCode === 403" class="state-card">
        <h1>无权访问</h1>
        <p>这篇文档属于绝对对内内容，当前账号没有访问权限。</p>
      </div>

      <div v-else-if="statusCode === 404" class="state-card">
        <h1>文档不存在</h1>
        <p>这篇文档没有发布，或 slug 不存在。</p>
      </div>

      <div v-else-if="error" class="state-card">
        <h1>加载失败</h1>
        <p>请求文档时发生错误。</p>
        <button class="retry-button" @click="refresh()">重试</button>
      </div>

      <article v-else-if="doc" class="doc-article">
        <header class="doc-header">
          <div class="doc-meta">
            <span>{{ doc.category }}</span>
            <span class="doc-visibility" :class="doc.visibility">{{ doc.visibility }}</span>
          </div>
          <h1>{{ doc.title }}</h1>
          <p>{{ doc.summary }}</p>
        </header>

        <div class="markdown-body" v-html="doc.html"></div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.doc-detail-page {
  min-height: 100vh;
  padding: 120px 24px 80px;
  background:
    radial-gradient(circle at top left, rgba(12, 44, 86, 0.08), transparent 30%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f5 100%);
  color: #11161c;
}

.doc-shell {
  width: min(920px, 100%);
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  margin-bottom: 18px;
  color: #354353;
  text-decoration: none;
}

.state-card,
.doc-article {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(17, 22, 28, 0.08);
  box-shadow: 0 20px 60px rgba(17, 22, 28, 0.08);
}

.state-card {
  padding: 28px;
}

.state-card h1 {
  margin: 0 0 10px;
}

.state-card p {
  margin: 0;
  line-height: 1.7;
  color: #536170;
}

.retry-button {
  margin-top: 16px;
  padding: 10px 16px;
  border: none;
  border-radius: 999px;
  background: #11161c;
  color: #fff;
  cursor: pointer;
}

.doc-article {
  padding: 32px;
}

.doc-header {
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(17, 22, 28, 0.08);
}

.doc-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  color: #536170;
  font-size: 0.9rem;
}

.doc-visibility {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.doc-visibility.public {
  background: rgba(33, 132, 95, 0.12);
  color: #0f6f4c;
}

.doc-visibility.restricted {
  background: rgba(203, 139, 12, 0.14);
  color: #8b5f00;
}

.doc-visibility.internal {
  background: rgba(122, 38, 182, 0.14);
  color: #6c27a6;
}

.doc-header h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.08;
}

.doc-header p {
  margin: 16px 0 0;
  color: #536170;
  line-height: 1.8;
}

:deep(.markdown-body) {
  padding-top: 28px;
  line-height: 1.8;
  color: #24303c;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  color: #11161c;
  line-height: 1.2;
}

:deep(.markdown-body table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

:deep(.markdown-body th),
:deep(.markdown-body td) {
  padding: 10px 12px;
  border: 1px solid rgba(17, 22, 28, 0.12);
  text-align: left;
}

:deep(.markdown-body code) {
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(17, 22, 28, 0.06);
  font-size: 0.92em;
}

:deep(.markdown-body a) {
  color: #0d5f85;
}
</style>
