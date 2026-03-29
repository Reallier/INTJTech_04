# App16 Bili Transcriber

面向 Bilibili 视频的“下载 -> 音频抽取 -> 语音转写”流水线工具。当前是单文件 CLI 实现，定位为内部转写效率工具而非长期在线服务。

## 项目定位

- 输入：Bilibili 视频 URL
- 处理：`yt-dlp` 拉流 + `ffmpeg` 转 16k 单声道 WAV + DashScope 实时识别
- 输出：`txt` 转写文本 + `json` 元数据（同名文件）

## 基本信息

| 项目 | 说明 |
|------|------|
| 代码目录 | `/data/intjsys/products/app16-bili-transcriber` |
| 主入口 | `transcribe.py` |
| 运行形态 | Python CLI（非常驻服务） |
| 默认输出目录 | `./output` |
| 核心外部依赖 | `yt-dlp`, `ffmpeg`, `ffprobe`, `dashscope` |

## 架构与处理链路

```text
Bilibili URL
   |
   v
[Step 1] yt-dlp 下载最佳音轨
   |
   v
[Step 2] ffmpeg 抽取 WAV (16kHz / mono / PCM s16le)
   |
   v
[Step 3] DashScope Recognition 回调流式识别
   |
   v
text/json 文件落盘
```

## 关键实现细节

### 1) 下载阶段（`download_video`）

- 使用 `yt-dlp --no-playlist -f bestaudio/best` 优先拿音频轨
- 通过 `--print after_move:filepath` 获取最终文件路径
- 主策略失败时 fallback 到输出目录“最新修改文件”兜底

### 2) 音频抽取阶段（`extract_audio`）

- 统一输出为 ASR 友好的 WAV 格式：
  - `-acodec pcm_s16le`
  - `-ar 16000`
  - `-ac 1`
- 如果同名 WAV 已存在则跳过重做（幂等优化）

### 3) 识别阶段（`transcribe_audio`）

- 使用 `dashscope.audio.asr.Recognition` + 回调 `RecognitionCallback`
- 推流参数：
  - 分片大小 `6400 bytes`（200ms 音频）
  - 分片间 sleep `0.01s`
  - WAV 头部自动跳过 44 bytes（`RIFF` 检测）
- 只收集 `sentence_end=true` 的最终句子，减少中间草稿污染
- 超时策略：`max(60, 音频时长 * 2)`，防止超长任务无限等待

## 输出设计

同名三元结果（与视频标题对应）：

- `xxx.wav`：标准化音频
- `xxx.txt`：完整文本
- `xxx.json`：结构化结果（URL、文件名、语言、时间戳、全文）

这套输出结构适合后续直接接入摘要、切片、向量化等后处理任务。

## 稳定性与容错分析

当前实现优点：

- 对关键工具缺失有显式退出（`yt-dlp`、`dashscope`）
- 子进程调用有超时上限（download 600s / ffmpeg 300s）
- 回调错误可回传并阻断流程，避免静默失败

当前短板：

1. 密钥治理风险：`DASHSCOPE_API_KEY` 在代码里存在默认值，应改为必须从环境变量注入。
2. 文本拼接风险：`full_text = "".join(collected_texts)` 未做句间分隔，建议改为按标点或换行拼接。
3. 单任务串行：下载、抽取、转写全串行；批量处理时吞吐较低。
4. 非服务化：无 API、无任务队列、无状态持久层，不适合多用户并发调用。

## 典型运行方式

```bash
cd /data/intjsys/products/app16-bili-transcriber
export DASHSCOPE_API_KEY=xxx
python transcribe.py "https://www.bilibili.com/video/BVxxxx" --output ./output --lang zh
```

## 演进建议（从工具到服务）

1. 服务化：封装 FastAPI + 异步任务队列（Celery/RQ）。
2. 可恢复：任务状态落库，失败可重试并支持断点续跑。
3. 质量增强：增加 VAD、说话人分离、标点恢复和摘要后处理。
4. 成本与审计：记录模型调用时长、字数、费用和错误分类。

## 结论

App16 目前是高可用性的“个人/小团队效率脚本”，技术路径正确，产出稳定；若要成为正式产品能力，需要先完成密钥治理、任务系统化和服务接口化三项基础工程。
