<script setup lang="ts">
// 团队成员
// 团队成员 - 瑞士网格表版
const members = [
  {
    name: "REALLIER",
    role: "SDK Efficiency",
    summary: "前海外独角兽架构负责人。侧重架构解构与生产可行性。"
  },
  {
    name: "GZZCH",
    role: "Infrastructure",
    summary: "资深 DevOps 专家。侧重全链路观测与系统稳定性。"
  },
  {
    name: "ROUVA",
    role: "Interaction",
    summary: "前大厂 Agent 落地负责人。侧重协议定义与交互闭环。"
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

// 核心优势 - 工程哲学
const philosophy = [
  {
    index: "I",
    title: "数据主权",
    enTitle: "Data Sovereignty",
    slogan: "环境感知优于数据托管。",
    detail: "拒绝黑盒化云服务。坚持 Private-First 部署范式，确保 AI 逻辑流转完全受控于客户的私有网络（VPC）与安全审计体系。交付即物理隔离，将隐私风险降至工程理论值的最低点。"
  },
  {
    index: "II",
    title: "原子集成",
    enTitle: "Atomic Architecture",
    slogan: "低侵入、低熵值的架构准则。",
    detail: "摒弃重型工作流框架的逻辑冗余。采用原子化微服务封装 AI 能力，实现对存量业务系统（CRM/OA/ERP）的无感介入与低成本插拔。严禁架构越权。"
  },
  {
    index: "III",
    title: "链路确定性",
    enTitle: "Deterministic Observability",
    slogan: "链路可观测性是生产力的第一命脉。",
    detail: "引入分布式链路追踪（Deep Trace）标准。通过强类型协议约束，实现模型决策路径的全量透明化。终结随机性猜想，具备秒级的根因溯源能力。"
  },
  {
    index: "IV",
    title: "动作导向交互",
    enTitle: "Action-Oriented Interface",
    slogan: "效率工具应当从“对话”向“动作”回归。",
    detail: "利用 LLM 提取结构化参数，直接驱动底层工程脚本或 API 动作，实现“意图即执行”的极简交互。拒绝效率损耗，严禁在具备确定性自动化路径的场景中使用多轮自然语言确认。"
  },
  {
    index: "V",
    title: "结构化协作协议",
    enTitle: "Schema-First Protocol",
    slogan: "彻底终结非结构化信息的“有损压缩”。",
    detail: "强制执行 Schema-based 的模型间通讯。禁止 Agent 之间使用自然语言汇报工作，所有协作指令必须通过标准 JSON 协议传递，隔离幻觉风险，仅交换确定的数据状态。"
  },
  {
    index: "VI",
    title: "工业级吞吐效能",
    enTitle: "Production-Grade Throughput",
    slogan: "极致的执行效能优于拟人化的逻辑堆砌。",
    detail: "沿袭企业级 SDK 架构范式，深度优化推理路径。在高并发生产环境下，确保 AI 模块具备毫秒级的响应能力与极低的资源熵增。拒绝交付非生产级原型。"
  }
];
</script>

<template>
  <div class="about-page">
    <!-- 顶部导航 -->
    <header class="about-header">
      <div class="container header-inner">
        <a href="/" class="logo">简序智能<span>INTJsys</span></a>
        <nav class="nav">
          <a href="/" class="nav-link">首页</a>
          <a href="#team" class="nav-link">团队</a>
        </nav>
      </div>
    </header>

    <main class="about-main">
      <!-- Hero -->
      <section class="hero-section">
        <div class="container">
          <span class="hero-label">About Us</span>
          <h1 class="page-title">关于我们</h1>
          <p class="page-subtitle">小而精的工程团队，帮小微企业把重复又重要的工作交给 Agent 处理，让自动化落地更省时间、更可控。</p>
        </div>
      </section>

      <!-- 团队介绍 -->
      <section id="team" class="team-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Team</span>
            <h2 class="section-title">核心团队</h2>
          </div>
          <!-- Swiss Spec List -->
          <div class="team-list">
            <div v-for="(member, index) in members" :key="member.name" class="member-row">
              <span class="row-index">{{ (index + 1).toString().padStart(2, '0') }}</span>
              <div class="row-content">
                <span class="row-name">{{ member.name }}</span>
                <span class="row-divider">|</span>
                <span class="row-role">{{ member.role }}</span>
                <span class="row-divider mobile-hide">|</span>
                <p class="row-summary mobile-hide">{{ member.summary }}</p>
              </div>
            </div>
            <!-- 移动端额外显示摘要，因为上面的一行放不下 -->
            <div class="mobile-only-summary">
              <!-- (可选：如果需要在移动端优化显示) -->
            </div>
          </div>
        </div>
      </section>

      <!-- 工程哲学 -->
      <section class="philosophy-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Engineering Philosophy</span>
            <h2 class="section-title">工程哲学</h2>
          </div>
          <div class="philosophy-grid">
            <div v-for="item in philosophy" :key="item.index" class="philosophy-card">
              <div class="ph-index">{{ item.index }}</div>
              <div class="ph-header">
                <h3 class="ph-title">{{ item.title }}</h3>
                <span class="ph-en-title">{{ item.enTitle }}</span>
              </div>
              <div class="ph-content">
                <p class="ph-slogan">{{ item.slogan }}</p>
                <p class="ph-detail">{{ item.detail }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术日志 -->
      <section class="notes-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Tech Log</span>
            <h2 class="section-title">技术日志</h2>
          </div>
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
          <div class="section-header section-header-center">
            <span class="section-tag">Contact</span>
            <h2 class="section-title">联系我们</h2>
          </div>
          <div class="contact-content">
            <p>如有合作意向或技术咨询，欢迎通过以下方式联系：</p>
            <div class="contact-info">
              <a href="mailto:contact@intjtech.cn" class="contact-item">
                <span class="contact-icon"><FaIcon icon="at" /></span>
                <span>contact@intjtech.cn</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="about-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <a href="/" class="footer-logo">简序智能</a>
          <p>构建高效、智能的 AI 工具组件，让逻辑驱动生产力。</p>
        </div>
        <div class="footer-bottom">
          <div>© 2025 深圳简序智能科技有限公司</div>
          <span>SZ · HK · SH</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ========================================
   CSS Variables - 黑白灰极简设计系统
   ======================================== */
.about-page {
  /* CSS Variables */
  --bg: #ffffff;
  --bg-secondary: #fafafa;
  --fg: #111111;
  --muted: #666666;
  --muted-light: #999999;
  --border: rgba(0, 0, 0, 0.08);
  --grid-line: rgba(0, 0, 0, 0.04);
  --dot-color: rgba(0, 0, 0, 0.15);
  --radius: 12px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Base Styles */
  min-height: 100vh;
  color: var(--fg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;

  /* 背景层合并：栅格(Top) + 底色(Bottom) */
  background-color: var(--bg);
  background-image: 
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  
  background-size: 40px 40px, 40px 40px;
  background-position: 0 0, 0 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ========================================
   Header - 与首页统一
   ======================================== */
.about-header {
  position: sticky;
  top: 0;
  /* 移除背景色，完全透明以透出网格 */
  background: transparent;
  backdrop-filter: blur(0); /* 移除模糊，彻底通透 */
  z-index: 1000;
  border-bottom: none; /* 移除 Header 分割线 */
}

.header-inner {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  border-radius: 6px;
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

/* ========================================
   Hero Section
   ======================================== */
.hero-section {
  padding: 120px 0 80px;
  text-align: center;
  background: transparent;
}

.hero-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--muted);
  margin-bottom: 24px;
  display: block;
}

.page-title {
  font-size: 64px;
  font-weight: 800;
  color: var(--fg);
  margin-bottom: 24px;
  letter-spacing: -0.04em;
}

.page-subtitle {
  font-size: 20px;
  color: var(--muted);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ========================================
   Section Headers
   ======================================== */
.section-header {
  margin-bottom: 48px;
}

.section-header-center {
  text-align: center;
}

.section-tag {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--muted);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-tag::before {
  content: "";
  width: 8px;
  height: 1px;
  background: var(--muted);
}

.section-header-center .section-tag {
  justify-content: center;
}

.section-header-center .section-tag::before {
  display: none;
}

.section-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--fg);
  letter-spacing: -0.03em;
}

/* ========================================
   Team Section
   ======================================== */
.team-section {
  padding: 80px 0;
  border-top: none; /* 移除分割线 */
}

.team-grid {
  /* 废弃网格，改为 flex column 布局 */
  display: flex;
  flex-direction: column;
}

/* Bold Typography List Style (baseline alignment) */
.member-row {
  display: flex;
  align-items: baseline; /* 回归基线对齐，以文字底部为准 */
  padding: 32px 0;
  border-bottom: none; 
  transition: transform 0.3s var(--ease);
  cursor: default;
  /* 移除固定高度，让基线自然决定高度，靠 padding 撑开 */
}

.member-row:hover {
  background-color: transparent;
  transform: translateX(10px);
}

.member-row:first-child {
  border-top: none;
}

.row-index {
  font-family: 'Inter', sans-serif;
  font-size: 16px; 
  font-weight: 900;
  color: var(--fg);
  width: auto; /* 关键修改: 移除固定宽度，改为自适应 */
  flex-shrink: 0;
  opacity: 0.3;
  margin-right: 6px; 
}

.row-content {
  flex: 1;
  display: flex;
  align-items: baseline; 
  gap: 0; /* 移除 gap，完全由子元素 margin 控制 */
  font-family: 'Inter', sans-serif;
  flex-wrap: nowrap; 
  overflow: hidden; 
}

.row-name {
  font-size: 64px; 
  font-weight: 900;
  color: var(--fg);
  text-transform: uppercase;
  letter-spacing: -0.04em; 
  line-height: 1; 
  width: auto; /* 移除固定宽度，自然跟随 */
  margin-right: 16px; /* 名字和角色之间的间距 */
  flex-shrink: 0; 
}

.row-divider {
  display: none;
}

.row-role {
  font-size: 20px; 
  font-weight: 800; 
  color: var(--fg);
  text-transform: uppercase;
  letter-spacing: 0em; 
  width: auto; /* 移除固定宽度 */
  margin-right: 24px; /* 角色和简介之间的间距 */
  flex-shrink: 0;
}

.row-summary {
  font-size: 18px; 
  font-weight: 500;
  color: var(--muted);
  margin: 0;
  line-height: normal; 
  flex: 1;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis; 
}

/* Mobile Responsive */
.mobile-hide {
  display: inline-block;
}

@media (max-width: 768px) {
  .mobile-hide {
    display: none;
  }
  
  .member-row {
    flex-wrap: wrap;
    align-items: flex-start;
  }
  
  .row-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .row-role {
    width: auto;
    font-size: 12px;
  }
}

/* ========================================
   Philosophy Section
   ======================================== */
.philosophy-section {
  padding: 80px 0;
  border-top: none; /* 移除分割线 */
}

.philosophy-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.philosophy-card {
  position: relative;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px;
  transition: all 0.4s var(--ease);
  overflow: hidden;
}

.philosophy-card:hover {
  border-color: var(--fg);
  transform: translateY(-2px);
}

.ph-index {
  font-family: 'Times New Roman', serif;
  font-size: 80px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.03);
  position: absolute;
  top: 10px;
  right: 20px;
  line-height: 1;
  pointer-events: none;
  transition: color 0.4s var(--ease);
}

.philosophy-card:hover .ph-index {
  color: rgba(0, 0, 0, 0.08);
}

.ph-header {
  margin-bottom: 24px;
  position: relative;
}

.ph-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--fg);
  margin-bottom: 4px;
}

.ph-en-title {
  display: block;
  font-family: 'Times New Roman', serif;
  font-style: italic;
  font-size: 16px;
  color: var(--muted-light);
}

.ph-slogan {
  font-size: 15px;
  font-weight: 600;
  color: var(--fg);
  margin-bottom: 8px;
  border-left: 2px solid var(--fg);
  padding-left: 12px;
}

.ph-detail {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
  margin: 0;
  text-align: justify;
}

/* ========================================
   Notes Section
   ======================================== */
.notes-section {
  padding: 80px 0;
  border-top: none; /* 移除分割线 */
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.note-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
  transition: all 0.4s var(--ease);
}

.note-card:hover {
  border-color: var(--fg);
}

.note-date {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-light);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.note-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--fg);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.note-summary {
  font-size: 15px;
  color: var(--muted);
  line-height: 1.7;
  margin: 0;
}

/* ========================================
   Contact Section
   ======================================== */
.contact-section {
  padding: 80px 0;
  text-align: center;
  border-top: none; /* 移除分割线 */
}

.contact-content p {
  color: var(--muted);
  margin-bottom: 32px;
  font-size: 16px;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: var(--fg);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s var(--ease);
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.contact-icon {
  font-size: 18px;
}

/* ========================================
   Footer
   ======================================== */
.about-footer {
  padding: 80px 0 40px;
  border-top: none; /* 移除分割线 */
}

.footer-inner {
  text-align: center;
}

.footer-brand {
  margin-bottom: 40px;
}

.footer-logo {
  font-weight: 800;
  font-size: 18px;
  color: var(--fg);
  text-decoration: none;
  display: block;
  margin-bottom: 12px;
}

.footer-logo:hover {
  opacity: 0.7;
}

.footer-brand p {
  color: var(--muted);
  font-size: 14px;
  max-width: 300px;
  margin: 0 auto;
}

.footer-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding-top: 24px;
  border-top: none; /* 移除分割线 */
  font-size: 13px;
  color: var(--muted-light);
}

/* ========================================
   Responsive
   ======================================== */
@media (max-width: 1024px) {
  .team-grid,
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-title {
    font-size: 48px;
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
  
  .hero-section {
    padding: 80px 0 60px;
  }
  
  .page-title {
    font-size: 36px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .team-grid,
  .advantages-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .member-card,
  .advantage-card,
  .note-card {
    padding: 24px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
