/**
 * 管理员获取统计数据 API
 */
import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth } from '../../utils/adminAuth';

const prisma = new PrismaClient();

// App02 客服系统地址
const APP02_URL = process.env.APP02_URL || 'http://localhost:8000';

export default defineEventHandler(async (event) => {
    // 验证管理员 Token（支持 cookie 和 Authorization header）
    verifyAdminAuth(event);

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

    // 获取 App02 (Closer 智能客服) 用量统计
    let app02_usage = null;
    try {
        const response = await $fetch(`${APP02_URL}/api/usage/stats`, {
            timeout: 5000,
        });
        app02_usage = response;
    } catch (error) {
        console.warn('无法获取 App02 用量统计:', error);
        app02_usage = { error: '服务不可用' };
    }

    return {
        total_users,
        total_balance: 0,  // 官网暂无余额系统
        today_new_users,
        total_transactions: 0,  // 官网暂无交易系统
        admin_count,
        // 服务用量统计
        service_usage: {
            app02_closer: app02_usage,
        }
    };
});

