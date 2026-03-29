# App01 运维手册

> 监控、维护与故障排查

## 日志集成

- **格式**：结构化 JSON 输出
- **聚合**：Loki 集中日志管理
- **追踪**：完整异常堆栈

## 性能监控

| 指标 | 目标值 |
|------|--------|
| 响应时间 | < 3秒（OCR + 匹配） |
| 准确率 | > 85%（人工验证） |
| 并发处理 | 10 个并发请求 |
| Token 消耗 | 平均 500 tokens/匹配 |

---

## 数据库维护

```sql
-- 清理过期匹配记录（30天以上）
DELETE FROM matches WHERE created_at < NOW() - INTERVAL '30 days';
```

### 搜索索引维护

- **扩展要求**：确保已安装 `pg_trgm`（用于模糊匹配）
- **迁移后操作**：执行 `/api/reindex` 全量重建索引

示例：
```bash
curl -X POST https://api.talentai.intjsys.com/api/reindex \
  -H "X-API-Key: <ADMIN_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"candidate_ids": null, "updated_since": null}'
```

## 监控检查清单

- [ ] 检查 API 响应时间
- [ ] 监控 Token 使用量
- [ ] 验证 OCR 准确率
- [ ] 检查日志异常

## 备份策略

- **数据库**：每日自动备份
- **配置文件**：版本控制
- **镜像**：定期更新

---

## 已知问题

### 高优先级
- OCR 识别率在复杂格式简历中需要提升
- 大文件上传超时处理

### 中优先级
- 匹配算法对某些行业适应性不足
- 移动端体验优化
