# 官网 - INTJTech Official Site

## 定位

简序智能官网，面向小微企业的AI Agent技术伙伴展示平台。

---

## 版本历史

### V2 - 极简工业风 (2025-12-31 ~)

**设计灵感**: Linear / WorkOS 风格

**主要变更**:
- 采用黑白灰单色系设计，去除紫色主题
- Bento Grid 产品矩阵布局
- 滚动揭示动画 (Intersection Observer)
- 背景栅格纹理，模拟工业底纸

**色彩系统**:
```css
--bg: #ffffff;
--fg: #111111;
--muted: #666666;
--border: rgba(0, 0, 0, 0.08);
```

**核心页面**:
- 首页: Hero → Bento Grid → Deep Dive → Comparison → Developer → Manifesto
- About: 团队介绍 → 技术优势 → 技术日志

---

### V1 - 紫色主题 (~ 2025-12-31)

::: details V1 设计归档

**设计风格**: 紫色渐变 + 卡片式布局

**色彩系统**:
```css
--color-primary: #7c3aed;
--color-accent: #6366f1;
/* 渐变 */
background: linear-gradient(135deg, #6366f1, #a855f7);
```

**核心特点**:
- 紫色为主色调
- FontAwesome 图标
- 功能卡片列表布局
- 用户控制台入口

**归档文件**: Git 提交 `65d8d6e`

如需回滚，可执行：
```bash
git checkout 65d8d6e -- pages/index.vue pages/about.vue
```

:::

---

## 组件化最佳实践

### 共享导航栏组件 (2026-01-19)

**问题**: 多页面导航栏不一致，样式和逻辑分散在各页面中，维护困难。

**解决方案**: 创建 `components/SiteHeader.vue` 共享组件，统一管理导航栏。

**组件结构**:
```
components/
└── SiteHeader.vue    # 共享 Header（含导航、用户卡片、下拉菜单）
```

**使用方式**:
```vue
<template>
  <div class="page">
    <SiteHeader @open-login="showLoginModal = true" />
    <main>...</main>
  </div>
</template>
```

**关键特性**:
- 导航链接自动根据 `$route.path` 标记 active 状态
- 通过 `@open-login` 事件让页面控制登录弹窗
- 完整封装用户认证逻辑（useAuth）

---

### CSS 下划线实现方案

**错误方案**: 使用 `border-bottom` 实现下划线

问题：在某些浏览器/渲染条件下，border 会出现圆角或变形。

**正确方案**: 使用 `::after` 伪元素

```css
.nav-link {
  position: relative;
  color: var(--fg);
  font-weight: 600;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--fg);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.nav-link.active::after {
  transform: scaleX(1);
}
```

**优势**:
- 下划线独立于文字渲染，不受 border-radius 影响
- 可通过 `transform: scaleX()` 实现动画效果
- 精确控制下划线位置和粗细

---

### 视觉一致性：透明区块与卡片高对比度 (2026-01-20)

**问题**:
1. 全局样式 (`main.css`) 中的 `.section:nth-of-type` 规则导致页面区块交替出现浅灰/白色背景，覆盖了全局网格背景（Global Grid）。
2. 在网格背景上，纯白底色的卡片如果边框过细（如浅灰色或虚线），视觉边界不清，用户体验不佳。

**解决方案**:
1. **区块透明化**: 在页面级样式中显式覆盖全局背景，设置 `background: transparent`。
2. **卡片高对比度**: 所有的卡片组件（Card/Block）保持白色背景 (`#fff`)，但强制使用黑色实线边框 (`1px solid var(--fg)`)。

**代码示例**:

```css
/* 1. 强制区块背景透明，透出底部网格 */
.core-section,
.curated-section,
.mcp-section,
.pricing-section,
.connect-section {
  background: transparent;
}

/* 2. 卡片：白底 + 黑边框 */
.skill-card,
.mcp-card,
.pricing-card {
  background: #fff;
  border: 1px solid var(--fg); /* 关键：黑色实线 */
  /* border: 1px dashed var(--border);  <-- 避免使用虚线或浅色 */
}
```

**效果**:
- 页面整体网格纹理贯穿始终，无色块遮挡。
- 内容卡片清晰悬浮于网格之上，边界硬朗，工业风强烈。

---

## 核心页面

### 首页
- 公司定位：用工程化方法设计、开发和落地AI Agent
- 产品矩阵：TalentAI（旗舰）、实验室、INTJ Bridge
- 核心能力：多模态语义解析、双向认知匹配
- 技术服务区块：精选开源项目部署运维（2026-01-31 新增）

### 技术服务（2026-01-31 新增）

**路由结构**:
```
/services           # 技术服务列表页
/services/[slug]    # 服务详情页（如 /services/openclaw）
```

**当前服务**:
- OpenClaw 部署运维 - 12+ 消息平台统一接入的个人 AI 助手网关
- Eigent 部署运维 - 开源多智能体协作桌面应用（CAMEL-AI），支持 MCP 集成
- Langfuse 部署运维 - LLM 可观测与评测闭环平台（Trace/Prompt/评测）
- Promptfoo 回归测试体系 - LLM Prompt/Agent 回归评测与 CI Gate 落地
- DeepEval 评测体系 - LLM 评测与单元测试框架（metrics + LLM-as-judge）
- Ragas RAG 评测 - RAG 质量评测框架（忠实度/相关性/回答质量等）
- Garak 红队扫描 - LLM 安全红队基线扫描与整改复测
- PyRIT 对抗测试 - 对抗测试编排与安全评估报告（Microsoft 开源）

**页面模板**:
- `pages/services/index.vue` - 服务列表
- `pages/services/[slug].vue` - 服务详情

### 技术选型中心 (MCP & Skill)
- 核心资产（自研能力展示）
- 精选开源（Skill 精选）
- Agent 连接器（MCP Servers）

### 服务控制台
- 用户登录/注册
- 服务接入
- 余额管理

### 管理后台
- 用户管理
- 服务配置
- 统计数据

---

## 合作定价

| 包类型 | 周期 | 价格 |
|--------|------|------|
| Agent试水包 | 1-2周 | ¥8,000-20,000 |
| 小规模上线包 | 3-6周 | ¥25,000-60,000 |
| 月度优化包 | 持续 | ¥4,000-15,000/月 |

---

## 技术栈

- 框架：Nuxt 3 + Vue 3
- 语言：TypeScript
- 样式：Scoped CSS + 全局 main.css
- 图标：FontAwesome 6
- 字体：Inter (Google Fonts)
- 部署：Docker + Traefik
- 数据库：PostgreSQL（Prisma）

---

## 部署信息

**镜像名称**: `intjsys-official`

**容器仓库**: `ccr.ccs.tencentyun.com/reallier/intjsys-official:latest`

**部署命令**:
```bash
# Windows
.\deploy.bat

# Mac/Linux
./scripts/deploy.sh
```

---

## 线上环境

- 地址：`https://intjsys.com`
- 服务端口：3000（Traefik 代理）

