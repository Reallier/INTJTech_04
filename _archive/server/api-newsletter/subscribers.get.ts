import prisma from '~/server/utils/prisma';

/**
 * 内部接口：返回所有 AI 简报订阅者的邮箱列表
 * 鉴权方式：Bearer Token（使用环境变量 NEWSLETTER_API_KEY）
 * 
 * 供 TrendRadar 推送脚本调用
 */
export default defineEventHandler(async (event) => {
    const apiKey = process.env.NEWSLETTER_API_KEY || process.env.JWT_SECRET;

    const authHeader = getHeader(event, 'authorization');
    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
        throw createError({ statusCode: 403, message: 'Forbidden' });
    }

    const subscribers = await prisma.user.findMany({
        where: {
            aiNewsletterSubscribed: true,
            email: { not: null },
            status: 'active'
        },
        select: {
            id: true,
            email: true,
            name: true
        }
    });

    return {
        success: true,
        count: subscribers.length,
        subscribers: subscribers.map(s => ({
            email: s.email,
            name: s.name
        }))
    };
});
