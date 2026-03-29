# Cloudflare Tunnel 部署指南

官网国际版 (reallier.com) 通过 Cloudflare Tunnel 暴露服务，绕过域名备案限制。

## 架构

```
用户 → Cloudflare Edge → Tunnel → 192.168.39.77:9528 → 容器 :3000
```

- **cloudflared** 以 systemd 原生服务运行（非容器）
- 应用容器将端口 3000 映射到宿主机 9528
- Tunnel 通过 Cloudflare Dashboard 配置 `reallier.com → http://localhost:9528`

## 关键配置

### cloudflared 服务

```ini
# /etc/systemd/system/cloudflared.service
ExecStart=/usr/bin/cloudflared --no-autoupdate tunnel --protocol http2 run --token <TOKEN>
```

### Docker Compose

```yaml
# /data/app-stacks/intjsys-overseas/compose.yml
services:
  intjsys-overseas:
    image: intjsys-overseas:latest
    ports:
      - "9528:3000"
    restart: always
```

## 踩坑记录

### 1. QUIC 协议被电信运营商掐断

**现象**：cloudflared 默认使用 QUIC 协议，日志显示连接注册成功但频繁断开：
```
ERR Serve tunnel error: accept stream listener encountered a failure
WRN Failed to dial to edge with quic: timeout: no recent network activity
```

**原因**：国内电信/联通等运营商对 UDP + QUIC 流量有限制或 QoS 降级。

**解决**：强制使用 HTTP/2 协议：
```bash
# 修改 systemd 服务文件
sed -i 's|tunnel run|tunnel --protocol http2 run|' /etc/systemd/system/cloudflared.service
systemctl daemon-reload
systemctl restart cloudflared
```

### 2. 容器网络隔离 — 不能滥用 localhost

**原则**：容器内的 `localhost` 指的是容器自身，不是宿主机。

**当前方案可行原因**：cloudflared 是 systemd 原生服务（非容器化），直接运行在宿主机上，可以访问通过 `-p 9528:3000` 映射的端口。

**如果 cloudflared 也容器化**：需要这样处理：
- 将 cloudflared 和应用放在同一 Docker 网络
- Tunnel 目标改为 `http://容器名:3000`（而非 `localhost`）
- 或使用 `host.docker.internal`（仅限 Docker Desktop）

### 3. Nuxt 3 环境变量 runtime 覆盖需要 `NUXT_PUBLIC_` 前缀

Nuxt 3 的 `runtimeConfig.public` 在 Docker 运行时通过环境变量覆盖时，变量名必须加 `NUXT_PUBLIC_` 前缀：

```yaml
environment:
  - NUXT_PUBLIC_SITE_EDITION=overseas  # ✅ 正确
  - SITE_EDITION=overseas              # ❌ 不会覆盖
```

> **注意**：后续物理拆分后，国际版不再需要 SITE_EDITION 环境变量。

### 4. Tunnel 控制面连通 ≠ 数据面连通

**现象**：`journalctl` 显示 4 条连接全部 `Registered`，但 `reallier.com` 持续 502。

**排查方式**：
1. 在服务器上 `curl localhost:9528` → 确认应用正常
2. 访问 `reallier.com` 后立即查看 cloudflared 日志 → 无任何请求记录
3. 结论：CF edge 无法将请求路由到 Tunnel，网络层问题

**可能原因**：
- 上游网关/路由器对 7844 端口的长连接有超时或干扰
- 运营商中间设备篡改 HTTP/2 帧
- 需要从有公网直连的服务器运行 cloudflared

## 部署操作

### 安装 cloudflared (Fedora)

```bash
# 下载 RPM 包（在有网络的机器上）
curl -L -o cloudflared.rpm https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-x86_64.rpm

# 传输并安装
scp cloudflared.rpm root@192.168.39.77:/tmp/
ssh root@192.168.39.77 "rpm -i /tmp/cloudflared.rpm"

# 注册 Tunnel
cloudflared service install <TOKEN>

# 强制 HTTP/2
sed -i 's|tunnel run|tunnel --protocol http2 run|' /etc/systemd/system/cloudflared.service
systemctl daemon-reload
systemctl restart cloudflared
```

### 部署国际版应用

```bash
cd /data/intjsys/official-site-reallier
bash scripts/deploy.sh
```

## 命名规范

- ✅ **国际版** — 正式对外称呼
- ❌ ~~海外版~~ — 不使用
- 技术标识：`official-site-reallier`（项目目录）、`intjsys-overseas`（容器名，历史原因）
