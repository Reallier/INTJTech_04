/**
 * 管理员更新服务配置 API
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

    const payload = verifyUserToken(adminToken) as any;
    if (!payload) {
        throw createError({ statusCode: 401, message: '无效的 Token' });
    }

    const body = await readBody(event);
    const { serviceId, visible, sortOrder } = body;

    if (!serviceId) {
        throw createError({ statusCode: 400, message: '缺少服务ID' });
    }

    // 构建更新数据
    const updateData: any = {};
    if (typeof visible === 'boolean') {
        updateData.visible = visible;
    }
    if (typeof sortOrder === 'number') {
        updateData.sortOrder = sortOrder;
    }

    if (Object.keys(updateData).length === 0) {
        throw createError({ statusCode: 400, message: '没有要更新的数据' });
    }

    // 更新服务配置
    const service = await prisma.serviceConfig.update({
        where: { serviceId },
        data: updateData
    });

    return { success: true, service };
});
