# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production

# 设置工作目录
WORKDIR /app

# 从构建阶段复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.output /app/.output
RUN mkdir -p /app/.output/server/chunks/public && cp -r /app/.output/public/. /app/.output/server/chunks/public/ && ls -la /app/.output/server/chunks/public/
COPY --from=builder /app/package*.json ./

# 暴露端口（Nuxt 默认使用 3000 端口）
EXPOSE 3000

# 启动应用
CMD ["node", ".output/server/index.mjs"]