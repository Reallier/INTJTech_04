---
title: Mattermost 部门频道与 Bot 方案（归档）
description: 历史方案。按“部门分工 + 部门 Bot + CEO 汇报频道”组织协作，现已不作为现行规范。
---

# Mattermost 部门频道与 Bot 方案（归档）

::: warning 已归档
本文记录的是历史方案：用“部门频道 + 部门 Bot + CEO 汇报频道”来编排智能体协作。该方案容易在多次自然语言传递/转述中放大噪声与幻觉，现已不再作为现行规范。

当前建议：将协作与执行收敛到 **单一强力 Agent + 结构化状态 + 确定性工具链**，把沟通从“汇报小作文”改成“交换确定数据”。
:::

以下为历史内容原文（仅用于追溯）：

---

# Mattermost - 团队协作平台

INTJTech 使用 Mattermost 作为内部团队协作和 Agent 通信的平台。

## 访问信息

| 项目 | 值 |
|------|---|
| **URL** | `http://localhost:8065` |
| **Team URL** | `http://localhost:8065/intjtech` |
| **Admin 邮箱** | admin@intjtech.com |
| **Admin 用户名** | admin |

## 频道规划

| 频道 | 用途 |
|------|------|
| `#town-square` | 全员公告 |
| `#devops` | DevOps 部门工作 |
| `#qa` | QA 部门工作 |
| `#engineering` | 工程部门工作 |
| `#product` | 产品部门工作 |
| `#marketing` | 营销部门工作 |
| `#finance` | 财务部门工作 |
| `#support` | 客服部门工作 |
| `#ceo-briefing` | CEO 日报/周报 |
| `#alerts` | 系统告警和通知 |

## Bot 账户

每个部门都有专属的 Bot Agent：

| Bot | 用途 |
|-----|------|
| `devops-agent` | DevOps 自动化、监控告警 |
| `qa-agent` | 测试报告、Bug 通知 |
| `engineering-agent` | 代码审查、Sprint 更新 |
| `product-agent` | PRD 更新、路线图 |
| `marketing-agent` | 营销活动更新 |
| `finance-agent` | 财务报告 |
| `support-agent` | 工单更新、升级通知 |
| `ceo-agent` | 日报/周报汇总 |

## Python SDK 集成

### 安装依赖

```bash
pip install aiohttp
```

### 使用示例

```python
# 方式 1: 使用部门专用 ChatBridge
from chat_bridge import chat_bridge

async def main():
    await chat_bridge.connect()
    await chat_bridge.send_message("Hello from Agent!")
    await chat_bridge.send_to_ceo_briefing("日报内容...")
    await chat_bridge.disconnect()
```

```python
# 方式 2: 直接使用 MattermostClient
from mattermost_client import create_client

async def main():
    client = create_client("devops")
    await client.connect()
    
    # 发送到部门频道
    await client.send_message("Hello!")
    
    # 发送到其他频道
    await client.send_to_channel("ceo-briefing", "Report...")
    
    await client.disconnect()
```

## 配置文件

配置文件位于 `infrastructure/mattermost/`:

- `mattermost_config.json` - 频道和 Bot ID 映射
- `bot_tokens.env` - Bot Token 配置
- `setup_mattermost.py` - 自动化配置脚本
- `test_bots.py` - Bot 连接测试

## 管理命令

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

# 重新配置 Bot 和频道
python setup_mattermost.py

# 测试 Bot 连接
python test_bots.py
```

## 从 app12 迁移

原有的 `app12-agent-chat` 已废弃，所有 Agent 的 `chat_bridge.py` 已更新使用 Mattermost SDK。接口保持兼容，无需修改业务代码。

