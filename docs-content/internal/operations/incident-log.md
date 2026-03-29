# 故障处理日志

本章节记录系统故障及其修复过程，供后续参考。

---

## 2026-01-17：官网 Admin 后台长时间未操作显示空数据

### 问题描述

用户反馈：官网 Admin 后台长时间不登录后，页面显示空数据，需要刷新或重新登录才能恢复。

**表现**：
- 统计卡片全部显示 0
- 用户列表为空
- 服务配置列表为空
- 无任何错误提示

### 根因分析

**问题本质**：JWT Token 过期后，前端未正确处理 API 返回的 401 错误。

**详细链路**：
1. `admin_token` 使用通用的 `signUserToken()`，有效期只有 **15 分钟**
2. Cookie 的 `maxAge` 设置的是 24 小时，导致 Cookie 还在但 Token 已过期
3. 前端 middleware 只检查 Cookie 是否存在和格式，**不验证 Token 是否过期**
4. API 返回 401 错误后，前端只是 `console.error` 打印日志，**没有跳转登录页**
5. 页面保持空数据状态（`stats` 和 `users` 使用默认空值）

**相关文件**：
- `server/utils/jwt.ts`：Token 配置 `accessTokenExpiry: '15m'`
- `middleware/admin.ts`：只检查 Cookie 存在性
- `pages/admin/index.vue`：API 调用的 catch 块未处理 401

### 解决方案

#### 1. 为 Admin 创建专用长效 Token（7天）

```typescript
// server/api/admin/login.post.ts
const ADMIN_TOKEN_EXPIRY = '7d';

const signAdminToken = (user: any): string => {
    return jwt.sign({
        id: user.id,
        user_id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        type: 'admin'
    }, secret, { expiresIn: ADMIN_TOKEN_EXPIRY });
};
```

#### 2. Cookie 有效期与 Token 一致

```typescript
setCookie(event, 'admin_token', token, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7, // 7 天
    // ...
});
```

#### 3. 添加 401 错误自动跳转登录

```javascript
// pages/admin/index.vue
const handleApiError = (e) => {
  if (e?.status === 401 || e?.statusCode === 401) {
    console.warn('[Admin] Token 已过期，跳转登录...');
    const adminToken = useCookie('admin_token');
    adminToken.value = null;
    navigateTo('/admin/login');
    return true;
  }
  return false;
};

// 在所有 API 调用的 catch 块中使用
try {
  // ...
} catch (e) {
  if (!handleApiError(e)) {
    console.error('Failed to fetch:', e);
  }
}
```

### 修改文件

| 文件 | 修改内容 |
|------|----------|
| `server/api/admin/login.post.ts` | 创建 `signAdminToken()` 函数，7天有效期 |
| `pages/admin/index.vue` | 添加 `handleApiError()` 函数处理 401 |

### 验证方式

1. 登录 Admin 后台
2. 等待 15 分钟后刷新页面（或手动清除 token）
3. 应自动跳转到登录页，而非显示空数据

### 预防措施

1. **所有管理后台** API 调用都应包含 401 错误处理
2. **Token 有效期** 应与业务场景匹配：
   - 普通用户：15分钟（安全优先）
   - 管理后台：7天（便利优先）
3. 考虑添加 **Token 过期提示**，而非静默失败

---

## 2026-01-17：Admin 登录后闪回登录页（附加问题）

### 问题描述

在修复上述"空数据"问题后，发现新问题：登录成功后页面短暂跳转到 `/admin`，随即闪回到 `/admin/login`。

**表现**：
- 登录请求成功（服务器日志显示 "Login successful"）
- Token 正确写入 Cookie
- 页面进入后台后立即闪回登录页
- 控制台显示 `[Admin] Token 已过期，跳转登录...`

### 根因分析

**问题本质**：新签发的 Admin Token 使用了 `type: 'admin'`，但验证函数检查的是 `type === 'access'`。

**详细链路**：
1. `signAdminToken()` 签发的 Token payload 包含 `type: 'admin'`
2. `verifyAccessToken()` 第 65 行检查 `if (decoded.type !== 'access') return null`
3. Token 验证失败，API 返回 401
4. 前端 `handleApiError()` 捕获 401，触发跳转登录

**关键代码**：
```typescript
// server/utils/jwt.ts - 第 62-71 行
export const verifyAccessToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, getSecret());
        if (decoded.type !== 'access') {  // ← 这里要求 type 必须是 'access'
            return null;
        }
        return decoded;
    } catch (e) {
        return null;
    }
};
```

### 解决方案

将 Admin Token 的 `type` 从 `'admin'` 改为 `'access'`，保持与验证逻辑兼容：

```typescript
// server/api/admin/login.post.ts
const signAdminToken = (user: any): string => {
    return jwt.sign({
        id: user.id,
        user_id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        type: 'access'  // ← 与 verifyAccessToken 验证逻辑保持一致
    }, secret, { expiresIn: ADMIN_TOKEN_EXPIRY });
};
```

### 经验教训

1. **JWT Token 类型检查**：签发新类型 Token 时，必须确认验证函数是否兼容
2. **端到端测试**：修改认证逻辑后，必须完整测试登录→API调用→登出流程
3. **日志辅助定位**：控制台输出 `Token 已过期，跳转登录` 虽然误导（实际是 type 不匹配），但帮助定位到 401 触发点

---

*记录人：AI Agent*  
*修复时间：2026-01-17 23:45*

---

## 2026-02-18：海外版知识库搜索 502（Podman 容器网络隔离）

### 问题描述

海外版官网 (`intjsys-overseas`) 部署在 `192.168.39.77`，知乎知识库搜索功能返回 502 错误，提示 "Search failed"。

**表现**：
- 搜索任何关键词均返回 `{"error":true,"statusCode":502,"statusMessage":"Search failed"}`
- 容器日志：`Search error: [POST] "http://host.docker.internal:9380/api/v1/retrieval": <no response> fetch failed`
- RAGFlow 服务本身正常运行（宿主机 `curl localhost:9380` 返回 404 = 服务存活）

### 根因分析

**问题本质**：77 服务器使用的是 **Podman**（非 Docker），容器默认 bridge 网络无法访问宿主机端口。

**详细链路**：
1. `search.get.ts` 中 `INTERNAL_HOST` 在生产环境使用 `host.docker.internal`
2. Podman 容器的 `/etc/hosts` 中 `host.docker.internal` 映射到 `10.89.5.1`（podman 桥接网关）
3. 但 `intjsys-overseas` 容器处于独立的 `intjsys-overseas_default` bridge 网络中
4. 该网络与 podman 桥接网络 **不互通**，导致容器无法访问宿主机上的 RAGFlow（9380）和 Nginx HTML 服务器（9600）
5. 即使改为宿主机真实 IP `192.168.39.77`，bridge 模式下也无法访问（wget 超时）

### 解决方案

**改为 `network_mode: host`**，使容器直接共享宿主机网络栈，无需任何端口映射或跨网络访问。

#### 1. 修改 compose.yml

```yaml
services:
  intjsys-overseas:
    image: intjsys-overseas:latest
    container_name: intjsys-overseas
    environment:
      - NODE_ENV=production
      - NITRO_HOST=0.0.0.0
      - NITRO_PORT=9528          # 直接绑定宿主机端口
      - DATABASE_URL=file:./data/dev.db
    network_mode: host            # 关键：使用宿主机网络
    volumes:
      - ./data-overseas:/app/data
    restart: always
```

> **注意**：host 模式下不支持 `ports` 映射，需直接通过 `NITRO_PORT` 指定端口。

#### 2. 修改 API 中的内部地址

```typescript
// server/api/knowledge/zhihu/search.get.ts & documents.get.ts
const INTERNAL_HOST = process.env.NODE_ENV === 'production' ? 'localhost' : EXTERNAL_HOST;
```

host 网络下容器内 `localhost` 即宿主机，可直接访问 RAGFlow（9380）和 Nginx（9600）。

### 修改文件

| 文件 | 修改内容 |
|------|----------|
| `compose.yml` | `network_mode: host`，移除 `ports`，`NITRO_PORT` 改为 9528 |
| `server/api/knowledge/zhihu/search.get.ts` | `INTERNAL_HOST` 改为 `localhost` |
| `server/api/knowledge/zhihu/documents.get.ts` | `INTERNAL_HOST` 改为 `localhost` |

### 经验教训

1. **Podman ≠ Docker**：`host.docker.internal` 在 Podman 下行为不同，bridge 网络隔离更严格
2. **容器需要访问宿主机服务时**：优先用 `network_mode: host`，避免跨网络路由问题
3. **排查网络问题的方法**：`docker exec` + `wget`/`curl` 从容器内部验证连通性，比看日志更直接

---

*记录人：AI Agent*  
*修复时间：2026-02-18 18:15*

---

## 2026-02-18：knowledge-hub-api 预览页面 404（端口冲突）

### 问题描述

`knowledge-hub-api` 容器的 Orchestrator 预览页面 (`/api/orchestrator/photos/intelligence/preview`) 始终返回 `404 Not Found`，即使容器日志显示路由已注册。

**表现**：
- 从浏览器和宿主机 curl 访问 `localhost:8081/api/orchestrator/...` 均返回 404
- 容器内部通过 `docker exec` + `urllib` 测试同一路径返回 200
- `/health` 端点从外部能正常返回 200
- 容器日志显示 `Orchestrator API routes registered` 且 uvicorn 启动无错误

### 根因分析

**问题本质**：`zhihu-crawler` 和 `knowledge-hub-api` 两个容器都绑定了宿主机的 **8081 端口**。Podman 的 nftables DNAT 规则将外部请求路由到了 `zhihu-crawler`（只有 `/health` 路由），而非 `knowledge-hub-api`（99 条路由）。

**关键证据**：
```bash
# 宿主机获取 openapi.json → 只有 1 条路由
curl -s http://localhost:8081/openapi.json | python3 -c '...; print(len(paths))'
# 输出: 1

# 容器内获取 → 99 条路由  
docker exec knowledge-hub-api python -c '...; print(len(paths))'
# 输出: 99

# docker ps 直接暴露了端口冲突
docker ps --format 'table {{.Names}}\t{{.Ports}}' | grep 8081
# zhihu-crawler        0.0.0.0:8081->8081/tcp
# knowledge-hub-api    0.0.0.0:8081->8081/tcp
```

### 排查过程中走弯路的反思

> [!CAUTION]
> 本次排查花费了大量时间（约 30 分钟），最终发现是一个 `docker ps | grep 8081` 就能在 10 秒内定位的问题。

**走弯路的原因**：
1. **一开始怀疑 Python 导入问题** → 花了大量时间调试 `api.py` 中 orchestrator 的 import 逻辑
2. **容器内部测试造成误导** → `docker exec` 内 urllib 测试返回 200（请求的是容器内的 uvicorn），让人误以为服务正常
3. **调试过程中引入新 bug** → 在 `logger` 还未定义的位置添加了 `logger.info()` 导致 `NameError`，使 api.py 彻底崩溃
4. **同时修改多个变量** → 每次重启时同时修改了 except 类型、logger 调用、注册日志，无法判断哪个改动起了作用

### 解决方案

将 `knowledge-hub-api` 的宿主机端口映射从 `8081` 改为 `8082`：

```yaml
# docker-compose.yml
services:
  knowledge-hub-api:
    ports:
      - "8082:8081"   # 原来是 "8081:8081"，与 zhihu-crawler 冲突
```

### 核心教训（通用排查原则）

| 原则 | 说明 |
|------|------|
| **先查基础设施再查代码** | 遇到 404/连接问题，第一步 `ss -tlnp \| grep <端口>` + `docker ps \| grep <端口>`，10 秒发现端口冲突 |
| **外部测试优先于内部测试** | 用户链路是 `浏览器 → 宿主机端口 → 容器`，应先测外部链路，不要只在容器内测 |
| **不要在调试时引入副作用** | 不要往生产代码里临时加调试语句（可能因变量未定义等引入新问题），应优先用 `docker logs` + 现有日志 |
| **每次只改一个变量** | 同时修改多处时，无法判断哪个改动生效，增加了排查复杂度 |

### 附带问题：缩略图 500 错误

端口冲突解决后，预览页面缩略图返回 HTTP 500，原因是容器缺少 `Pillow` 包（`No module named 'PIL'`）。

**解决方法**：由于容器 DNS 不通无法直接 `pip install`，通过本机代理下载 wheel 包后 `docker cp` + `pip install --no-index` 安装。

---

*记录人：AI Agent*  
*修复时间：2026-02-18 23:15*

---

## 2026-02-19：Photo Intelligence 接入 RAGFlow（容器跨网络通信 + 数据持久化）

### 问题描述

Photo Intelligence (`app15`) 需要将照片分析结果同步到 RAGFlow 知识库，但容器内无法访问 RAGFlow 服务。

**表现**：
- 同步 API 返回 `Connection refused`（第一次尝试用 `localhost:9380`）
- 改为 `host.docker.internal:9380` 后超时（第二次尝试）
- 改为宿主机 IP `192.168.39.77:9380` 后仍超时
- 最终发现所有从容器到宿主机端口的连接都被阻断

### 根因分析

本次涉及 **三个独立问题**，逐步暴露：

#### 问题 1：容器网络隔离导致无法访问 RAGFlow

**根因**：`photo-intelligence` 和 `ragflow` 分别在不同的 Docker bridge 网络中（`app15-photo-intelligence_default` vs `ragflow_ragflow`），bridge 网络之间不互通。`host.docker.internal` 解析到的网关 IP（`10.89.7.1`）虽正确，但宿主机防火墙/iptables 阻止容器网络入站连接。

```bash
# 验证过程
docker exec photo-intelligence python3 -c "
import socket
socket.create_connection(('host.docker.internal', 9380), timeout=5)
"
# → timed out

socket.create_connection(('192.168.39.77', 9380), timeout=5)
# → timed out

# 甚至 Ollama 也不通
socket.create_connection(('host.docker.internal', 11434), timeout=3)
# → Connection refused（77 没有 Ollama）
```

#### 问题 2：数据库文件在容器层，重建后丢失

**根因**：`state_db.py` 使用 `Path(__file__).parent.parent.parent.parent / "data"` 计算 DB 路径，在容器中解析为 `/data/photo_intelligence.db`（容器临时层），而非 `/app/data/`（持久化 volume 挂载点）。

每次 `docker compose up -d` 重建容器后，全部数据丢失：
```bash
ls -la /opt/app15-photo-intelligence/data/
# photo_intelligence.db  → 0 bytes（空文件）
# thumbnails/            → 19448 个缩略图（仍在，因为是 volume 挂载的）
```

#### 问题 3：代码修改每次重建容器后丢失

**根因**：`docker cp` 将文件复制到容器层（可写层），`docker compose up` 重建容器后用 image 的只读层覆盖，丢失所有修改。

### 解决方案

#### 1. 加入 RAGFlow 网络（解决网络隔离）

```yaml
# docker-compose.yml
services:
  photo-intelligence:
    networks:
      - default
      - ragflow        # 加入 RAGFlow 的 Docker 网络

networks:
  ragflow:
    external: true
    name: ragflow_ragflow
```

容器内可通过 Docker DNS `ragflow:9380` 直接访问：
```python
RAGFLOW_BASE_URL = "http://ragflow:9380"  # Docker 内部 DNS 解析
```

#### 2. 环境变量控制 DB 路径（解决持久化）

```python
# state_db.py
_DATA_DIR = os.environ.get(
    "PI_DATA_DIR",
    str(Path(__file__).parent.parent.parent.parent / "data"),
)
_DEFAULT_DB = str(Path(_DATA_DIR) / "photo_intelligence.db")
```

```yaml
# docker-compose.yml
environment:
  - PI_DATA_DIR=/app/data   # 指向持久化 volume
```

#### 3. 源码挂载为 volume（解决代码丢失）

```yaml
# docker-compose.yml
volumes:
  - ./data:/app/data           # 数据持久化
  - ./src:/app/src             # 源码实时绑定
  - /data/photos/album:/data/photos/album:ro
```

### 核心教训

| 原则 | 说明 |
|------|------|
| **容器间通信必须共享网络** | 不同 `docker-compose.yml` 创建的服务在不同网络中，需要用 `external: true` 加入同一网络 |
| **`host.docker.internal` 不可靠** | 在 Linux Docker / Podman 下，宿主机防火墙可能阻止容器入站，改用 Docker 内部 DNS 更稳定 |
| **容器层文件 ≠ 持久化** | `docker cp` 或容器内 `pip install` 修改的文件在重建后全丢，关键数据必须在 volume 中 |
| **DB 路径不要依赖 `__file__`** | 容器内的 `__file__` 路径与本地开发不同，用环境变量 `PI_DATA_DIR` 控制更灵活 |
| **开发期挂载 src 目录** | `./src:/app/src` 可让代码变更即时生效，避免反复 `docker cp + restart` |

### 修改文件

| 文件 | 修改内容 |
|------|----------|
| `docker-compose.yml` | 加入 `ragflow_ragflow` 外部网络、PI_DATA_DIR 变量、src volume 挂载 |
| `state_db.py` | DB 路径改为 `PI_DATA_DIR` 环境变量优先 |
| `ragflow_sync.py`（新增） | RAGFlow 同步模块（创建数据集、上传文档、触发解析） |
| `api.py` | +3 个 RAGFlow API 端点 |

### 验证结果

```
POST /api/intelligence/ragflow/sync?batch_size=5
→ {"message":"同步完成","synced":3,"failed":0,"skipped":0}

GET /api/intelligence/ragflow/stats
→ {"ragflow_indexed":3,"ragflow_pending":0,"total":3}

RAGFlow 数据集: photo_intelligence → 3 docs, 3 chunks ✅
```

---

*记录人：AI Agent*  
*修复时间：2026-02-19 16:40*

