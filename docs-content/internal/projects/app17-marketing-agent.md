# App17 - 小红书营销智能体

## 核心价值

基于 nanobot 框架的**小红书自动化运营智能体**，通过飞书/Telegram 与运营团队对话，完成热点调研、爆款分析、内容生成、评论管理等工作。

## 架构

- **智能体内核**：[nanobot](https://github.com/HKUDS/nanobot)（~3400 行超轻量框架）
- **主力工具**：[redbook CLI](https://github.com/lucasygu/redbook)（搜索/分析/发帖/评论/图卡）
- **MCP 补充**：[xiaohongshu-mcp](https://github.com/xpzouying/xiaohongshu-mcp)（定时发布/视频发布）
- **通信渠道**：飞书 + Telegram

## 技术栈

- 框架：nanobot (Python)
- 工具：redbook CLI (Node.js)
- MCP：xiaohongshu-mcp (Go/Docker)
- LLM：qwen-max（DashScope）

## 工作模式

**人工审核模式**：AI 生成内容草稿 → 人工审核 → 确认后发布

## 功能清单

### 已完成
- ✅ 项目脚手架搭建
- ✅ 小红书运营 Skill（SKILL.md）
- ✅ 安装脚本（setup.sh）
- ✅ 部署脚本（deploy.sh）
- ✅ 飞书 + Telegram 双通道配置
- ✅ 内容模板库

### 待完成
- 🔄 安装部署并验证完整链路
- 🔄 小红书账号登录对接
- 📋 定时任务配置（每日选题推送）
- 📋 评论自动监控

## 配置

| 环境变量 | 说明 |
|----------|------|
| `DASHSCOPE_API_KEY` | 阿里云 DashScope API Key |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token |
| `TELEGRAM_USER_ID` | 运营人员 Telegram ID |
| `FEISHU_APP_ID` | 飞书应用 App ID |
| `FEISHU_APP_SECRET` | 飞书应用 App Secret |

## 维护指南

### 启动服务
```bash
cd /data/intjsys/products/app17-marketing-agent
bash deploy.sh
```

### 日志查看
```bash
# nanobot 日志
tail -f /tmp/nanobot-gateway.log

# xiaohongshu-mcp 日志
docker compose logs -f xiaohongshu-mcp
```

### 更新 Skill
编辑 `skills/xiaohongshu/SKILL.md`，然后重启 nanobot gateway。
