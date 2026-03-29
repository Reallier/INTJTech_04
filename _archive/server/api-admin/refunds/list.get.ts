/**
 * 管理员获取退款申请列表
 * GET /api/admin/refunds/list
 */
import { PrismaClient } from '@prisma/client';
import { verifyUserToken } from '../../../utils/jwt';

const prisma = new PrismaClient();

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

    // 获取查询参数
    const query = getQuery(event);
    const status = query.status as string || undefined;

    // 查询退款申请
    const refunds = await prisma.refundRequest.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 100,
    });

    // 获取用户信息
    const userIds = [...new Set(refunds.map(r => r.userId))];
    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, username: true, email: true, phone: true },
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    return refunds.map(r => ({
        id: r.id,
        userId: r.userId,
        user: userMap.get(r.userId),
        amount: Number(r.amount),
        reason: r.reason,
        status: r.status,
        createdAt: r.createdAt,
        processedAt: r.processedAt,
        processedBy: r.processedBy,
    }));
});
