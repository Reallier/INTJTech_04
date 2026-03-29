# TalentAI 企业私有化部署方案

> **状态**：✅ 已完成 | **更新时间**：2026-01-20

本方案规划 TalentAI 产品的企业私有化部署版本，实现账号付费激活的商业模式。

::: tip 实施进度
- [x] **Phase 1**: 架构设计 + 方案评审 ✅
- [x] **Phase 2**: License 服务开发 ✅ (2026-01-20)
- [x] **Phase 3**: 认证模式改造 ✅ (2026-01-20)
- [x] **Phase 4**: 部署包制作 + 文档 ✅ (2026-01-20)
- [x] **Phase 5**: Beta 测试 + 验证 ✅ (2026-01-20)
- [x] **Phase 6**: 正式发布 ✅ (2026-01-20)
:::

## 背景与目标

TalentAI 目前作为 INTJsys 生态的旗舰商业产品运行在 SaaS 模式下（`talentai.intjsys.com`）。私有化版本目标：

1. **完全私有化部署**：企业可在自有服务器/云环境独立运行
2. **账号付费激活**：通过 License 授权机制实现商业变现
3. **数据完全隔离**：满足企业数据安全与合规要求

---

## 产品架构对比

### SaaS 版本 vs 私有化版本

| 维度 | SaaS 版本（现有） | 私有化部署版本（规划） |
|:-----|:-----------------|:--------------------|
| **部署位置** | INTJsys 云服务器 | 企业自有服务器/私有云 |
| **身份认证** | 统一 Identity HUB | 独立本地认证系统 |
| **计费模式** | Token 用量按量付费 | License 授权 + 订阅制 |
| **数据存储** | 共享 PostgreSQL（租户隔离） | 企业独占数据库 |
| **AI 算力** | DashScope 共享 API Key | 企业自有 API Key 或本地模型 |
| **更新机制** | 实时更新 | 版本包升级 |

---

## License 授权机制

### 授权流程

```
企业客户 → 首次部署获取机器指纹 → 提交 Machine ID + 订单号
    ↓
License 服务器 → 返回 License Key
    ↓
私有化 TalentAI → 输入 License Key 激活 → 功能解锁
```

### 授权维度

| 授权参数 | 说明 | 示例 |
|:--------|:-----|:-----|
| **Machine ID** | 服务器硬件指纹（MAC/CPU/磁盘序列号组合哈希） | `a1b2c3d4e5f6...` |
| **有效期** | 授权时长 | 1年 / 永久 |
| **用户数上限** | 可创建的账号数量 | 50 / 200 / 无限 |
| **功能模块** | 解锁的功能范围 | 基础版 / 专业版 / 企业版 |
| **并发数** | 同时在线匹配的请求数 | 5 / 20 / 50 |

### License 密钥格式

采用 **JWT + RSA 签名** 格式：

```json
{
  "lic_id": "LIC-2026-00001",
  "customer": "深圳某科技有限公司",
  "machine_id": "a1b2c3d4e5f6...",
  "edition": "professional",
  "max_users": 200,
  "max_concurrency": 20,
  "features": ["instant_match", "talent_pool", "jd_search", "api_access"],
  "issued_at": "2026-01-18",
  "expires_at": "2027-01-18",
  "signature": "RSA_SHA256..."
}
```

---

## 版本定价策略

### 版本矩阵

| 版本 | 适用场景 | 用户上限 | 并发数 | 功能模块 | 定价（年） |
|:----|:--------|:--------|:------|:--------|:---------|
| **标准版** | 中小企业 HR 团队 | 50 人 | 5 并发 | 基础匹配 + 人才库 | ¥19,800 |
| **专业版** | 大中型企业 | 200 人 | 20 并发 | 全功能 + API 接口 | ¥49,800 |
| **企业版** | 集团/猎头公司 | 无限制 | 50 并发 | 全功能 + 定制开发 | ¥128,000 |
| **旗舰版** | 超大规模/OEM | 无限制 | 无限制 | 源码授权 + 技术支持 | 面议 |

### 付费周期选项

- **年付订阅**：每年续费，享受持续更新与技术支持
- **买断授权**：一次性付费，永久使用（不含后续升级）
- **按量叠加**：基础授权 + 超额用户/并发按需购买

### 增值服务

| 服务项 | 说明 | 定价 |
|:------|:----|:-----|
| 部署实施服务 | 工程师远程/现场部署 | ¥5,000 起 |
| 定制开发 | 功能定制/接口对接 | 按人天报价 |
| 年度技术支持 | 5×8 工单 + 远程支持 | ¥8,000/年 |
| 专属技术顾问 | 7×24 + 优先响应 | ¥30,000/年 |

---

## 私有化部署架构

### 标准部署（单机模式）

适用于 **标准版 / 专业版**，单台服务器即可运行：

```
┌─────────────────────────────────────────────────────────────┐
│                    企业私有服务器                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ TalentAI    │  │ TalentAI    │  │   PostgreSQL        │ │
│  │ Frontend    │  │ Backend     │  │   + pgvector        │ │
│  │ (Nuxt 4)    │  │ (FastAPI)   │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Traefik/Nginx                        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 高可用部署（集群模式）

适用于 **企业版**，支持横向扩展：

```
                    负载均衡层 (Nginx / HAProxy)
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   Backend #1            Backend #2            Backend #N
   (4 workers)           (4 workers)           (4 workers)
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                   PostgreSQL Primary
                   + pgvector + pgBackRest
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
            Replica       Replica        Backup
```

---

## 技术改造要点

### 1. 身份认证模块改造

**现状**：使用 INTJsys Identity HUB（共享 JWT_SECRET、apex cookie）

**改造清单**：
- 新增 `AuthMode` 枚举（`SAAS` / `PRIVATE` / `OFFLINE`）
- 身份验证逻辑支持本地模式（无需连接 Identity HUB）
- 用户表迁移到独立数据库（私有化场景）
- License 验证中间件

### 2. License 授权服务

新增服务模块结构：

```
backend/
├── license/
│   ├── __init__.py
│   ├── models.py          # License 数据模型
│   ├── validator.py       # License 验证逻辑
│   ├── machine_id.py      # 机器指纹生成
│   └── router.py          # License API 端点
```

**核心 API**：

| 端点 | 方法 | 说明 |
|:----|:-----|:----|
| `/api/license/status` | GET | 查询当前授权状态 |
| `/api/license/activate` | POST | 激活 License |
| `/api/license/deactivate` | POST | 注销 License（用于迁移） |
| `/api/license/machine-id` | GET | 获取机器指纹 |

### 3. AI 算力适配

**方案 A：企业自有 DashScope Key**
- 企业自行申请阿里云 DashScope API Key
- 配置到私有化系统的环境变量

**方案 B：本地模型（高级版）**
- 支持对接本地部署的开源 LLM（如 Qwen/Llama）
- 通过 OpenAI API 兼容接口对接

```yaml
# 私有化 compose.yml 配置示例
environment:
  - LLM_PROVIDER=dashscope    # dashscope | openai | local
  - LLM_API_KEY=${CUSTOMER_API_KEY}
  - LLM_MODEL=qwen-max
  # 本地模型选项
  - LOCAL_LLM_ENDPOINT=http://localhost:8080/v1
```

### 4. 部署包结构

标准交付物：

```
talentai-private-v1.0.0/
├── docker-compose.yml        # 一键部署配置
├── .env.example              # 环境变量模板
├── install.sh                # Linux 安装脚本
├── install.ps1               # Windows 安装脚本
├── images/                   # Docker 镜像包（离线安装）
│   ├── talentai-frontend.tar
│   ├── talentai-backend.tar
│   └── postgres-vector.tar
├── database/
│   └── init.sql              # 数据库初始化脚本
├── docs/
│   ├── 部署手册.pdf
│   ├── 用户手册.pdf
│   └── API 文档.pdf
└── LICENSE.txt
```

---

## 里程碑规划

| 阶段 | 内容 | 预计周期 |
|:----|:-----|:--------|
| **Phase 1** | 架构设计 + 方案评审 | 1 周 |
| **Phase 2** | License 服务开发 | 2 周 |
| **Phase 3** | 身份认证模块改造 | 2 周 |
| **Phase 4** | 部署包制作 + 文档 | 1 周 |
| **Phase 5** | Beta 测试 + 迭代 | 2 周 |
| **Phase 6** | 正式发布 + 销售支持 | 持续 |

---

## 风险与待决事项

::: warning 商业策略待确认
1. 定价策略是否符合市场定位？
2. License 模式是否需要支持完全离线验证？
3. 旗舰版源码授权的边界？
4. 是否需要支持本地 LLM 部署方案？
:::

::: danger 技术风险
1. **License 破解风险**：客户端验证可能被逆向，需评估法律 + 技术双重保护
2. **版本碎片化**：私有化版本更新推送困难，需设计版本管理策略
3. **支持成本**：每个私有化客户都是独立环境，运维支持成本较高
:::

---

## 发布记录

### v1.0.0 (2026-01-20)

**🎉 首个私有化部署版本正式发布！**

#### 新增功能
- ✅ **License 授权系统**：JWT + RSA 签名验证，支持机器指纹绑定
- ✅ **三种认证模式**：SAAS / PRIVATE / OFFLINE
- ✅ **一键部署脚本**：支持 Linux (install.sh) 和 Windows (install.ps1)
- ✅ **Docker Compose 编排**：前端 + 后端 + 数据库全栈部署
- ✅ **数据库自动初始化**：pgvector 扩展 + 默认管理员账号

#### 技术实现

| 模块 | 文件路径 | 功能 |
|:-----|:---------|:-----|
| 机器指纹 | `backend/license/machine_id.py` | 硬件指纹生成 + UUID 兜底 |
| License 验证 | `backend/license/validator.py` | JWT 解码 + RSA 签名验证 |
| 认证中间件 | `backend/license/middleware.py` | AuthMode 枚举 + 请求拦截 |
| API 路由 | `backend/license/router.py` | 激活/状态/注销接口 |
| 生成工具 | `tools/generate_license.py` | 内部密钥对和 License 生成 |

#### 部署文件清单

```
deploy/
├── compose.private.yml      # 一键部署配置
├── .env.private.example     # 环境变量模板
├── init-db.sql              # 数据库初始化
├── install.sh               # Linux 安装脚本
├── install.ps1              # Windows 安装脚本
├── build_offline_package.sh # 离线包构建
└── docs/
    └── 部署手册.md          # 用户部署指南
```

#### Beta 测试验证
- **测试服务器**: Test-1 (111.230.19.24)
- **测试结果**: 全流程通过（部署 → 指纹 → 激活 → 验证）
- **激活示例**: `BetaTestCompany`, Professional 版, 29 天有效期

#### Docker 镜像版本

| 镜像 | Tag | Registry |
|:-----|:----|:---------|
| `talentai-backend` | `private-v1.0.1` | ccr.ccs.tencentyun.com/reallier |
| `talentai-frontend` | `private-v1.0.0` | ccr.ccs.tencentyun.com/reallier |

#### 数据库模式 (init-db.sql)

共 14 张表，与 ORM 模型完全对齐：

| 表名 | 模型 | 描述 |
|:-----|:-----|:-----|
| `users` | `User` | 用户表（与官网共享） |
| `candidates` | `Candidate` | 候选人表 |
| `resumes` | `Resume` | 简历表 |
| `experiences` | `Experience` | 工作经历表 |
| `projects` | `Project` | 项目经历表 |
| `education` | `Education` | 教育经历表 |
| `candidate_index` | `CandidateIndex` | 向量索引表（pgvector） |
| `merge_lineage` | `MergeLineage` | 合并谱系表 |
| `audit_log` | `AuditLog` | 审计日志表 |
| `skill_recency` | `SkillRecency` | 技能新鲜度表 |
| `hm_usage_records` | `UsageRecord` | 使用记录表 |
| `hm_transactions` | `Transaction` | 交易流水表 |
| `hm_match_records` | `MatchRecord` | 匹配记录表 |
| `hm_feedbacks` | `Feedback` | 用户反馈表 |

#### 默认管理员账号

| 配置项 | 值 |
|:------|:---|
| 用户名 | `admin` |
| 邮箱 | `admin@localhost` |
| 密码 | `admin123` |
| 角色 | `admin` |

::: warning 安全提示
首次部署后请立即修改默认管理员密码！
:::
