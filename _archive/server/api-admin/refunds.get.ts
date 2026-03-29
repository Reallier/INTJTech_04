/**
 * 管理后台 - 获取退款申请列表
 * GET /api/admin/refunds
 */
import prisma from '../../utils/prisma';
import { verifyAdminAuth } from '../../utils/adminAuth';

export default defineEventHandler(async (event) => {
    // 验证管理员权限
    verifyAdminAuth(event);

    // 获取所有退款申请，包含用户和订单信息
    const refunds = await prisma.refundRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            paymentOrder: {
                select: {
                    orderId: true,
                    amount: true,
                    refundedAmount: true,
                    paidAt: true,
                    tradeNo: true,
                },
            },
        },
    });

    return {
        success: true,
        refunds,
    };
});
