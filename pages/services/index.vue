<template>
  <div class="page">
    <SiteHeader @open-login="showLoginModal = true" />
    
    <main>
      <!-- Hero Section -->
      <section class="section container hero-section">
        <div class="section-header">
          <div class="section-title-group">
            <span class="section-tag">[ TECHNICAL SERVICES ]</span>
            <h1 class="hero-title">技术服务</h1>
          </div>
          <p class="section-desc">经过验证的开源项目 · 专业的部署与运维支持</p>
        </div>
      </section>

      <!-- 服务列表 -->
      <section class="section container services-list-section">
        <!-- 类别筛选 -->
        <div class="filter-row">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="filter-btn"
            :class="{ active: activeCategory === cat.id }"
            @click="activeCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>

        <div class="services-grid">
          <NuxtLink 
            v-for="svc in filteredServices" 
            :key="svc.id" 
            :to="`/services/${svc.id}`"
            class="service-card"
          >
            <div class="service-ribbon">可提供服务</div>
            <div class="service-header">
              <span class="service-name">{{ svc.name }}</span>
              <div class="service-badges">
                <span class="badge stars-badge">★ {{ svc.stars }}</span>
              </div>
            </div>
            <p class="service-desc">{{ svc.desc }}</p>
            <div class="service-features">
              <span v-for="f in svc.features" :key="f" class="feature-tag">{{ f }}</span>
            </div>
            <div class="service-footer">
              <div class="service-meta">
                <span class="service-source">{{ svc.source }}</span>
              </div>
              <span class="view-detail">了解服务 →</span>
            </div>
          </NuxtLink>
        </div>

        <!-- CTA -->
        <div class="cta-block">
          <div class="cta-card">
            <h3>没找到你需要的项目？</h3>
            <p>告诉我们你想部署的开源项目，我们评估后可提供定制服务</p>
            <NuxtLink to="/contact" class="btn-primary">联系咨询 →</NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
    <LoginModal v-model="showLoginModal" />
  </div>
</template>

<script setup>
const showLoginModal = ref(false);
const activeCategory = ref('all');

const services = [
  {
    id: 'openclaw',
    name: 'OpenClaw 部署运维',
    desc: '12+ 消息平台统一接入的个人 AI 助手网关。支持 WhatsApp、Telegram、Discord、iMessage 等，本地优先架构，隐私完全可控。',
    stars: '2.1k',
    source: 'OpenClaw',
    category: 'ops',
    features: ['本地优先', '多通道', '安全可控', '专业服务'],
  },
  {
    id: 'langfuse',
    name: 'Langfuse 部署运维',
    desc: '开源 LLM 可观测与评测闭环平台：Trace、Prompt 管理、数据集与对比评测。我们提供私有部署与运维服务。',
    stars: '21.6k',
    source: 'Langfuse',
    category: 'quality',
    features: ['私有部署', 'Trace', '评测闭环', '专业服务'],
  },
  {
    id: 'promptfoo',
    name: 'Promptfoo 回归测试体系',
    desc: 'LLM Prompt/Agent 回归测试框架，可在 CI 中做准入门禁。我们提供用例集、指标与流水线接入。',
    stars: '10.3k',
    source: 'Promptfoo',
    category: 'quality',
    features: ['CI Gate', '回归评测', '评测集', '专业服务'],
  },
  {
    id: 'deepeval',
    name: 'DeepEval 评测体系',
    desc: 'LLM 评测与单元测试框架（metrics + LLM-as-judge）。我们提供指标体系、数据集与 CI 集成。',
    stars: '13.5k',
    source: 'Confident AI',
    category: 'quality',
    features: ['指标体系', 'LLM Judge', 'CI 集成', '专业服务'],
  },
  {
    id: 'ragas',
    name: 'Ragas RAG 评测',
    desc: 'RAG 质量评测框架（忠实度/相关性/回答质量等）。我们提供评测集构建、指标解释与持续评测。',
    stars: '12.5k',
    source: 'Ragas',
    category: 'quality',
    features: ['RAG 评测', '数据集', '指标解释', '专业服务'],
  },
  {
    id: 'garak',
    name: 'Garak 红队扫描',
    desc: 'LLM 安全红队扫描器，覆盖越狱、提示注入、敏感信息泄露等风险。我们提供基线扫描与整改复测。',
    stars: '6.9k',
    source: 'NVIDIA',
    category: 'security',
    features: ['红队扫描', '越狱/注入', '基线报告', '整改复测'],
  },
  {
    id: 'pyrit',
    name: 'PyRIT 对抗测试',
    desc: 'Microsoft 开源对抗测试编排框架，用于系统化生成攻击用例与评估防护效果。我们提供攻击库定制与报告。',
    stars: '3.4k',
    source: 'Azure',
    category: 'security',
    features: ['对抗编排', '攻击库', '评估报告', '专业服务'],
  },
  {
    id: 'eigent',
    name: 'Eigent 部署运维',
    desc: '基于 CAMEL-AI 的开源多智能体协作桌面应用。35+ 内置工具包与 MCP 集成，打造专属 AI Workforce，本地部署隐私可控。',
    stars: '1.8k',
    source: 'Eigent',
    category: 'ops',
    features: ['多智能体', '本地部署', 'MCP 集成', '专业服务'],
  },
  {
    id: 'ragflow',
    name: 'RAGFlow 部署运维',
    desc: '开源 RAG 引擎，深度文档理解驱动的检索增强生成。支持复杂格式文档解析、可视化分块、多路召回与可溯源引用，开箱即用的知识库问答。',
    stars: '25.3k',
    source: 'InfiniFlow',
    category: 'knowledge',
    features: ['深度文档解析', '可视化分块', '多路召回', '专业服务'],
  },
];

const categories = [
  { id: 'all', label: '全部' },
  { id: 'ops', label: '部署运维' },
  { id: 'knowledge', label: '知识管理' },
  { id: 'quality', label: '质量评测' },
  { id: 'security', label: '安全红队' },
];

const filteredServices = computed(() => {
  if (activeCategory.value === 'all') return services;
  return services.filter(s => s.category === activeCategory.value);
});

useSeoMeta({
  title: '技术服务 - 简序智能',
  description: '经过验证的开源项目部署与运维服务，提供专业的技术支持。'
});
</script>

<style scoped>
/* ========================================
   CSS Variables - 统一设计系统
   ======================================== */
.page {
  --bg: #ffffff;
  --fg: #111111;
  --muted: #666666;
  --border: rgba(0, 0, 0, 0.08);
  --grid-line: rgba(0, 0, 0, 0.04);
  --accent: #000000;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  
  min-height: 100vh;
  color: var(--fg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  background-color: var(--bg);
  background-image: 
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 40px 40px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
}

/* ========================================
   Section Layout
   ======================================== */
.section {
  padding: 80px 0;
  background: transparent;
}

.hero-section {
  padding: 100px 0 60px;
  border-bottom: 1px solid var(--border);
}

.section-header {
  margin-bottom: 0;
}

.section-title-group {
  margin-bottom: 16px;
}

.section-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--muted);
  display: block;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0;
  color: var(--fg);
}

.section-desc {
  font-size: 16px;
  color: var(--muted);
  margin: 0;
  max-width: 600px;
}

/* ========================================
   Services Grid
   ======================================== */
.services-list-section {
  padding-top: 60px;
  padding-bottom: 100px;
}

.filter-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.filter-btn {
  padding: 8px 14px;
  border: 1px solid var(--fg);
  background: transparent;
  color: var(--fg);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.filter-btn:hover {
  transform: translateY(-1px);
}

.filter-btn.active {
  background: var(--fg);
  color: #fff;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 60px;
}

.service-card {
  padding: 32px;
  background: #fff;
  border: 2px solid var(--fg);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s var(--ease);
  display: flex;
  flex-direction: column;
  position: relative;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.08);
}

.service-ribbon {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px 16px;
  background: var(--fg);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.service-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--fg);
}

.service-badges {
  display: flex;
  gap: 8px;
}

.badge {
  font-size: 11px;
  padding: 4px 8px;
  border: 1px solid var(--border);
}

.stars-badge {
  background: #f5f5f5;
  color: var(--fg);
  font-weight: 600;
}

.service-desc {
  color: var(--muted);
  font-size: 14px;
  margin: 0 0 20px;
  line-height: 1.7;
  flex: 1;
}

.service-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.feature-tag {
  font-size: 11px;
  padding: 4px 10px;
  background: #f5f5f5;
  color: #333;
  border: 1px solid var(--border);
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.service-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.service-source {
  font-size: 12px;
  color: var(--muted);
}

.view-detail {
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
}

/* ========================================
   CTA Block
   ======================================== */
.cta-block {
  display: flex;
  justify-content: center;
}

.cta-card {
  background: #fff;
  border: 1px solid var(--fg);
  padding: 40px 60px;
  text-align: center;
  max-width: 560px;
  width: 100%;
}

.cta-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--fg);
}

.cta-card p {
  color: var(--muted);
  font-size: 14px;
  margin: 0 0 24px;
  line-height: 1.6;
}

.btn-primary {
  display: inline-block;
  padding: 12px 28px;
  background: var(--fg);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid var(--fg);
  transition: all 0.2s var(--ease);
}

.btn-primary:hover {
  background: #fff;
  color: var(--fg);
}

/* ========================================
   Responsive
   ======================================== */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-card {
    padding: 32px 24px;
  }
}
</style>
