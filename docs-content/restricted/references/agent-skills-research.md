# Agent Skills 调研

> **调研日期**: 2026-01-18  
> **关键词**: AI Agent, Skills, MCP, Claude Code, Gemini CLI

---

## 概述

**Agent Skills** 是一种为 AI Agent 提供专业化、可复用能力扩展的开放标准。它将特定领域的知识、工作流程和指令封装为模块化的"技能包"，使通用 AI Agent 能够按需激活并执行复杂的专业任务。

::: tip 核心类比
如果 MCP 是 AI 的"USB-C 接口"（解决**能访问什么**），那么 Agent Skills 就是"操作手册"（解决**如何执行**）。
:::

---

## 一、核心概念

### 1.1 核心理念

| 理念 | 描述 |
| :--- | :--- |
| **模块化** | 技能作为独立目录存在，易于共享、版本控制和复用 |
| **声明式** | 通过 `SKILL.md` 文件声明技能用途和触发条件 |
| **资源驱动** | 技能可包含脚本、参考文档、代码模板等辅助资源 |
| **渐进式披露** | Agent 仅预加载技能名称和描述，完整内容在激活时才加载 |

### 1.2 SKILL.md 格式规范

```yaml
---
name: "skill-unique-name"       # 必填，≤64字符，仅小写+连字符
description: "技能用途描述"      # 必填，≤1024字符，触发关键字
---

# Instructions
具体操作流程步骤

# Constraints  
Agent 使用此技能时必须遵守的规则

# Resources
如何使用 scripts/, references/, assets/ 资源
```

### 1.3 目录结构

```
.gemini/skills/skill-name/
├── SKILL.md              # 核心定义 (必须)
├── scripts/              # 可执行脚本 (Python, Bash, Node.js)
├── references/           # 参考文档/Schema/规则说明
└── assets/               # 代码模板/样板文件
```

---

## 二、与 MCP 的关系

| 维度 | MCP | Agent Skills |
| :--- | :--- | :--- |
| **解决问题** | Agent 能访问**什么** | Agent **如何**执行任务 |
| **核心功能** | 外部工具、API、数据源的集成标准 | 专业知识、工作流程的封装标准 |
| **上下文影响** | 初始化时注入所有工具 Schema | 仅激活时加载相关技能内容 |
| **开发复杂度** | 需要编码实现 Server/Client | 自然语言指令为主，可选脚本 |

**协同模式**：两者互补，现代 Agent 倾向于组合使用。

---

## 三、生态系统

### 3.1 平台采用情况

| 平台 | 状态 | 备注 |
| :--- | :---: | :--- |
| **Anthropic Claude** | ✅ | 标准发起者，Claude.ai / Claude Code 完整支持 |
| **Google Gemini CLI** | ✅ | Antigravity 生态兼容 |
| **GitHub Copilot** | ✅ | `.github/skills/` 位置支持 |
| **Cursor** | ✅ | AI 代码编辑器核心扩展点 |
| **OpenAI Codex** | ✅ | 2025-12 起在 Codex 文档中引入 |

### 3.2 开放标准

- **官网**: [agentskills.io](https://agentskills.io)
- **发布**: 2025年12月由 Anthropic 开源

---

## 四、GitHub 优质合集

### 4.1 头部仓库

| 仓库 | Stars | 描述 |
| :--- | :---: | :--- |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 20.7k | Skills, hooks, slash-commands 综合合集 |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 20.7k | Composio 官方维护，分类清晰 |
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | 5.3k | 专注 Claude Code 工作流 |
| [heilcheng/awesome-agent-skills](https://github.com/heilcheng/awesome-agent-skills) | 1.4k | 跨平台 (Claude/Codex/Copilot) |
| [zechenzhangAGI/AI-research-SKILLs](https://github.com/zechenzhangAGI/AI-research-SKILLs) | 797 | AI 研究专用 (GRPO/Megatron/vLLM) |
| [Prat011/awesome-llm-skills](https://github.com/Prat011/awesome-llm-skills) | 690 | LLM 通用 (含 Gemini CLI 兼容) |

### 4.2 技能分类

| 类别 | 代表技能 |
| :--- | :--- |
| **开发代码** | `code-review`, `create-pr`, `test-runner`, `debugger` |
| **文档处理** | `docx`, `pdf`, `xlsx`, `markdown-optimizer` |
| **数据分析** | `data-analysis`, `csv-processor`, `chart-generator` |
| **研究写作** | `deep-research`, `academic-writer`, `citation-manager` |
| **AI 研究** | `grpo-training`, `megatron-config`, `vllm-deploy` |
| **图像多媒体** | `imagen`, `screenshot-analyzer` |

### 4.3 垂直领域

| 领域 | 仓库 |
| :--- | :--- |
| 法律 | [lawvable/awesome-legal-skills](https://github.com/lawvable/awesome-legal-skills) |
| AI 研究 | [zechenzhangAGI/AI-research-SKILLs](https://github.com/zechenzhangAGI/AI-research-SKILLs) |

---

## 五、使用指南

### 5.1 安装到用户级 (跨项目)

```bash
git clone https://github.com/ComposioHQ/awesome-claude-skills.git ~/.gemini/skills/composio
```

### 5.2 安装到项目级

```bash
git clone https://github.com/travisvn/awesome-claude-skills.git .gemini/skills/travisvn
```

### 5.3 单技能提取

```bash
cp -r awesome-claude-skills/skills/docx ~/.gemini/skills/docx
```

---

## 六、最佳实践

1. **描述撰写** — 具体列出触发关键字和专业领域
2. **脚本优先** — 复杂逻辑封装为可执行脚本
3. **交互式规划** — 重大变更前要求 Agent 先生成计划
4. **上下文精简** — SKILL.md 仅包含 Agent 不知道的信息

---

## 七、技术展望

- **Context Engineering 时代** — 从"提示工程"到"上下文工程"
- **Hybrid Agent** — MCP + Skills 组合成为主流架构
- **技能市场** — [SkillsMP.com](https://skillsmp.com) 等平台正在形成
