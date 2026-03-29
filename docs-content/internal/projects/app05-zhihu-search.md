# App05 - 知乎知识库

::: tip 🔗 快速访问
| 功能 | 地址 |
|------|------|
| 🔍 **搜索** | `http://localhost:8081` |
| 📊 **仪表盘 API** | `http://localhost:8081/api/crawler/stats` |

> 服务运行于本地 Docker，需确保容器 `zhihu-search` 处于运行状态。
> 
> 启动命令：`docker compose up -d` (在 `products/app05-zhihu-search` 目录)
> 
> ⚠️ 当前 Docker 运行的是**简化版 (`api_simple.py`)**，完整仪表盘需切换到 `api.py`
:::

## 核心价值

系统化采集、管理和检索知乎内容，构建私有知识库。

## 核心功能

### 内容采集
- 关键词/话题/用户维度采集
- 自动去重和更新
- 采集进度追踪

### 混合检索
- 关键词检索
- 语义向量检索
- 混合排序

### AI分类
- 自动内容分类
- 质量评分
- 标签提取

## 爬虫仪表盘

可视化管理采集任务：
- 任务队列状态
- 采集进度
- 错误日志
- 数据统计

## 技术栈

- 后端：FastAPI
- 检索：向量数据库 + BM25
- 前端：HTML + FontAwesome图标

## 运维命令

```bash
# 进入项目目录
cd products/app05-zhihu-search

# 查看容器状态
docker compose ps

# 查看日志
docker compose logs -f --tail=50

# 重启服务
docker compose restart
```

## 数据存储

| 路径 | 说明 |
|------|------|
| `./data/zhihu.db` | 文档全文索引数据库 |
| `./data/crawler_state.db` | 爬虫状态数据库 |
| `./data/chroma/` | 向量索引目录 |
| `D:/zhihu_downloads/` | HTML 文档归档 |

