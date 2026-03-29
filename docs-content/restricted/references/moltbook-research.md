# Moltbook 项目调研

> 调研日期：2026-02-08

本文档记录了对 Moltbook（AI 代理社交网络）及其底层框架 OpenClaw 的深度调研，为 INTJsys 未来 AI Agent 产品线提供技术参考和案例警示。

## 概述

**Moltbook** 是一个专为 AI 代理（Agent）设计的互联网论坛，于 2026 年 1 月由企业家 Matt Schlicht 推出。其口号为 **"The Front Page of the Agent Internet"**（代理互联网的首页），设计上高度模仿 Reddit。

| 属性 | 详情 |
|:---|:---|
| **创始人** | Matt Schlicht（Chatbots Magazine / Octane AI 创始人） |
| **上线时间** | 2026 年 1 月 |
| **声称注册代理** | ~150 万 |
| **实际人类所有者** | ~1.7 万（安全审计数据） |
| **帖子 / 评论** | ~4.2 万 / ~23.3 万 |
| **底层框架** | OpenClaw（开源） |
| **网址** | [moltbook.com](https://moltbook.com) |

::: warning 争议项目
Moltbook 的数据真实性、安全性和商业模式均受到广泛质疑。本文档同时记录其正面参考价值和反面教训。
:::

## 核心概念

| 概念 | 描述 |
|:---|:---|
| **Submolts** | 类似 Reddit 的 Subreddits，按主题分类的 AI 讨论社区 |
| **Agent 自主交互** | AI 代理可自主发帖、回复、评论、投票 |
| **Skills 共享** | 代理之间可分享和安装 Skill 插件 |
| **AI 审核** | 平台由 AI 代理 "Clawd Clawderberg" 管理和审核 |
| **人类观察模式** | 人类用户只能浏览，不能发帖互动 |

## 技术架构

### 整体架构

Moltbook 采用客户端-服务器模型：

```
┌─────────────────────────────────────────────────┐
│  AI Agent (OpenClaw)                            │
│  - 本地运行于用户机器上                            │
│  - 定期从 Moltbook 服务器获取指令/内容               │
│  - 自主决定：发帖 / 回复 / 投票                      │
└──────────────────────┬──────────────────────────┘
                       │ API 调用
                       ▼
┌─────────────────────────────────────────────────┐
│  Moltbook Server (moltbook.com)                 │
│  - 后端：Supabase (PostgreSQL)                   │
│  - 社区结构：Submolts                             │
│  - AI 审核员：Clawd Clawderberg                  │
└─────────────────────────────────────────────────┘
```

### 后端技术栈

| 层级 | 技术 |
|:---|:---|
| **数据库** | Supabase (PostgreSQL) |
| **API** | RESTful HTTP API |
| **认证** | API Key（暴露在客户端 JS 中） |
| **开发方式** | "AI Vibe Coding"（AI 辅助快速开发） |

### 底层框架 — OpenClaw

OpenClaw（曾先后命名为 Clawdbot → Moltbot → OpenClaw）是 Moltbook 的客户端代理框架，由 **Peter Steinberger** 创建，MIT 开源协议。

#### OpenClaw 架构

```
WhatsApp / Telegram / Slack / Discord / Signal / iMessage / ...
               │
               ▼
┌───────────────────────────────┐
│            Gateway            │
│       (WebSocket 控制面板)     │
│     ws://127.0.0.1:18789      │
└──────────────┬────────────────┘
               │
               ├─ Pi Agent (RPC)
               ├─ CLI (openclaw …)
               ├─ WebChat UI
               ├─ macOS App
               └─ iOS / Android Nodes
```

#### OpenClaw 核心特性

| 特性 | 说明 |
|:---|:---|
| **本地优先 Gateway** | WebSocket 控制面板，管理会话、渠道、工具、事件 |
| **多渠道消息** | 支持 13+ 消息平台（WhatsApp、Telegram、Slack、Discord 等） |
| **Skills 插件系统** | 52+ 内置 Skill，支持安装第三方 Skill |
| **浏览器控制** | CDP 协议控制 Chrome/Chromium |
| **语音交互** | Voice Wake + Talk Mode |
| **Docker 沙箱** | 安全隔离执行环境 |
| **技术栈** | TypeScript + Node.js ≥ 22 |
| **开源协议** | MIT |

#### OpenClaw 内置 Skills 示例

| 分类 | Skills |
|:---|:---|
| **通讯集成** | Discord、Slack、iMessage、WhatsApp |
| **开发工具** | GitHub、Coding Agent |
| **生产力** | Notion、Obsidian、Apple Notes、Trello |
| **多媒体** | Spotify、Video Frames、Camera Snap |
| **AI 能力** | Gemini、OpenAI Image Gen、Whisper |
| **自动化** | Cron、Weather、Session Logs |

## 安全事件分析

::: danger 严重安全漏洞
Moltbook 上线后爆发多起严重安全事件，所有敏感数据被泄露。以下记录可作为产品安全的反面教材。
:::

### Supabase 数据库暴露

安全公司 **Wiz** 发现的问题：

| 问题 | 详情 |
|:---|:---|
| **API Key 暴露** | Supabase API 密钥直接写在客户端 JavaScript 中 |
| **RLS 未配置** | Row Level Security 未启用，整个数据库裸奔 |
| **泄露 API Token** | ~150 万 API 认证令牌被暴露 |
| **泄露邮箱** | ~3.5 万邮箱地址泄露 |
| **泄露私信** | AI 代理之间的私信内容可被读取 |
| **账号冒充** | 任何人可通过 HTTP 请求冒充任意代理、修改帖子 |

### Supply Chain 漏洞

| 问题 | 详情 |
|:---|:---|
| **恶意 Skill** | 伪装为天气插件的恶意 Skill，窃取配置文件和 API 密钥 |
| **无权限系统** | 安装 Skill 无需审批或权限控制 |
| **无沙箱隔离** | Skill 代码可直接访问宿主系统 |
| **无审计追踪** | 无法追溯 Skill 的行为记录 |

### CVE-2026-25253

| 属性 | 详情 |
|:---|:---|
| **漏洞类型** | 远程代码执行 (RCE) |
| **影响范围** | OpenClaw 全版本 |
| **严重等级** | 高危 |
| **修复版本** | OpenClaw v2026.1.29 |

### 事件响应

- Moltbook 临时下线
- 强制重置所有代理 API 密钥

## 争议分析

### 数据真实性

| 质疑点 | 证据 |
|:---|:---|
| **虚假用户规模** | 150 万代理 vs 仅 1.7 万实际人类用户 |
| **人类伪装代理** | cURL 命令即可模拟代理发帖 |
| **静默代理比例高** | 150 万代理仅产生 4.2 万帖子、23.3 万评论 |
| **批量注册** | 有人利用 OpenClaw 工具注册 50 万虚假 AI 用户 |

### 商业模式争议

| 争议 | 详情 |
|:---|:---|
| **流量骗局** | 批评者认为是"人类精心设计的流量骗局" |
| **代币投机** | $MOLT 代币 48 小时蒸发 1 亿美金 |
| **代理经济泡沫** | 所谓的"代理经济"被评为"没有清算所的欠条堆" |
| **融资变现** | 创始人通过热度参与 Feltsense 项目 510 万美元融资 |

### 开发方式质疑

创始人 Matt Schlicht 自称使用 "AI Vibe Coding" 开发 Moltbook（通过 AI 助手根据概念构建平台，非手动编码）。安全专家认为这种方式导致了危险的安全疏忽，包括 RLS 未配置、API Key 暴露等基础性问题。

::: tip 教训
"Vibe Coding" 可以加速原型开发，但**不能取代系统性的安全审查**。任何面向生产的系统都必须经过安全评审。
:::

## 行业影响

### 正面意义

| 方面 | 描述 |
|:---|:---|
| **多代理交互实验** | 首次大规模展示 AI 代理自主社交的可能性 |
| **OpenClaw 框架** | 开源、本地优先、多渠道集成的 AI 代理框架具有技术价值 |
| **行业讨论** | 引发关于 AI 代理自主性、身份验证、安全边界的思考 |

### 反面教训

| 方面 | 教训 |
|:---|:---|
| **安全先行** | AI 辅助开发不能取代安全审查 |
| **信任模型** | 开放的 Skill 安装需要权限和沙箱系统 |
| **数据真实性** | AI 生态中的用户指标需要新的验证标准 |
| **金融投机风险** | AI 热点极易被加密货币投机利用 |

## INTJsys 应用建议

### 技术参考价值

| 方面 | OpenClaw 可借鉴之处 |
|:---|:---|
| **多渠道消息集成** | 13+ 消息平台的统一 Gateway 架构 |
| **Skills 插件系统** | 基于 Anthropic Agent Skill 规范的模块化扩展 |
| **本地优先架构** | WebSocket 控制面板 + 设备节点的设计模式 |
| **Agent-to-Agent** | 跨会话的代理间通信协议 |

### 安全警示

- ❌ 不要在客户端暴露数据库凭证
- ❌ 不要跳过 RLS / RBAC 配置
- ❌ 不要允许未审查的第三方代码执行
- ✅ 必须实施 Skill 沙箱隔离
- ✅ 必须实施 API 认证和权限分级
- ✅ 必须对 "Vibe Coding" 产出进行安全审查

## 参考链接

- [Moltbook 官网](https://moltbook.com)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [Wiz 安全报告](https://www.wiz.io)
- [Wikipedia: Moltbook](https://en.wikipedia.org/wiki/Moltbook)
- [知乎讨论](https://www.zhihu.com/question/2000597877295174051)
