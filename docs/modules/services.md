# 服务跳转模块

## 服务入口

官网作为统一入口，为各产品提供跳转服务。

| 服务 | 入口 | 跳转地址 |
|------|------|----------|
| 简历匹配 | `/api/services/hirestream-redirect` | `https://app.reallier.top` |
| 智能客服 | 🚧 待接入 | - |

## 跳转流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant W as 官网
    participant S as 产品服务
    
    U->>W: 点击服务入口
    W->>W: 检查登录状态
    alt 未登录
        W->>U: 跳转登录页
    else 已登录
        W->>W: 生成新 JWT Token
        W->>S: 重定向 + Token
        S->>S: 验证 Token
        S->>U: 显示服务页面
    end
```

## 相关文件

- `server/api/services/hirestream-redirect.get.ts`
