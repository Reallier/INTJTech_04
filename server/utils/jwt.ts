import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

// 用户会话 Token（长期，7天）
export const signUserToken = (user: { id: number; email: string | null; name: string | null; avatar?: string | null }) => {
    return jwt.sign({
        // 原有字段（保持向后兼容）
        id: user.id,
        email: user.email,
        name: user.name,
        // 新增字段（给 hirestream-match 使用）
        user_id: `intj_${user.id}`,  // 统一用户 ID 格式
        nickname: user.name,
        avatar_url: user.avatar
    }, SECRET, { expiresIn: '7d' });
};

// 跳转用短期 Token（5分钟，用于 URL 传递）
export const signRedirectToken = (user: { id: number; email: string | null; name: string | null; avatar?: string | null }) => {
    return jwt.sign({
        user_id: `intj_${user.id}`,
        nickname: user.name,
        avatar_url: user.avatar,
        purpose: 'redirect'  // 标记用途，便于审计
    }, SECRET, { expiresIn: '5m' });  // 5分钟过期
};

export const verifyUserToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (e) {
        return null;
    }
};
