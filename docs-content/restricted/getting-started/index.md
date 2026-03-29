# 快速开始

欢迎使用 INTJTech 技术文档！

## 开发环境要求

- **Python**: 3.11+（推荐 3.13）
- **Node.js**: 18+
- **包管理**: Python 用 `uv`，Node.js 用 `npm`
- **Docker**: 生产部署必需

## 克隆项目

```bash
git clone <repository-url>
cd Integration_testing
```

## 运行任意项目

以 App01 为例：

```bash
cd app01-hirestream-match

# Python 后端
cd backend
uv sync
uv run uvicorn main:app --reload --port 8001

# 前端
cd frontend
npm install
npm run dev
```

## 下一步

- [开发环境配置](./setup) - 详细的环境搭建指南
- [部署指南](./deployment) - Docker 部署流程
- [项目文档](/projects/) - 各项目详细说明
