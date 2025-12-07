# 管理后台模块

## 功能列表

| 功能 | 路径 | 说明 |
|------|------|------|
| 管理员登录 | `/admin/login` | 独立的管理员账号体系 |
| 用户管理 | `/admin` | 用户列表、搜索 |
| 用户充值 | `/admin` | 为用户增加余额 |
| 创建用户 | `/admin` | 创建新用户并生成密码 |
| 删除用户 | `/admin` | 删除用户及关联数据 |
| 统计概览 | `/admin` | 用户数、总余额、今日新增 |

## 权限控制

- 管理员 Token 存储在 `admin_token` Cookie
- 所有管理接口都需要 Bearer Token 认证
- Token 有效期 24 小时

## API 调用

管理后台调用 HireStream 服务的 Admin API：

```
https://app.reallier.top/api/admin/
├── POST /login          # 登录
├── GET  /stats          # 统计
├── GET  /users          # 用户列表
├── POST /users          # 创建用户
├── POST /users/:id/recharge  # 充值
└── DELETE /users/:id    # 删除用户
```

## 相关文件

- `pages/admin/index.vue` - 管理后台主页
- `pages/admin/login.vue` - 管理员登录页
- `middleware/admin.ts` - 管理员路由守卫
