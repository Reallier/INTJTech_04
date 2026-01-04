/**
 * 管理员获取用户列表 API
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

    // 获取查询参数
    const query = getQuery(event);
    const skip = parseInt(query.skip as string) || 0;
    const limit = parseInt(query.limit as string) || 20;
    const search = query.search as string || '';

    // 构建查询条件
    const where: any = {};
    if (search) {
        where.OR = [
            { username: { contains: search } },
            { name: { contains: search } },
            { email: { contains: search } }
        ];
    }

    // 查询用户列表
    const users = await prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            balance: true,
            freeQuota: true,
            createdAt: true,
            updatedAt: true
        }
    });

    // 格式化返回数据
    const formattedUsers = users.map(user => {
        const balance = Number(user.balance) || 0;
        const freeQuota = Number(user.freeQuota) || 0;
        return {
            user_id: user.id,
            username: user.username,
            nickname: user.name,
            email: user.email,
            role: user.role,
            balance: balance,
            free_quota: freeQuota,
            total_available: balance + freeQuota,
            created_at: user.createdAt
        };
    });

    return {
        users: formattedUsers,
        total: await prisma.user.count({ where })
    };
});
