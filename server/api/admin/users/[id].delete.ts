/**
 * 管理员删除用户 API
 */
import { PrismaClient } from '@prisma/client';
import { verifyUserToken } from '../../../utils/jwt';

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

    try {
        // 查找用户
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        // 不允许删除管理员账户
        if (user.role === 'admin') {
            return { success: false, message: '不能删除管理员账户' };
        }

        // 删除用户（Prisma 会根据 schema 中的级联设置处理关联数据）
        await prisma.user.delete({
            where: { id: userId }
        });

        return {
            success: true,
            message: `用户 ${user.name || user.username} 已删除`
        };
    } catch (error: any) {
        console.error('Delete user failed:', error);
        throw createError({
            statusCode: 500,
            message: '删除用户失败: ' + (error.message || '未知错误')
        });
    }
});
