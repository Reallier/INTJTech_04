import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// 运行时读取密钥（不在模块加载时读取，避免构建时烘焙）
const getSecret = () => process.env.JWT_SECRET || 'dev_secret_key_123';
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_456';

// Token 配置
export const TOKEN_CONFIG = {
    accessTokenExpiry: '15m',      // Access Token 15分钟
    refreshTokenExpiry: 30,         // Refresh Token 30天
    maxDevices: 3,                  // 最多3台设备同时登录
    smsCodeExpiry: 5                // 验证码5分钟有效
};

// User 类型定义
interface UserPayload {
    id: number;
    phone?: string | null;
    email?: string | null;
    name?: string | null;
    username?: string | null;
    avatar?: string | null;
    role?: string;
}

// Access Token Payload
interface AccessTokenPayload {
    id: number;
    phone?: string | null;
    email?: string | null;
    name?: string | null;
    username?: string | null;
    avatar?: string | null;
    role?: string;
    user_id: number;
    type: 'access';
}

// 签发 Access Token（短效，15分钟）
export const signAccessToken = (user: UserPayload): string => {
    const payload: AccessTokenPayload = {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        user_id: user.id,
        type: 'access'
    };
    return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_CONFIG.accessTokenExpiry });
};

// 签发 Refresh Token（长效，30天）
export const generateRefreshToken = (): string => {
    return uuidv4();
};

// 验证 Access Token
export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
    try {
        const decoded = jwt.verify(token, getSecret()) as AccessTokenPayload;
        if (decoded.type !== 'access') {
            return null;
        }
        return decoded;
    } catch (e) {
        return null;
    }
};

// 计算 Refresh Token 过期时间
export const getRefreshTokenExpiry = (): Date => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + TOKEN_CONFIG.refreshTokenExpiry);
    return expiry;
};

// ========== 兼容旧接口 ==========

// 兼容旧的 signUserToken（现在指向 accessToken）
export const signUserToken = (user: UserPayload): string => {
    return signAccessToken(user);
};

// 兼容旧的 verifyUserToken
export const verifyUserToken = (token: string) => {
    return verifyAccessToken(token);
};

// 跳转用短期 Token（5分钟，用于 URL 传递）
export const signRedirectToken = (user: UserPayload): string => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        user_id: user.id,
        nickname: user.name,
        avatar_url: user.avatar,
        purpose: 'redirect'
    }, getSecret(), { expiresIn: '5m' });
};
