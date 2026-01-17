# 简序智能官网 (Jianxu Intelligence Site)

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.12.0-00DC82?style=flat&logo=nuxt.js)](https://nuxt.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://www.docker.com/)

## 📖 项目简介

简序智能官网是一个面向小微企业的 AI Agent 技术伙伴网站。我们专注于用工程化方法设计、开发和落地 AI Agent，帮助企业实现业务流程自动化，让重复又重要的工作变得更省时间、更可控。

这是一个基于 Nuxt 3 构建的现代化单页应用 (SPA)，采用响应式设计，提供了完整的公司介绍、服务展示、案例分享、团队信息和联系方式。

## ✨ 主要功能

### 🏢 公司服务展示
- **客服/咨询类 Agent**: 为有大量重复问答的团队提供智能客服解决方案
- **数据整理 & 报表类 Agent**: 自动化数据处理和报表生成
- **内部知识问答/培训 Agent**: 构建企业内部知识库和培训系统

### 📊 业务案例
展示实际落地案例，包括：
- 客服问答 Agent 在零售行业的应用
- 内部知识问答 Agent 在团队 Onboarding 中的作用
- 自动报表 Agent 在运营周报自动化中的实践

### 💰 合作定价
提供三段式合作模式：
- **Agent 试水包**: 1-2 周快速验证 (¥8,000–¥20,000)
- **小规模上线包**: 3-6 周完整落地 (¥25,000–¥60,000)
- **月度优化包**: 持续优化订阅 (¥4,000–¥15,000/月)

### 👥 团队介绍
- 核心成员背景和专长介绍
- 技术关注点：生产可用性、可维护性、用户体验

### 📝 更新日志
记录一线落地经验、技术笔记和解决方案

### 📞 联系方式
提供多种联系渠道，便于业务沟通

## 🛠️ 技术栈

- **框架**: [Nuxt 3](https://nuxt.com/) - Vue.js 全栈框架
- **语言**: TypeScript + JavaScript
- **样式**: CSS (自定义样式)
- **部署**: Docker + Traefik (反向代理)
- **构建工具**: Vite (Nuxt 内置)
- **包管理**: npm

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Docker (用于部署)

### 本地开发

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd zilshu-tech-site
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

   访问 http://localhost:3000 查看网站

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🐳 Docker 部署

### 使用 Docker Compose

1. **构建和启动服务**
   ```bash
   docker-compose up -d
   ```

2. **查看服务状态**
   ```bash
   docker-compose ps
   ```

3. **停止服务**
   ```bash
   docker-compose down
   ```

### 手动 Docker 构建

```bash
# 构建镜像
docker build -t zilshu-tech-site:latest .

# 运行容器
docker run -d -p 3000:3000 --name zilshu-tech-site zilshu-tech-site:latest
```

## 📁 项目结构

```
zilshu-tech-site/
├── assets/                 # 静态资源
│   ├── images/            # 图片文件
│   └── styles/            # 样式文件
├── pages/                 # 页面组件
│   └── index.vue          # 首页
├── app.vue                # 根组件
├── nuxt.config.ts         # Nuxt 配置
├── package.json           # 项目依赖
├── Dockerfile             # Docker 构建配置
├── compose.yml            # Docker Compose 配置
├── .gitignore             # Git 忽略文件
└── README.md              # 项目文档
```

## 🔧 配置说明

### Nuxt 配置 (nuxt.config.ts)

- **应用信息**: 设置网站标题和描述
- **CSS**: 引入全局样式
- **Nitro**: 配置 Vercel 部署预设
- **Devtools**: 禁用开发工具

### 环境变量

生产环境支持以下环境变量：
- `NODE_ENV`: 运行环境 (production)
- `PORT`: 服务端口 (默认 3000)

## 🌐 部署配置

项目配置了 Traefik 反向代理：
- **域名**: intjsys.com
- **HTTPS**: 自动 TLS 证书
- **网络**: traefik 网络

## 📊 性能优化

- **静态生成**: 使用 Nuxt 的静态生成能力
- **代码分割**: 自动代码分割和懒加载
- **图片优化**: 使用 Nuxt Image 模块优化图片
- **SEO**: 配置页面元信息和结构化数据

## 🧪 代码质量

- **ESLint**: 配置代码规范检查
- **TypeScript**: 类型安全检查
- **Prettier**: 代码格式化 (通过 ESLint 配置)

运行代码检查：
```bash
npm run lint
```

## 🤝 贡献指南

虽然这是一个公司官网项目，但欢迎提交改进建议：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目仅供深圳市简序智能科技有限公司内部使用，未经授权不得用于商业用途。

## 📞 联系我们

- **微信**: ________
- **邮箱**: ________
- **网站**: https://intjsys.com

有任何技术问题或合作需求，请通过以上方式联系我们。

---

**简序智能** - 小而精的工程团队，帮小微企业把重复又重要的工作交给 Agent 处理，让自动化落地更省时间、更可控。
