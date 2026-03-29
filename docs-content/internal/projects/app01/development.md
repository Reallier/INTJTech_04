# App01 开发指南

> 本地开发环境与测试

## 本地启动

```bash
# 后端
cd backend
uv sync
uv run uvicorn main:app --reload

# 前端
cd frontend
npm install
npm run dev
```

## 测试

```bash
# 单元测试
pytest tests/

# 安全测试
cd ../app09-ai-autotest
python -m src suite --target-url http://localhost:8001
```

### 固定测试脚本（推荐）

> 生产只读回归建议使用固定 profile 执行，避免误写/扣费。

**配置文件**：`tests/profiles.json`  
**执行脚本**：`tests/run_fixed.sh`  
**本地密钥**：`tests/.env.<profile>.local`（已被 .gitignore 忽略）

示例：
```bash
# 生产只读健康检查
./tests/run_fixed.sh prod_readonly

# 生产 SSO 快速健康检查
./tests/run_fixed.sh prod_sso_smoke
```

环境变量示例（本地文件）：
```
DASHSCOPE_API_KEY=...
JWT_SECRET=...
TEST_USERNAME=...
TEST_PASSWORD=...
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
```

## 代码规范

- 使用 `uv` 包管理
- 类型注解完整
- 遵循 RESTful API 设计
- 安全编码实践

---

## 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端界面      │    │   FastAPI后端   │    │   数据库存储     │
│   (Nuxt 3)      │◄──►│   (匹配引擎)    │◄──►│ (PostgreSQL)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   AI服务层      │
                       │ DashScope API   │
                       └─────────────────┘
```

---

## 版本历史

| 版本 | 说明 |
|------|------|
| v1.0.0 | 基础匹配功能 |
| v1.1.0 | 添加人才库管理 |
| v1.2.0 | 集成安全防护系统 |
| v2.0.0 | 重构为微服务架构 |
| v2.1.0 | Deep Defense 安全升级 |
| v4.0.0 | Business Value 版本 |
