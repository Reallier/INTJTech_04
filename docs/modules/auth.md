# 登录认证模块

## 认证方式

| 方式 | 状态 | 说明 |
|------|------|------|
| 微信登录 | 🚧 待接入 | 需要企业主体 |
| 密码登录 | ✅ 已实现 | 用于管理后台创建的用户 |
| Mock 登录 | ✅ 开发用 | `?mock=true` 触发 |

## JWT Token 结构

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "用户昵称",
  "user_id": "intj_1",
  "nickname": "用户昵称",
  "avatar_url": "https://...",
  "iat": 1733558400,
  "exp": 1734163200
}
```

## 跨子域共享

- Cookie 设置 `domain: .reallier.top`
- 简历匹配服务从 Cookie 读取 `auth_token`
- 支持 URL 参数 `?token=xxx` 传递

## 相关文件

- `server/utils/jwt.ts` - JWT 签发和验证
- `server/api/auth/` - 认证相关 API
- `middleware/auth.ts` - 路由守卫
