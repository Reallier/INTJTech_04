# 可观测性栈

## 架构概览

```
应用日志/指标 ──→ Prometheus (指标) ──→ Grafana
                  Loki (日志)      ──→   ↑
```

## 组件说明

### Prometheus
- **用途**: 指标采集与存储
- **地址**: `http://43.136.53.213:9090`
- **采集**: node_exporter, 应用自定义指标

### Loki
- **用途**: 日志聚合
- **地址**: `http://43.136.53.213:3100`
- **客户端**: intjtech-logging SDK

### Grafana
- **用途**: 可视化面板
- **地址**: `http://43.136.53.213:3000`
- **仪表盘**: 系统监控、应用日志、告警

## 日志集成

使用 `intjtech-logging` 统一日志库：

```python
from intjtech_logging import setup_logging, get_logger

setup_logging(
    service_name="app01-hirestream-match",
    log_level="INFO",
    loki_url="http://43.136.53.213:3100",
)
logger = get_logger(__name__)

logger.info("Application started", extra={"version": "1.0.0"})
```

## 告警规则

基础告警已配置：
- CPU > 80% 持续 5 分钟
- 内存 > 90%
- 磁盘 > 85%

## App08 AI 巡检

App08 (资源监控) 每日生成 AI 巡检报告，分析系统健康状态。
