<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type NavItem = { id: string; label: string };
type Service = {
  title: string;
  fit: string;
  tasks: string[];
  outcomes: string[];
};
type CaseItem = {
  tag: string;
  result: string;
  agent: string;
  background: string;
  approach: string[];
  effect: string;
};
type Advantage = {
  title: string;
  detail: string;
  tag?: string;
  extra?: string;
  icon?: string;
};
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
type NoteItem = { date: string; title: string; summary: string; content: string };

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

const caseScopes = [
  "客服服务",
  "内部知识",
  "运营自动化",
  "销售提效",
  "定制组合场景",
  "知识库搭建",
  "流程编排",
  "多语言客服",
  "数据质检",
  "风险控制"
];

const cases: CaseItem[] = [
  {
    tag: "客服 / 在线咨询",
    result: "智能客户服务",
    agent: "客服问答 Agent",
    background: "重复咨询多、人力成本高，新人上手慢，服务体验不稳定。",
    approach: [
      "梳理 FAQ / 政策 / 价格口径，搭检索 + 规则的知识库",
      "嵌入官网对话框与客服系统，限定报价与承诺边界",
      "设置转人工与复盘流程，真实对话反哺知识库迭代"
    ],
    effect: "常见问题 70%+ 由 Agent 直接应答，新人独立接待时间从 3 周缩短到 3 天。"
  },
  {
    tag: "内部知识 / Onboarding",
    result: "内部知识自助平台",
    agent: "内部问答 Agent",
    background: "流程跨度大且分散，新人怕出错，老员工频繁被打断说明。",
    approach: [
      "收拢 Onboarding 手册、流程 SOP、政策条款，按场景拆段",
      "接入知识库 / 协作工具，在常用入口内嵌问答",
      "按角色做权限与回答口径，留下提问日志补文档缺口"
    ],
    effect: "新人 80% 的流程问题可自助解决，重复答疑工时下降一半，文档更新路径变清晰。"
  },
  {
    tag: "运营 / 报表自动化",
    result: "运营数据周报自动化",
    agent: "自动报表 Agent",
    background: "周报制作需要多系统导出、手动拼图，耗时且易漏。",
    approach: [
      "对接业务数据库 / BI，明确指标口径与异常兜底规则",
      "生成周报草稿（文字 + 表格），支持一键补充截图与备注",
      "上线后按真实反馈迭代摘要颗粒度与格式模板"
    ],
    effect: "周报生成时间从半天缩短到约 10 分钟，团队把精力放在分析而不是搬运数据。"
  },
  {
    tag: "定制组合 / 跨流程",
    result: "定制化 Agent 组合",
    agent: "流程编排 + 多 Agent",
    background: "跨部门流程多、标准不一致，想用 AI 串起线索筛选、沟通、报告。",
    approach: [
      "按现有流程拆节点，定义每步输入 / 责任与质量标准",
      "组合问答、文案、报表 Agent，用编排减少人工搬运",
      "保留人工校验点，输出可回溯的记录与通知"
    ],
    effect: "2–3 周拼出可运行版本，人工交接减少 40% 左右，新流程可观测、可继续扩展。"
  }
];

const coreAdvantages: Advantage[] = [
  {
    title: "安全可控，数据在你们手里",
    tag: "安全",
    detail: "安全和合规是前提，不是附加功能。",
    extra: "支持私有化 / 专有云部署；权限控制、操作审计、数据脱敏齐备，数据留在你们环境。",
    icon: "fa-solid fa-shield-halved"
  },
  {
    title: "易集成、少侵入，方便维护",
    tag: "对接",
    detail: "把智能能力嵌进现有系统，而不是推倒重来。",
    extra: "对接 IM / CRM / 工单 / 知识库 / OA；通过 API / 中间层 / Agent 二开，降低侵入并可版本管理关键逻辑。",
    icon: "fa-solid fa-plug"
  },
  {
    title: "可观测、可接手，避免锁定",
    tag: "可控",
    detail: "系统对你们透明、可维护，而不是黑盒。",
    extra: "代码、脚本、配置优先放在你们仓库；命中率、转人工、覆盖率等指标可观测可导出，附文档与培训便于自查。",
    icon: "fa-solid fa-chart-line"
  }
];

const supportAdvantages: Advantage[] = [
  {
    title: "试错成本低",
    tag: "试点",
    detail: "从小场景、小部门先试起，先跑通一个可用版本。",
    extra: "效果可见、数据可控后，再决定是否扩大投入。",
    icon: "fa-solid fa-flask"
  },
  {
    title: "方案更灵活不套路",
    tag: "定制",
    detail: "不卖固定模板，在通用与定制间找成本/效果平衡。",
    extra: "按现状裁剪开发量，避免“大而全”带来的维护负担。",
    icon: "fa-solid fa-sliders"
  },
  {
    title: "小团队，沟通链路短、迭代快",
    tag: "效率",
    detail: "直接和核心工程师 / 架构师对话，理解与落地更快。",
    extra: "先上线可真实使用的版本，再按数据快速迭代。",
    icon: "fa-solid fa-bolt"
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
    date: "2025-02-20",
    title: "Coze / Dify / n8n：近期上手要点与踩坑记录",
    summary:
      "Coze 的灵魂在工作流与插件，要自己调 chunk 策略与 API adapter；Dify 像工程师的 AI 中台，RAG/日志/观测完善但生产部署要把数据库、向量库、对象存储和反代配齐；n8n 本质是自动化引擎，AI 节点很薄，记得限流、封装上下文。",
    content: `Coze，官方卖点说的是零代码拖拽，但真用起来就知道灵魂其实在工作流和插件生态上。我之前给 Bot 接了个 OAuth2插件，结果它能在流程里直接把 token 拿回来继续跑，像这种细节一般竞品真没做。它的工作流节点更像轻量级的iPaaS，虽然比不上n8n那么变态，但常见的 HTTP API、KV 存储、上下文管理都能撑住；如果本来就习惯 Zapier 或 Make，迁移到这里没什么门槛。知识库这一块就比较挑人了，PDF 上传、网页抓取看起来省心，但实际效果完全取决于 embedding 的分块策略，我第一次丢长文档进去，回答飘得跟特么 GPT-2回魂一样，最后只能自己调chunk size 和 overlap 才阳间一点。另外 Coze的API 返回和 OpenAl 也不完全兼容，message 分段和 toolcall 的 schema 都有坑，不写 adapter，前端（Next.js/ Vercel 上跑的 Chat UI）直接对接基本要挂。好处是它对外触达确实方便，多渠道一键发布省了不少功夫，所以适合 MVP 或外部试水，但要做长期复杂系统可能还是不太行。

Dify 的路线就不一样，属于是工程师的“AI 中台”。四大件——模型管理、RAG 检索、Agent 工作流、观测评估——一套齐活。它的日志和评测系统非常不错，可以直接看到每次调用的 prompt、响应、token 消耗和命中率，调优复杂链路的时候比自己写一堆 debuglog 快活。RAG部分也给足了选择，pgvector、 Milvus、Weaviate 都能接，但坑在于底层数据库必须先调优好，不然索引没建全、连接池没调，几百 QPS就寄；embedding 跑大了还得盯存储成本，S3/MinlO的账单比 KPI 诚实。部署上官方说“一键”，但那个 Docker Compose 只能算 demo，真要上生产还是Helm/K8S,Postgres、Redis、对象存储、反代（Nginx/Traefilk）全得配齐，最好再上 GitOps （ArgoCD/Flux）做多环境持续交付。不提前规划PVC，迁移的时候会血压飙升。

n8n这东西就更直接了，它压根不是 AI平台，应该算是个自动化引擎，AI 节点只是其中一个 widget。强项是几百个集成组件，Webhook、消息队列（Kafka、RabbitMQ）、数据库（MySQL、Postgres、Mongo）全能接，逻辑编排还能写小段JS 控制流，相当于把 Node.js 灵活性抽象进了可视化。我当时拿 Google Sheet 做灵感池触发LLM 生成标题，结果忘了限流，API队列直接开始爬行，最后只能加 Redis 阀门限流。AI节点本身其实挺薄的，系统提示、上下文拼接都要自己封装，和LangChain、Llamalndex 那种专门为大模型打磨的框架没法比，但胜在生态够厚，几乎能和任何 Saas 打通。如果想更稳，还可以搭配 Temporal或 Prefect 这种调度框架，做复杂任务编排；所以n8n也不用懂Al了，懂你Leader 需求就行了`
  },
  {
    date: "2025-02-20",
    title: "Airflow 的价值是透明性，而非执行性能",
    summary:
      "延迟主要来自调度与进程通信开销，天生不适合低延迟场景；它在批处理和数据管道里提供可追溯、可观测的可见性，TaskFlow API 体现“代码即 DAG”；规模化后文档支撑有限，但生态惯性让它仍是事实标准。",
    content: `Airflow 的体验再次验证了一个恒定的工程规律：任何系统都受制于自身的设计边界。 相同的 CPU，服务器执行同一 DAG 需十秒，本地性能模式四五秒，节能模式甚至三秒。这种反常的梯度说明瓶颈不在硬件，而在解释器调度、进程通信与 Executor 实现。系统开销主导了延迟结构，Airflow 在设计层面无法避免这种“控制面放大效应”——亚毫秒级逻辑被膨胀成秒级延迟，这是其体系固有的代价。

它真正擅长的领域是批处理与数据管道。CeleryExecutor 的运行模式更接近“批量编排器”而非“实时控制器”。延迟敏感的业务（支付、订单流转、同步交易）并不需要调度层，只需数据库状态枚举即可。Airflow 的核心价值并非执行性能，而是透明性：可追溯、可观测、可统计。它在系统中承担“可见化节点”的角色，将复杂的异步过程转化为可解释的结构映射。

TaskFlow API 的出现，进一步揭示了行业的结构拐点：配置文件的表达力已达极限。YAML 的简洁性与约束性在复杂逻辑下失效，代码成为新的均衡点。Airflow 选择“代码即 DAG”，是主动放弃低门槛，换取逻辑的完备性。循环、条件、依赖在语言层内天然具备抽象能力，比层层缩进的配置文件更具可维护性。系统设计从描述式转向命令式，体现出编排系统演化的必然方向——在复杂性增量面前，静态配置让位于可组合逻辑。

代价是清晰的。Airflow 在单 DAG 层面友好，但当规模扩展到模块化、多依赖场景时，文档支撑不足，知识传递依赖经验。系统因此形成筛选机制：只有具备项目组织思维的用户才能留下。 对留下的人而言，Airflow 从“任务调度器”演化为“流程管理框架”，DAG 不再是任务列表，而是运行时依赖图。

竞争者 Prefect 与 Dagster 的策略集中在托管云与用户体验。它们以“轻量、现代”作为入口，尝试以服务化取代生态，但技术债、生态积累与社区规模决定了优势不对称。Apache 基金会的长周期治理与十年沉淀，使 Airflow 成为事实标准。这里的壁垒不是功能，而是生态惯性：系统之间的兼容、插件依赖、团队经验、运维惯性，构成了路径锁定效应。

因此，Airflow 的价值从不在性能。它提供的是一种结构化的可见性与可控性。适用于跨系统、异步、大批量任务的编排与追踪，不适用于高并发、低延迟的实时场景。它是后台的导演，不是前台的收银机。

如果从认知框架去解析：Ni 识别边界与趋势，Te 衡量资源与产出，Fi 确认系统定位与价值，Se 记录操作层的真实表现。四个维度收束的结论是一致的——Airflow 是规模化异步系统的组织者，不是实时系统的执行单元。它的设计哲学强调秩序与可观测性，而非反应速度。

Airflow 的局限不是缺陷，而是边界的自洽。一个系统能做什么，取决于它愿意为代价付出什么。Airflow 选择了延迟，换来了结构透明与运行确定性。在工程世界中，这种取舍本身就是成熟。`
  },
  {
    date: "2025-02-20",
    title: "AI 退潮后的温度：接受边界、换取确定性",
    summary:
      "以 Airflow 为例，系统设计选择了延迟换透明，适用跨系统异步与批量编排，不适合高并发实时；Ni/Te/Fi/Se 的取舍收敛到同一结论：成熟系统靠可观测与确定性站稳，而非追求极致反应速度。",
    content: `当AI的热度退去，我们终于看清它真正的温度。Airflow 的体验再次验证了一个恒定的工程规律：任何系统都受制于自身的设计边界。 相同的 CPU，服务器执行同一 DAG 需十秒，本地性能模式四五秒，节能模式甚至三秒。这种反常的梯度说明瓶颈不在硬件，而在解释器调度、进程通信与 Executor 实现。系统开销主导了延迟结构，Airflow 在设计层面无法避免这种“控制面放大效应”——亚毫秒级逻辑被膨胀成秒级延迟，这是其体系固有的代价。

它真正擅长的领域是批处理与数据管道。CeleryExecutor 的运行模式更接近“批量编排器”而非“实时控制器”。延迟敏感的业务（支付、订单流转、同步交易）并不需要调度层，只需数据库状态枚举即可。Airflow 的核心价值并非执行性能，而是透明性：可追溯、可观测、可统计。它在系统中承担“可见化节点”的角色，将复杂的异步过程转化为可解释的结构映射。

TaskFlow API 的出现，进一步揭示了行业的结构拐点：配置文件的表达力已达极限。YAML 的简洁性与约束性在复杂逻辑下失效，代码成为新的均衡点。Airflow 选择“代码即 DAG”，是主动放弃低门槛，换取逻辑的完备性。循环、条件、依赖在语言层内天然具备抽象能力，比层层缩进的配置文件更具可维护性。系统设计从描述式转向命令式，体现出编排系统演化的必然方向——在复杂性增量面前，静态配置让位于可组合逻辑。

代价是清晰的。Airflow 在单 DAG 层面友好，但当规模扩展到模块化、多依赖场景时，文档支撑不足，知识传递依赖经验。系统因此形成筛选机制：只有具备项目组织思维的用户才能留下。 对留下的人而言，Airflow 从“任务调度器”演化为“流程管理框架”，DAG 不再是任务列表，而是运行时依赖图。

竞争者 Prefect 与 Dagster 的策略集中在托管云与用户体验。它们以“轻量、现代”作为入口，尝试以服务化取代生态，但技术债、生态积累与社区规模决定了优势不对称。Apache 基金会的长周期治理与十年沉淀，使 Airflow 成为事实标准。这里的壁垒不是功能，而是生态惯性：系统之间的兼容、插件依赖、团队经验、运维惯性，构成了路径锁定效应。

因此，Airflow 的价值从不在性能。它提供的是一种结构化的可见性与可控性。适用于跨系统、异步、大批量任务的编排与追踪，不适用于高并发、低延迟的实时场景。它是后台的导演，不是前台的收银机。

如果从认知框架去解析：Ni 识别边界与趋势，Te 衡量资源与产出，Fi 确认系统定位与价值，Se 记录操作层的真实表现。四个维度收束的结论是一致的——Airflow 是规模化异步系统的组织者，不是实时系统的执行单元。它的设计哲学强调秩序与可观测性，而非反应速度。

Airflow 的局限不是缺陷，而是边界的自洽。一个系统能做什么，取决于它愿意为代价付出什么。Airflow 选择了延迟，换来了结构透明与运行确定性。在工程世界中，这种取舍本身就是成熟。`
  }
];

const heroChips = ["1–6 周交付", "￥8,000–￥60,000 典型预算", "偏工程、少花哨"];
const timeline = ["想法 / 场景梳理", "快速试水 MVP", "小规模上线", "持续优化与监控"];

const activeSection = ref("hero");
const selectedNote = ref<NoteItem | null>(null);
let observer: IntersectionObserver | null = null;
const isMobileNavOpen = ref(false);

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
};

const closeMobileNav = () => {
  isMobileNavOpen.value = false;
};

const noteParagraphs = computed(() =>
  selectedNote.value
    ? selectedNote.value.content
        .split("\n\n")
        .map((para) => para.trim())
        .filter(Boolean)
    : []
);

const closeNote = () => {
  selectedNote.value = null;
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
};

const openNote = (note: NoteItem) => {
  selectedNote.value = note;
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
};

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
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
});
</script>

<template>
  <div class="page">
    <header class="top-nav">
      <div class="container">
        <div class="nav-bar">
          <div class="brand">
            <img src="/site-logo.png" alt="紫薯科技Logo" style="width: 40px; height: 40px; vertical-align: middle; margin-right: 8px;" />
            紫薯科技 · AI Agent
          </div>
          <button
            type="button"
            class="nav-toggle"
            :class="{ open: isMobileNavOpen }"
            :aria-expanded="isMobileNavOpen"
            aria-label="切换导航"
            @click="toggleMobileNav"
          >
            <span class="line" />
            <span class="line" />
            <span class="line" />
          </button>
        </div>
        <nav :class="['nav-links', { 'nav-open': isMobileNavOpen }]">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="`#${item.id}`"
            class="nav-link"
            :class="{ active: activeSection === item.id }"
            @click="closeMobileNav"
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

      <section id="cases" class="section cases-section">
        <div class="container">
          <div class="cases-header">
            <h2 class="section-heading">一些我们做过和正在做的东西（Cases）</h2>
            <p class="section-subtitle cases-subtitle">
              3–4 个真实落地的代表场景，先讲业务问题与结果，再讲 Agent 的做法；更多案例放在单独页面。
            </p>
          </div>
          <div class="case-chips" v-if="caseScopes.length">
            <span v-for="scope in caseScopes" :key="scope" class="case-chip">{{ scope }}</span>
          </div>
          <div class="cases-grid">
            <article v-for="item in cases" :key="item.result" class="case-card">
              <div class="case-tag">{{ item.tag }}</div>
              <h3 class="case-title">
                <span class="case-result">{{ item.result }}</span>
                <span class="case-agent">（{{ item.agent }}）</span>
              </h3>
              <p class="case-background">{{ item.background }}</p>
              <div class="case-approach">
                <div class="case-label">我们怎么做</div>
                <ul>
                  <li v-for="step in item.approach" :key="step">{{ step }}</li>
                </ul>
              </div>
              <div class="case-effect">
                <span class="case-label">效果</span>
                <span class="case-effect-text">{{ item.effect }}</span>
              </div>
            </article>
          </div>
          <div class="cases-footer">
            <a class="case-more-link" href="/cases">
              查看更多案例
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section id="advantages" class="section">
        <div class="container">
          <h2 class="section-heading">为什么找我们这样的「小而精」团队（Advantages）</h2>
          <p class="section-subtitle">
            我们不是大公司，没有庞大组织和流程，但在 AI Agent / 业务自动化方向长期深耕。对很多中小企业来说，一支规模不大但技术与业务都过关的团队，往往比“人多但不熟你业务”的团队更适合。
          </p>
          <div class="advantage-groups">
            <div class="adv-group advantage-top">
              <div class="cards-grid advantages-grid primary-grid">
                <article
                  v-for="adv in coreAdvantages"
                  :key="adv.title"
                  class="card advantage-card advantage-primary"
                >
                  <div class="adv-tag" role="img" :aria-label="adv.tag || adv.title">
                    <i :class="adv.icon || 'fa-solid fa-star'"></i>
                  </div>
                  <h3>{{ adv.title }}</h3>
                  <div class="adv-body">
                    <p class="meta">{{ adv.detail }}</p>
                    <p v-if="adv.extra" class="extra">{{ adv.extra }}</p>
                  </div>
                </article>
              </div>
            </div>
            <div class="adv-group advantage-bottom">
              <div class="cards-grid advantages-grid secondary-grid">
                <article
                  v-for="adv in supportAdvantages"
                  :key="adv.title"
                  class="card advantage-card advantage-secondary"
                >
                  <div class="adv-tag" role="img" :aria-label="adv.tag || adv.title">
                    <i :class="adv.icon || 'fa-solid fa-star'"></i>
                  </div>
                  <h3>{{ adv.title }}</h3>
                  <div class="adv-body">
                    <p class="meta">{{ adv.detail }}</p>
                    <p v-if="adv.extra" class="extra">{{ adv.extra }}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
          <div class="note advantage-note">
            目标：在安全、可控的前提下，先跑通 1–2 个可观测、有数据的试点，再基于效果逐步扩展，而不是一开始就做周期长、风险大的大项目。
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
            紫薯科技是一个核心成员仅有 3 人的小型工程团队，每个人都长期在一线写代码、做真实业务系统。
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
            <article
              v-for="note in notes"
              :key="note.title"
              class="note-card"
              role="button"
              tabindex="0"
              @click="openNote(note)"
              @keydown.enter.prevent="openNote(note)"
              @keydown.space.prevent="openNote(note)"
            >
              <div class="badge">{{ note.date }}</div>
              <h3>{{ note.title }}</h3>
              <p class="meta">{{ note.summary }}</p>
              <div class="note-card-cta">点击查看全文</div>
            </article>
          </div>
        </div>
      </section>

    </main>
    <footer class="footer">
      <div class="container footer-shell">
        <div class="footer-brand-compact">
          <img class="footer-logo" src="/site-logo.png" alt="紫薯科技 Logo" />
          <div>
            <div class="footer-title">紫薯科技 · AI Agent 技术伙伴</div>
            <div class="footer-slogan">小微企业的工程化 Agent 团队</div>
          </div>
        </div>

        <div class="footer-links-compact">
          <a href="#services">我们能帮你做什么</a>
          <a href="#cases">案例</a>
          <a href="#advantages">为什么找我们</a>
          <a href="#pricing">合作 / 定价</a>
          <a href="#team">团队</a>
        </div>

        <div class="footer-contact-compact">
          <span class="footer-label">微信</span>
          <span class="footer-value">________</span>
          <span class="footer-divider-dot">·</span>
          <span class="footer-label">Email</span>
          <span class="footer-value">________</span>
          <span class="footer-divider-dot">·</span>
          <span class="footer-value">GitHub / Blog / 公众号</span>
        </div>

        <a class="btn btn-primary footer-top-btn" href="#hero" aria-label="回到顶部">
          回到顶部
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>

      <div class="container footer-bottom">
        <small>小团队、重工程、追求可落地的 Agent 交付</small>
        <span class="footer-divider" />
        <small>Copyright © 紫薯科技</small>
      </div>
    </footer>
    <div
      v-if="selectedNote"
      class="note-modal-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="selectedNote?.title"
      @click.self="closeNote"
    >
      <div class="note-modal">
        <div class="note-modal-header">
          <div>
            <div class="badge">{{ selectedNote.date }}</div>
            <h3>{{ selectedNote.title }}</h3>
          </div>
          <button class="note-modal-close" type="button" aria-label="关闭" @click="closeNote">
            ✕
          </button>
        </div>
        <div class="note-modal-body">
          <p v-for="(para, idx) in noteParagraphs" :key="idx">{{ para }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
