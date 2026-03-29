<script setup lang="ts">
const route = useRoute();
const currentScope = computed(() => {
  const scope = typeof route.query.scope === 'string' ? route.query.scope : 'all';
  return ['all', 'public', 'restricted', 'internal'].includes(scope) ? scope : 'all';
});

const { data, pending, error, refresh } = await useFetch('/api/docs', {
  query: computed(() => ({ scope: currentScope.value })),
  credentials: 'include'
});

const docs = computed(() => data.value?.docs || []);
const viewer = computed(() => data.value?.viewer || { role: 'guest', authenticated: false });
const counts = computed(
  () =>
    data.value?.counts || {
      all: 0,
      public: 0,
      restricted: 0,
      internal: 0
    }
);

const filters = computed(() => [
  { key: 'all', label: '全部', count: counts.value.all },
  { key: 'public', label: '完全对外', count: counts.value.public },
  { key: 'restricted', label: '受限共享', count: counts.value.restricted },
  { key: 'internal', label: '绝对对内', count: counts.value.internal }
]);

useSeoMeta({
  title: '文档中心 | 简序智能',
  description: '统一文档入口，按完全对外、受限共享、绝对对内三个层级管理内容可见度。'
});
</script>

<template>
  <div class="docs-page">
    <section class="docs-hero">
      <div>
        <p class="eyebrow">Documentation</p>
        <h1>统一文档中心</h1>
        <p class="hero-copy">
          同一套入口，按 <code>public</code>、<code>restricted</code>、<code>internal</code>
          三层可见度分发内容。默认只展示当前身份有权访问的文档。
        </p>
      </div>

      <div class="viewer-card">
        <span class="viewer-label">当前身份</span>
        <strong>{{ viewer.role }}</strong>
        <p v-if="viewer.authenticated">已登录，可查看受限共享内容。</p>
        <p v-else>未登录，仅显示完全对外内容。</p>
      </div>
    </section>

    <section class="filters">
      <NuxtLink
        v-for="filter in filters"
        :key="filter.key"
        class="filter-chip"
        :class="{ active: currentScope === filter.key }"
        :to="filter.key === 'all' ? '/docs' : `/docs?scope=${filter.key}`"
      >
        <span>{{ filter.label }}</span>
        <strong>{{ filter.count }}</strong>
      </NuxtLink>
    </section>

    <section v-if="currentScope === 'restricted' && !viewer.authenticated" class="notice-card">
      <h2>受限共享内容需要登录</h2>
      <p>这类内容通常用于客户交付、实施对接与准备清单。内容默认不公开收录，但也不会放敏感凭证。</p>
      <NuxtLink class="notice-action" to="/login?redirect=%2Fdocs%3Fscope%3Drestricted">登录后查看</NuxtLink>
    </section>

    <section
      v-if="currentScope === 'internal' && viewer.role !== 'internal' && viewer.role !== 'admin'"
      class="notice-card"
    >
      <h2>绝对对内内容仅内部成员可见</h2>
      <p>内部文档用于架构、运维、治理与事故复盘，不向普通登录用户开放。</p>
    </section>

    <section class="docs-grid">
      <article v-for="doc in docs" :key="doc.id" class="doc-card">
        <div class="doc-meta">
          <span class="doc-category">{{ doc.category }}</span>
          <span class="doc-visibility" :class="doc.visibility">{{ doc.visibility }}</span>
        </div>
        <h2>{{ doc.title }}</h2>
        <p>{{ doc.summary }}</p>
        <NuxtLink :to="doc.path" class="doc-link">查看文档</NuxtLink>
      </article>

      <div v-if="pending" class="empty-state">文档加载中...</div>
      <div v-else-if="error" class="empty-state error-state">
        <p>文档列表加载失败。</p>
        <button class="retry-button" @click="refresh()">重试</button>
      </div>
      <div v-else-if="docs.length === 0" class="empty-state">
        当前筛选下没有可访问文档。
      </div>
    </section>
  </div>
</template>

<style scoped>
.docs-page {
  min-height: 100vh;
  padding: 120px 24px 80px;
  background:
    radial-gradient(circle at top right, rgba(12, 44, 86, 0.08), transparent 30%),
    linear-gradient(180deg, #f7f8fa 0%, #eef1f4 100%);
  color: #101418;
}

.docs-hero,
.filters,
.docs-grid,
.notice-card {
  width: min(1120px, 100%);
  margin: 0 auto;
}

.docs-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 24px;
  align-items: start;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6f7b88;
}

h1 {
  margin: 0;
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  line-height: 1.05;
}

.hero-copy {
  max-width: 760px;
  margin: 16px 0 0;
  font-size: 1rem;
  line-height: 1.75;
  color: #4d5a68;
}

.viewer-card,
.notice-card,
.doc-card {
  border: 1px solid rgba(16, 20, 24, 0.08);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 50px rgba(12, 26, 42, 0.08);
}

.viewer-card {
  padding: 20px;
}

.viewer-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6f7b88;
}

.viewer-card strong {
  font-size: 1.15rem;
}

.viewer-card p {
  margin: 10px 0 0;
  color: #5c6875;
  line-height: 1.6;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 999px;
  border: 1px solid rgba(16, 20, 24, 0.12);
  color: #24303c;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.82);
}

.filter-chip.active {
  background: #101418;
  color: #fff;
  border-color: #101418;
}

.notice-card {
  padding: 22px 24px;
  margin-bottom: 20px;
}

.notice-card h2 {
  margin: 0 0 10px;
  font-size: 1.15rem;
}

.notice-card p {
  margin: 0;
  line-height: 1.7;
  color: #4d5a68;
}

.notice-action {
  display: inline-flex;
  margin-top: 16px;
  padding: 10px 16px;
  border-radius: 999px;
  background: #101418;
  color: #fff;
  text-decoration: none;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.doc-card {
  display: flex;
  flex-direction: column;
  padding: 22px;
}

.doc-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 0.82rem;
}

.doc-category {
  color: #536170;
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

.doc-card h2 {
  margin: 0 0 12px;
  font-size: 1.2rem;
}

.doc-card p {
  margin: 0;
  flex: 1;
  line-height: 1.7;
  color: #4d5a68;
}

.doc-link {
  margin-top: 18px;
  color: #101418;
  font-weight: 600;
  text-decoration: none;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 36px 20px;
  text-align: center;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  color: #536170;
}

.error-state p {
  margin: 0 0 12px;
}

.retry-button {
  padding: 10px 16px;
  border: none;
  border-radius: 999px;
  background: #101418;
  color: #fff;
  cursor: pointer;
}

@media (max-width: 840px) {
  .docs-hero {
    grid-template-columns: 1fr;
  }
}
</style>
