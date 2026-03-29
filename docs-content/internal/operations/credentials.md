# 系统凭证管理

本页面记录 INTJTech 各系统的管理员凭证信息。

::: warning 内部文档
本文档仅限内部使用，请勿外传。
:::

## 官方网站 (official-site-intjtech)

### 生产环境
- **地址**: https://intjtech.reallier.top
- **管理后台**: https://intjtech.reallier.top/admin

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | Zilshu@2024 |

### 测试环境
- **地址**: https://test.intjtech.reallier.top:5443
- **管理后台**: https://test.intjtech.reallier.top:5443/admin

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | Zilshu@2024 |
| 测试用户 | test01 | 0d76TFV7hv3m |

## TalentAI (App01)

### 生产环境
- **前端**: https://talentai.intjsys.com
- **API**: https://api.talentai.intjsys.com

### 测试环境
- **前端**: https://test.talentai.intjsys.com
- **API**: https://test.api.talentai.intjsys.com

## 服务器 SSH

| 用途 | IP | 用户 | SSH Key |
|------|-----|------|---------|
| 生产服务器 | 119.29.166.51 | root | reallier.pem |
| 测试服务器 | 111.230.19.24 | root | test.pem |
| 监控服务器 | 43.136.53.213 | root | moniter.pem |

::: tip SSH Key 位置
所有 PEM 文件位于本地 `C:\Users\admin\Downloads\` 目录下。
**注意：服务器已禁用密码登录，必须使用 SSH Key。**
:::

## 腾讯云容器镜像仓库 (CCR)

- **地址**: ccr.ccs.tencentyun.com
- **命名空间**: reallier

| 用途 | 用户名 | 密码 |
|------|--------|------|
| Docker Push/Pull | 100026572558 | 123580Aa |

```bash
# 登录命令
docker login ccr.ccs.tencentyun.com/reallier -u 100026572558 -p 123580Aa
```

## RAGFlow (知识库管理)

- **管理后台**: http://192.168.39.77:9080
- **API**: http://192.168.39.77:9380/api/v1
- **API Key**: `ragflow-hiIpWFXy78qcUodc_BujEzHmDeJ_Nf_-8T3qNsN3SxA`
- **Embedding 模型**: text-embedding-v4@Tongyi-Qianwen (DashScope)

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | icey123580@gmail.com | 123580Aa |

## 数据库

### 生产环境 (talentai_db)
- **Host**: talentai_db (Docker 内网)
- **Port**: 5432
- **Database**: talentai
- **User**: talentai
- **Password**: `7a9d1834ad23433780b82dab10528932`

> 🔐 密码于 2026-01-02 更新，移除硬编码默认值

### 测试环境 (talentai_db)
- **Host**: talentai_db (Docker 内网)
- **Port**: 5432
- **Database**: talentai
- **User**: talentai
- **Password**: talentai123 (测试环境保留简单密码)
