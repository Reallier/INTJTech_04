import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

// 用户会话 Token（长期，7天）
export const signUserToken = (user: { id: number; email: string | null; name: string | null; avatar?: string | null }) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        user_id: user.id,  // 纯整数格式（2026 统一标准）
        nickname: user.name,
        avatar_url: user.avatar
    }, SECRET, { expiresIn: '7d' });
};

// 跳转用短期 Token（5分钟，用于 URL 传递）
export const signRedirectToken = (user: { id: number; email: string | null; name: string | null; avatar?: string | null }) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        user_id: user.id,  // 纯整数格式（2026 统一标准）
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
