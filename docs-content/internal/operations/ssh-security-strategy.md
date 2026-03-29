# SSH 安全访问策略：纯密钥模式

## 背景与挑战

我们之前的 SSH 安全策略依赖于 Fail2Ban 来防御暴力破解攻击。然而，在实际运营中遇到了以下痛点：

1.  **动态 IP 误封**：管理人员通常通过家庭宽带或移动网络（4G/5G）访问服务器，出口 IP 经常变化。Fail2Ban 在检测到连接不稳定或少量错误的尝试时（例如 KEX 握手超时），容易误封这些合法的动态 IP。
2.  **白名单维护成本高**：由于 IP 不固定，维护各种白名单（安全组、hosts.allow、Fail2Ban ignoreip）变得非常繁琐且不切实际。
3.  **连接中断**：因误封导致的连接中断严重影响了紧急运维和部署效率。

## 解决方案：纯密钥认证 (Key-Only Auth)

为了彻底解决上述问题，同时保持甚至提升安全性，我们采取了**"纯密钥认证 + 关闭 Fail2Ban"**的策略。

### 核心变更

1.  **强制密钥认证**：服务器仅允许 SSH 密钥对（PEM/PPK）登录，**彻底禁用密码登录**。
2.  **关闭 Fail2Ban**：由于密码登录已被物理阻断，暴力破解（尝试猜测密码）已无意义，Fail2Ban 对于 SSH 的防护变得多余，反而成为误封合法用户的阻碍。
3.  **移除 IP 限制**：不再在防火墙或软件层面对 SSH 端口（22）的源 IP 进行严格限制（除必要的云平台安全组兜底外）。

### 安全性分析

-   **抗暴力破解**：RSA/Ed25519 密钥的破解难度在当前算力下是天文数字。没有密码输入框，攻击者无法进行字典攻击。
-   **可用性**：无论管理员 IP 如何变化，只要持有私钥即可登录，无需担心被 ban。
-   **性能**：减少了 Fail2Ban 频繁修改 iptables 规则带来的系统开销。

## 配置指南

### 1. 服务器配置 (`/etc/ssh/sshd_config`)

确保以下配置项生效：

```ssh
# 禁用密码认证
PasswordAuthentication no
ChallengeResponseAuthentication no

# 启用公钥认证
PubkeyAuthentication yes

# 确保 root 登录（如需）仅限密钥
PermitRootLogin prohibit-password
```

配置完成后重启 SSH 服务：
```bash
systemctl restart sshd
```

### 2. 关闭 Fail2Ban (针对 SSH)

如果只使用 Fail2Ban 保护 SSH，可以直接停止服务：

```bash
systemctl stop fail2ban
systemctl disable fail2ban
```

如果 Fail2Ban 还需要保护 Nginx 等其他服务，请编辑 `/etc/fail2ban/jail.local`，禁用 SSH 监控：

```ini
[sshd]
enabled = false
```

## 客户端连接标准

所有运维人员只需持有授权的 PEM 私钥即可连接，无需考虑当前 IP：

```bash
# 标准连接命令
ssh -i /path/to/private.pem root@<server-ip>
```

> **注意**：请务必妥善保管私钥文件，它是进入服务器的唯一凭证。
