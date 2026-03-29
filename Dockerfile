# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build

# 生产阶段
FROM node:20-alpine AS production

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/public ./public
COPY --from=builder /app/docs-content ./docs-content

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", ".output/server/index.mjs"]
