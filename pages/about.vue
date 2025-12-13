<script setup lang="ts">
// 团队成员
const members = [
  {
    name: "Reallier",
    role: "前海外独角兽 SDK 效能架构负责人",
    bullets: [
      "负责整体技术方案、系统设计和项目把控",
      "熟悉企业级生产环境、稳定性与可维护性",
      "擅长把‘想法’拆成能长期维护技术方案"
    ],
    summary: "方向与架构把控，强调可维护性与生产可行性。"
  },
  {
    name: "Gzzch",
    role: "技术极客 / DevOps & 深度开发",
    bullets: [
      "长期在一线做深度开发，技术圈小有名气",
      "容器化、监控、自动化部署经验丰富",
      "让 Agent 在生产环境稳定、可观测、可追责"
    ],
    summary: "系统与运维质量，保障上线后的稳定度。"
  },
  {
    name: "Rouva",
    role: "前大厂设计部门 Agent 落地技术负责人",
    bullets: [
      "在大厂负责设计团队内部 Agent / 自动化落地",
      "懂产品与审美，也熟悉 Agent 技术",
      "擅长把复杂流程做成好用、好看、好上手的工具"
    ],
    summary: "体验与落地细节，确保‘能用、好用’。"
  }
];

// 技术日志
const techNotes = [
  {
    date: "2025-02-20",
    title: "Coze / Dify / n8n：近期上手要点与踩坑记录",
    summary: "Coze 的灵魂在工作流与插件，要自己调 chunk 策略与 API adapter；Dify 像工程师的 AI 中台，RAG/日志/观测完善但生产部署要把数据库、向量库、对象存储和反代配齐；n8n 本质是自动化引擎，AI 节点很薄，记得限流、封装上下文。"
  },
  {
    date: "2025-02-20",
    title: "Airflow 的价值是透明性，而非执行性能",
    summary: "延迟主要来自调度与进程通信开销，天生不适合低延迟场景；它在批处理和数据管道里提供可追溯、可观测的可见性，TaskFlow API 体现'代码即 DAG'；规模化后文档支撑有限，但生态惯性让它仍是事实标准。"
  },
  {
    date: "2025-02-20",
    title: "AI 退潮后的温度：接受边界、换取确定性",
    summary: "以 Airflow 为例，系统设计选择了延迟换透明，适用跨系统异步与批量编排，不适合高并发实时；Ni/Te/Fi/Se 的取舍收敛到同一结论：成熟系统靠可观测与确定性站稳，而非追求极致反应速度。"
  }
];

// 核心优势
const advantages = [
  {
    title: "安全可控，数据在你们手里",
    tag: "安全",
    detail: "支持私有化 / 专有云部署；权限控制、操作审计、数据脱敏齐备，数据留在你们环境。",
    icon: "🛡️"
  },
  {
    title: "易集成、少侵入，方便维护",
    tag: "对接",
    detail: "对接 IM / CRM / 工单 / 知识库 / OA；通过 API / 中间层 / Agent 二开，降低侵入并可版本管理关键逻辑。",
    icon: "🔌"
  },
  {
    title: "可观测、可接手，避免锁定",
    tag: "可控",
    detail: "代码、脚本、配置优先放在你们仓库；命中率、转人工、覆盖率等指标可观测可导出，附文档与培训便于自查。",
    icon: "📊"
  }
];
</script>

<template>
  <div class="about-page">
    <!-- 顶部导航 -->
    <header class="about-header">
      <div class="container">
        <a href="/" class="brand">
          <img src="/site-logo.png" alt="简序智能" class="brand-logo" />
          <span class="brand-name">简序智能</span>
        </a>
        <nav class="nav-links">
          <a href="/" class="nav-link">首页</a>
          <a href="/console" class="nav-link">控制台</a>
        </nav>
      </div>
    </header>

    <main class="about-main">
      <!-- Hero -->
      <section class="hero-section">
        <div class="container">
          <h1 class="page-title">关于我们</h1>
          <p class="page-subtitle">小而精的工程团队，帮小微企业把重复又重要的工作交给 Agent 处理</p>
        </div>
      </section>

      <!-- 团队介绍 -->
      <section class="team-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-icon">👥</span>
            核心团队
          </h2>
          <div class="team-grid">
            <div v-for="member in members" :key="member.name" class="member-card">
              <div class="member-avatar">{{ member.name.charAt(0) }}</div>
              <div class="member-info">
                <h3 class="member-name">{{ member.name }}</h3>
                <p class="member-role">{{ member.role }}</p>
                <ul class="member-bullets">
                  <li v-for="(bullet, i) in member.bullets" :key="i">{{ bullet }}</li>
                </ul>
                <p class="member-summary">{{ member.summary }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术优势 -->
      <section class="advantages-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-icon">✨</span>
            我们的优势
          </h2>
          <div class="advantages-grid">
            <div v-for="adv in advantages" :key="adv.title" class="advantage-card">
              <div class="adv-icon">{{ adv.icon }}</div>
              <div class="adv-content">
                <span class="adv-tag">{{ adv.tag }}</span>
                <h3 class="adv-title">{{ adv.title }}</h3>
                <p class="adv-detail">{{ adv.detail }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术日志 -->
      <section class="notes-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-icon">📝</span>
            技术日志
          </h2>
          <div class="notes-list">
            <article v-for="note in techNotes" :key="note.title" class="note-card">
              <div class="note-date">{{ note.date }}</div>
              <h3 class="note-title">{{ note.title }}</h3>
              <p class="note-summary">{{ note.summary }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="contact-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-icon">📧</span>
            联系我们
          </h2>
          <div class="contact-content">
            <p>如有合作意向或技术咨询，欢迎通过以下方式联系：</p>
            <div class="contact-info">
              <a href="mailto:contact@intjtech.cn" class="contact-item">
                <span class="contact-icon">📮</span>
                <span>contact@intjtech.cn</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="about-footer">
      <div class="container">
        <p>© 2025 简序智能 · AI Agent 技术服务</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.about-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.about-header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #6366f1;
}

/* Main */
.about-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

/* Hero */
.hero-section {
  padding: 80px 0 60px;
  text-align: center;
}

.page-title {
  font-size: 48px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 20px;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

/* Section Titles */
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
}

.title-icon {
  font-size: 28px;
}

/* Team Section */
.team-section {
  padding: 60px 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.member-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.member-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

.member-name {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.member-role {
  font-size: 14px;
  color: #6366f1;
  margin-bottom: 16px;
}

.member-bullets {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}

.member-bullets li {
  font-size: 14px;
  color: #64748b;
  padding-left: 16px;
  position: relative;
  margin-bottom: 8px;
}

.member-bullets li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #6366f1;
}

.member-summary {
  font-size: 13px;
  color: #94a3b8;
  font-style: italic;
}

/* Advantages Section */
.advantages-section {
  padding: 60px 0;
  background: white;
  margin: 0 -32px;
  padding-left: 32px;
  padding-right: 32px;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.advantage-card {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
}

.adv-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: white;
  border-radius: 12px;
  flex-shrink: 0;
}

.adv-tag {
  display: inline-block;
  padding: 2px 8px;
  background: #6366f1;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  margin-bottom: 8px;
}

.adv-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.adv-detail {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

/* Notes Section */
.notes-section {
  padding: 60px 0;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.note-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.note-date {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.note-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.note-summary {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
}

/* Contact Section */
.contact-section {
  padding: 60px 0;
  text-align: center;
}

.contact-content p {
  color: #64748b;
  margin-bottom: 24px;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  color: #1e293b;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.contact-item:hover {
  background: #6366f1;
  color: white;
}

.contact-icon {
  font-size: 18px;
}

/* Footer */
.about-footer {
  padding: 32px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  border-top: 1px solid #e2e8f0;
  background: white;
}

/* Responsive */
@media (max-width: 1024px) {
  .team-grid,
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .about-main {
    padding: 0 20px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .team-grid,
  .advantages-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-links {
    display: none;
  }
}
</style>
