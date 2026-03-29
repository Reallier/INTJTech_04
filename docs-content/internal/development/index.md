# INTJTech 开发规范

> 本文档为团队统一开发规范，适用于所有项目。

---

## 技术栈规范

### Python 项目
- **包管理**: 统一使用 `uv`（不用 pip）
- **版本**: Python 3.11+（新项目推荐 3.13）
- **Web框架**: FastAPI / Streamlit
- **ORM**: SQLAlchemy（PostgreSQL）或直接 SQLite

```bash
# 初始化项目
uv init
uv add fastapi uvicorn

# 运行服务
uv run uvicorn main:app --reload
```

### Node.js 项目
- **包管理**: npm
- **框架**: Nuxt 3（官网）/ Vite（纯前端）
- **版本**: Node.js 18+

### 前端样式
- **样式**: 自定义 CSS（官网）/ Tailwind（新项目可选）

### 图标规范
- **统一使用 FontAwesome**
- **禁止使用 Emoji 图标**（不专业，显示不一致）
- Emoji 在不同系统/浏览器下显示不一致，且不够专业
- 通过 CDN 或 npm 包引入 FontAwesome

---

## Docker 部署规范

### 基本原则
1. **所有服务都用 Docker** 部署
2. **数据必须持久化**（挂载 volume）
3. **使用 docker-compose** 管理多容器

### 目录结构
```
project/
├── Dockerfile
├── docker-compose.yml      # 本地开发
├── server-compose.yml      # 生产部署
└── data/                   # 持久化数据（.gitignore）
```

### compose 文件规范
```yaml
services:
  app:
    build: .
    ports:
      - "8001:8000"
    volumes:
      - ./data:/app/data    # 数据持久化
    environment:
      - ENV=production
    restart: unless-stopped
```

---

## 服务端口与域名

### 端口分配

| 端口 | 服务 |
|------|------|
| 8001 | app01-hirestream-match |
| 8002 | app02-customer-service |
| 8003 | app03-mindai-typing |
| 8004 | app04-contract-review |
| 8005 | app05-zhihu-search |
| 8006 | app06-boss-job-agent |
| 8007 | app07-resume-agent |
| 8008 | app08-resource-monitor |
| 8009 | app09-ai-autotest |
| 8010 | app10-video-analyzer |
| 8011 | app11-visual-asset |
| 3000 | official-site-intjtech |

### 线上服务（ICP 未备案）

> 由于域名尚未完成 ICP 备案，所有线上服务使用 **5443 端口**

| 服务 | 线上地址 |
|------|----------|
| App01 前端 | `https://talentai.intjsys.com` |
| App01 后端 | `https://api.talentai.intjsys.com` |
| 官网 | `https://intjtech.reallier.top:5443` |

### 服务器信息

| 服务器 | SSH | 用途 |
|--------|-----|------|
| 生产服 | `ssh -i reallier.pem root@119.29.166.51` | 线上服务 |
| 测试服 | `ssh -i test.pem root@111.230.19.24` | 测试环境 |
| 监控服 | `ssh -i moniter.pem root@43.136.53.213` | Prometheus/Loki/Grafana |

---

## Git 规范

### 提交信息格式
```
<type>: <subject>

[optional body]
```

**类型 (type):**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变更

**示例:**
```
feat: 添加多 API Key 轮换支持
fix: 修复空输入导致的 422 错误
docs: 更新 README 部署说明
```

### 分支策略
- `main`: 生产分支，保持稳定
- `dev`: 开发分支（可选）
- `feature/*`: 功能分支

---

## 日志与监控

### 日志集成
使用统一日志库 `intjtech-logging`：

```python
from intjtech_logging import setup_logging, get_logger

setup_logging(
    service_name="app01-hirestream-match",
    log_level="INFO",
    loki_url="http://43.136.53.213:3100",
)
logger = get_logger(__name__)
```

### 监控栈
- **Prometheus**: 指标采集
- **Loki**: 日志聚合
- **Grafana**: 可视化面板

---

## 安全规范

### API Key 管理
- 所有密钥通过 `.env` 文件配置
- 生产环境使用环境变量注入
- **禁止提交密钥到 Git**

### 输入校验
- 所有用户输入必须经过清洗
- 使用 Pydantic 进行类型校验
- 实现速率限制（10 req/min 默认）

---

## 测试规范

### 本地测试
```bash
# 优先使用命令行和日志分析
# 避免浏览器模拟操作（除非必要）
```

### 安全测试
使用 app09-ai-autotest 进行安全基准测试：
```bash
cd app09-ai-autotest
python -m src suite --target-url http://localhost:8001
```

---

## 文档规范

### README 必备内容
1. 项目简介与功能特性
2. 快速开始（安装、配置、运行）
3. 环境变量说明
4. 项目结构
5. API 接口（如适用）
6. 部署说明

### 知识库 (KI)
重要技术决策、架构设计记录在知识库中，便于后续查阅。

### 内外文档分层
- 内部文档：运维与架构细节，发布到 internal-docs。
- 公开文档：产品介绍与公开能力，发布到 public docs。
- 分层规则详见：[文档分层规范](/development/docs-boundary)

---

**简序智能** - 小而精的工程团队

## 文档维护流程

### 更新频率

- **代码变更**：每次功能发布后更新项目文档和 API 接口。

- **架构调整**：系统架构变更时更新架构图和说明。

- **每月审查**：团队定期审查文档完整性和准确性。

### 维护规范

- **版本控制**：文档随代码提交，使用有意义的提交信息。

- **责任分配**：每个项目负责人负责对应文档维护。

- **反馈机制**：用户和开发者可通过 Issue 报告文档问题。

### 工具和流程

- **Markdown 格式**：使用标准 Markdown，确保兼容 VitePress。

- **图片管理**：架构图和截图存放在 docs/assets/ 目录。

- **链接检查**：定期检查内部链接有效性。
