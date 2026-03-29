# 部署指南

## Docker 部署

所有项目都支持 Docker 部署。

### 单项目部署

```bash
cd <project-dir>
docker compose up -d
```

### 常用命令

```bash
# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f

# 重新构建
docker compose build --no-cache
docker compose up -d
```
