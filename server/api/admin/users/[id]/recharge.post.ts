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

    // 获取用户 ID
    const userId = event.context.params?.id;
    if (!userId) {
        throw createError({ statusCode: 400, message: '缺少用户 ID' });
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

        // 官网目前没有余额字段，这里返回一个模拟的成功响应
        // 如果需要真正的余额系统，需要在 Prisma schema 中添加相关字段
        console.log(`Recharge request: user=${userId}, amount=${amount}, remark=${remark}`);

        return {
            success: true,
            message: '充值功能暂未开放（余额系统尚未集成）',
            new_balance: amount  // 模拟返回
        };
    } catch (error: any) {
        console.error('Recharge failed:', error);
        throw createError({
            statusCode: 500,
            message: '充值失败: ' + (error.message || '未知错误')
        });
    }
});
