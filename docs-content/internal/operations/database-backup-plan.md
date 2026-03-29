# 数据库系统与备份策略

> **最后更新**: 2026-01-17  
> **状态**: ✅ 生产运行中

---

## 📋 概述

本文档描述 INTJsys 生态系统的数据库架构、备份策略选型和操作指南。

---

## 🏗️ 数据库架构

### 当前状态

生产环境使用 **单一 PostgreSQL 实例**，承载整个生态系统的核心数据。

```
┌─────────────────────────────────────────────────────────────┐
│  talentai_db (PostgreSQL 15 + pgvector)                     │
│  容器名: talentai_db                                         │
│  服务器: 119.29.166.51                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  身份中心表 (官网管理)                                       │
│  ├── users              用户账号、余额、角色                 │
│  ├── refresh_tokens     用户会话令牌                        │
│  ├── sms_codes         短信验证码                           │
│  └── service_configs    产品配置                            │
│                                                             │
│  TalentAI 产品表                                            │
│  ├── candidates         候选人基本信息                      │
│  ├── resumes           简历原文存储                         │
│  ├── experiences        工作经历                            │
│  ├── projects          项目经历                             │
│  ├── education         教育经历                             │
│  ├── candidate_index   检索索引（向量+全文）                 │
│  ├── hm_match_records  匹配记录                             │
│  ├── hm_transactions   交易流水                             │
│  ├── hm_usage_records  使用记录                             │
│  ├── hm_feedbacks      用户反馈                             │
│  ├── merge_lineage     合并谱系追踪                         │
│  ├── audit_log         操作审计日志                         │
│  └── skill_recency     技能新鲜度                           │
│                                                             │
│  共计: 17 张表                                               │
└─────────────────────────────────────────────────────────────┘
```

### 历史背景

这是一个「混合数据库」架构，身份中心和产品数据共存于同一实例。这是早期快速迭代的产物，未来可能拆分为：
- `intjsys_identity_db` - 身份中心
- `talentai_db` - TalentAI 产品数据
- `mindai_db` - MindAI 产品数据

---

## 🔄 备份策略选型

### 需求分析

| 指标 | 目标值 | 说明 |
|------|--------|------|
| **RPO** (恢复点目标) | ≤ 15 分钟 | 最多丢失 15 分钟数据 |
| **RTO** (恢复时间目标) | ≤ 1 小时 | 灾难发生后 1 小时内恢复 |
| **PITR** | ✅ 必须 | 支持时间点恢复 |
| **加密** | ✅ 必须 | 云端数据加密 |

### 方案对比

| 方案 | PITR | 增量备份 | 云存储 | 加密 | 复杂度 | 结论 |
|------|------|----------|--------|------|--------|------|
| **pg_dump** | ❌ | ❌ | 需脚本 | 需脚本 | 低 | ❌ 不满足需求 |
| **pgBackRest** | ✅ | ✅ | ✅ 原生 | ✅ 内置 | 中 | ✅ **采用** |
| Barman | ✅ | ✅ | ❌ | 部分 | 高 | ❌ 复杂度过高 |

### 最终选择

**pgBackRest + 腾讯云 COS (S3 兼容)**

- 支持 Full / Differential / Incremental 备份
- 原生支持 PITR 时间点恢复
- 内置 AES-256-CBC 加密
- 原生 S3 协议支持
- 单一配置文件，易于维护

---

## 🗄️ 备份配置详情

### 存储后端

| 配置项 | 值 |
|--------|-----|
| **存储类型** | 腾讯云 COS (S3 兼容) |
| **Bucket** | `intjsys-db-backups-1312973739` |
| **地域** | `ap-guangzhou` (广州) |
| **存储类型** | 单 AZ 低频存储 |
| **备份路径** | `/production/intjsys-core/` |
| **加密** | AES-256-CBC |

### COS 高级配置

创建 Bucket 时，以下高级功能**保持关闭**：

| 功能 | 设置 | 理由 |
|------|------|------|
| 版本控制 | ❌ 关闭 | pgBackRest 自己管理版本 |
| 日志存储 | ❌ 关闭 | 备份日志由 pgBackRest 记录 |
| 极智压缩 | ❌ 关闭 | 仅针对图片，不适用备份文件 |
| 服务端加密 | ❌ 不加密 | pgBackRest 已在客户端用 AES-256 加密 |

### 保留策略

| 备份类型 | 频率 | 保留数量 |
|----------|------|----------|
| **Full** (全量) | 每周日 03:00 | 2 个 |
| **Diff** (差异) | 每日 03:00 (周一-周六) | 7 个 |
| **WAL** (归档) | 实时 | 自动管理 |

**恢复窗口**: 约 14 天

### 成本估算

| 项目 | 计算 | 月成本 |
|------|------|--------|
| 存储 (低频) | ~2GB × 0.08 元/GB | ~0.16 元 |
| 请求费用 | ~500 次 PUT | ~0.05 元 |
| 流量 | 内网免费 | 0 元 |
| **合计** | | **< 0.5 元/月** |

---

## 🛠️ 操作指南

### 查看备份状态

```bash
docker exec -u postgres talentai_db pgbackrest info
```

**预期输出**:
```
stanza: talentai
    status: ok
    cipher: aes-256-cbc

    db (current)
        wal archive min/max (15): .../...

        full backup: 20260117-145600F
            timestamp start/stop: 2026-01-17 22:56+08 / 2026-01-17 22:56+08
            database size: 31.1MB, database backup size: 31.1MB
            repo1: backup set size: 3.7MB, backup size: 3.7MB
```

### 手动触发备份

```bash
# 全量备份
docker exec -u postgres talentai_db pgbackrest --stanza=talentai --type=full backup

# 差异备份
docker exec -u postgres talentai_db pgbackrest --stanza=talentai --type=diff backup
```

### 查看备份日志

```bash
# 定时任务日志
cat /var/log/pgbackrest-cron.log

# 容器内详细日志
docker exec talentai_db cat /var/log/pgbackrest/talentai-backup.log
```

---

## 🚨 灾难恢复

### 场景 A: 恢复到最新状态

```bash
# 1. 停止应用
cd /data/app-stack/talentai
docker compose stop talentai-frontend talentai-backend

# 2. 停止数据库
docker compose stop talentai-db

# 3. 清空数据目录 (危险!)
docker run --rm -v talentai_postgres_data:/data alpine sh -c "rm -rf /data/*"

# 4. 恢复
docker compose run --rm talentai-db pgbackrest --stanza=talentai restore

# 5. 启动服务
docker compose up -d
```

### 场景 B: PITR 时间点恢复

如果需要恢复到 2026-01-17 14:30:00 之前的状态（例如：误删数据后恢复）：

```bash
# 1. 停止服务
docker compose stop

# 2. 清空数据目录
docker run --rm -v talentai_postgres_data:/data alpine sh -c "rm -rf /data/*"

# 3. PITR 恢复
docker compose run --rm talentai-db pgbackrest --stanza=talentai \
    --type=time \
    --target="2026-01-17 14:30:00+08" \
    --target-action=promote \
    restore

# 4. 启动服务
docker compose up -d
```

### 场景 C: 验证备份完整性

```bash
# 使用 --dry-run 模拟恢复（不实际写入）
docker exec -u postgres talentai_db pgbackrest --stanza=talentai --dry-run restore
```

---

## 📁 相关文件

| 文件 | 位置 | 说明 |
|------|------|------|
| Dockerfile | `infrastructure/database/pgbackrest/Dockerfile` | 镜像构建 |
| pgbackrest.conf | `infrastructure/database/pgbackrest/pgbackrest.conf` | 配置文件 |
| compose.yml | `products/app01-hirestream-match/deploy/compose.yml` | 部署配置 |
| README.md | `infrastructure/database/pgbackrest/README.md` | 快速参考 |

---

## 📊 监控与告警

### 待实现

- [ ] 备份成功/失败通知 (钉钉/邮件)
- [ ] 备份大小趋势监控
- [ ] WAL 归档延迟告警
- [ ] 定期恢复演练

---

## 📅 变更记录

| 日期 | 变更 |
|------|------|
| 2026-01-17 | 初始部署 pgBackRest + COS 备份系统 |
| 2026-01-17 | 备份路径从 `/talentai/` 改为 `/production/intjsys-core/` |
