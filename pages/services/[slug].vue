<template>
  <div class="service-detail-page">
	    <main class="container">
	      <header class="page-header">
	        <NuxtLink to="/services" class="back-link">← 返回技术服务</NuxtLink>
	        <span class="label">— SERVICE</span>
	        <h1>{{ service.name }}</h1>
	        <div class="meta">
          <span class="rating">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= service.rating }">★</span>
          </span>
          <a :href="service.github" target="_blank" rel="noopener" class="github-link">
            GitHub →
          </a>
          <a v-if="service.docs" :href="service.docs" target="_blank" rel="noopener" class="docs-link">
            官方文档 →
          </a>
        </div>
      </header>

      <!-- 项目简介 -->
      <section class="content-card intro-section">
        <h2>项目简介</h2>
        <p class="intro-text">{{ service.intro }}</p>
        <div class="features-grid">
          <div v-for="feature in service.features" :key="feature.title" class="feature-item">
            <span class="feature-icon">{{ feature.icon }}</span>
            <div class="feature-content">
              <h4>{{ feature.title }}</h4>
              <p>{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 我们提供的服务 -->
      <section class="content-card services-offered">
        <h2>我们提供的服务</h2>
        
        <div class="service-category">
          <h3>🚀 部署服务</h3>
          <div class="service-list">
            <div v-for="item in service.deployment" :key="item.title" class="service-item">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </div>
          </div>
        </div>

        <div class="service-category">
          <h3>🔧 运维服务</h3>
          <div class="service-list">
            <div v-for="item in service.maintenance" :key="item.title" class="service-item">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 为什么选择我们 -->
      <section class="content-card why-us">
        <h2>为什么选择我们</h2>
        <div class="why-grid">
          <div v-for="reason in service.whyUs" :key="reason.title" class="why-item">
            <span class="why-icon">✓</span>
            <div>
              <strong>{{ reason.title }}</strong>
              <p>{{ reason.desc }}</p>
            </div>
          </div>
        </div>
      </section>

	      <!-- CTA -->
	      <section class="cta-section">
	        <div class="cta-card">
	          <span class="label">— CONTACT</span>
	          <h2>需要帮忙落地 {{ service.projectName }}？</h2>
	          <p>我们提供专业的落地与运维服务</p>
	          <NuxtLink to="/contact" class="btn-primary">联系咨询 →</NuxtLink>
	        </div>
	      </section>
    </main>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

// 服务详情数据
const servicesData = {
  'openclaw': {
    name: 'OpenClaw 部署运维服务',
    projectName: 'OpenClaw',
    rating: 5,
    github: 'https://github.com/openclaw/openclaw',
    docs: 'https://openclaw.org/docs',
    intro: 'OpenClaw 是开源的个人 AI 助手网关，可在你自己的服务器上本地运行。通过统一的 Gateway 控制中心连接 WhatsApp、Telegram、Discord、iMessage、Slack 等 12+ 主流消息平台，让你随时随地通过日常使用的聊天应用与 AI 进行自然对话。',
    features: [
      { icon: '🏠', title: '本地优先', desc: '所有数据和处理在本地服务器运行，隐私完全可控' },
      { icon: '📱', title: '12+ 消息通道', desc: '支持 WhatsApp、Telegram、Discord、iMessage、Slack 等主流平台' },
      { icon: '🔒', title: '安全可控', desc: '配对机制、白名单、Docker 沙箱等多层安全防护' },
      { icon: '💻', title: '跨平台', desc: '支持 macOS、Linux、Windows 及移动端 Companion App' },
    ],
    deployment: [
      { title: '环境搭建', desc: 'Node.js 22+ 环境配置、依赖安装、Gateway 初始化' },
      { title: '通道对接', desc: 'WhatsApp/Telegram/Discord/Slack 等账号绑定配置' },
      { title: '安全配置', desc: 'Token 认证、白名单、DM 配对策略、Docker 沙箱' },
      { title: '服务化部署', desc: 'launchd/systemd/Windows Task 守护进程配置' },
      { title: '远程访问', desc: 'Tailscale/VPN/SSH 隧道配置，移动端接入' },
    ],
    maintenance: [
      { title: '监控告警', desc: 'Gateway 健康检查、通道连接状态、进程存活监控' },
      { title: '版本升级', desc: '跟踪官方 CHANGELOG、平滑升级、回滚保障' },
      { title: '故障响应', desc: '问题诊断、快速恢复、openclaw doctor 定期巡检' },
      { title: '定期巡检', desc: '安全审计、配置优化、会话清理、配额管理' },
    ],
    whyUs: [
      { title: '专业运维团队', desc: 'Node.js 服务及容器化运维经验丰富' },
      { title: '中心化监控', desc: 'Loki 日志监控体系，问题实时可见' },
      { title: '快速响应', desc: '本地化服务，沟通无时差' },
      { title: '持续跟进', desc: '紧跟官方更新，第一时间升级' },
    ],
  },
	  'eigent': {
	    name: 'Eigent 部署运维服务',
	    projectName: 'Eigent',
	    rating: 5,
	    github: 'https://github.com/eigent-ai/eigent',
	    docs: 'https://eigent.ai/docs',
	    intro: 'Eigent 是基于 CAMEL-AI 框架的开源多智能体协作桌面应用，让你构建、管理和部署专属的 AI Workforce。它支持 35+ 内置工具包、MCP 协议集成和 Human-in-the-Loop 机制，将复杂工作流自动化为可并行执行的智能任务。',
	    features: [
	      { icon: '🤖', title: '多智能体协作', desc: 'Workforce 引擎支持任务分解与并行执行，智能体协同完成复杂任务' },
	      { icon: '🏠', title: '本地优先', desc: '本地 PostgreSQL + FastAPI 后端，敏感数据完全可控' },
	      { icon: '🔧', title: '35+ 工具包', desc: '终端/代码/浏览器/生产力套件/社交平台等丰富工具生态' },
	      { icon: '🔌', title: 'MCP 集成', desc: '原生 Model Context Protocol 支持，动态扩展智能体能力' },
	    ],
	    deployment: [
	      { title: '环境搭建', desc: 'Node.js 18-22 + Python 3.10 环境配置、uv/npm 依赖安装' },
	      { title: '后端部署', desc: 'PostgreSQL 数据库 + FastAPI 代理服务 Docker 化部署' },
	      { title: '前端配置', desc: 'Electron 桌面应用编译、本地代理路由配置' },
	      { title: '模型对接', desc: 'Ollama 本地模型 / 云端 API（OpenAI/Claude）配置' },
	      { title: 'MCP 扩展', desc: 'MCP Server 注册与工具权限配置' },
	    ],
	    maintenance: [
	      { title: '监控告警', desc: 'FastAPI 健康检查、Workforce 执行状态、资源占用监控' },
	      { title: '版本升级', desc: '跟踪官方 Release、数据库迁移、配置兼容性验证' },
	      { title: '故障响应', desc: '智能体异常诊断、任务恢复、日志分析' },
	      { title: '定期巡检', desc: '数据库优化、工具链更新、安全审计' },
	    ],
	    whyUs: [
	      { title: '专业运维团队', desc: 'Python/Electron 全栈及容器化运维经验丰富' },
	      { title: '中心化监控', desc: 'Loki 日志监控体系，问题实时可见' },
	      { title: '快速响应', desc: '本地化服务，沟通无时差' },
	      { title: '深度理解', desc: '对 CAMEL-AI 框架和多智能体架构有深入研究' },
	    ],
	  },
	  'langfuse': {
	    name: 'Langfuse 部署运维服务',
	    projectName: 'Langfuse',
	    rating: 5,
	    github: 'https://github.com/langfuse/langfuse',
	    docs: 'https://langfuse.com/docs',
	    intro: 'Langfuse 是开源的 LLM 可观测与评测闭环平台，覆盖 Trace 采集、Prompt 管理、数据集对比与自动化评测，让你的 Prompt/Agent 迭代从“感觉更好”走向“可量化验证”。我们提供从私有部署到长期运维的完整交付。',
	    features: [
	      { icon: '🔍', title: 'Trace 可观测', desc: '对话链路与工具调用全量追踪，定位慢点与失败点' },
	      { icon: '🧪', title: '评测闭环', desc: '数据集/对比评测/回归结果集中管理，可追溯' },
	      { icon: '🧰', title: 'Prompt 管理', desc: 'Prompt 版本化、灰度策略与效果对比，降低迭代风险' },
	      { icon: '🔒', title: '私有部署', desc: '数据留在自有环境，权限与合规边界清晰' },
	    ],
	    deployment: [
	      { title: '私有化部署', desc: 'Docker Compose/容器化部署、数据库与对象存储配置、反向代理与 HTTPS' },
	      { title: '采集接入', desc: 'SDK/HTTP 接入，打通线上链路 Trace 与关键业务字段' },
	      { title: '权限与审计', desc: '账号体系、团队空间、访问控制与审计策略配置' },
	      { title: '评测数据集', desc: '建立核心数据集与回归策略，定义“上线门槛”' },
	      { title: '告警联动', desc: '关键错误/延迟阈值告警，联动 Slack/飞书/邮件' },
	    ],
	    maintenance: [
	      { title: '监控告警', desc: '服务存活、数据库容量、队列积压、错误率与延迟监控' },
	      { title: '备份恢复', desc: '数据库与配置备份、演练恢复，确保可用性' },
	      { title: '版本升级', desc: '跟踪官方版本、安全补丁与变更验证，提供回滚方案' },
	      { title: '成本优化', desc: '采样策略、存储分层、保留周期与冷热数据治理' },
	    ],
	    whyUs: [
	      { title: '生产级交付', desc: '从反向代理到数据治理，按“线上可用”标准交付' },
	      { title: '可观测经验', desc: '熟悉日志/链路/指标体系，问题定位更快' },
	      { title: '评测方法论', desc: '把数据集与指标体系一并交付，避免“只装不管”' },
	      { title: '持续服务', desc: '可提供长期运维与持续优化，确保效果可持续' },
	    ],
	  },
	  'promptfoo': {
	    name: 'Promptfoo 回归测试体系服务',
	    projectName: 'Promptfoo',
	    rating: 5,
	    github: 'https://github.com/promptfoo/promptfoo',
	    docs: 'https://www.promptfoo.dev/docs',
	    intro: 'Promptfoo 是开源的 LLM Prompt/Agent 回归测试与评测框架，适合把“上线前必须过哪些用例”固化成可执行的 CI Gate。我们提供用例集建设、评分标准与流水线落地，让每次迭代都有可量化的质量报告。',
	    features: [
	      { icon: '🚦', title: 'CI Gate', desc: '在 PR/发布流水线做准入门禁，阻断回归' },
	      { icon: '🧪', title: '用例集沉淀', desc: '覆盖关键业务链路的 prompts/多轮对话用例集' },
	      { icon: '⚖️', title: '混合评估', desc: '规则/指标 + LLM-as-judge 的组合评测，兼顾效率与解释性' },
	      { icon: '📄', title: '报告输出', desc: '失败样例、diff 与可复现配置，方便定位与复测' },
	    ],
	    deployment: [
	      { title: '目标梳理', desc: '明确关键链路、不可退化指标与验收口径（上线门槛）' },
	      { title: '用例与数据', desc: '整理真实样本、构建数据集与可复现的输入输出格式' },
	      { title: '评分标准', desc: '定义评分规则、阈值与 LLM-as-judge 的提示词与校准策略' },
	      { title: 'CI 接入', desc: '在 GitHub Actions/GitLab CI 等流水线接入，输出报告与阻断策略' },
	      { title: '工程化模板', desc: '交付可复用的项目模板与最佳实践，方便复制到更多应用' },
	    ],
	    maintenance: [
	      { title: '基线维护', desc: '持续补齐新场景用例，更新基线与阈值，防止指标漂移' },
	      { title: '模型切换验证', desc: '更换模型/参数/提示词前后对比验证，降低回归风险' },
	      { title: '失败复盘', desc: '定位失败样例根因，给出可执行的修复路径与复测计划' },
	      { title: '报告月度复盘', desc: '按周期输出质量趋势与重点问题清单' },
	    ],
	    whyUs: [
	      { title: '工程化优先', desc: '把评测做成 CI 的一部分，而不是一次性演示' },
	      { title: '指标可解释', desc: '强调可复现与可解释的评分口径，避免“玄学”' },
	      { title: '体系化沉淀', desc: '交付模板、数据集与规则，形成长期资产' },
	      { title: '端到端陪跑', desc: '从定义指标到落地验收，全程可控' },
	    ],
	  },
	  'deepeval': {
	    name: 'DeepEval 评测体系服务',
	    projectName: 'DeepEval',
	    rating: 5,
	    github: 'https://github.com/confident-ai/deepeval',
	    docs: 'https://deepeval.com/',
	    intro: 'DeepEval 是开源的 LLM 评测与单元测试框架，支持自定义 metrics、LLM-as-judge 以及数据集评测。我们提供“指标体系 + 数据集 + CI 集成”的一体化落地服务，让评测变成可持续迭代的工程资产。',
	    features: [
	      { icon: '📐', title: '指标体系', desc: '按业务目标定义可复用 metrics（质量/安全/一致性）' },
	      { icon: '🧑‍⚖️', title: 'LLM Judge', desc: 'Judge 提示词与校准策略，控制一致性与成本' },
	      { icon: '🧩', title: '可扩展', desc: '支持自定义评测逻辑与模型接入，适配不同应用形态' },
	      { icon: '🔁', title: '持续评测', desc: '把评测接入 CI，形成长期回归与趋势监控' },
	    ],
	    deployment: [
	      { title: '评测目标定义', desc: '拆解“好”的定义：质量、安全、结构化输出、鲁棒性等' },
	      { title: '数据集构建', desc: '整理真实样本、构建覆盖边界条件的评测数据集' },
	      { title: '指标落地', desc: '落地 metrics 与 Judge 规则，设置阈值与失败解释' },
	      { title: 'CI 集成', desc: '接入流水线，输出标准化报告与阻断策略' },
	      { title: '成本控制', desc: '评测采样、分层评测与缓存策略，控制 token 成本' },
	    ],
	    maintenance: [
	      { title: '指标校准', desc: '随业务演进调整指标权重与阈值，保持评测有效性' },
	      { title: '数据集更新', desc: '持续吸收线上 badcase，避免评测“只会刷题”' },
	      { title: '回归看板', desc: '趋势分析与重点退化追踪，辅助工程决策' },
	      { title: '故障复测', desc: '针对退化点提供复测脚本与修复建议' },
	    ],
	    whyUs: [
	      { title: '方法论清晰', desc: '强调“指标-数据-阈值-闭环”，避免空泛评测' },
	      { title: '可持续交付', desc: '落地到 CI 与看板，保证长期可用' },
	      { title: '业务贴合', desc: '从业务目标反推指标，不做“为了评测而评测”' },
	      { title: '安全意识', desc: '把安全评测纳入基线，减少线上风险' },
	    ],
	  },
	  'ragas': {
	    name: 'Ragas RAG 评测服务',
	    projectName: 'Ragas',
	    rating: 5,
	    github: 'https://github.com/vibrantlabsai/ragas',
	    docs: 'https://docs.ragas.io/en/stable/',
	    intro: 'Ragas 是开源的 RAG 质量评测框架，聚焦检索与生成的关键指标（相关性、忠实度、回答质量等）。我们提供从评测集构建、指标解释到持续评测落地的完整服务，帮助你把 RAG 的“效果”变成可度量、可优化的工程目标。',
	    features: [
	      { icon: '📚', title: 'RAG 指标', desc: '覆盖检索质量与生成质量的核心指标体系' },
	      { icon: '🧾', title: '评测集建设', desc: '基于真实业务样本构建覆盖边界条件的数据集' },
	      { icon: '🔬', title: '定位问题', desc: '把退化定位到检索/切分/重排/提示词等环节' },
	      { icon: '🔁', title: '持续评测', desc: '支持周期性评测与回归，形成稳定改进节奏' },
	    ],
	    deployment: [
	      { title: '链路梳理', desc: '梳理知识库、检索链路与生成策略，确定评测点位' },
	      { title: '数据集构建', desc: '采集问答样本、构建 ground truth/参考答案与评价维度' },
	      { title: '指标配置', desc: '选择与校准指标与 Judge，设置阈值与报表口径' },
	      { title: '流水线接入', desc: '接入 CI/定时任务，输出报告与趋势对比' },
	      { title: '优化路线图', desc: '基于评测结果给出可执行的优化清单与优先级' },
	    ],
	    maintenance: [
	      { title: '评测集扩充', desc: '持续吸收线上问题样本，覆盖新知识与新问题' },
	      { title: '指标复盘', desc: '定期复盘指标有效性与阈值，避免评测失真' },
	      { title: '成本与速度优化', desc: '分层评测、缓存与采样策略，控制评测成本' },
	      { title: '效果追踪', desc: '跟踪优化前后对比，形成可展示的改进证据' },
	    ],
	    whyUs: [
	      { title: '懂检索也懂生成', desc: '评测与优化覆盖 RAG 全链路，而非只看最终答案' },
	      { title: '数据驱动', desc: '用数据集与指标做决策，减少反复试错' },
	      { title: '可复制模板', desc: '交付模板与脚本，便于复制到更多知识库' },
	      { title: '工程化落地', desc: '把评测接入流水线，形成长期闭环' },
	    ],
	  },
	  'garak': {
	    name: 'Garak 红队扫描服务',
	    projectName: 'Garak',
	    rating: 5,
	    github: 'https://github.com/NVIDIA/garak',
	    intro: 'Garak 是 NVIDIA 开源的 LLM 漏洞扫描器，覆盖越狱、提示注入、敏感信息泄露、拒绝服务等常见风险类型。我们提供基线扫描、风险分级与整改复测服务，把安全评估从“口头承诺”变成“可复现报告”。',
	    features: [
	      { icon: '🛡️', title: '红队基线', desc: '建立可重复执行的安全扫描基线与评分口径' },
	      { icon: '🧨', title: '覆盖广', desc: '覆盖多类攻击向量，适配不同模型与应用形态' },
	      { icon: '📑', title: '报告输出', desc: '风险分级、复现步骤与整改建议，便于闭环' },
	      { icon: '🔁', title: '整改复测', desc: '修复后复测验证，确保风险下降而非“看起来修了”' },
	    ],
	    deployment: [
	      { title: '目标接入', desc: '对接你的 API/Agent/应用入口，配置鉴权与速率限制' },
	      { title: '基线配置', desc: '选择攻击包、设置白名单/黑名单、定义风险分级' },
	      { title: '执行扫描', desc: '按场景跑批扫描，收集可复现样例与证据' },
	      { title: '输出报告', desc: '整理报告与修复建议，给出优先级与风险评估' },
	      { title: '复测计划', desc: '制定整改复测计划与上线门槛' },
	    ],
	    maintenance: [
	      { title: '攻击库更新', desc: '跟踪新攻击手法与变种，更新扫描策略' },
	      { title: '定期复测', desc: '按月/季度复测，防止模型与提示词变更引入新风险' },
	      { title: '风险跟踪', desc: '对高风险项持续跟踪，直至闭环' },
	      { title: '门禁接入', desc: '把关键扫描纳入上线门禁，降低线上暴露概率' },
	    ],
	    whyUs: [
	      { title: '安全优先', desc: '以“可复现 + 可闭环”为目标，不止跑一遍工具' },
	      { title: '实战导向', desc: '结合真实业务入口与攻击面，避免纸面安全' },
	      { title: '工程化交付', desc: '可落地到 CI 与门禁流程，形成持续机制' },
	      { title: '可沟通报告', desc: '报告面向技术与管理双受众，便于推进整改' },
	    ],
	  },
	  'pyrit': {
	    name: 'PyRIT 对抗测试服务',
	    projectName: 'PyRIT',
	    rating: 5,
	    github: 'https://github.com/Azure/PyRIT',
	    intro: 'PyRIT 是 Microsoft 开源的对抗测试编排框架，面向 AI 系统化红队评估与安全验证。我们提供攻击用例库定制、编排落地与对抗评估报告，帮助你验证防护策略在真实攻击面下是否有效。',
	    features: [
	      { icon: '🧭', title: '对抗编排', desc: '按场景编排攻击链路与评估流程，支持批量执行' },
	      { icon: '🧰', title: '用例库', desc: '沉淀适配你业务的攻击用例库与复现脚本' },
	      { icon: '📊', title: '评估报告', desc: '输出可追溯证据与风险结论，支持对比与复测' },
	      { icon: '🔌', title: '多目标接入', desc: '可接入不同模型/网关/Agent，统一评估口径' },
	    ],
	    deployment: [
	      { title: '目标接入', desc: '对接模型 API、Agent 或应用入口，配置鉴权与限流' },
	      { title: '场景定义', desc: '定义风险场景：越狱、注入、越权、隐私泄露等' },
	      { title: '用例库定制', desc: '结合业务构建对抗用例库，覆盖关键攻击面' },
	      { title: '批量执行', desc: '跑批对抗评估，收集证据与失败样例' },
	      { title: '报告与整改', desc: '输出报告与整改建议，制定复测与门禁策略' },
	    ],
	    maintenance: [
	      { title: '持续更新', desc: '跟踪攻击手法与业务变化，持续更新用例库' },
	      { title: '门禁策略', desc: '把关键对抗场景纳入上线门禁与灰度验证' },
	      { title: '复测验证', desc: '整改后复测对比，确保风险实质下降' },
	      { title: '安全培训', desc: '输出团队可用的安全 checklist 与应对策略' },
	    ],
	    whyUs: [
	      { title: '体系化红队', desc: '强调"场景-证据-结论-复测"的闭环交付' },
	      { title: '贴近业务', desc: '以你的真实入口与数据形态为准，避免空泛' },
	      { title: '可持续资产', desc: '交付用例库与脚本，形成长期防护资产' },
	      { title: '工程化集成', desc: '可集成到 CI 与发布流程，形成持续机制' },
	    ],
	  },
	  'ragflow': {
	    name: 'RAGFlow 部署运维服务',
	    projectName: 'RAGFlow',
	    rating: 5,
	    github: 'https://github.com/infiniflow/ragflow',
	    docs: 'https://ragflow.io/docs',
	    intro: 'RAGFlow 是 InfiniFlow 开源的 RAG（检索增强生成）引擎，以深度文档理解为核心，支持 PDF/Word/Excel/PPT/图片等复杂格式智能解析与可视化分块。内置多路召回（关键词 + 向量 + 知识图谱）、可溯源引用和对话式问答，适合企业知识库、内部文档搜索与智能客服等场景。我们提供从部署到长期运维的完整交付。',
	    features: [
	      { icon: '📄', title: '深度文档解析', desc: '基于 AI 视觉模型的 OCR 与版面分析，精准处理 PDF 表格、图片与复杂排版' },
	      { icon: '🔍', title: '多路召回', desc: '关键词 + 语义向量 + 知识图谱三路融合检索，兼顾精确匹配与语义理解' },
	      { icon: '✂️', title: '可视化分块', desc: '智能分块策略可视化预览与调试，确保检索粒度合理、引用可溯源' },
	      { icon: '🤖', title: '对话式问答', desc: '内置搜索应用与聊天助手，支持流式输出、多轮对话与 API 集成' },
	    ],
	    deployment: [
	      { title: '环境部署', desc: 'Docker Compose 编排（Elasticsearch + MySQL + MinIO + Redis），资源规划与配置优化' },
	      { title: '模型对接', desc: 'Ollama 本地模型 / 云端 API（OpenAI/通义千问/DeepSeek）嵌入与生成模型配置' },
	      { title: '知识库建设', desc: '文档导入、解析模板选择、分块策略调优与索引构建' },
	      { title: '应用集成', desc: 'RESTful API / SDK 接入业务系统，搜索应用与聊天助手配置' },
	      { title: '安全配置', desc: '用户权限、API Key 管理、网络隔离与反向代理配置' },
	    ],
	    maintenance: [
	      { title: '监控告警', desc: 'Elasticsearch 集群健康、文档处理队列、Task Executor 心跳与资源占用监控' },
	      { title: '版本升级', desc: '跟踪官方版本与安全补丁，数据库迁移验证与回滚保障' },
	      { title: '性能调优', desc: '检索召回率优化、分块策略迭代、嵌入模型选型与索引重建' },
	      { title: '定期巡检', desc: '存储清理、日志轮转、数据库优化与备份恢复验证' },
	    ],
	    whyUs: [
	      { title: '生产级经验', desc: '已在实际项目中完成 10,000+ 文档的解析与索引，熟悉全链路调优' },
	      { title: '全栈运维', desc: '覆盖 Elasticsearch、MySQL、MinIO 等基础设施的综合运维能力' },
	      { title: '中心化监控', desc: 'Loki 日志监控体系，Task Executor 状态实时可见' },
	      { title: '持续服务', desc: '提供长期运维与持续优化，紧跟官方更新与社区最佳实践' },
	    ],
	  },
	};

const service = computed(() => {
  return servicesData[slug] || {
    name: '未找到',
    projectName: '',
    rating: 0,
    github: '#',
    intro: '该服务不存在',
    features: [],
    deployment: [],
    maintenance: [],
    whyUs: [],
  };
});

useSeoMeta({
  title: () => `${service.value.name} - 简序智能`,
  description: () => service.value.intro?.slice(0, 150)
});
</script>

<style scoped>
.service-detail-page {
  min-height: 100vh;
  background-color: #fafafa;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
  padding: 80px 0;
}

.container {
  max-width: 900px;
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
  flex-wrap: wrap;
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

.github-link,
.docs-link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.github-link:hover,
.docs-link:hover {
  color: #111;
}

/* Content Cards */
.content-card {
  background: #fff;
  border: 1px solid #111;
  padding: 48px;
  margin-bottom: 32px;
}

.content-card h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 24px;
  color: #111;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Intro Section */
.intro-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #444;
  margin: 0 0 32px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.feature-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.feature-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feature-content h4 {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 600;
  color: #111;
}

.feature-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

/* Services Offered */
.service-category {
  margin-bottom: 32px;
}

.service-category:last-child {
  margin-bottom: 0;
}

.service-category h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px;
  color: #111;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8f8f8;
  border-left: 3px solid #111;
}

.service-item strong {
  min-width: 120px;
  color: #111;
}

.service-item span {
  color: #666;
}

/* Why Us */
.why-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.why-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.why-icon {
  width: 24px;
  height: 24px;
  background: #111;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.why-item strong {
  display: block;
  color: #111;
  margin-bottom: 4px;
}

.why-item p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* CTA */
.cta-section {
  display: flex;
  justify-content: center;
}

.cta-card {
  background: #fff;
  border: 2px solid #111;
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

/* Responsive */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  .content-card {
    padding: 32px 24px;
  }
  
  .features-grid,
  .why-grid {
    grid-template-columns: 1fr;
  }
  
  .service-item {
    flex-direction: column;
    gap: 4px;
  }
  
  .service-item strong {
    min-width: auto;
  }
}
</style>
