/**
 * 管理员用户充值 API
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

    // 验证是否为管理员
    const payload = verifyUserToken(adminToken) as any;
    if (!payload) {
        throw createError({ statusCode: 401, message: '无效的 Token' });
    }

    // 获取用户 ID 并转换为整数
    const userIdParam = event.context.params?.id;
    if (!userIdParam) {
        throw createError({ statusCode: 400, message: '缺少用户 ID' });
    }
    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
        throw createError({ statusCode: 400, message: '无效的用户 ID' });
    }

    // 获取充值信息
    const body = await readBody(event);
    const { amount, remark } = body;

    if (!amount || amount <= 0) {
        throw createError({ statusCode: 400, message: '充值金额必须大于 0' });
    }

    try {
        // 查找用户
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        // 计算新余额
        const currentBalance = Number(user.balance) || 0;
        const newBalance = currentBalance + Number(amount);

        // 更新用户余额
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { balance: newBalance }
        });

        console.log(`Recharge success: user=${userId}, amount=${amount}, remark=${remark}, new_balance=${newBalance}`);

        return {
            success: true,
            message: '充值成功',
            new_balance: Number(updatedUser.balance)
        };
    } catch (error: any) {
        console.error('Recharge failed:', error);
        throw createError({
            statusCode: 500,
            message: '充值失败: ' + (error.message || '未知错误')
        });
    }
});
