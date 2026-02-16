/**
 * 踢下线（删除登录设备）API
 * 
 * DELETE /api/admin/sessions/[id]
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

    // 获取 Session ID
    const sessionId = event.context.params?.id;
    if (!sessionId) {
        throw createError({ statusCode: 400, message: '缺少 Session ID' });
    }

    // 查找并删除
    try {
        const session = await prisma.refreshToken.findUnique({
            where: { id: sessionId },
            include: { user: { select: { id: true, name: true } } }
        });

        if (!session) {
            return { success: false, message: '设备不存在' };
        }

        await prisma.refreshToken.delete({ where: { id: sessionId } });

        console.log(`[Admin] 踢下线: 用户 ${session.user.id} 设备 ${sessionId}`);

        return {
            success: true,
            message: '设备已下线'
        };
    } catch (error: any) {
        console.error('Delete session failed:', error);
        throw createError({
            statusCode: 500,
            message: '操作失败: ' + (error.message || '未知错误')
        });
    }
});
