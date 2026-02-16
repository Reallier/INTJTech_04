/**
 * 登出 API
 * 
 * POST /api/auth/logout
 * 
 * 清除 Cookie 并撤销 Refresh Token
 */
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
    const refreshToken = getCookie(event, 'refresh_token');

    // 从数据库删除 Refresh Token
    if (refreshToken) {
        try {
            await prisma.refreshToken.delete({
                where: { token: refreshToken }
            });
            console.log('[Logout] Refresh Token 已撤销');
        } catch (e) {
            // Token 可能不存在，忽略
            console.log('[Logout] Refresh Token 不存在或已失效');
        }
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const cookieOptions = {
        httpOnly: false,
        maxAge: 0,
        path: '/',
        ...(isDev ? {} : { domain: '.intjsys.com', secure: true }),
        sameSite: 'lax' as const
    };

    // 清除所有认证 Cookie
    setCookie(event, 'auth_token', '', cookieOptions);
    setCookie(event, 'refresh_token', '', { ...cookieOptions, httpOnly: true });
    setCookie(event, 'admin_token', '', cookieOptions);

    console.log('[Logout] Cookie 已清除');

    return { success: true, message: '已登出' };
});
