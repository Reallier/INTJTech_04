# 简序智能官网 (Jianxu Intelligence Site)

> 生产状态：这是仍在线运行的国内展示站，服务 `intjsys.com`、ICP 合规和国内官方业务展示。视觉系统、品牌壳与核心信息架构对齐 `official-site-international`，功能范围由国内版白名单独立控制。整理、清理或重做页面前请先阅读 [PROJECT_STATUS.md](./PROJECT_STATUS.md)。

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.12.0-00DC82?style=flat&logo=nuxt.js)](https://nuxt.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://www.docker.com/)

## 📖 项目定位

简序智能国内官网是一个低频维护、展示优先的 Nuxt 3 官方站点。它面向国内客户、合作伙伴和合规场景，用于说明简序智能是谁、提供什么 AI 工程与自动化能力、有哪些产品或案例入口，以及如何联系。

本项目以国际站的公开品牌体验为基线，但不做无差别镜像，也不承接国际站的登录、Admin、评论、RAG 知识库、数据库、Signal 等复杂后端功能。国内站通过 `data/domesticPolicy.mjs` 的显式白名单控制构建路由和模块边界。

国内站现在完全按宣传页处理。TalentAI、MindAI 等产品名可以作为案例或能力展示出现，但页面 CTA 默认指向站内联系、能力说明或产品展示，不直接接入子产品服务域名。

## ✨ 展示范围

### 🏢 品牌与业务展示
- 公司定位、工程理念和国内业务叙事
- AI Agent、业务自动化、私有化部署、数据/知识流程等能力说明
- 产品矩阵、实验项目或精选案例入口

### 📊 页面能力
- 首页：品牌定位、核心服务、产品入口、可信度和 CTA
- 关于：公司角色、团队/创始人背景、工作方式
- 服务/能力：适合国内客户理解的交付范围和合作方式
- 联系：明确的国内商务沟通入口
- 隐私、条款、备案相关基础页面

### 🚫 默认不承接
- 用户登录、Admin 控制台、会员体系
- 评论、Newsletter、支付或订单系统
- RAGFlow/知识库 API、Prisma/数据库工作流
- Signal/AI 资讯聚合、算法推荐、公开生成式 AI、观测面板或国际站专属后台能力
- Google Fonts、境外 Font Awesome CDN、国际站实时演示 iframe

这些能力如确实需要，应作为独立产品或独立后端项目评估，而不是默认塞进国内官网。

## 🛠️ 技术栈

- **框架**: [Nuxt 3](https://nuxt.com/) - Vue.js 全栈框架
- **语言**: TypeScript + JavaScript
- **样式**: CSS (自定义样式)
- **部署**: Docker + Traefik 反向代理
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

## 📁 当前项目结构

```
official-site-domestic/
├── assets/                 # 静态资源
│   ├── images/            # 图片文件
│   └── styles/            # 样式文件
├── components/             # 站点公共组件
│   ├── SiteHeader.vue
│   └── SiteFooter.vue
├── docs-content/           # 国内站内部/公开文档内容
├── pages/                 # 页面组件
│   ├── index.vue          # 首页
│   ├── about.vue          # 关于
│   ├── contact.vue        # 联系
│   ├── skills.vue         # 能力/技能展示
│   ├── log.vue            # 更新记录
│   ├── privacy.vue        # 隐私
│   └── terms.vue          # 条款
├── public/                # 公共静态文件
├── scripts/               # 部署脚本
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

## 🧭 维护原则

- 国际站是品牌视觉、页面壳和核心信息架构基线；国内站是受限功能版本。
- 同步公开体验时，先核对 `data/domesticPolicy.mjs`，不得绕过路由白名单。
- 国内站升级以展示页重做为主，避免长期在超大单文件里零散打补丁。
- 不直接复制国际站的账号、互动、资讯、知识库、实时演示或后台代码。
- 国内站默认保持轻后端，不引入登录、Admin、数据库、RAG、评论、Signal 等复杂功能。
- 国内站默认不直连 TalentAI、MindAI 等子产品服务入口；产品能力只做宣传展示和咨询转化。
- 部署前必须确认本地构建可通过，并确认 Docker 镜像能从源码重建。

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

## 🧪 验证

当前 `package.json` 提供以下基础命令：

```bash
npm test
npm run build
npm run preview
```

如后续引入 lint、typecheck 或测试命令，应同步更新本节。

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
