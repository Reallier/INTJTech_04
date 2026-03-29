import { verifyUserToken } from '~/server/utils/jwt';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token');
    if (!token) {
        throw createError({ statusCode: 401, message: '未登录' });
    }

    const payload = verifyUserToken(token) as any;
    if (!payload || !payload.id) {
        throw createError({ statusCode: 401, message: 'Token 无效' });
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { aiNewsletterSubscribed: true, email: true }
    });

    if (!user) {
        throw createError({ statusCode: 404, message: '用户不存在' });
    }

    if (!user.email) {
        throw createError({ statusCode: 400, message: '请先绑定邮箱' });
    }

    // Toggle subscription
    const newStatus = !user.aiNewsletterSubscribed;

    await prisma.user.update({
        where: { id: payload.id },
        data: { aiNewsletterSubscribed: newStatus }
    });

    console.log(`[Newsletter] User ${payload.id} ${newStatus ? 'subscribed' : 'unsubscribed'}`);

    return {
        success: true,
        subscribed: newStatus
    };
});
