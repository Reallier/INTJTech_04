# 运维手册

本章节记录 INTJTech 各项目的运维管理规范、公测支持方案以及故障应急处理流程。

## 目录

### 生产级应用支持
- **[TalentAI (App01) 公测支持](/operations/app01-beta-support)**：包含告警规则、并发目标、成本控制及回滚策略。

### 系统管理
- **[凭证管理](/operations/credentials)**：各系统管理员账号、服务器 SSH、数据库连接信息。
- **[Cloudflare Tunnel 部署指南](/operations/cloudflare-tunnel)** ✅：国际版 Tunnel 配置、QUIC/HTTP2 踩坑、容器网络隔离经验。
- **[数据库备份规划](/operations/database-backup-plan)** ✅：pgBackRest + 腾讯云 COS 企业级备份系统。
- **[SSH 安全策略](/operations/ssh-security-strategy)** ✅：弃用 Fail2Ban，采用纯密钥认证解决动态 IP 误封问题。
- **[故障处理日志](/operations/incident-log)**：系统故障记录及修复过程。

## 核心运维标准
1. **监控先行**：所有上线应用必须接入 Prometheus + Loki 监控中心。
2. **三级响应**：Critical 级别告警必须在 15 分钟内首响。
3. **成本闭环**：每日通过 App08 巡检报告核对 API 消耗与预算。
