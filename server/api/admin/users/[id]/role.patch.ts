/**
 * 更新用户角色 API
 * 
 * PATCH /api/admin/users/[id]/role
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

    // 获取请求体
    const body = await readBody(event);
    const { role } = body;

    // 验证角色值
    const validRoles = ['user', 'internal', 'admin'];
    if (!validRoles.includes(role)) {
        return { success: false, message: '无效的角色值' };
    }

    // 查找用户
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return { success: false, message: '用户不存在' };
    }

    // 更新角色
    await prisma.user.update({
        where: { id: userId },
        data: { role }
    });

    console.log(`[Admin] 用户 ${userId} 角色变更: ${user.role} -> ${role}`);

    return {
        success: true,
        message: `用户角色已更新为 ${role === 'admin' ? '管理员' : role === 'internal' ? '内部用户' : '普通用户'}`,
        role
    };
});
