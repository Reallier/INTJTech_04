---
title: Mattermost 协作平台
---

# Mattermost - 团队协作平台

INTJTech 使用 Mattermost 作为内部沟通平台（人机共用），用于公告、讨论与系统事件通知。

::: warning 重要变更（部门分工方案已归档）
历史上曾尝试用“按部门分工 + 部门 Bot + CEO 汇报频道”来编排智能体协作。该方案会在多次自然语言中继中放大噪声与幻觉，现 **不再作为现行规范**。

历史方案已归档：[/archive/mattermost-department-agents](/archive/mattermost-department-agents)
:::

## 访问信息

| 项目 | 值 |
|------|---|
| **URL** | `http://localhost:8065` |
| **Team URL** | `http://localhost:8065/intjtech` |
| **Admin 邮箱** | admin@intjtech.com |
| **Admin 用户名** | admin |

## 运行与管理

```bash
cd infrastructure/mattermost

# 启动服务
docker-compose up -d

# 查看日志
docker logs mattermost-app -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down
```

## 频道组织（当前建议）

- 固定频道只保留“少而稳定”的集合（公告、告警、公共讨论）。
- 其他频道按项目/事件临时创建，优先用“可追踪的命名”（例如 `inc-<id>`、`app01-<topic>`），避免用部门作为长期抽象。

## Bot 使用原则

- Bot 按“系统边界/集成”命名，而不是按部门命名（例：`alerts-bot`、`deploy-bot`）。
- Bot 消息必须携带可追踪字段（如 `task_id` / `trace_id` / 变更链接 / Dashboard 链接），避免“口头汇报式小作文”。

## Webhook（最小集成）

Incoming Webhook 适合做告警/发布通知，不用于多 Agent 的中继协作。

```bash
curl -X POST "<WEBHOOK_URL>" \
  -H "Content-Type: application/json" \
  -d '{"text":"[ALERT] service=app01 trace_id=..."}'
```

