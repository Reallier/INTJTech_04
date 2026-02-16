/**
 * 管理员批准退款
 * POST /api/admin/refunds/[id]/approve
 * 
 * 风控措施：
 * 1. 验证管理员身份
 * 2. 检查用户余额是否足够（防止扣成负数）
 * 3. 使用行锁防止并发问题
 * 4. 原子事务保证一致性
 */
import prisma from '../../../../utils/prisma';
import { verifyUserToken } from '../../../../utils/jwt';
import { refundPayment } from '../../../../utils/alipay';
import { logAdminAction, AuditActions } from '../../../../utils/auditLog';

export default defineEventHandler(async (event) => {
    // 1. 验证管理员 Token
    const adminToken = getCookie(event, 'admin_token');
    if (!adminToken) {
        throw createError({ statusCode: 401, message: '需要管理员登录' });
    }

    const payload = verifyUserToken(adminToken) as any;
    if (!payload) {
        throw createError({ statusCode: 401, message: '无效的 Token' });
    }

    // 2. 获取退款申请 ID
    const refundId = event.context.params?.id;
    if (!refundId) {
        throw createError({ statusCode: 400, message: '缺少退款申请 ID' });
    }

    // 3. 查询退款申请（包含关联订单和用户）
    const refund = await prisma.refundRequest.findUnique({
        where: { id: refundId },
        include: {
            paymentOrder: true,
            user: true,
        },
    });

    if (!refund) {
        throw createError({ statusCode: 404, message: '退款申请不存在' });
    }

    if (refund.status !== 'PENDING') {
        throw createError({ statusCode: 400, message: '该退款申请已处理' });
    }

    const order = refund.paymentOrder;
    if (!order || !order.tradeNo) {
        throw createError({ statusCode: 400, message: '关联订单无效或缺少支付宝交易号' });
    }

    const refundAmount = Number(refund.amount);

    // 4. 【风控】检查用户余额是否足够
    const userBalance = Number(refund.user.balance);
    if (userBalance < refundAmount) {
        throw createError({
            statusCode: 400,
            message: `用户余额不足，当前 ¥${userBalance.toFixed(2)}，无法退款 ¥${refundAmount.toFixed(2)}`
        });
    }

    // 5. 【风控】再次检查订单可退金额
    const orderAmount = Number(order.amount);
    const alreadyRefunded = Number(order.refundedAmount);
    const refundable = orderAmount - alreadyRefunded;

    if (refundAmount > refundable) {
        throw createError({
            statusCode: 400,
            message: `可退金额不足，当前可退 ¥${refundable.toFixed(2)}`
        });
    }

    // 6. 使用事务 + 行锁执行退款
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 【风控】使用 FOR UPDATE 锁定订单行，防止并发
            await tx.$executeRaw`SELECT id FROM payment_orders WHERE id = ${order.id} FOR UPDATE`;

            // 再次验证订单状态（双重检查）
            const lockedOrder = await tx.paymentOrder.findUnique({
                where: { id: order.id },
            });

            if (!lockedOrder) {
                throw new Error('订单不存在');
            }

            const currentRefunded = Number(lockedOrder.refundedAmount);
            const currentRefundable = orderAmount - currentRefunded;

            if (refundAmount > currentRefundable) {
                throw new Error(`可退金额不足，当前可退 ¥${currentRefundable.toFixed(2)}`);
            }

            // 【风控】锁定用户行，检查余额
            await tx.$executeRaw`SELECT id FROM users WHERE id = ${refund.userId} FOR UPDATE`;

            const lockedUser = await tx.user.findUnique({
                where: { id: refund.userId },
            });

            if (!lockedUser) {
                throw new Error('用户不存在');
            }

            const currentBalance = Number(lockedUser.balance);
            if (currentBalance < refundAmount) {
                throw new Error(`用户余额不足，当前 ¥${currentBalance.toFixed(2)}`);
            }

            // 调用支付宝退款 API
            console.log(`[Refund] Calling Alipay: tradeNo=${order.tradeNo}, amount=${refundAmount}, requestNo=${refundId}`);

            const refundResult = await refundPayment(
                order.tradeNo!,
                refundAmount,
                refundId
            );

            if (!refundResult.success) {
                throw new Error(`支付宝退款失败: ${refundResult.message}`);
            }

            // 更新退款申请状态
            await tx.refundRequest.update({
                where: { id: refundId },
                data: {
                    status: 'APPROVED',
                    tradeNo: refundResult.refundTradeNo,
                    processedAt: new Date(),
                    processedBy: payload.username || payload.name || 'admin',
                },
            });

            // 更新订单已退款金额
            await tx.paymentOrder.update({
                where: { id: order.id },
                data: {
                    refundedAmount: {
                        increment: refundAmount,
                    },
                },
            });

            // 扣减用户余额
            await tx.user.update({
                where: { id: refund.userId },
                data: {
                    balance: {
                        decrement: refundAmount,
                    },
                },
            });

            console.log(`[Refund] Success: refundId=${refundId}, orderId=${order.orderId}, userId=${refund.userId}, amount=${refundAmount}`);

            return { success: true };
        }, {
            timeout: 30000,  // 30 秒超时
        });

        // 记录审计日志
        const headers = getHeaders(event);
        await logAdminAction({
            adminName: payload.username || payload.name || 'admin',
            action: AuditActions.REFUND_APPROVE,
            targetType: 'RefundRequest',
            targetId: refundId,
            details: {
                orderId: order.orderId,
                userId: refund.userId,
                amount: refundAmount,
            },
            ipAddress: headers['x-forwarded-for']?.split(',')[0] || headers['x-real-ip'],
            userAgent: headers['user-agent'],
        });

        return {
            success: true,
            message: `退款成功！¥${refundAmount.toFixed(2)} 已退回用户支付宝账户`
        };
    } catch (error: any) {
        console.error(`[Refund] Failed: ${error.message}`);
        throw createError({
            statusCode: 500,
            message: error.message || '退款处理失败'
        });
    }
});
