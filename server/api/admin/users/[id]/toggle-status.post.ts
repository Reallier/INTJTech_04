/**
 * 禁用/启用用户 API
 * 
 * POST /api/admin/users/[id]/toggle-status
 */
import prisma from '~/server/utils/prisma';
import { verifyUserToken } from '~/server/utils/jwt';

export default defineEventHandler(async (event) => {
    // 验证管理员 Token
    const adminToken = getCookie(event, 'admin_token');
    if (!adminToken) {
        throw createError({ statusCode: 401, message: '需要管理员登录' });
    }

    const payload = verifyUserToken(adminToken) as any;
    if (!payload) {
        throw createError({ statusCode: 401, message: '无效的 Token' });
    }

    // 获取用户 ID
    const userIdParam = event.context.params?.id;
    if (!userIdParam) {
        throw createError({ statusCode: 400, message: '缺少用户 ID' });
    }
    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
        throw createError({ statusCode: 400, message: '无效的用户 ID' });
    }

    // 查找用户
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return { success: false, message: '用户不存在' };
    }

    // 不能操作管理员
    if (user.role === 'admin' || user.role === 'super_admin') {
        return { success: false, message: '不能禁用管理员账户' };
    }

    // 切换状态
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    await prisma.user.update({
        where: { id: userId },
        data: { status: newStatus }
    });

    // 如果是禁用，清除所有登录设备
    if (newStatus === 'disabled') {
        await prisma.refreshToken.deleteMany({ where: { userId } });
    }

    console.log(`[Admin] 用户 ${userId} 状态变更: ${user.status} -> ${newStatus}`);

    return {
        success: true,
        message: newStatus === 'active' ? '用户已启用' : '用户已禁用',
        status: newStatus
    };
});
