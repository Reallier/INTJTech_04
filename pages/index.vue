<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type NavItem = { id: string; label: string };
type Service = {
  title: string;
  fit: string;
  tasks: string[];
  outcomes: string[];
};
type CaseItem = {
  title: string;
  background: string;
  actions: string[];
  outcome: string;
};
type Advantage = { title: string; detail: string };
type Pricing = {
  title: string;
  duration: string;
  fit: string[];
  includes: string[];
  price: string;
  featured?: boolean;
};
type Member = {
  name: string;
  role: string;
  bullets: string[];
  summary: string;
};
type NoteItem = { date: string; title: string; summary: string };

const navItems: NavItem[] = [
  { id: "hero", label: "Hero" },
  { id: "services", label: "我们能帮你做什么" },
  { id: "cases", label: "案例" },
  { id: "advantages", label: "为什么找我们" },
  { id: "pricing", label: "合作方式/定价" },
  { id: "team", label: "团队" },
  { id: "notes", label: "更新日志" },
  { id: "contact", label: "联系我们" }
];

const services: Service[] = [
  {
    title: "客服 / 咨询类 Agent",
    fit: "适合有大量重复问答的团队（课程咨询、电商售后、服务介绍等）",
    tasks: [
      "整理 FAQ / 文档 / 话术，搭建可检索的知识库",
      "设计“有边界”的 Agent：能解答问题，但避免乱承诺 / 乱报价",
      "接入你已有的渠道（官网对话框、客服系统、企业微信等）"
    ],
    outcomes: [
      "重复问题在几秒内得到更统一的回答",
      "新人客服更快上手，不用频繁问“这个怎么回？”"
    ]
  },
  {
    title: "数据整理 & 报表类 Agent",
    fit: "适合经常有人在做“导出 Excel → 复制粘贴 → 截图发老板”的团队",
    tasks: [
      "从现有系统 / 表格中抽取关键数据",
      "搭“整理 + 总结”的 Agent（生成日报 / 周报 / 摘要）",
      "按老板习惯，输出可直接转发的简报（文字 / 表格）"
    ],
    outcomes: [
      "少做大量机械的复制粘贴和截图",
      "更快得到“这周发生了什么”这种结论级信息"
    ]
  },
  {
    title: "内部知识问答 / 培训 Agent",
    fit: "适合文档多、新人多，但没人有空“从头再讲一遍”的团队",
    tasks: [
      "整理内部文档、流程说明、培训材料",
      "搭建内部问答 Agent，回答流程 / 操作问题",
      "嵌入日常使用的工具（协作平台 / 内部后台 / 知识库）"
    ],
    outcomes: [
      "新人遇到问题先问系统，而不是每次打断老员工",
      "更容易发现文档空白与缺口，持续补充"
    ]
  }
];

const cases: CaseItem[] = [
  {
    title: "案例示意 1：客服问答 Agent（零售 + 线上咨询）",
    background: "背景：每天大量重复问题，客服压力大，新人难培训。",
    actions: [
      "整理 FAQ → 搭建问答 Agent → 接入现有客服系统",
      "通过业务约束避免“乱承诺 / 乱报价”"
    ],
    outcome: "效果：常见问题直接引用 Agent 回答，新人培训周期明显变短。"
  },
  {
    title: "案例示意 2：内部知识问答 Agent（小团队 Onboarding）",
    background:
      "背景：业务流程复杂，新人怕出错，老员工经常被打断回答问题。",
    actions: [
      "梳理流程文档 → 搭内部问答 Agent → 嵌入协作工具",
      "设定权限边界，避免越权回答"
    ],
    outcome:
      "效果：新人多数问题可自助查到，老员工工作连续性提升，问题记录沉淀回文档。"
  },
  {
    title: "案例示意 3：自动报表 Agent（运营周报自动化）",
    background:
      "背景：每周运营同事花半天在“导数据 → 做 PPT → 发周报”。",
    actions: [
      "接入业务数据 → 设计指标与模板 → 生成周报草稿",
      "在真实数据上持续调优摘要和格式"
    ],
    outcome:
      "效果：周报生成时间从半天缩短到几十分钟，更多精力放在分析而不是排版。"
  }
];

const advantages: Advantage[] = [
  {
    title: "试错成本低",
    detail: "可以从小场景、小部门先试，不需要一开始就做“大而全”。"
  },
  {
    title: "沟通链路短",
    detail: "基本直接和核心工程师对话，需求理解和落地更快。"
  },
  {
    title: "偏好快速迭代",
    detail: "习惯先上线可用版本，再在真实使用里持续调，不拖长周期。"
  },
  {
    title: "善于二次开发",
    detail: "优先叠加在你现有流程与工具上，而不是让你重做系统。"
  },
  {
    title: "方案更灵活不套路",
    detail: "不会给你包装好的标准化模板，而是根据你的业务特点定制最轻、最合适的方案。"
  },
  {
    title: "更在意长期合作",
    detail: "小团队没有“项目指标压力”，我们更关注的是能不能持续给你带来价值，因为每一个真实有效的合作，对我们都很重要。"
  }
];

const pricing: Pricing[] = [
  {
    title: "01. Agent 试水包",
    duration: "1–2 周",
    fit: [
      "想快速验证某个 AI 场景是否可行",
      "需要可演示、可使用的 Agent MVP",
      "希望以较小预算先试水"
    ],
    includes: [
      "1 个可运行的 Agent MVP",
      "输入 / 输出格式设计",
      "简易界面或 API 接口",
      "轻量部署（单容器 / Serverless 等）",
      "最多 1 次小范围迭代"
    ],
    price: "￥8,000 – ￥20,000"
  },
  {
    title: "02. 小规模上线包",
    duration: "3–6 周",
    fit: [
      "方向已验证，想真正用在业务流程中",
      "希望做“可维护的功能”，而不只是 Demo",
      "想先在有限范围内落地 AI"
    ],
    includes: [
      "1–3 个 Agent 的完整工作流",
      "与现有系统的轻量集成（API / 数据接口 / 权限）",
      "可用界面或嵌入式组件",
      "部署、日志、监控和错误处理基础设施",
      "2–3 轮基于真实使用的优化迭代"
    ],
    price: "￥25,000 – ￥60,000",
    featured: true
  },
  {
    title: "03. 月度优化包",
    duration: "按月订阅",
    fit: [
      "已有 AI 能力上线，希望持续提升效果与稳定性",
      "需要小规模功能扩展、改进、调优",
      "希望有稳定技术伙伴按月支持"
    ],
    includes: [
      "prompt 调优与模型效果改进",
      "小功能开发 / 小流程扩展",
      "错误分析、修复与监控",
      "模型更新、数据增强",
      "固定月度工时（如 20 / 40 / 80 小时包）"
    ],
    price: "￥4,000 – ￥15,000 / 月"
  }
];

const members: Member[] = [
  {
    name: "Reallier",
    role: "前海外独角兽 SDK 效能架构负责人",
    bullets: [
      "负责整体技术方案、系统设计和项目把控",
      "熟悉企业级生产环境、稳定性与可维护性",
      "擅长把“想法”拆成能长期维护技术方案"
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
    summary: "体验与落地细节，确保“能用、好用”。"
  }
];

const notes: NoteItem[] = [
  {
    date: "2025-01-xx",
    title: "给内部客服系统接入 Agent 时，如何处理“模糊问题”和“超出权限的问题”",
    summary: "设定业务边界、拒绝策略与转人工分流，避免越界回答。"
  },
  {
    date: "2025-01-xx",
    title: "从 Excel 报表到自动周报：一次把“复制粘贴”替换掉的实战拆解",
    summary: "输入格式规范化、指标抽象、模版化输出、上线后的监测与回放。"
  },
  {
    date: "2025-01-xx",
    title: "在老系统里接入新 Agent：我们常用的“最小侵入式”集成策略",
    summary: "API 适配、鉴权与审计、逐步 rollout 的开关策略。"
  }
];

const heroChips = ["1–6 周交付", "￥8,000–￥60,000 典型预算", "偏工程、少花哨"];
const timeline = ["想法 / 场景梳理", "快速试水 MVP", "小规模上线", "持续优化与监控"];

const activeSection = ref("hero");
let observer: IntersectionObserver | null = null;

onMounted(() => {
  // 强制滚动到页面顶部 - 使用多种方式确保兼容性
  window.scrollTo({ top: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    {
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0.3
    }
  );

  navItems.forEach((item) => {
    const el = document.getElementById(item.id);
    if (el) {
      observer?.observe(el);
    }
  });
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <div class="page">
    <header class="top-nav">
      <div class="container">
        <div class="brand">
          <img src="/site-logo.png" alt="紫薯科技Logo" style="width: 40px; height: 40px; vertical-align: middle; margin-right: 8px;" />
          紫薯科技 · AI Agent
        </div>
        <nav class="nav-links">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="`#${item.id}`"
            class="nav-link"
            :class="{ active: activeSection === item.id }"
          >
            {{ item.label }}
          </a>
        </nav>
      </div>
    </header>

    <main>
      <section id="hero" class="section hero-section">
        <div class="container hero-container">
          <!-- 左侧文本区域 -->
          <div class="hero-content">
            <div class="eyebrow">
              <span class="dot" />
              紫薯科技 · 面向小微企业的 AI Agent 技术伙伴
            </div>
            
            <!-- 主标题 -->
            <h1 class="hero-title">小微企业的专属 <span class="highlight">AI 工程团队</span></h1>
            
            <!-- 副标题 -->
            <h2 class="hero-subtitle">
              用工程化方法做 Agent 设计、开发与落地，让流程自动化、更省心、更可控。
            </h2>
            
            <!-- 支持卖点 -->
            <div class="hero-benefits">
              <div class="benefit-tag">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- 淡灰色圆圈背景 -->
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#E5E7EB" stroke-width="1"/>
                  <!-- 细线条对勾图标 -->
                  <path d="M20 6L9 17L4 12" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                工程落地，不止是 Demo
              </div>
              <div class="benefit-tag">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- 淡灰色圆圈背景 -->
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#E5E7EB" stroke-width="1"/>
                  <!-- 细线条对勾图标 -->
                  <path d="M20 6L9 17L4 12" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                1–6 周可交付，小工程不拖期
              </div>
              <div class="benefit-tag">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- 淡灰色圆圈背景 -->
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#E5E7EB" stroke-width="1"/>
                  <!-- 细线条对勾图标 -->
                  <path d="M20 6L9 17L4 12" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                成本透明：¥8,000–¥60,000
              </div>
            </div>
            
            <!-- CTA按钮 -->
            <div class="cta-row">
              <a class="btn btn-primary" href="#contact">立即沟通需求</a>
              <a class="btn btn-secondary" href="#contact">
                看看我们怎么做项目
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
            
            <div class="note">
              不确定从哪里开始？先用 15 分钟聊聊你的业务场景，一起找一个小切入口。
            </div>
          </div>
          
          <!-- 右侧视觉区域 -->
          <div class="hero-visual">
            <!-- Agent Orchestrator 架构图 -->
            <div class="engineering-illustration">
              <img src="/agent-diagram.svg" alt="Agent Orchestrator 架构图" style="width: 100%; height: auto;">
            </div>
          </div>
        </div>
      </section>

      <section id="services" class="section">
        <div class="container">
          <h2 class="section-heading">我们能帮你做什么（Services）</h2>
          <p class="section-subtitle">
            围绕“让人从重复劳动里解放出来”，目前主要聚焦三类场景。
          </p>
          <div class="cards-grid">
            <article v-for="service in services" :key="service.title" class="card">
              <div class="pill">{{ service.title }}</div>
              <p class="meta">{{ service.fit }}</p>
              <div>
                <strong>我们会帮你：</strong>
                <ul>
                  <li v-for="item in service.tasks" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div>
                <strong>你能得到：</strong>
                <ul>
                  <li v-for="item in service.outcomes" :key="item">{{ item }}</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="cases" class="section">
        <div class="container">
          <h2 class="section-heading">一些我们做过和正在做的东西（Cases）</h2>
          <p class="section-subtitle">
            不一上来做“大而全”，更习惯从一个小场景开始，验证价值后再逐步扩展。
          </p>
          <div class="cards-grid">
            <article v-for="item in cases" :key="item.title" class="card">
              <h3>{{ item.title }}</h3>
              <p class="meta">{{ item.background }}</p>
              <ul>
                <li v-for="action in item.actions" :key="action">{{ action }}</li>
              </ul>
              <div class="note">{{ item.outcome }}</div>
            </article>
          </div>
          <p class="section-subtitle">
            上线后会逐步补充真实案例和过程截图。
          </p>
        </div>
      </section>

      <section id="advantages" class="section">
        <div class="container">
          <h2 class="section-heading">为什么找我们这样的小团队（Advantages）</h2>
          <p class="section-subtitle">
            我们不是大公司，没有庞大组织，也没有复杂流程。但对很多小微企业来说，这种“小”反而更好用。
          </p>
          <div class="cards-grid">
            <article v-for="adv in advantages" :key="adv.title" class="card">
              <h3>{{ adv.title }}</h3>
              <p class="meta">{{ adv.detail }}</p>
            </article>
          </div>
          <div class="note">
            目标：先做一个可用版本上线，再在真实使用里持续调，而不是拖几个月憋一个大版本。
          </div>
        </div>
      </section>

      <section id="pricing" class="section">
        <div class="container">
          <h2 class="section-heading">合作方式 & 定价（Collaboration / Pricing）</h2>
          <p class="section-subtitle">
            三段式合作，让你从“试水”到“上线”再到“持续优化”，都保持轻量、可控的节奏与预算。
          </p>
          <div class="pricing-grid">
            <article
              v-for="pkg in pricing"
              :key="pkg.title"
              class="price-card"
              :class="{ featured: pkg.featured }"
            >
              <div class="pill">{{ pkg.title }}</div>
              <div class="price-tag">{{ pkg.price }}</div>
              <div class="price-duration">时间范围：{{ pkg.duration }}</div>
              <div class="divider" />
              <div>
                <strong>适合：</strong>
                <ul>
                  <li v-for="item in pkg.fit" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div>
                <strong>包含内容：</strong>
                <ul>
                  <li v-for="item in pkg.includes" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div class="note">
                实际价格会在了解具体场景后给出清晰报价，不会“做完才知道多少钱”。
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="team" class="section">
        <div class="container">
          <h2 class="section-heading">关于我们（Team）</h2>
          <p class="section-subtitle">
            紫薯科技是一个 2–3 人的小型工程团队，每个人都长期在一线写代码、做真实业务系统。
          </p>
          <div class="team-grid">
            <div class="info-card info-top">
              <div class="pill pill-ghost">小型工程团队</div>
              <h3>2–3 人配置，方向 / 系统 / 体验都到位</h3>
              <p class="intro-meta">
                简单说，就是：一个负责方向和架构 + 一个负责系统与运维质量 + 一个负责体验与落地细节。
              </p>
              <p class="muted">
                共同目标：让 Agent 不只是“看上去很酷”，而是真正在公司里稳定被每天使用。
              </p>
            </div>

            <article
              v-for="(member, index) in members"
              :key="member.name"
              class="member-card"
              :class="`member-slot-${index}`"
            >
              <div class="member-header">
                <div class="member-name">{{ member.name }}</div>
                <span class="member-role">{{ member.role }}</span>
              </div>
              <p class="member-summary">{{ member.summary }}</p>
              <ul class="member-bullets">
                <li v-for="bullet in member.bullets" :key="bullet">{{ bullet }}</li>
              </ul>
            </article>

            <div class="info-card info-bottom">
              <div class="team-meta-row">
                <div class="team-meta-block">
                  <span class="meta-label">规模</span>
                  <span class="meta-value">2–3 人常驻</span>
                  <small>保持直接沟通，快速迭代</small>
                </div>
                <div class="team-meta-block">
                  <span class="meta-label">工作方式</span>
                  <span class="meta-value">先跑通，再精炼</span>
                  <small>落地导向，可观测且好维护</small>
                </div>
              </div>

              <div class="team-focus-title">我们关注的关键点</div>
              <div class="team-focus-chips">
                <div class="focus-chip">
                  <div class="chip-title">生产可用性</div>
                  <div class="chip-desc">稳定性、监控、错误发现与追踪</div>
                </div>
                <div class="focus-chip">
                  <div class="chip-title">可维护性</div>
                  <div class="chip-desc">清晰的输入输出协议、文档化的约束与边界</div>
                </div>
                <div class="focus-chip">
                  <div class="chip-title">体验</div>
                  <div class="chip-desc">好用、好看、好上手，方便团队内部推广</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="notes" class="section">
        <div class="container">
          <h2 class="section-heading">更新日志 / 笔记（Changelog / Notes）</h2>
          <p class="section-subtitle">
            记录一线落地过程中的经验和踩坑，方便你了解真实问题与解决方式。
          </p>
          <div class="cards-grid">
            <article v-for="note in notes" :key="note.title" class="note-card">
              <div class="badge">{{ note.date }}</div>
              <h3>{{ note.title }}</h3>
              <p class="meta">{{ note.summary }}</p>
            </article>
          </div>
          <p class="section-subtitle">上线初期可只放 1–2 条代表性内容，后续持续补充。</p>
        </div>
      </section>

      <section id="contact" class="section">
        <div class="container">
          <h2 class="section-heading">联系我们（Contact）</h2>
          <p class="section-subtitle">
            如果你想用 Agent 做业务自动化或已有 Demo 需要落地，都可以直接联系 —— 加微信最快。
          </p>
          <div class="contact-panel">
            <div class="contact-item">
              <span class="contact-label">微信</span>
              <span class="contact-value">________</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">Email</span>
              <span class="contact-value">________</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">其他链接</span>
              <span class="contact-value">GitHub / Blog / 公众号</span>
            </div>
            <div class="cta-row">
              <a class="btn btn-primary" href="#hero">回到顶部</a>
              <a class="btn btn-secondary" href="mailto:________">发邮件沟通</a>
            </div>
            <div class="footnote">
              简单介绍一下你的业务和现在遇到的问题，我们会先帮你一起找一个小而清晰的切入点。
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer class="footer">
      <div class="container">
        <div>紫薯科技 · AI Agent 技术伙伴</div>
        <small>小团队、重工程、追求可落地的 Agent 交付</small>
        <div>
          <a href="#hero">回到顶部</a>
        </div>
      </div>
    </footer>
  </div>
</template>
