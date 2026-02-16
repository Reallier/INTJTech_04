/**
 * 资源监控服务跳转 API
 * 
 * 为已登录用户生成带 JWT token 的跳转链接
 * 跳转到 monitor.reallier.top（资源监控服务）
 */
import { verifyUserToken, signUserToken } from '~/server/utils/jwt';
import prisma from '~/server/utils/prisma';

const MONITOR_URL = process.env.MONITOR_URL || 'https://monitor.reallier.top:6443';

export default defineEventHandler(async (event) => {
    // 1. 验证用户身份
    const token = getCookie(event, 'auth_token');

    if (!token) {
        // 未登录，重定向到登录页
        return sendRedirect(event, '/login?redirect=monitor');
    }

    const payload = verifyUserToken(token) as any;
    if (!payload || !payload.id) {
        // Token 无效，清除 cookie 并重定向到登录页
        setCookie(event, 'auth_token', '', { maxAge: 0 });
        return sendRedirect(event, '/login?redirect=monitor');
    }

    // 2. 获取完整用户信息
    const user = await prisma.user.findUnique({
        where: { id: payload.id }
    });

    if (!user) {
        return sendRedirect(event, '/login?redirect=monitor');
    }

    // 3. 生成新的 token（包含完整的用户信息供资源监控服务使用）
    const newToken = signUserToken(user);

    // 4. 重定向到资源监控服务，携带 token
    const redirectUrl = `${MONITOR_URL}?token=${encodeURIComponent(newToken)}`;

    console.log(`[Monitor Redirect] User ${user.id} redirecting to Resource Monitor`);

    return sendRedirect(event, redirectUrl);
});
