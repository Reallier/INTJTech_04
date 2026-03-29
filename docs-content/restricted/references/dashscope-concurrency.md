# DashScope 并发优化指南

## 限流规则（官方）

| 模型 | RPM | TPM |
|:---|:---|:---|
| qwen-max | 1200 | 1,000,000 |
| qwen3-max | 600 | 1,000,000 |

> 参考: https://help.aliyun.com/document_detail/2712195.html

---

## 关键发现

### 1. DashScope 完全支持高并发

直接测试结果：
- 3 并发: 全部 ~1秒返回 ✅
- 5 并发: 全部 ~1.5秒返回 ✅

**RPM 是请求数限制，不是并发限制。**

### 2. 同步 vs 异步的致命差距

| 调用方式 | 10并发结果 |
|:---|:---|
| `OpenAI`（同步） | 11请求，55%成功，RPS 0.12 |
| `AsyncOpenAI`（异步） | **65请求，100%成功，RPS 0.9** |

**根因**: 同步调用阻塞 FastAPI 事件循环，导致请求串行化。

### 3. 最终性能

10并发×60秒压测（AsyncOpenAI）:

| 指标 | 值 |
|:---|:---|
| 总请求 | 65 |
| 成功率 | **100%** |
| RPS | 0.9 |
| 平均延迟 | 10.2s |
| P99延迟 | 14.5s |

---

## 解决方案

### 1. 使用 AsyncOpenAI

```python
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key=api_key,
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

# 异步调用
resp = await client.chat.completions.create(...)
```

### 2. 多Key轮询（可选）

用于分担 RPM 配额：

```python
class MultiKeyRotator:
    def __init__(self, api_keys: List[str]):
        self._key_cycle = cycle(api_keys)
    
    def get_next_key(self) -> str:
        return next(self._key_cycle)
```

环境变量：
```
DASHSCOPE_API_KEYS=sk-xxx,sk-yyy,sk-zzz
```

---

## 容量估算

| 配置 | 预期RPS | 每分钟请求 |
|:---|:---|:---|
| 1 Key + 异步 | ~1 | 60 |
| 2 Key + 异步 | ~2 | 120 |
| DashScope限制 | 20 | 1200 |

**结论**: 单Key异步已足够支撑 App01 业务需求。

---

## 历史问题

### 已修复: 同步调用阻塞

- **症状**: 多并发时延迟剧增，大量超时
- **误诊**: 以为是 DashScope 的秒级保护
- **根因**: FastAPI 中使用同步 `OpenAI` 客户端
- **解决**: 改用 `AsyncOpenAI`

### 已废弃: 限流器

`SmoothRateLimiter` 被证明无效且有害：
- 串行化请求，反而降低吞吐
- DashScope 本身不需要客户端限流
- 已从调用链移除
