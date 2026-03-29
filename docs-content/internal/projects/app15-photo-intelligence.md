# App15 Photo Intelligence

面向本地相册目录的多后端视觉分析服务。核心目标是把“文件系统中的照片”转换成“可检索的结构化知识”，并可进一步同步到 RAGFlow。

## 项目定位

- 输入：本地照片/视频目录（当前默认跳过视频分析）
- 处理：增量扫描 + 异步并发分析 + 结果持久化
- 输出：结构化元数据（标题/描述/场景/标签/物体/OCR/质量分）+ 画廊预览 + RAGFlow 检索索引

## 基本信息

| 项目 | 说明 |
|------|------|
| 服务端口 | `8015` |
| 代码目录 | `/data/intjsys/products/app15-photo-intelligence` |
| 运行形态 | Docker + FastAPI |
| 容器名 | `photo-intelligence` |
| 主数据源 | `/data/photos/album`（只读挂载） |
| 状态库 | SQLite (`photo_intelligence.db`) |

## 架构总览

```text
               +-----------------------+
               |  FastAPI API Layer    |
               |  api.py               |
               +----------+------------+
                          |
                          v
               +-----------------------+
               | PhotoIntelligenceWorker|
               | worker.py             |
               +----+-------------+----+
                    |             |
         Scan Phase |             | Analyze Phase
                    v             v
             +-------------+   +------------------+
             | AssetScanner|   | PhotoAnalyzer    |
             | scanner.py  |   | analyzer.py      |
             +------+------+   +----+---+---+-----+
                    |               |   |   |   |
                    +-------+-------+   |   |   |
                            v           |   |   |
                       +---------+      |   |   |
                       | StateDB |<-----+   |   |
                       | SQLite  |          |   |
                       +----+----+          |   |
                            |               |   |
                            +-------> CostTracker
                            |
                            +-------> RAGFlowSync (optional)
```

## 端到端执行链路

1. `POST /api/intelligence/start` 启动后台 worker。
2. Worker 周期性执行 `scan_incremental`，首次无增量时触发一次 `scan_all`。
3. Scanner 递归目录，按扩展名识别 `IMAGE/VIDEO`，以“绝对路径 SHA256”生成 `asset_id`。
4. Analyzer 批量拉取 `pending` 记录，并发分析，按配置选择后端：
   - `gemini`
   - `dashscope`
   - `ollama`
   - `clip`
5. 结果写回 `photo_analysis` 表，状态由 `pending -> analyzing -> analyzed/error`。
6. 可选调用 `POST /api/intelligence/ragflow/sync`，把 `analyzed` 且未索引的数据上传至 RAGFlow。

## 核心模块深度拆解

### 1) Orchestration: `worker.py`

- 状态机：`idle/scanning/analyzing/paused/error`
- 主循环按 `scan_interval` 与 `loop_interval` 驱动
- 单循环最多分析 `10` 轮，避免一次循环占用过久
- 运行时热更新配置（`PUT /api/intelligence/config`）会同步到 analyzer/rate-limiter/cost-tracker

### 2) 扫描层: `scanner.py`

- 支持图片：`.jpg/.jpeg/.png/.gif/.webp/.heic/.bmp`
- 支持视频：`.mp4/.mov/.avi/.mkv`
- 增量策略：基于 `mtime` 与 `scan_meta.last_incremental_scan`
- 去重主键：`asset_id=sha256(absolute_path)`（路径稳定即稳定）

### 3) 分析层: `analyzer.py`

- 并发模型：`asyncio.Semaphore(concurrency)`
- 限流：令牌桶（`TokenBucketRateLimiter`）
- 容错：熔断器（`CircuitBreaker`，默认失败阈值 10，恢复窗口 300s）
- 大图保护：超过 `10MB` 自动缩放至 `2048px` 内并重编码 JPEG
- 多后端策略：
  - `Gemini`: `google-genai` SDK
  - `DashScope`: OpenAI 兼容 `/chat/completions`
  - `Ollama`: 本地 `/api/generate`
  - `CLIP`: 零样本分类器，本地推理无云端成本

### 4) 状态与数据层: `state_db.py`

- SQLite + WAL，`busy_timeout=5000`
- 主表 `photo_analysis` 存放资产状态与分析字段
- `cost_log` 累计 token 与费用
- `scan_meta` 持久化扫描游标
- `photo_collections/collection_items` 支持收藏夹/分类视图
- “卡死任务”恢复：`analyzing` 超过 10 分钟自动回退 `pending`

### 5) RAG 联动层: `ragflow_sync.py`

- 自动确保 dataset 存在（按名称查找或创建）
- 将单照片结构化结果转换成 markdown 文档上传 RAGFlow
- 本地 `ragflow_doc_id` 回写，支持从检索 chunk 反查本地 asset
- 支持上传后自动触发 chunk parse

## 数据模型（核心字段）

`photo_analysis` 关键信息：

- 资产标识：`asset_id`, `asset_type`, `original_path`, `original_name`
- 流程状态：`status`, `retry_count`, `error_message`, `updated_at`
- 语义结果：`title`, `description`, `scene`, `mood`, `event_type`
- 结构结果：`tags_json`, `objects_json`, `colors_json`, `ocr_text`
- 检索联动：`ragflow_indexed`, `ragflow_doc_id`

## 对外 API 分组

### Pipeline 控制

- `POST /api/intelligence/start|stop|pause|resume`
- `POST /api/intelligence/scan`
- `POST /api/intelligence/analyze`

### 查询与可视化

- `GET /api/intelligence/status|stats|cost|recent|gallery|asset/{asset_id}`
- `GET /api/intelligence/proxy/{asset_id}/thumbnail|original`
- `GET /api/intelligence/preview`

### RAGFlow 与收藏夹

- `POST /api/intelligence/ragflow/sync`
- `GET /api/intelligence/ragflow/stats|dataset|search`
- `GET/POST/DELETE /api/intelligence/collections...`

## 部署与运行关键点

```bash
cd /data/intjsys/products/app15-photo-intelligence
docker compose up -d
```

关键运行参数（`docker-compose.yml`）：

- `PHOTO_DIR=/data/photos/album`
- `PI_BACKEND=dashscope|gemini|ollama|clip`
- `PI_DATA_DIR=/app/data`（务必挂载持久化卷）
- `RAGFLOW_BASE_URL=http://ragflow:9380`（容器需加入 `ragflow_ragflow` 网络）

## 性能与容量特征

- 扫描复杂度：`O(文件总数)`，增量受 `mtime` 缩减
- 分析吞吐：受后端（云 API 或本地 GPU）与 `analyze_concurrency` 共同限制
- 单机存储：SQLite 足够支撑中小规模图库；超大规模建议迁移 PostgreSQL

## 当前技术风险与改进建议

1. 密钥默认值风险：`RAGFLOW_API_KEY` 与 `DASHSCOPE_API_KEY` 在代码/环境示例中出现默认值，建议改为“强制环境注入，无默认值”。
2. 资产标识风险：`asset_id` 基于路径哈希，文件重命名会被视作新资产；若要“内容去重”，建议引入文件内容哈希。
3. 进程内状态依赖：worker 单实例内存状态较多，未来多副本部署要补充分布式锁与任务分片。
4. `gpu` 信息口径：GPU 名称当前固定为 4090，建议改为动态探测，避免运维误判。

## 适用场景结论

App15 已具备“内部图库智能索引”生产可用形态，尤其适合本地素材库整理与检索增强；若继续向多团队规模化演进，优先改造点是密钥治理、资产唯一键策略和数据库升级路径。
