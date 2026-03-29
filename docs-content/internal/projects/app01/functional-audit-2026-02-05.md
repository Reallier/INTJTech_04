# App01 功能检查报告（静态）- 2026-02-05

> 检查日期：2026-02-05  \
> 检查方式：静态代码审查与历史记录复盘（未运行测试/服务）

## 执行摘要
- 整体健康度：中等
- 主要风险：输出安全与注入响应风险；JWT 默认密钥风险；测试与鉴权契约不一致；LLM 输出解析失败导致 500。
- 发布建议：上线前至少完成安全与核心接口回归（见文末命令）。

## 检查范围与方法
- 仅静态检查：读取代码、配置、测试历史。
- 覆盖范围：前端布局与登录链路、后端核心接口、测试体系与历史记录。

## 基线信息
### 测试环境配置
- `tests/config.py` 提供三套环境：
  - test: https://test.api.talentai.intjsys.com / https://test.talentai.intjsys.com
  - prod: https://api.talentai.intjsys.com / https://talentai.intjsys.com（只读）
  - local: http://localhost:8000 / http://localhost:3000

### 测试历史
- `tests/test_history.json` 最近记录：
  - 2026-01-02 13:24，env=test，passed=81，failed=0
  - 同时记录 `failed_tests` 含两项重复失败：`test_leak_006_server_config`、`test_injection_role_play`
- 结论：历史记录存在“通过数与失败项不一致”的异常，需要以原始 pytest 输出为准。

### 测试模块清单（19 个）
- test_01_health, test_02_search, test_03_instant_match, test_04_candidates, test_05_history, test_06_stats, test_07_security, test_08_feedback, test_09_jd_match, test_10_license, test_11_ingest, test_12_candidate_management, test_13_billing, test_14_sso_config, test_15_sso_integration, test_16_edge_cases, test_17_data_isolation, test_99_backend_pressure, test_license_api

## 后端功能与风险点
### 关键接口概览
- `/health`：健康检查。
- `/api/instant-match`：即时匹配（文本/OCR），包含注入检测、政策敏感惩罚、计费逻辑。
- `/api/match`：JD 匹配候选人，需登录用户。

### 风险点（分级）
**高**
- 输出安全风险：仅有输入清洗，输出内容若出现 IP:Port/DB 连接串或“DAN 模式”响应，可能触发安全测试失败。
- JWT 默认密钥风险：`match_service/auth.py` 存在默认密钥使用场景，生产未覆盖会导致可伪造 token。
- 测试历史异常：安全用例已记录失败，但统计显示 0 失败，历史数据可信度不足。

**中**
- 鉴权与测试契约不一致：`/api/instant-match` 强制登录，但安全/即时匹配相关用例未统一携带 token。
- LLM 输出 JSON 解析无容错：异常输出将直接 500。
- 外部依赖波动：DashScope LLM/OCR 调用对测试稳定性有显著影响。

**低**
- 计费逻辑对 `_parse_failure` 依赖风控标记，若解析失败但未正确标记，可能出现异常扣费或误判。

## 前端功能与风险点
- SSO 回调只在 console 输出，失败无明确 UI 提示。
- Layout 中全局 `window.click` 监听未卸载，HMR/多挂载时可能叠加监听。
- 头像使用第三方 `dicebear`，存在隐私与可用性依赖。

## 测试体系与覆盖度
- 覆盖安全、功能、计费、SSO、隔离、性能等主线。
- 高依赖外部服务：LLM/OCR、数据库、SSO、计费数据；本地环境若未完整配置，测试结果波动大。
- 多用例需要有效 `auth_token` 与 `JWT_SECRET`，否则会出现 401 或前置失败。

## 结论与建议
**高优先级**
- 增加输出侧安全清洗与注入响应抑制，覆盖 IP:Port/连接串与“DAN 模式”指令响应。
- 明确生产环境 JWT_SECRET 强制配置。
- 在发布前至少执行安全与核心接口回归。

**中优先级**
- 统一 `/api/instant-match` 鉴权策略与测试用例调用方式。
- 为 LLM 输出解析增加容错与降级返回。

**低优先级**
- 前端 SSO 失败提示、全局事件解绑与外部头像依赖提示。

## 可复现测试命令（未执行）
```bash
python tests/run_tests.py --env local --readonly
python tests/run_tests.py --env test --readonly
pytest -q tests/test_07_security.py
```
