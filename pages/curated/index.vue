<template>
  <div class="curated-page">
    <main class="container">
      <header class="page-header">
        <span class="label">— CURATED</span>
        <h1>技术精选</h1>
        <p class="subtitle">我亲自验证的优质开源项目，每个都经过实战检验。</p>
      </header>

      <div class="projects-grid">
        <NuxtLink 
          v-for="project in projects" 
          :key="project.slug" 
          :to="`/curated/${project.slug}`"
          class="project-card"
        >
          <div class="card-header">
            <span class="project-name">{{ project.name }}</span>
            <span class="project-rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= project.rating }">★</span>
            </span>
          </div>
          <p class="project-tagline">{{ project.tagline }}</p>
          <span class="view-more">查看详情 →</span>
        </NuxtLink>
      </div>

      <section class="cta-section">
        <div class="cta-card">
          <span class="label">— SERVICES</span>
          <h2>需要技术支持？</h2>
          <p>我们提供技术选型咨询、部署交付、运维支持服务。</p>
          <NuxtLink to="/contact" class="btn-primary">联系我们 →</NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
});

useSeoMeta({
  title: '技术精选 - 简序智能',
  description: '经过实战验证的优质开源项目精选，由简序智能团队亲自筛选推荐。'
});

const projects = [
  {
    slug: 'opencode',
    name: 'OpenCode',
    tagline: '终端里的 AI 编程助手，轻量好用',
    rating: 4
  },
  {
    slug: 'superpowers',
    name: 'Superpowers',
    tagline: 'AI Agent 能力增强框架，让模型更强大',
    rating: 4
  },
  {
    slug: 'tars',
    name: 'TARS',
    tagline: '字节开源的多模态 AI Agent，可视化操控电脑',
    rating: 5
  },
  {
    slug: 'mirothinker',
    name: 'MiroThinker',
    tagline: '深度思考推理框架，增强 LLM 推理能力',
    rating: 4
  }
];
</script>

<style scoped>
.curated-page {
  min-height: 100vh;
  background-color: #fafafa;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
  padding: 80px 0;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  margin-bottom: 48px;
}

.label {
  font-size: 0.75rem;
  color: #999;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 12px;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 16px;
  color: #111;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 64px;
}

.project-card {
  background: #fff;
  border: 1px solid #111;
  padding: 32px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.project-name {
  font-weight: 700;
  font-size: 1.25rem;
  color: #111;
}

.project-rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 0.9rem;
}

.star.filled {
  color: #111;
}

.project-tagline {
  color: #666;
  font-size: 0.95rem;
  margin: 0 0 auto;
  line-height: 1.6;
  padding-bottom: 16px;
}

.view-more {
  font-size: 0.85rem;
  color: #111;
  font-weight: 600;
}

.cta-section {
  display: flex;
  justify-content: center;
}

.cta-card {
  background: #fff;
  border: 1px solid #111;
  padding: 48px;
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.cta-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: #111;
}

.cta-card p {
  color: #666;
  margin: 0 0 24px;
}

.btn-primary {
  display: inline-block;
  padding: 14px 32px;
  background: #111;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid #111;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #fff;
  color: #111;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>
