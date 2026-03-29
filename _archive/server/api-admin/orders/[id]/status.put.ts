/**
 * Admin Update Order Status API
 * PUT /api/admin/orders/:id/status
 */
import prisma from '~/server/utils/prisma';
import { logAdminAction } from '~/server/utils/auditLog';

const VALID_STATUSES = ['PENDING', 'PAID', 'CLOSED', 'REFUNDED'];

export default defineEventHandler(async (event) => {
    // Verify admin authentication
    const payload = event.context.auth;
    if (!payload || (payload.role !== 'admin' && payload.role !== 'internal')) {
        throw createError({
            statusCode: 403,
            message: 'Access denied. Admin privileges required.',
        });
    }

    const orderId = getRouterParam(event, 'id');
    if (!orderId) {
        throw createError({
            statusCode: 400,
            message: 'Order ID is required',
        });
    }

    const body = await readBody(event);
    const { status, reason } = body;

    // Validate status
    if (!status || !VALID_STATUSES.includes(status)) {
        throw createError({
            statusCode: 400,
            message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
    }

    try {
        // Find order
        const order = await prisma.paymentOrder.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw createError({
                statusCode: 404,
                message: 'Order not found',
            });
        }

        const previousStatus = order.status;

        // Update order status in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update order status
            const updatedOrder = await tx.paymentOrder.update({
                where: { id: orderId },
                data: { status },
            });

            // Create status log
            await tx.orderStatusLog.create({
                data: {
                    orderId: orderId,
                    fromStatus: previousStatus,
                    toStatus: status,
                    reason: reason || null,
                    operator: payload.username || payload.name || 'admin',
                },
            });

            return updatedOrder;
        });

        // Log audit action
        const headers = getHeaders(event);
        await logAdminAction({
            adminName: payload.username || payload.name || 'admin',
            action: 'ORDER_STATUS_CHANGE',
            targetType: 'PaymentOrder',
            targetId: orderId,
            details: {
                orderId: order.orderId,
                previousStatus,
                newStatus: status,
                reason: reason || null,
            },
            ipAddress: headers['x-forwarded-for']?.split(',')[0] || headers['x-real-ip'],
            userAgent: headers['user-agent'],
        });

        console.log(`[OrderStatus] Changed: ${orderId} from ${previousStatus} to ${status} by ${payload.username || 'admin'}`);

        return {
            success: true,
            message: `Order status updated from ${previousStatus} to ${status}`,
            order: {
                id: result.id,
                orderId: result.orderId,
                status: result.status,
            },
        };
    } catch (error: any) {
        console.error('[OrderStatus] Error:', error.message);
        if (error.statusCode) throw error;
        throw createError({
            statusCode: 500,
            message: 'Failed to update order status',
        });
    }
});
