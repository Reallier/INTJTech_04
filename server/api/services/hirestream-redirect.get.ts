/**
 * HireStream 服务跳转 API (TalentAI)
 * 
 * 为已登录用户生成带 JWT token 的跳转链接
 * 跳转到 talentai.reallier.top:5443（智能招聘匹配系统）
 */
import { verifyUserToken, signUserToken } from '~/server/utils/jwt';
import prisma from '~/server/utils/prisma';

const HIRESTREAM_URL = process.env.HIRESTREAM_URL || 'https://talentai.reallier.top:5443';

export default defineEventHandler(async (event) => {
    // 1. 验证用户身份
    const token = getCookie(event, 'auth_token');

    if (!token) {
        // 未登录，重定向到登录页
        return sendRedirect(event, '/login?redirect=hirestream');
    }

    const payload = verifyUserToken(token) as any;
    if (!payload || !payload.id) {
        // Token 无效，清除 cookie 并重定向到登录页
        setCookie(event, 'auth_token', '', { maxAge: 0 });
        return sendRedirect(event, '/login?redirect=hirestream');
    }

    // 2. 获取完整用户信息
    const user = await prisma.user.findUnique({
        where: { id: payload.id }
    });

    if (!user) {
        return sendRedirect(event, '/login?redirect=hirestream');
    }

    // 3. 生成新的 token（包含完整的用户信息供 hirestream 使用）
    const newToken = signUserToken(user);

    // 4. 重定向到 HireStream 服务，携带 token
    const redirectUrl = `${HIRESTREAM_URL}?token=${encodeURIComponent(newToken)}`;

    console.log(`[HireStream Redirect] User ${user.id} redirecting to HireStream`);

    return sendRedirect(event, redirectUrl);
});
