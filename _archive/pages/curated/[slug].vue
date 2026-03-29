<template>
  <div class="curated-detail-page">
    <main class="container">
      <header class="page-header">
        <NuxtLink to="/curated" class="back-link">← 返回精选列表</NuxtLink>
        <span class="label">— PROJECT</span>
        <h1>{{ project.name }}</h1>
        <div class="meta">
          <span class="rating">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= project.rating }">★</span>
          </span>
          <a :href="project.github" target="_blank" rel="noopener" class="github-link">
            GitHub →
          </a>
        </div>
      </header>

      <article class="content-card">
        <section class="section">
          <h2>我的评价</h2>
          <p>{{ project.review }}</p>
        </section>

        <section class="section">
          <h2>适用场景</h2>
          <p>{{ project.useCase }}</p>
        </section>

        <section class="section">
          <h2>技术要点</h2>
          <p>{{ project.techPoints }}</p>
        </section>

        <section v-if="project.experience" class="section">
          <h2>实战经验</h2>
          <p>{{ project.experience }}</p>
        </section>
      </article>

      <section class="cta-section">
        <div class="cta-card">
          <span class="label">— SERVICES</span>
          <h2>需要帮忙落地这个方案？</h2>
          <p>我们提供技术选型咨询、部署交付、运维支持服务。</p>
          <NuxtLink to="/contact" class="btn-primary">联系咨询 →</NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

// 项目详情数据
const projectsData = {
  'opencode': {
    name: 'OpenCode',
    rating: 4,
    github: 'https://github.com/opencode-ai/opencode',
    review: '轻量级终端 AI 编程助手。不像某些臃肿的 IDE 插件，OpenCode 专注于命令行场景，启动快、资源占用低。对于喜欢在终端工作的开发者来说，这是一个很好的选择。',
    useCase: '适合习惯命令行工作流的开发者。如果你主力编辑器是 Vim/Neovim，或者经常需要在服务器上直接编码，OpenCode 比 Cursor 这类重型工具更合适。',
    techPoints: '基于 Claude/OpenAI API，支持多种模型。核心亮点是轻量和快速，没有复杂的依赖。支持上下文管理和多轮对话。',
    experience: '我在服务器调试和快速脚本编写场景中使用过，体验流畅。'
  },
  'superpowers': {
    name: 'Superpowers',
    rating: 4,
    github: 'https://github.com/superpowers-ai/superpowers',
    review: 'AI Agent 能力增强框架。它的核心思想是通过组合多种工具和策略，让基础模型获得更强的执行能力。设计理念很清晰，代码质量也不错。',
    useCase: '适合想要构建复杂 AI Agent 的团队。如果你需要让 AI 执行多步骤任务、调用外部工具，Superpowers 提供了一个很好的脚手架。',
    techPoints: '模块化设计，支持插件扩展。内置常用工具集成（文件操作、网络请求等）。有较好的错误处理和重试机制。',
    experience: ''
  },
  'tars': {
    name: 'TARS',
    rating: 5,
    github: 'https://github.com/bytedance/UI-TARS',
    review: '字节跳动开源的多模态 AI Agent 框架，可以通过视觉理解来操控电脑。这是目前开源社区里最接近"通用桌面 Agent"的项目之一。技术实力很强，更新也很积极。',
    useCase: '适合需要自动化 GUI 操作的场景：RPA、测试自动化、数据采集。相比传统的按坐标点击，TARS 通过视觉理解来定位元素，鲁棒性更强。',
    techPoints: '纯视觉方案，不依赖 DOM 或 Accessibility API。支持 macOS 和 Windows。与 Claude 配合效果最佳。架构清晰，容易二次开发。',
    experience: '我测试过用它来自动化一些重复性的 Web 操作，识别准确率很高。'
  },
  'mirothinker': {
    name: 'MiroThinker',
    rating: 4,
    github: 'https://github.com/mirothinker/mirothinker',
    review: '专注于增强 LLM 推理能力的框架。通过结构化的思考链和反思机制，让普通模型也能处理复杂推理任务。思路很有价值。',
    useCase: '适合需要深度推理的场景：数学问题、逻辑分析、复杂决策。如果你发现普通 prompt 让模型容易出错，可以试试 MiroThinker 的方法论。',
    techPoints: '核心是 Chain-of-Thought 的增强版，加入了自我反思和纠错机制。可以和多种模型配合使用。',
    experience: ''
  }
};

const project = computed(() => {
  return projectsData[slug] || {
    name: '未找到',
    rating: 0,
    github: '#',
    review: '该项目不存在',
    useCase: '',
    techPoints: '',
    experience: ''
  };
});

useSeoMeta({
  title: () => `${project.value.name} - 技术精选 - 简序智能`,
  description: () => project.value.review?.slice(0, 150)
});
</script>

<style scoped>
.curated-detail-page {
  min-height: 100vh;
  background-color: #fafafa;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
  padding: 80px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  margin-bottom: 48px;
}

.back-link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 24px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #111;
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

.meta {
  display: flex;
  align-items: center;
  gap: 24px;
}

.rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1.1rem;
}

.star.filled {
  color: #111;
}

.github-link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.github-link:hover {
  color: #111;
}

.content-card {
  background: #fff;
  border: 1px solid #111;
  padding: 48px;
  margin-bottom: 48px;
}

.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section h2 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: #111;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section p {
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
  margin: 0;
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
</style>
