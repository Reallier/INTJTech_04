/**
 * 获取用户登录设备列表 API
 * 
 * GET /api/admin/users/[id]/sessions
 */
import prisma from '~/server/utils/prisma';
import { verifyUserToken } from '~/server/utils/jwt';

export default defineEventHandler(async (event) => {
    // 验证管理员 Token
    const adminToken = getCookie(event, 'admin_token');
    if (!adminToken) {
        throw createError({ statusCode: 401, message: '需要管理员登录' });
    }

    const payload = verifyUserToken(adminToken) as any;
    if (!payload) {
        throw createError({ statusCode: 401, message: '无效的 Token' });
    }

    // 获取用户 ID
    const userIdParam = event.context.params?.id;
    if (!userIdParam) {
        throw createError({ statusCode: 400, message: '缺少用户 ID' });
    }
    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
        throw createError({ statusCode: 400, message: '无效的用户 ID' });
    }

    // 获取用户登录设备
    const sessions = await prisma.refreshToken.findMany({
        where: { userId },
        select: {
            id: true,
            userAgent: true,
            createdAt: true,
            expiresAt: true
        },
        orderBy: { createdAt: 'desc' }
    });

    // 解析 User-Agent
    const formattedSessions = sessions.map(s => {
        let device = '未知设备';
        const ua = s.userAgent || '';

        if (ua.includes('iPhone')) device = 'iPhone';
        else if (ua.includes('iPad')) device = 'iPad';
        else if (ua.includes('Android')) device = 'Android';
        else if (ua.includes('Windows')) device = 'Windows';
        else if (ua.includes('Mac')) device = 'Mac';
        else if (ua.includes('Linux')) device = 'Linux';

        return {
            id: s.id,
            device,
            userAgent: ua.slice(0, 100),
            createdAt: s.createdAt,
            expiresAt: s.expiresAt,
            isExpired: s.expiresAt < new Date()
        };
    });

    return {
        success: true,
        sessions: formattedSessions,
        total: sessions.length
    };
});
