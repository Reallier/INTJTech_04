/**
 * 创建支付订单 API
 * POST /api/payment/create
 * 1:1 金额充值（充多少到账多少）
 * 使用电脑网站支付（跳转支付宝网页）
 */
import prisma from '../../utils/prisma';
import { verifyUserToken } from '../../utils/jwt';
import { createPagePayOrder } from '../../utils/alipay';

// 充值套餐配置（1:1 金额）
const RECHARGE_PACKAGES = [
    { amount: 10, label: '10元' },
    { amount: 50, label: '50元' },
    { amount: 100, label: '100元' },
];

// 生成订单号
function generateOrderId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY-${timestamp}-${random}`;
}

export default defineEventHandler(async (event) => {
    // 1. 验证用户登录
    const authToken = getCookie(event, 'auth_token');
    if (!authToken) {
        throw createError({ statusCode: 401, message: '请先登录' });
    }

    const payload = verifyUserToken(authToken) as any;
    if (!payload || !payload.id) {
        throw createError({ statusCode: 401, message: '登录已过期，请重新登录' });
    }
    const userId = payload.id;

    // 2. 获取请求参数
    const body = await readBody(event);
    const { packageIndex, customAmount } = body;

    let amount: number;
    let subject: string;

    // 3. 校验充值套餐
    if (typeof packageIndex === 'number' && packageIndex >= 0 && packageIndex < RECHARGE_PACKAGES.length) {
        const pkg = RECHARGE_PACKAGES[packageIndex];
        amount = pkg.amount;
        subject = `INTJsys 充值 - ${pkg.label}`;
    } else if (typeof customAmount === 'number' && customAmount >= 1 && customAmount <= 10000) {
        amount = Math.floor(customAmount * 100) / 100;
        subject = `INTJsys 充值 - ${amount}元`;
    } else {
        throw createError({ statusCode: 400, message: '请选择有效的充值套餐或输入有效金额（1-10000元）' });
    }

    // 4. 创建订单记录
    const orderId = generateOrderId();

    try {
        await prisma.paymentOrder.create({
            data: {
                orderId,
                userId,
                amount,
                status: 'PENDING',
            },
        });

        // 5. 调用支付宝电脑网站支付，获取跳转 URL
        const { payUrl } = await createPagePayOrder(orderId, amount, subject);

        console.log(`[Payment] Created order: ${orderId}, user: ${userId}, amount: ${amount}`);

        return {
            success: true,
            orderId,
            payUrl,  // 返回支付跳转链接
            amount,
        };
    } catch (error: any) {
        console.error('[Payment] Create order failed:', error);
        await prisma.paymentOrder.deleteMany({ where: { orderId } }).catch(() => { });

        throw createError({
            statusCode: 500,
            message: '创建订单失败：' + (error.message || '未知错误'),
        });
    }
});
