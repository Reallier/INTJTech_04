/**
 * 刷新 Access Token API
 * 
 * POST /api/auth/refresh
 * Cookie: refresh_token=xxx
 * 
 * 使用 Refresh Token 获取新的 Access Token
 */
import prisma from '~/server/utils/prisma';
import { signAccessToken, generateRefreshToken, getRefreshTokenExpiry, TOKEN_CONFIG } from '~/server/utils/jwt';

export default defineEventHandler(async (event) => {
    // 从 Cookie 获取 Refresh Token
    const refreshToken = getCookie(event, 'refresh_token');

    if (!refreshToken) {
        return {
            success: false,
            message: '未登录',
            code: 'NO_REFRESH_TOKEN'
        };
    }

    // 查找 Refresh Token
    const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true }
    });

    if (!tokenRecord) {
        console.log('[Refresh] Token 不存在');
        // 清除无效 Cookie
        setCookie(event, 'refresh_token', '', { maxAge: 0, path: '/' });
        return {
            success: false,
            message: '登录已失效，请重新登录',
            code: 'INVALID_TOKEN'
        };
    }

    // 检查是否过期
    if (tokenRecord.expiresAt < new Date()) {
        console.log('[Refresh] Token 已过期');
        // 删除过期 Token
        await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
        setCookie(event, 'refresh_token', '', { maxAge: 0, path: '/' });
        return {
            success: false,
            message: '登录已过期，请重新登录',
            code: 'TOKEN_EXPIRED'
        };
    }

    const user = tokenRecord.user;
    console.log('[Refresh] 刷新 Token:', user.id);

    // 生成新的 Access Token
    const accessToken = signAccessToken(user);

    // 可选：轮换 Refresh Token（更安全，但会导致旧 Token 失效）
    // 这里我们选择不轮换，保持简单

    // 更新 auth_token Cookie
    const isDev = process.env.NODE_ENV !== 'production';
    setCookie(event, 'auth_token', accessToken, {
        httpOnly: false,
        maxAge: 15 * 60,
        path: '/',
        ...(isDev ? {} : { domain: '.intjsys.com', secure: true }),
        sameSite: 'lax'
    });

    return {
        success: true,
        accessToken,
        user: {
            id: user.id,
            phone: user.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            balance: user.balance,
            freeQuota: user.freeQuota
        }
    };
});
