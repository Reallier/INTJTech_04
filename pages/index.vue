<script setup lang="ts">
import { onMounted, nextTick, ref } from "vue";

// 登录 Modal 状态（仅用于顶部登录按钮）
const showLoginModal = ref(false);

onMounted(async () => {
  // 使用 nextTick 确保 DOM 完全渲染后再初始化动画
  await nextTick();
  initScrollReveal();
});

// 滚动揭示逻辑
const initScrollReveal = () => {
  // 确保在客户端运行
  if (typeof window === 'undefined') return;
  
  const observerOptions = { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // 一旦激活就停止观察，避免重复触发
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal');
  
  revealElements.forEach(el => {
    observer.observe(el);
  });
  
  // 对于已经在视口内的元素，立即触发
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('active');
      }
    });
  }, 100);
};

const philosophies = [
  {
    id: '01',
    title: '数据主权 / DATA SOVEREIGNTY',
    tags: 'SPEC: PRIVATE-FIRST / VPC',
    content: '坚持环境感知优于数据托管。所有 AI 逻辑与数据流转闭环运行于客户受控环境，实现交付即物理隔离。'
  },
  {
    id: '02',
    title: '原子集成 / ATOMIC ARCHITECTURE',
    tags: 'PATTERN: MICROSERVICES / LOW-ENTROPY',
    content: '采用原子化微服务封装 AI 能力，实现存量业务系统的无感介入。严禁架构越权，AI 仅作为翻译插件。'
  },
  {
    id: '03',
    title: '链路确定性 / DETERMINISTIC OBSERVABILITY',
    tags: 'STANDARD: DEEP TRACE',
    content: '引入分布式链路追踪标准。通过强类型协议约束，实现决策路径、入参及 Token 流转的全量透明化。'
  },
  {
    id: '04',
    title: '意图即执行 / ACTION-DRIVEN INTERFACE',
    tags: 'LOGIC: INTENT-AS-EXECUTION',
    content: '直驱底层脚本。对话框仅作为异常处理的兜底，严禁在自动化路径中依赖多轮自然语言确认。'
  },
  {
    id: '05',
    title: '强契约通讯 / SCHEMA-FIRST PROTOCOL',
    tags: 'PROTOCOL: MANDATORY JSON',
    content: '废除自然语言总结，所有协作指令通过标准 JSON 协议传递，确保逻辑严密性并有效隔离幻觉。'
  },
  {
    id: '06',
    title: '工业级吞吐 / PRODUCTION-GRADE THROUGHPUT',
    tags: 'CRITERIA: HIGH-CONCURRENCY',
    content: '深度优化推理路由，确保高并发下的毫秒级响应与低熵增。不交付非生产级原型。'
  }
];



const engineeringStack = [
  {
    id: '01',
    title: '并发与调度层 / CONCURRENCY & SCHEDULING',
    tags: 'PATTERN: ASYNC-IO / EVENT-DRIVEN / TASK-QUEUE',
    content: '核心实现： 采用非阻塞异步 IO 架构（AsyncIO/Tokio），支持大规模 Agent 任务的并行调度与毫秒级上下文切换。针对高并发场景实施流量削峰与反压（Backpressure）机制，确保系统在高负载下的线性响应。'
  },
  {
    id: '02',
    title: '协议与校验层 / PROTOCOL & VALIDATION',
    tags: 'PATTERN: SCHEMA-FIRST / Pydantic / JSON-RPC',
    content: '核心实现： 强制执行强类型 Schema 约束，利用 Pydantic/Standard-JSON 进行运行时数据校验。所有 Agent 间通讯均通过结构化协议映射，从物理层杜绝自然语言交互产生的“逻辑漂移”与“非结构化幻觉”。'
  },
  {
    id: '03',
    title: '可观测性与追踪层 / OBSERVABILITY & TRACE',
    tags: 'PATTERN: DISTRIBUTED TRACING / OpenTelemetry / RCA',
    content: '核心实现： 全量接入 OpenTelemetry 工业标准，对每一个 Tool Call 及模型推理路径进行全局唯一 ID 标记。通过分布式链路追踪（Deep Trace）实现亚秒级故障根因分析（RCA），让 AI 决策路径完全透明。'
  },
  {
    id: '04',
    title: '状态与持久化层 / STATE & PERSISTENCE',
    tags: 'PATTERN: HYBRID-SEARCH / VECTOR-GRAPH / ATOMIC-PERSIST',
    content: '核心实现： 构建向量（Vector）与图（Graph）混合索引架构，解决长程记忆中的语义关联偏差。采用原子化事务保障 Agent 状态的持久化一致性，在高频交互中确保“状态不丢、逻辑不乱”。'
  },
  {
    id: '05',
    title: '部署与主权层 / DEPLOYMENT & SOVEREIGNTY',
    tags: 'PATTERN: DOCKER / VPC-ISOLATION / CI-CD',
    content: '核心实现： 实施全量容器化封装与环境声明式配置。支持基于 VPC 的物理隔离部署，确保 AI 逻辑运行于完全受控的内网环境，通过自动化流水线（CI/CD）实现工程标准的原子化交付。'
  }
];
</script>

<template>
  <div class="page">
    <!-- 使用共享 Header 组件 -->
    <SiteHeader @open-login="showLoginModal = true" />

    <main>
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <span class="hero-label">Intelligent System Architect</span>
          <h1 class="hero-title">秩序，<br>即是自由。</h1>
          <p class="hero-subtitle">
            我们重新编排业务的逻辑序数。简序智能（INTJsys）致力于将复杂的非结构化碎片，转化为稳健且可进化的生产力组件。
          </p>
          <div class="hero-cta">
            <a href="#products" class="btn">探索产品矩阵</a>
            <a href="#deep-dive" class="btn btn-ghost">了解核心能力</a>
          </div>
        </div>
      </section>


      <!-- Bento Products Grid -->
      <section id="products" class="bento container">
        <div class="bento-grid">
          <!-- TalentAI Flagship Card -->
          <div class="bento-card card-talent reveal">
            <span class="card-tag">Flagship</span>
            <h2 class="card-title">TalentAI</h2>
            <p class="card-desc">新一代人才评估引擎。打破简历与岗位间的信息熵增，让每一份才华被精准映射。</p>
            <div class="card-cta">
              <a href="#" @click="handleProductClick('talentai', $event)" class="btn">立即开始 →</a>
            </div>
            <!-- UI Mockup -->
            <div class="ui-mockup">
              <div class="mockup-bar"></div>
              <div class="mockup-bar-short"></div>
              <div class="mockup-row">
                <div class="mockup-avatar"></div>
                <div class="mockup-content"></div>
              </div>
            </div>
          </div>

          <!-- Labs Card -->
          <div class="bento-card card-labs reveal">
            <span class="card-tag">Research</span>
            <h2 class="card-title">实验室</h2>
            <p class="card-desc card-desc-sm">AI 知识库、流程引擎、逻辑桥... 更多原子工具正在构建中。</p>
          </div>

          <!-- Bridge Custom Service Card -->
          <div class="bento-card card-bridge reveal">
            <div class="bridge-content">
              <span class="card-tag">Custom Service</span>
              <h2 class="card-title">INTJ Bridge</h2>
              <p class="card-desc">当标准化工具无法承载您的雄心，我们为您构建专属的 AI 底层。</p>
            </div>
            <a href="mailto:contact@intjtech.cn" class="btn btn-ghost">预约咨询</a>
          </div>
        </div>
      </section>

      <!-- Engineering Philosophy (Linear Flow) -->
      <section id="deep-dive" class="container philosophy-section reveal">
        <div class="section-header">
          <span class="section-tag-index">ENGINEERING PHILOSOPHY / 工程哲学</span>
        </div>
        
        <div class="philosophy-list">
          <div v-for="item in philosophies" :key="item.id" class="ph-row">
            <span class="ph-id">{{ item.id }}</span>
            <div class="ph-main">
              <h3 class="ph-title">{{ item.title }}</h3>
              <div class="ph-meta">
                <span class="ph-tags">{{ item.tags }}</span>
                <span class="ph-divider">|</span>
                <span class="ph-desc">{{ item.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Engineering Stack (New) -->
      <section class="container philosophy-section reveal">
        <div class="section-header">
          <span class="section-tag-index">ENGINEERING STACK / 工程实现规格</span>
        </div>
        
        <div class="philosophy-list">
          <div v-for="item in engineeringStack" :key="item.id" class="ph-row">
            <span class="ph-id">{{ item.id }}</span>
            <div class="ph-main">
              <h3 class="ph-title">{{ item.title }}</h3>
              <div class="ph-meta">
                <span class="ph-tags">{{ item.tags }}</span>
                <span class="ph-divider">|</span>
                <span class="ph-desc">{{ item.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>




    </main>

    <!-- Footer: System Status Bar -->
    <footer class="system-footer">
      <div class="footer-inner">
        <!-- Left: Identity & Meta -->
        <div class="footer-identity">
          <div class="footer-brand">简序智能<span class="brand-en">INTJsys</span></div>
          <div class="footer-meta">
            <span>SYSTEM_STATUS: OPERATIONAL</span>
            <span>BUILD: SEAM_V4.8 / OIS_PROTOCOL</span>
          </div>
        </div>
        
        <!-- Center: Resource Matrix -->
        <div class="footer-matrix">
          <div class="matrix-row">
            <span class="matrix-label">[ PRODUCT ]</span>
            <span class="matrix-items">TalentAI / INTJ Bridge / Labs</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">[ SPECS ]</span>
            <span class="matrix-items">工程哲学 / 技术规格 / 研发日志</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">[ LEGAL ]</span>
            <span class="matrix-items">隐私政策 / 服务条款</span>
          </div>
        </div>
        
        <!-- Right: Nodes & Copyright -->
        <div class="footer-nodes">
          <div class="nodes-location">LOCATIONS: SZ · HK · SH</div>
          <div class="nodes-copyright">© 2025 INTJsys · ALL RIGHTS RESERVED.</div>
          <div class="nodes-icp"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026005920号</a></div>
        </div>
      </div>
    </footer>

    <!-- 登录 Modal -->
    <LoginModal v-model="showLoginModal" />
  </div>
</template>

<style scoped>
/* ========================================
   CSS Variables - 极简工业风设计系统
   在 scoped 样式中，变量需要定义在组件根元素上
   ======================================== */

/* ========================================
   Base Styles
   ======================================== */
.page {
  /* CSS Variables */
  --bg: #ffffff;
  --fg: #111111;
  --muted: #666666;
  --border: rgba(0, 0, 0, 0.08);
  --grid-line: rgba(0, 0, 0, 0.04); /* 稍微加深一点栅格 */
  --dot-color: rgba(0, 0, 0, 0.15); /* 加深点阵颜色确保可见 */
  --accent: #000000;
  --radius: 12px;
  --section-padding: 160px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Base Styles */
  min-height: 100vh;
  color: var(--fg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;

  /* 
    Layer 1 (上层): 横向栅格
    Layer 2 (上层): 纵向栅格
    Layer 3 (底层): 纯白背景色
  */
  background-color: var(--bg);
  background-image: 
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  
  /* 调整背景位置和尺寸 */
  background-size: 40px 40px, 40px 40px;
  background-position: 0 0, 0 0;
  
  /* 关键：local 或 scroll 都可以让背景随内容移动，
     但在 main 容器上，默认就是随文档流动的 */
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box; /* Critical for alignment */
}

/* Panel Inner */
.panel-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

/* ========================================
   动效基础类
   ======================================== */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s var(--ease), transform 0.8s var(--ease);
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

/* ========================================
   Header
   ======================================== */
.header {
  position: sticky;
  top: 0;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid var(--fg);
  z-index: 1000;
}

.header-inner {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

.logo {
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.04em;
  text-decoration: none;
  color: var(--fg);
  transition: opacity 0.2s var(--ease);
}

.logo:hover {
  opacity: 0.7;
}

.logo span {
  font-weight: 400;
  color: var(--muted);
  margin-left: 4px;
}

.nav {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  color: var(--muted);
  transition: color 0.2s var(--ease);
}

.nav-link:hover {
  color: var(--fg);
}

.btn-login {
  padding: 8px 16px;
  border: 1px solid var(--fg);
  border-radius: 0;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  color: var(--fg);
  transition: all 0.2s var(--ease);
}

.btn-login:hover {
  background: var(--fg);
  color: #fff;
}

/* 用户下拉卡片 */
.user-dropdown {
  position: relative;
}

.btn-user {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--fg);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.btn-user:hover {
  background: var(--fg);
  color: #fff;
}

.btn-user .arrow {
  font-size: 10px;
  opacity: 0.6;
}

.user-card {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 240px;
  background: #fff;
  border: 1px solid var(--fg);
  z-index: 1001;
}

.user-card-header {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: var(--fg);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-card-id {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

.user-card-stats {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}

.stat-label {
  font-size: 12px;
  color: var(--muted);
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
}

.btn-logout {
  display: block;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: none;
  font-size: 13px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #f5f5f5;
  color: var(--fg);
}

/* ========================================
   Dropdown Panels
   ======================================== */
.dropdown-panel {
  position: absolute;
  top: 72px;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--fg);
  padding: 32px 0;
  z-index: 999;
}

.panel-grid {
  display: grid;
  gap: 16px;
}

.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(4, 1fr); }

.panel-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  text-decoration: none;
  border: 1px solid #000 !important;
  background: #fff;
  transition: background 0.15s;
}

.panel-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.panel-icon {
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-weight: 700;
  font-size: 16px;
  color: var(--fg);
  flex-shrink: 0;
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.panel-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.panel-title {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: -0.01em;
  color: var(--fg);
  text-transform: uppercase;
}

.panel-meta {
  font-family: 'SF Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 6px;
  border: 1px solid var(--border);
}

.panel-desc {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
  margin: 0;
}

/* ========================================
   Hero Section
   ======================================== */
.hero {
  padding: 220px 0 120px;
  text-align: center;
}

.hero-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--muted);
  margin-bottom: 32px;
  display: block;
  animation: fadeInDown 0.8s var(--ease) both;
}

.hero-title {
  font-size: 96px;
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.06em;
  margin-bottom: 40px;
  animation: fadeInUp 1s var(--ease) 0.1s both;
}

.hero-subtitle {
  font-size: 24px;
  max-width: 800px;
  margin: 0 auto 56px;
  color: var(--muted);
  font-weight: 400;
  line-height: 1.4;
  animation: fadeInUp 1s var(--ease) 0.2s both;
}

.hero-cta {
  display: flex;
  gap: 20px;
  justify-content: center;
  animation: fadeInUp 1s var(--ease) 0.3s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========================================
   Buttons
   ======================================== */
.btn {
  padding: 16px 32px;
  background: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 0;
  font-size: 15px;
  font-weight: 600;
  transition: transform 0.3s var(--ease), background 0.3s var(--ease), box-shadow 0.3s var(--ease);
  display: inline-block;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--fg);
}

.btn-ghost:hover {
  background: #000;
  color: #fff;
  border-color: #000;
}

.btn-light {
  background: #fff;
  color: #000;
}

.btn-light:hover {
  background: #f5f5f5;
}

/* ========================================
   Bento Grid
   ======================================== */
.bento {
  padding: 80px 0;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 440px);
  gap: 24px;
}

.bento-card {
  background: #fff;
  border: 1px solid #111;
  border-radius: 0;
  padding: 56px;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.bento-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
}

.card-talent {
  grid-column: span 8;
}

.card-labs {
  grid-column: span 4;
  background: #fff;
}

.card-bridge {
  grid-column: span 12;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-tag {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--muted);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-tag::before {
  content: "";
  width: 8px;
  height: 1px;
  background: var(--muted);
}

.card-title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.03em;
}

.card-desc {
  font-size: 17px;
  color: var(--muted);
  max-width: 440px;
}

.card-desc-sm {
  font-size: 14px;
}

.card-cta {
  margin-top: 40px;
}

/* UI Mockup */
.ui-mockup {
  position: absolute;
  right: 40px;
  bottom: -20px;
  width: 400px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px 12px 0 0;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.6s var(--ease);
}

.bento-card:hover .ui-mockup {
  transform: translateY(-20px);
}

.mockup-bar {
  width: 100%;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-bottom: 12px;
}

.mockup-bar-short {
  width: 60%;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-bottom: 24px;
}

.mockup-row {
  display: flex;
  gap: 12px;
}

.mockup-avatar {
  width: 32px;
  height: 32px;
  background: #000;
  border-radius: 50%;
}

.mockup-content {
  flex: 1;
  height: 32px;
  background: #f5f5f5;
  border-radius: 4px;
}

/* ========================================
   Feature Deep Dive
   ======================================== */
.deep-dive {
  padding: var(--section-padding) 0;
  border-top: 1px solid var(--border);
}

.feature-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 100px;
  align-items: center;
  margin-bottom: 160px;
}

.feature-row:last-child {
  margin-bottom: 0;
}

.feature-row-reverse {
  direction: rtl;
}

.feature-row-reverse .feature-text {
  direction: ltr;
}

.feature-visual {
  background: #fafafa;
  aspect-ratio: 16/10;
  border: 1px solid var(--border);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.4s var(--ease);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-visual:hover {
  border-color: #000;
}

.visual-code {
  font-weight: 800;
  font-size: 100px;
  opacity: 0.03;
}

.feature-text h3 {
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 24px;
}

.feature-text p {
  font-size: 18px;
  color: var(--muted);
  margin-bottom: 32px;
  line-height: 1.6;
}

/* ========================================
   Comparison Section
   ======================================== */
.comparison {
  padding: var(--section-padding) 0;
  background: #111;
  color: #fff;
  border-radius: 32px;
  margin: 0 40px;
}

.comp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-top: 1px solid #222;
}

.comp-col {
  padding: 80px;
  transition: background 0.4s var(--ease);
}

.comp-col:hover {
  background: #161616;
}

.comp-col:first-child {
  border-right: 1px solid #222;
}

.comp-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 40px;
  display: block;
}

.comp-label-light {
  color: #fff;
}

.comp-item {
  margin-bottom: 48px;
  opacity: 0.6;
  transition: opacity 0.4s var(--ease);
}

.comp-col:hover .comp-item {
  opacity: 1;
}

.comp-item h5 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #fff;
}

.comp-item p {
  font-size: 15px;
  color: #777;
  margin: 0;
}

/* ========================================
   Developer Section
   ======================================== */
.developer {
  padding: var(--section-padding) 0;
}

.dev-box {
  background: #000;
  color: #fff;
  border-radius: 24px;
  padding: 100px;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  align-items: center;
}

.dev-content h2 {
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 24px;
}

.dev-content p {
  color: #777;
  margin-bottom: 40px;
  font-size: 18px;
}

.code-editor {
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 32px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 14px;
  color: #777;
  line-height: 1.8;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.code-line {
  white-space: pre;
}

.code-indent {
  padding-left: 2em;
}

.code-empty {
  height: 1.8em;
}

.keyword {
  color: #fff;
  font-weight: 600;
}

.string {
  color: #555;
}

/* ========================================
   Manifesto
   ======================================== */
.manifesto {
  padding: 160px 0;
  border-top: 1px solid var(--border);
}

.manifesto-text {
  font-size: 40px;
  font-weight: 500;
  line-height: 1.3;
  max-width: 900px;
  letter-spacing: -0.03em;
}

.text-muted {
  color: var(--muted);
}

/* ========================================
   Initialize Section (New CTA)
   ======================================== */
.init-section {
  padding: 80px 0 160px;
}

.init-status {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 14px;
  color: #000;
  opacity: 0.5;
  margin-left: 24px;
}

.init-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.init-row {
  display: grid;
  grid-template-columns: 48px 1fr 160px; /* ID | Main(Title+Content) | Action */
  align-items: baseline;
  gap: 24px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.init-row:last-child {
  border-bottom: none;
}

.init-btn {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 14px;
  color: #111;
  text-decoration: none;
  font-weight: 700;
  text-align: right;
  transition: color 0.2s ease;
}

.init-btn:hover {
  text-decoration: underline;
  color: #000;
}

@media (max-width: 768px) {
  .init-grid {
    gap: 40px;
  }
  .init-row {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-bottom: 0;
    border-bottom: none;
  }
  .init-status {
    display: block;
    margin-left: 0;
    margin-top: 8px;
  }
  .init-btn {
    text-align: left;
    margin-top: 8px;
    display: inline-block;
  }
}

/* ========================================
   System Footer (Status Bar Style)
   ======================================== */
.system-footer {
  border-top: 1px solid var(--fg);
  padding: 40px 0;
  background: transparent;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 60px;
}

/* Left: Identity & Meta */
.footer-identity {
  flex: 0 0 auto;
}

.footer-brand {
  font-weight: 900;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: var(--fg);
  margin-bottom: 12px;
}

.brand-en {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 400;
  font-size: 14px;
  margin-left: 6px;
  color: var(--muted);
}

.footer-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-meta span {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.02em;
}

/* Center: Resource Matrix */
.footer-matrix {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
}

.matrix-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.matrix-label {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: var(--fg);
  flex-shrink: 0;
}

.matrix-items {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 11px;
  color: var(--muted);
}

.matrix-items .footer-link {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s var(--ease);
}

.matrix-items .footer-link:hover {
  color: var(--fg);
  text-decoration: underline;
}

/* Right: Nodes & Copyright */
.footer-nodes {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
}

.nodes-location {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 11px;
  color: var(--fg);
  margin-bottom: 8px;
  letter-spacing: 0.1em;
}

.nodes-copyright {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 11px;
  color: var(--muted);
}

.nodes-reserved {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  opacity: 0.6;
}

.nodes-icp {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
}

.nodes-icp a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s var(--ease);
}

.nodes-icp a:hover {
  color: var(--fg);
  text-decoration: underline;
}

/* ========================================
   Responsive Design
   ======================================== */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 64px;
  }

  .bento-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .card-talent,
  .card-labs,
  .card-bridge {
    grid-column: span 1;
  }

  .ui-mockup {
    position: relative;
    right: 0;
    width: 100%;
    margin-top: 40px;
  }

  .feature-row,
  .feature-row-reverse,
  .dev-box,
  .comp-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .feature-row-reverse {
    direction: ltr;
  }

  .comp-col:first-child {
    border-right: none;
    border-bottom: 1px solid #222;
  }

  .manifesto-text {
    font-size: 28px;
  }

  .final-cta h2 {
    font-size: 40px;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }

  .header-inner {
    height: 64px;
  }

  .nav {
    gap: 20px;
  }

  .nav-link {
    display: none;
  }

  .hero {
    padding: 140px 0 80px;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .hero-cta {
    flex-direction: column;
    align-items: center;
  }

  .bento-card {
    padding: 32px;
  }

  .card-title {
    font-size: 28px;
  }

  .feature-text h3 {
    font-size: 32px;
  }

  .comparison {
    margin: 0 20px;
    border-radius: 20px;
  }

  .comp-col {
    padding: 40px;
  }

  .dev-box {
    padding: 40px;
  }

  .dev-content h2 {
    font-size: 32px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

/* Engineering Philosophy Styles */
.philosophy-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px;
  row-gap: 64px;
  margin-top: 60px;
}

.section-tag-index {
  display: block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #999;
  margin-bottom: 8px;
  text-transform: uppercase;
  text-align: center;
}

.section-title-index {
  font-size: 40px;
  font-weight: 800;
  color: #111;
  letter-spacing: -0.02em;
  text-align: center;
}

.ph-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.ph-top {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
  border-bottom: 2px solid #111;
  padding-bottom: 12px;
  width: 100%;
}

.ph-id {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #111;
}

.ph-slash {
  color: #eee;
}

.ph-title {
  font-size: 20px;
  font-weight: 800;
  color: #111;
  letter-spacing: 0.02em;
}

.ph-tags-box {
  margin-bottom: 16px;
}

.ph-tags {
  display: inline-block;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 12px;
  color: #666;
  background: #f4f4f4;
  padding: 4px 8px;
  border-radius: 4px;
}

.ph-content {
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  margin: 0;
  text-align: justify;
}

@media (max-width: 768px) {
  .philosophy-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

/* Compact Dropdown Panel */
.nav-link {
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  color: var(--fg);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
}
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #000;
}

.dropdown-panel {
  position: absolute;
  top: 72px;
  left: 0;
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #000;
  padding: 24px 0; /* Reduced Panel Padding */
  z-index: 999;
}

.panel-grid {
  display: grid;
  gap: 16px; /* Tighter Grid Gap */
}
.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(4, 1fr); }

.panel-item {
  display: flex;
  flex-direction: row; /* Horizontal Layout */
  align-items: flex-start;
  gap: 16px; 
  padding: 16px; /* Compact Item Padding */
  text-decoration: none;
  border: 1px solid transparent; 
  transition: background 0.1s, border-color 0.1s;
}

.panel-item:hover {
  background: #f4f4f4;
  border: 1px solid #000;
}

.panel-icon {
  width: 48px; height: 48px;
  background: #f8f8f8;
  display: flex; align-items: center; justify-content: center;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-weight: 700;
  font-size: 16px;
  color: #000;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.05);
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px; /* Tight text gap */
}

.panel-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.panel-title {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 14px; /* Smaller Title */
  letter-spacing: -0.01em;
  color: #000;
  text-transform: uppercase;
}

.panel-meta {
  font-family: 'SF Mono', monospace;
  font-size: 10px;
  color: #666;
  background: #eee;
  padding: 2px 5px;
  border-radius: 0;
}

.panel-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}
/* Global Grid Background (from About page) */
.page {
  /* CSS Variables */
  --bg: #ffffff;
  --bg-secondary: #fafafa;
  --fg: #111111;
  --muted: #666666;
  --muted-light: #999999;
  --border: transparent;
  --grid-line: rgba(0, 0, 0, 0.04);
  --radius: 0;

  background-color: var(--bg);
  background-image: 
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  
  background-size: 40px 40px, 40px 40px;
  background-position: 0 0, 0 0;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* Hardcore Linear Styling */
.section-tag-index {
  font-family: 'SF Mono', 'Roboto Mono', monospace; 
  font-weight: 700; 
  letter-spacing: 0.1em;
  font-size: 14px;
  padding-left: 0;
  margin-bottom: 40px;
}

.philosophy-section, .tech-log-section {
  padding: 60px 0;
}

/* Philosophy: 3-Column Grid (ID | Title+Tags | Content) */
.philosophy-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.ph-row {
  display: grid;
  grid-template-columns: 48px 1fr;
  align-items: baseline;
  gap: 24px;
}

.ph-id {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  color: #000;
  opacity: 0.4;
}

.ph-main {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  align-items: baseline;
}

.ph-title {
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin: 0;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.ph-meta {
  display: block;
}

.ph-tags {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 12px;
  color: #888;
  display: block;
  margin-top: 4px;
  text-transform: uppercase;
}

.ph-desc {
  color: #333;
  font-size: 15px;
  line-height: 1.6;
  text-align: justify;
}

/* Tech Log: Strict Table Row */
.log-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-row {
  display: grid;
  grid-template-columns: 120px 1fr; /* 修正为2列: [Date] [Content] */
  align-items: baseline;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 13px;
  color: #444;
}

.log-date {
  color: #999;
}

.log-content {
  display: flex;
  gap: 12px;
  flex-wrap: wrap; 
  align-items: baseline;
}

.log-type {
  font-weight: 700;
  color: #000;
  min-width: 80px; /* Type 在 Flex 容器中模拟列宽 */
}

.log-title {
  font-weight: 700;
  color: #111;
  font-family: 'Inter', sans-serif;
}

.log-tag {
  color: #888;
  background: #f4f4f4;
  padding: 0 4px;
}

.log-divider {
  color: #eee;
}

.log-desc {
  color: #666;
  font-family: 'Inter', sans-serif;
  margin-left: 12px;
}

/* Footer Container */
.footer-container {
  padding: 0 !important;
}

/* Footer Brand Styles */
.footer-brand-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  text-decoration: none;
}

.footer-brand-text {
  font-weight: 900;
  font-size: 20px;
  letter-spacing: -0.02em;
  color: var(--fg);
}

.footer-brand-sub {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.footer-desc {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 16px;
}

.footer-tech-badge {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.footer-tech-badge span {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  background: rgba(0, 0, 0, 0.04);
  padding: 4px 8px;
  border: 1px solid var(--border);
}

/* Footer Bottom Styles */
.footer-legal {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.footer-legal span {
  color: var(--muted);
}

.footer-legal a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-legal a:hover {
  color: var(--fg);
}

.footer-separator {
  color: var(--border);
}

.footer-locations {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.1em;
}

/* Responsive */
@media (max-width: 1024px) {
  .ph-main {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .ph-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .log-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .log-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .log-divider { display: none; }
  
  .log-type {
    min-width: auto;
  }
}
</style>

<!-- Global: overflow-x on html (not .page) to allow sticky to work -->
<style>
html {
  overflow-x: hidden;
}
</style>
