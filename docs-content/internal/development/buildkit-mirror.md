# Docker BuildKit 镜像加速配置

## 问题背景

Docker BuildKit（`docker buildx`）作为独立进程运行，**不会读取 Docker daemon 的镜像加速配置**。这导致：

- `docker run` / `docker pull` 正常使用镜像加速
- `docker build` 仍然从 Docker Hub 官方源拉取，速度极慢

## 解决方案

创建一个带镜像加速配置的 BuildKit 实例。

### 1. 创建 BuildKit 配置文件

```bash
mkdir -p ~/.config/buildkit
cat > ~/.config/buildkit/buildkitd.toml << 'EOF'
# BuildKit 镜像加速配置
[registry."docker.io"]
  mirrors = ["https://docker.m.daocloud.io", "https://mirror.baidubce.com"]
EOF
```

### 2. 创建新的 Builder 实例

```bash
# 删除旧的（如果有）
docker buildx rm mybuilder 2>/dev/null || true

# 创建新的 builder，指定配置文件
docker buildx create --name mybuilder \
  --driver docker-container \
  --config ~/.config/buildkit/buildkitd.toml \
  --use

# 启动并验证
docker buildx inspect --bootstrap
```

### 3. 验证配置生效

```bash
# 构建测试镜像
docker buildx build --load -t test:latest . 

# 观察输出中的拉取速度，应该明显加快
```

## 镜像源推荐

| 镜像源 | 地址 | 说明 |
|--------|------|------|
| DaoCloud | `https://docker.m.daocloud.io` | 免费，稳定 |
| 百度云 | `https://mirror.baidubce.com` | 国内速度快 |
| 阿里云 | `https://<你的ID>.mirror.aliyuncs.com` | 需登录获取 |

## 常见问题

### Q: 每次重启需要重新配置吗？

不需要。Builder 实例是持久化的，重启后自动可用。

### Q: 如何切换回默认 builder？

```bash
docker buildx use default
```

### Q: 如何查看当前使用的 builder？

```bash
docker buildx ls
```
