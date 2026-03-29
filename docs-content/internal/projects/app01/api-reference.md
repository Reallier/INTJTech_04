# App01 API 文档

> 本文档定义 TalentAI 系统的所有 API 接口。

## 即时匹配

**接口**：`POST /api/instant-match`

**功能**：上传简历和职位描述，获取匹配评分和分析。

**请求参数**：

```typescript
{
  jd: string,           // 职位描述（必需）
  resume?: File,        // 简历文件（PDF/JPG/PNG/GIF/WEBP）
  resume_text?: string  // 简历文本（与文件二选一）
}
```

**响应结果**：

```typescript
{
  match_score: number,    // 匹配分数 (0-100)
  advantages: string[],   // 匹配优势
  risks: string[],        // 潜在风险
  advice: string,         // 综合建议
  token_usage: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number,
    cost: number
  }
}
```

---

## 候选人管理

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/candidates/ingest` | POST | 简历入库 |
| `/api/candidates` | GET | 候选人列表 |
| `/api/candidates/{id}` | GET | 候选人详情 |
| `/api/candidates/{id}` | DELETE | 删除候选人 |

**入库特性**：自动去重、PDF/DOCX支持、结构化信息提取、审计日志。

---

## 智能搜索

**接口**：`GET /api/search`

**参数**：
- `q`：搜索关键词
- `top_k`：返回数量
- `mode`：搜索模式（`hybrid`/`vector`，默认 `hybrid`）

**搜索类型**：全文关键词 + 模糊匹配 + 语义向量混合搜索（强依赖 Embedding）。

**错误码**：
- `503`：Embedding 服务不可用

---

## 索引管理

**接口**：`POST /api/reindex`

**功能**：增量索引重建、向量嵌入更新、批量处理。

---

## 健康检查

| 接口 | 说明 |
|------|------|
| `GET /health` | 应用健康状态 |
| `GET /api/stats` | 系统统计信息 |
