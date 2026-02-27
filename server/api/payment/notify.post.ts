/**
 * 支付宝异步通知回调 API
 * POST /api/payment/notify
 * 
 * 注意：此接口由支付宝服务器调用，不验证用户 Token
 */
import prisma from '../../utils/prisma';
import { verifyNotifySignature } from '../../utils/alipay';

export default defineEventHandler(async (event) => {
    // 1. 获取通知参数
    const params = await readBody(event);

    console.log('[AlipayNotify] Received:', JSON.stringify(params));

    // 2. 验证签名
    if (!verifyNotifySignature(params)) {
        console.error('[AlipayNotify] 签名验证失败');
        return 'fail';
    }

    // 3. 提取关键参数
    const {
        out_trade_no: orderId,      // 业务订单号
        trade_no: tradeNo,          // 支付宝交易号
        trade_status: tradeStatus,  // 交易状态
        total_amount: totalAmount,  // 交易金额
    } = params;

    // 4. 只处理支付成功的通知
    if (tradeStatus !== 'TRADE_SUCCESS' && tradeStatus !== 'TRADE_FINISHED') {
        console.log(`[AlipayNotify] 忽略非成功状态: ${tradeStatus}`);
        return 'success';
    }

    try {
        // 5. 查询订单
        const order = await prisma.paymentOrder.findUnique({
            where: { orderId },
        });

        if (!order) {
            console.error(`[AlipayNotify] 订单不存在: ${orderId}`);
            return 'fail';
        }

        // 6. 防重复处理
        if (order.status === 'PAID') {
            console.log(`[AlipayNotify] 订单已处理: ${orderId}`);
            return 'success';
        }

        // 7. 验证金额
        const notifyAmount = parseFloat(totalAmount);
        const orderAmount = Number(order.amount);
        if (Math.abs(notifyAmount - orderAmount) > 0.01) {
            console.error(`[AlipayNotify] 金额不匹配: 通知=${notifyAmount}, 订单=${orderAmount}`);
            return 'fail';
        }

        // 8. 原子事务：更新订单 + 增加用户余额
        await prisma.$transaction(async (tx) => {
            // 更新订单状态
            await tx.paymentOrder.update({
                where: { orderId },
                data: {
                    status: 'PAID',
                    tradeNo,
                    paidAt: new Date(),
                },
            });

            // 增加用户余额（1:1 充值）
            const user = await tx.user.findUnique({
                where: { id: order.userId },
            });

            if (!user) {
                throw new Error('用户不存在');
            }

            const newBalance = Number(user.balance) + Number(order.amount);
            await tx.user.update({
                where: { id: order.userId },
                data: { balance: newBalance },
            });

            console.log(`[AlipayNotify] 充值成功: orderId=${orderId}, userId=${order.userId}, amount=${order.amount}, newBalance=${newBalance}`);
        });

        return 'success';
    } catch (error: any) {
        console.error('[AlipayNotify] 处理失败:', error);
        return 'fail';
    }
});
