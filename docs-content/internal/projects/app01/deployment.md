# App01 部署指南

> Docker 容器化部署配置

## 环境变量

```bash
# API 配置
DASHSCOPE_API_KEY=your_key_here
QWEN_MODEL=qwen-max
SYSTEM_PROMPT=custom_prompt

# 数据库
DATABASE_URL=postgresql://user:pass@host:port/db

# 文件上传
MAX_FILE_SIZE_MB=10

# 日志
LOKI_URL=http://loki-server:3100
```

---

## Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8001:8001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - DASHSCOPE_API_KEY=${DASHSCOPE_API_KEY}
    volumes:
      - ./data:/app/data
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=talentai
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

---

## 性能配置

### Token 管理
- 多 Key 轮询：支持并发请求负载均衡
- 费用计算：精确到 Token 的成本统计

### 缓存策略
- OCR 结果缓存：避免重复处理
- 向量索引缓存：提升搜索性能
- API 响应缓存：减少重复计算

### 并发处理
- AsyncOpenAI：异步处理提升并发
- 数据库连接池：连接复用
- 文件流处理：大文件分块上传
