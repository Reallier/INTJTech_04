# 效率脚本类

自动化工作流与方法论实践的技能包。

---

## atomic-notes <Badge type="tip" text="INTJsys 自研" />

> 原子笔记方法论，基于 Zettelkasten 原则

**场景**：
- 知识管理与组织
- 文档模块化拆分
- 笔记系统构建

**核心原则**：
- **单一职责 (SRP)**：一个笔记只包含一个独立的知识单元
- **自包含**：笔记应独立可理解，无需依赖外部上下文
- **正交性**：不同笔记间无内容重叠
- **描述性标题**：标题即内容摘要

**安装**：
```bash
# 已内置于项目 .gemini/skills/atomic-notes
```

**触发示例**：
- "按原子笔记原则拆分这份文档"
- "检查这个笔记是否符合 SRP"

---

## ois-json-first <Badge type="tip" text="INTJsys 自研" />

> OIS (Observable Intelligent Scripts) JSON-First 状态管理

**场景**：
- Agent 间数据传递
- 结构化状态管理
- 可追踪执行流程

**核心理念**：
- **JSON 优先**：所有 Agent 输出强制为结构化 JSON
- **确定性 > 智能**：可追踪比"聪明"更重要
- **数据清洗器**：LLM 是翻译插件，不是流水线主宰

```json
{
  "status": "success",
  "data": { /* 结构化结果 */ },
  "metadata": { "timestamp": "...", "agent": "..." }
}
```

**安装**：
```bash
# 将在 .gemini/skills/ois-json-first 发布
```

**触发示例**：
- "用 JSON 格式输出分析结果"
- "确保输出可被下游脚本解析"

---

## automation-workflow

> 通用自动化工作流模板

**场景**：
- 重复性任务自动化
- CI/CD 流程辅助
- 批处理脚本生成

**安装**：
```bash
git clone https://github.com/heilcheng/awesome-agent-skills.git ~/.gemini/skills/agent-skills
```

**来源**：[awesome-agent-skills](https://github.com/heilcheng/awesome-agent-skills) ⭐ 1.4k

**触发示例**：
- "生成一个自动化部署脚本"
- "创建批量处理工作流"
