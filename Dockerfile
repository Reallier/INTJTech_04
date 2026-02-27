# 构建阶段
FROM node:20-alpine AS builder

# 安装 Prisma 需要的依赖
RUN apk add --no-cache openssl libc6-compat

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制项目文件
COPY . .

# 生成 Prisma 客户端（仅生成客户端代码，不实际连接数据库）
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

# 构建项目
RUN npm run build

# 生产阶段
FROM node:20-alpine AS production

# 安装运行时需要的依赖
RUN apk add --no-cache openssl libc6-compat

# 设置工作目录
WORKDIR /app

# 复制构建产物
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# 复制 public 到正确位置
RUN mkdir -p /app/.output/server/chunks/public && cp -r /app/.output/public/. /app/.output/server/chunks/public/

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", ".output/server/index.mjs"]