# Awesome MCP Servers 调研

> **调研日期**：2026-01-16  
> **目的**：筛选适合公司 Agent 系统的 MCP Server，用于工具集成和能力扩展

---

## 什么是 MCP

MCP（Model Context Protocol）是 Anthropic 主导的 AI 工具协议标准。它定义了 AI Agent 与外部工具交互的统一接口，使工具可以跨框架复用。

**核心价值**：
- 工具只需实现一次 MCP Server，就能被不同 Agent 框架调用
- 解耦工具实现与 Agent 框架

---

## 强推荐（直接可用）

### Browser MCP ⭐⭐⭐⭐⭐
- **仓库**：[browsermcp/mcp](https://github.com/browsermcp/mcp)
- **功能**：本地浏览器自动化
- **应用场景**：Boss Agent、知乎爬虫的浏览器自动化，比原生 Playwright 更容易被 AI 调用

### Android MCP ⭐⭐⭐⭐
- **仓库**：[minhalvp/android-mcp-server](https://github.com/minhalvp/android-mcp-server)
- **功能**：通过 ADB 控制 Android 设备
- **应用场景**：移动端自动化（截图、UI 分析、包管理）

### Docker MCP ⭐⭐⭐⭐
- **仓库**：[QuantGeekDev/docker-mcp](https://github.com/QuantGeekDev/docker-mcp)
- **功能**：Docker 容器管理
- **应用场景**：让 Agent 能直接管理容器，适合 AIOps 场景

### Kubernetes MCP ⭐⭐⭐⭐
- **仓库**：[Flux159/mcp-server-kubernetes](https://github.com/Flux159/mcp-server-kubernetes)
- **功能**：K8s 集群管理（Pods、Deployments、Services）
- **应用场景**：AIOps 巡检 Agent 增强

### Alertmanager MCP ⭐⭐⭐⭐⭐
- **仓库**：[ntk148v/alertmanager-mcp-server](https://github.com/ntk148v/alertmanager-mcp-server)
- **功能**：对接 Prometheus Alertmanager
- **应用场景**：让 AI 能查询和管理告警，直接对接现有监控栈


---

## 值得研究

### Memory（官方）
- **仓库**：[modelcontextprotocol/servers/memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)
- **功能**：知识图谱记忆系统
- **价值**：对 Agent 记忆架构有参考价值

### Sequential Thinking（官方）
- **仓库**：[modelcontextprotocol/servers/sequentialthinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)
- **功能**：动态反思式问题解决
- **价值**：类似 CoT 的思维链推理

### bytebase/dbhub
- **仓库**：[bytebase/dbhub](https://github.com/bytebase/dbhub)
- **功能**：通用数据库 MCP
- **价值**：支持主流数据库，比自己封装省事

### Excel MCP
- **仓库**：[haris-musa/excel-mcp-server](https://github.com/haris-musa/excel-mcp-server)
- **功能**：Excel 读写、图表、透视表
- **价值**：处理 Excel 格式简历（TalentAI）

### Email MCP
- **仓库**：[Shy2593666979/mcp-server-email](https://github.com/Shy2593666979/mcp-server-email)
- **功能**：发送邮件（支持 Gmail/Outlook/QQ 等）
- **价值**：自动化通知场景

---

## 有意思的方向

### Hippycampus
- **仓库**：[cromwellian/hippycampus](https://github.com/cromwellian/hippycampus)
- **功能**：Swagger/OpenAPI → MCP Server 自动转换
- **价值**：快速把现有 API（TalentAI、知乎搜索）转成 MCP 工具

### MCPJungle
- **仓库**：[mcpjungle/MCPJungle](https://github.com/mcpjungle/MCPJungle)
- **功能**：开源自托管 MCP 网关
- **价值**：统一管理多个 MCP Server

### Magg
- **仓库**：[sitbon/magg](https://github.com/sitbon/magg)
- **功能**：Meta-MCP，让 AI 能自己发现和安装 MCP 服务器
- **价值**：Agent 自主扩展能力

### Windows CLI
- **仓库**：[SimonB97/win-cli-mcp-server](https://github.com/SimonB97/win-cli-mcp-server)
- **功能**：Windows 命令行控制（PowerShell/CMD/Git Bash）
- **价值**：本地自动化

---

## MCP 开发框架

| 框架 | 语言 | 说明 |
|------|------|------|
| [LiteMCP](https://github.com/wong2/litemcp) | TypeScript | 轻量优雅的 MCP 框架 |
| [mcp-framework](https://github.com/QuantGeekDev/mcp-framework) | TypeScript | 快速构建 MCP Server |
| [MCP Plexus](https://github.com/super-i-tech/mcp_plexus) | Python | 多租户 MCP 框架，支持 OAuth 2.1 |
| [centralmind/gateway](https://github.com/centralmind/gateway) | - | 根据数据库 Schema 自动生成 MCP 工具 |

---

## 优先级建议

1. **Alertmanager MCP** - 直接对接现有 Prometheus/Alertmanager
2. **Browser MCP** - 替代/增强浏览器自动化
3. **Hippycampus** - 快速把现有 API 转成 MCP Server
