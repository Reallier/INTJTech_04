# 部署配置说明

## 服务器基础信息

| 配置项 | 值 |
|------|------|
| 服务器 IP | `119.29.166.51` |
| SSH 密钥 | `C:\Users\admin\Downloads\reallier.pem` |
| Docker Registry | `ccr.ccs.tencentyun.com/reallier/` |

## 端口配置

### **重要：所有服务都使用 5443 端口**

Traefik 反向代理配置：
- `web` 入口点: **80 端口** (HTTP)
- `websecure` 入口点: **5443 端口** (HTTPS) ← 不是标准 443！

这意味着所有 HTTPS 服务都需要通过 `:5443` 端口访问。

## 域名与服务映射

| 服务 | 域名 | 完整 URL | 端口 |
|------|------|----------|------|
| 官网 | `intjtech.reallier.top` | `https://intjtech.reallier.top:5443` | 5443 |
| 简历匹配 | `app.reallier.top` | `https://app.reallier.top:5443` | 5443 |
| 智能客服 | `cs.reallier.top` | `https://cs.reallier.top:5443` | 5443 |
| MBTI判型 | `mbti.reallier.top` | `https://mbti.reallier.top:5443` | 5443 |

## 服务器目录结构

```
/data/app-stack/
├── traefik/           # Traefik 反向代理配置
│   ├── docker-compose.yml
│   ├── traefik.yml
│   └── acme.json      # Let's Encrypt 证书存储
├── intjtech/          # 官网
│   ├── compose.yml
│   └── data/          # 数据库文件
├── hirestream/        # 简历匹配服务 (app01)
│   ├── compose.yml
│   └── .env
├── customer-service/  # 智能客服 (app02)
│   ├── compose.yml
│   └── .env
└── mindai-typing/     # MBTI判型 (app03)
    ├── compose.yml
    ├── .env
    └── data/
```

## JWT 认证配置

所有需要认证的服务共享同一个 JWT_SECRET：

```
JWT_SECRET=5Sf4IrUfOLVQ7ul46zfg_w-bHHHu_Y67iqscKTw6UM0
```

该密钥用于：
1. 官网签发用户 token
2. 各应用验证 token 有效性

## 新应用接入检查清单

当接入新应用到官网时，需要检查以下事项：

### 1. 创建部署文件
- [ ] `deploy.bat` - 部署脚本
- [ ] `.dockerignore` - Docker 构建排除文件
- [ ] `Dockerfile` - Docker 镜像定义

### 2. 服务器配置
- [ ] 在服务器创建目录: `/data/app-stack/<app-name>/`
- [ ] 创建 `compose.yml`，确保：
  - 使用 `traefik` 外部网络
  - 配置正确的 Traefik labels
  - `entrypoints=websecure`（对应 5443 端口）
- [ ] 创建 `.env` 文件，包含 `JWT_SECRET`

### 3. 官网跳转 API
- [ ] 创建 `server/api/services/<app>-redirect.get.ts`
- [ ] 重定向 URL 必须包含 `:5443` 端口
- [ ] 更新登录页 `redirectUrls` 映射

### 4. 应用认证
如果应用需要登录才能使用：
- [ ] 添加 JWT 验证逻辑
- [ ] `LOGIN_URL` 必须指向 `https://intjtech.reallier.top:5443/login?redirect=<app>`
- [ ] 支持 URL query param 和 cookie 两种方式获取 token

### 5. DNS 配置
- [ ] 在 DNS 服务商添加 A 记录指向 `119.29.166.51`
- [ ] 等待 Traefik 自动签发 Let's Encrypt 证书

## 常见问题

### Q: 访问时显示 ERR_CONNECTION_CLOSED
**A:** 检查 URL 是否包含 `:5443` 端口。Traefik 的 HTTPS 入口点不是标准 443 端口。

### Q: 重定向后页面无法访问
**A:** 检查重定向目标 URL 是否包含 `:5443` 端口。

### Q: JWT 验证失败
**A:** 确保所有服务使用相同的 `JWT_SECRET`。

### Q: 证书问题
**A:** 检查 Traefik 日志：
```bash
docker logs traefik-traefik-1 2>&1 | grep -i "acme\|cert"
```

## 部署命令速查

```bash
# SSH 连接服务器
ssh -i "C:\Users\admin\Downloads\reallier.pem" root@119.29.166.51

# 查看容器状态
docker ps

# 查看服务日志
docker logs <container-name> --tail 50

# 重启服务
cd /data/app-stack/<app-name>
docker compose down && docker compose pull && docker compose up -d

# 重启 Traefik（刷新路由/证书）
cd /data/app-stack/traefik
docker compose restart
```
