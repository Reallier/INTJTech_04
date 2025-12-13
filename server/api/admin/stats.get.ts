/**
 * 管理员获取统计数据 API
 */
import { PrismaClient } from '@prisma/client';
import { verifyUserToken } from '../../utils/jwt';

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

    // 获取总用户数
    const total_users = await prisma.user.count();

    // 获取今日新增用户数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const today_new_users = await prisma.user.count({
        where: {
            createdAt: { gte: today }
        }
    });

    // 管理员数量
    const admin_count = await prisma.user.count({
        where: { role: 'admin' }
    });

    return {
        total_users,
        total_balance: 0,  // 官网暂无余额系统
        today_new_users,
        total_transactions: 0,  // 官网暂无交易系统
        admin_count
    };
});
