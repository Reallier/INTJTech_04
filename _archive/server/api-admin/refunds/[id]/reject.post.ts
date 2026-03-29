/**
 * 管理员拒绝退款
 * POST /api/admin/refunds/[id]/reject
 */
import { PrismaClient } from '@prisma/client';
import { verifyUserToken } from '../../../../utils/jwt';

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

    // 获取退款申请 ID
    const refundId = event.context.params?.id;
    if (!refundId) {
        throw createError({ statusCode: 400, message: '缺少退款申请 ID' });
    }

    // 查询退款申请
    const refund = await prisma.refundRequest.findUnique({
        where: { id: refundId },
    });

    if (!refund) {
        throw createError({ statusCode: 404, message: '退款申请不存在' });
    }

    if (refund.status !== 'PENDING') {
        throw createError({ statusCode: 400, message: '该退款申请已处理' });
    }

    // 拒绝退款
    await prisma.refundRequest.update({
        where: { id: refundId },
        data: {
            status: 'REJECTED',
            processedAt: new Date(),
            processedBy: payload.username || 'admin',
        },
    });

    console.log(`[Refund] Rejected: id=${refundId}, by=${payload.username || 'admin'}`);

    return { success: true, message: '已拒绝退款申请' };
});
