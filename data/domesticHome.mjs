export const domesticHomeHero = {
  label: 'AI SYSTEM ARCHITECTURE STUDIO',
  title: '简序智能 INTJsys',
  subtitle:
    '面向国内企业的 AI 系统工程、私有化基础设施和智能转型咨询。我们把 Agent、数据、流程和部署环境整理成可交付、可观察、可长期维护的生产系统。',
  primaryCta: {
    label: '预约诊断',
    href: '/contact',
  },
  secondaryCta: {
    label: '观看能力版图',
    href: '#business-lines',
  },
};

export const domesticHeroMetrics = [
  { value: '01', label: 'Agent 架构' },
  { value: '02', label: '私有云/下云' },
  { value: '03', label: 'AI 转型' },
  { value: 'CN', label: '国内交付' },
];

export const domesticValueCards = [
  {
    id: 'cloud-exit-case',
    tag: '脱敏案例 · 基础设施重构',
    title: '企业系统：从公有云账单失控到本地可治理',
    desc: '先盘点云主机、数据库、对象存储、带宽和备份，再判断哪些服务应保留云上，哪些应迁回本地或私有云。',
    note: '重点不是“下云口号”，而是重新确认成本、控制权、恢复路径和长期运维边界。',
    layout: 'card-value-main',
  },
  {
    id: 'private-ai-case',
    tag: '脱敏案例 · 私有化 AI',
    title: '知识库、模型网关和业务入口放回受控环境',
    desc: '涉及文档解析、向量检索、RAGFlow、模型服务、权限、反向代理、TLS、备份和监控。',
    note: '适合数据不能出网、需要内网访问或需要长期交接的 AI 系统。',
    layout: 'card-featured',
  },
  {
    id: 'diagnosis',
    tag: '诊断方法论',
    title: '先看真实负载，再讨论方案',
    desc: 'CPU、内存、磁盘、数据库、带宽、日志、账单和组织流程。先定位瓶颈，再决定架构动作。',
    note: '很多问题不需要“大改造”，需要先把浪费点和风险点讲清楚。',
    layout: 'card-featured',
  },
  {
    id: 'agent-infra',
    tag: 'AI 系统工程',
    title: 'Agent 不只是提示词，是运行系统',
    desc: '记忆、工具、权限、队列、缓存、评测、日志、回放和人工兜底，才决定 Agent 能否长期上线。',
    note: '国内站只做宣传和咨询入口，具体系统按项目单独交付。',
    cta: '了解业务线 →',
    href: '#business-lines',
    layout: 'card-featured',
  },
  {
    id: 'delivery',
    tag: '交付边界',
    title: '宣传页只负责讲清楚，不接服务后台',
    desc: 'TalentAI、MindAI 等产品可作为能力案例出现，但不在国内官网直接接入产品服务。',
    note: '所有转化路径统一回到站内联系页，便于合规、沟通和项目判断。',
    cta: '联系沟通 →',
    href: '/contact',
    layout: 'card-featured',
  },
];

export const domesticBusinessLines = [
  {
    slug: 'agent-efficiency-architecture',
    tag: 'AGENT EFFICIENCY ARCHITECTURE',
    icon: 'fa-gauge-high',
    color: '#dbeafe',
    text: '#1e3a8a',
    title: 'AI 智能体效能架构优化',
    summary:
      '围绕 Agent 记忆、多智能体协同、Harness 运行架构，以及高并发 / 微服务 / 云原生底座，设计可长期运行、可追踪、可复盘的智能体系统。',
    features: ['记忆架构', '多智能体协同', 'Harness', '工程效能底座'],
    link: '/contact',
  },
  {
    slug: 'cloud-infrastructure-configuration',
    tag: 'CLOUD INFRASTRUCTURE CONFIGURATION',
    icon: 'fa-server',
    color: '#dcfce7',
    text: '#166534',
    title: '云计算基础设施配置',
    summary:
      '覆盖下云迁移、私有云服务、本地服务器 / GPU、网络安全、监控备份和成本治理，把关键系统迁到可控、可观测、可运维的基础设施。',
    features: ['下云迁移', '私有云', '本地算力', '长期运维'],
    link: '/contact',
  },
  {
    slug: 'intelligent-transformation-strategy',
    tag: 'INTELLIGENT TRANSFORMATION STRATEGY',
    icon: 'fa-chart-line',
    color: '#fef3c7',
    text: '#92400e',
    title: '智能转型战略咨询',
    summary:
      '围绕商业目标、核心流程、组织知识、Skill 能力库、智能体工作台和经营指标，设计从战略判断到试点落地的转型路径。',
    features: ['战略诊断', '流程重构', 'Skill 资产', '经营系统'],
    link: '/contact',
  },
];

export const domesticWorkSteps = [
  {
    num: '01',
    title: '系统与业务诊断',
    desc: '先看 Agent 原型、云账单、现有架构、业务流程和组织目标，判断真正瓶颈是效能、基础设施还是转型路径。',
    color: '#dbeafe',
    text: '#1e3a8a',
    icon: 'fa-magnifying-glass',
  },
  {
    num: '02',
    title: '目标架构与路径设计',
    desc: '按业务线给出记忆 / Harness、下云 / 私有云、AI 原生流程等目标架构，并明确边界、风险和阶段验收。',
    color: '#dcfce7',
    text: '#166534',
    icon: 'fa-flask',
  },
  {
    num: '03',
    title: '阶段交付与持续治理',
    desc: '交付可执行资产、试点系统或迁移方案，再用监控、评测、复盘和运维边界把结果持续管起来。',
    color: '#fef3c7',
    text: '#92400e',
    icon: 'fa-rocket',
  },
];

export const domesticProofAssets = [
  {
    badge: '自研项目',
    badgeColor: '#fef3c7',
    badgeText: '#92400e',
    name: 'TalentAI',
    desc: '招聘智能系统效能案例。国内站展示 Demo、工程估算、Benchmark 和 Evaluation 如何衡量延迟、吞吐、成本和召回质量。',
    tags: ['P95', 'QPS', 'Recall@K', '工程估算'],
    stat: 'SHOWCASE',
    statColor: '#dbeafe',
    statText: '#1e3a8a',
  },
  {
    badge: '能力目录',
    badgeColor: '#dbeafe',
    badgeText: '#1e3a8a',
    name: 'MCP / Skill 选型资产',
    desc: '把工具、模型、数据源和部署条目整理成可复用目录，用于方案设计、评估和交付边界判断。',
    tags: ['MCP', 'Skills', '工具治理', '选型方法'],
    stat: 'PROMO',
    statColor: '#dcfce7',
    statText: '#166534',
  },
  {
    badge: '工程方法',
    badgeColor: '#dcfce7',
    badgeText: '#166534',
    name: '私有化部署与运维治理',
    desc: '关注服务器、容器、网络、权限、日志、告警、备份和恢复演练，让系统上线后可交接、可恢复。',
    tags: ['Docker', '监控', '备份', '运维边界'],
    stat: 'DELIVERY',
    statColor: '#fef3c7',
    statText: '#92400e',
  },
  {
    badge: '转型路线',
    badgeColor: '#ecfeff',
    badgeText: '#0f766e',
    name: 'AI 原生流程设计',
    desc: '把业务流程中的重复判断、信息整理、审核和复盘拆成 AI 节点、人工节点和系统节点。',
    tags: ['流程重构', '经营指标', '人机协同', '复盘'],
    stat: 'STRATEGY',
    statColor: '#ecfeff',
    statText: '#0f766e',
  },
];

export const domesticCta = {
  title: '先发一个具体问题，不用先定方案',
  subtitle:
    '可以是云账单、Agent 原型、私有化部署、知识库、业务流程或 AI 转型方向。我们先判断问题属于哪条链路，再决定是否值得继续做。',
  primary: {
    label: '联系沟通',
    href: '/contact',
  },
  secondary: {
    label: '了解简序智能',
    href: '/about',
  },
};
