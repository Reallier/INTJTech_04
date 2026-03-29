# 常见问题

## 部署

**Q: Docker 容器启动失败？**

检查：
1. 端口占用：`netstat -tlnp | grep 8001`
2. 容器日志：`docker-compose logs`
3. 环境变量是否配置

**Q: 如何配置 HTTPS？**

使用 Traefik 反向代理配置 TLS 终止。

## API

**Q: 频率限制？**

默认 10 次/分钟。

**Q: 支持文件格式？**

TalentAI (App01)：PDF、JPG、PNG

## 开发

**Q: 本地运行？**

```bash
cd app01-hirestream-match/backend
uv sync
uv run uvicorn main:app --reload --port 8001
```

**Q: 技术栈？**

后端 FastAPI + PostgreSQL/SQLite，前端 Nuxt 3，AI 服务 DashScope API。