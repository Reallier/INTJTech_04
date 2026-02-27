/**
 * 查询支付订单状态 API
 * GET /api/payment/status?orderId=xxx
 * 
 * 注：回调页面查询时可能没有登录态，所以只验证订单号
 * 订单号本身是随机生成的，不易被猜测
 */
import { PrismaClient } from '@prisma/client';
import { queryOrderStatus } from '../../utils/alipay';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    // 获取订单号
    const query = getQuery(event);
    const orderId = query.orderId as string;

    if (!orderId) {
        throw createError({ statusCode: 400, message: '缺少订单号' });
    }

    // 查询本地订单
    const order = await prisma.paymentOrder.findUnique({
        where: { orderId },
        select: {
            orderId: true,
            userId: true,
            amount: true,
            status: true,
            createdAt: true,
            paidAt: true,
        },
    });

    if (!order) {
        throw createError({ statusCode: 404, message: '订单不存在' });
    }

    // 如果本地状态是 PENDING，尝试从支付宝查询最新状态
    if (order.status === 'PENDING') {
        try {
            const alipayStatus = await queryOrderStatus(orderId);

            if (alipayStatus.tradeStatus === 'TRADE_SUCCESS') {
                // 更新本地订单状态
                await prisma.paymentOrder.update({
                    where: { orderId },
                    data: {
                        status: 'PAID',
                        paidAt: new Date(),
                        tradeNo: alipayStatus.tradeNo,
                    },
                });

                // 更新用户余额
                await prisma.user.update({
                    where: { id: order.userId },
                    data: {
                        balance: {
                            increment: Number(order.amount),
                        },
                    },
                });

                console.log(`[Payment] Order paid via query: ${orderId}, amount: ${order.amount}`);

                return {
                    orderId: order.orderId,
                    amount: Number(order.amount),
                    status: 'PAID',
                    createdAt: order.createdAt,
                    paidAt: new Date(),
                };
            }
        } catch (error) {
            console.error('[Payment] Query alipay status failed:', error);
        }
    }

    return {
        orderId: order.orderId,
        amount: Number(order.amount),
        status: order.status,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
    };
});
