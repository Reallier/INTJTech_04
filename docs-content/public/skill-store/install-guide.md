# 安装指南

Agent Skills 的安装与配置说明。

---

## 安装位置

Skills 可以安装在两个位置，根据使用范围选择：

| 位置 | 路径 | 适用场景 |
|:--|:--|:--|
| **用户级** | `~/.gemini/skills/` | 跨项目复用，个人常用工具 |
| **项目级** | `.gemini/skills/` | 项目专属，提交到版本控制 |

---

## 安装方法

### 方法一：克隆整个合集

```bash
# 用户级（推荐）
git clone https://github.com/ComposioHQ/awesome-claude-skills.git ~/.gemini/skills/composio

# 项目级
git clone https://github.com/ComposioHQ/awesome-claude-skills.git .gemini/skills/composio
```

### 方法二：提取单个 Skill

```bash
# 从已克隆的合集中提取
cp -r awesome-claude-skills/skills/docx ~/.gemini/skills/docx
```

### 方法三：手动创建

```bash
mkdir -p ~/.gemini/skills/my-skill
touch ~/.gemini/skills/my-skill/SKILL.md
```

---

## SKILL.md 格式

每个 Skill 目录必须包含 `SKILL.md` 文件：

```yaml
---
name: "skill-name"          # 必填，≤64字符，仅小写+连字符
description: "技能描述"      # 必填，≤1024字符
---

# Instructions
具体操作步骤...

# Constraints
使用限制和规则...

# Resources
如何使用 scripts/, references/ 等资源...
```

---

## 目录结构

```
.gemini/skills/skill-name/
├── SKILL.md              # 核心定义 (必须)
├── scripts/              # 可执行脚本 (Python, Bash 等)
├── references/           # 参考文档、Schema
└── assets/               # 代码模板、样板文件
```

---

## 平台兼容性

| 平台 | 技能路径 | 状态 |
|:--|:--|:--:|
| **Gemini CLI** | `.gemini/skills/` | ✅ |
| **Claude Code** | `.claude/skills/` | ✅ |
| **GitHub Copilot** | `.github/skills/` | ✅ |
| **Cursor** | `.cursor/skills/` | ✅ |

::: tip 跨平台技巧
大多数 Skills 核心内容通用，只需复制到对应平台目录即可。
:::

---

## 验证安装

安装后，在 Agent 会话中测试触发：

```
> 帮我审查这个 PR

[Agent 应自动识别并加载 code-review skill]
```

---

## 更多资源

- [Agent Skills 开放标准](https://agentskills.io)
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) ⭐ 20.7k
- [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) ⭐ 20.7k
