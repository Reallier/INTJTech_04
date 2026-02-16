/**
 * Admin Orders List API
 * GET /api/admin/orders
 */
import prisma from '~/server/utils/prisma';
import { verifyAdminAuth } from '../../utils/adminAuth';

export default defineEventHandler(async (event) => {
    console.log('[AdminOrders] API called');

    // 验证管理员认证（支持 cookie 和 Authorization header）
    const payload = verifyAdminAuth(event);
    console.log('[AdminOrders] Auth payload:', { role: payload.role });

    const query = getQuery(event);
    const page = parseInt(query.page as string) || 0;
    const pageSize = parseInt(query.pageSize as string) || 20;
    const status = query.status as string || undefined;
    const search = query.search as string || undefined;

    // Build where clause
    const where: any = {};

    if (status && status !== 'ALL') {
        where.status = status;
    }

    // Search by order ID or user info
    if (search) {
        where.OR = [
            { orderId: { contains: search, mode: 'insensitive' } },
            { tradeNo: { contains: search, mode: 'insensitive' } },
        ];
    }

    try {
        // Get orders with user info
        const orders = await prisma.paymentOrder.findMany({
            where,
            include: {
                statusLogs: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: page * pageSize,
            take: pageSize,
        });

        // Get user info for orders
        const userIds = [...new Set(orders.map(o => o.userId))];
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, username: true, email: true, phone: true, name: true },
        });
        const userMap = new Map(users.map(u => [u.id, u]));

        // Get total count
        const totalCount = await prisma.paymentOrder.count({ where });

        // Format response
        const formattedOrders = orders.map(order => ({
            id: order.id,
            orderId: order.orderId,
            userId: order.userId,
            user: userMap.get(order.userId) || null,
            amount: parseFloat(order.amount.toString()),
            refundedAmount: parseFloat(order.refundedAmount.toString()),
            tradeNo: order.tradeNo,
            status: order.status,
            createdAt: order.createdAt,
            paidAt: order.paidAt,
            lastStatusChange: order.statusLogs[0] || null,
        }));

        return {
            success: true,
            orders: formattedOrders,
            pagination: {
                page,
                pageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            },
        };
    } catch (error: any) {
        console.error('[AdminOrders] Error:', error.message);
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch orders',
        });
    }
});
