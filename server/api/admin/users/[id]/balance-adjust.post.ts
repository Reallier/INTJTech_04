/**
 * Admin Balance Adjustment API
 * POST /api/admin/users/:id/balance-adjust
 */
import prisma from '~/server/utils/prisma';
import { logAdminAction, AuditActions } from '~/server/utils/auditLog';

export default defineEventHandler(async (event) => {
    // Verify admin authentication
    const payload = event.context.auth;
    if (!payload || (payload.role !== 'admin' && payload.role !== 'internal')) {
        throw createError({
            statusCode: 403,
            message: 'Access denied. Admin privileges required.',
        });
    }

    const userId = parseInt(getRouterParam(event, 'id') || '');
    if (isNaN(userId)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid user ID',
        });
    }

    const body = await readBody(event);
    const { amount, type, reason } = body;

    // Validate input
    if (typeof amount !== 'number' || amount === 0) {
        throw createError({
            statusCode: 400,
            message: 'Amount must be a non-zero number',
        });
    }

    const validTypes = ['COMPENSATION', 'DEDUCTION', 'PROMOTION', 'REFUND'];
    if (!type || !validTypes.includes(type)) {
        throw createError({
            statusCode: 400,
            message: `Type must be one of: ${validTypes.join(', ')}`,
        });
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
        throw createError({
            statusCode: 400,
            message: 'Reason is required',
        });
    }

    // Find user
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, phone: true, balance: true },
    });

    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found',
        });
    }

    const currentBalance = Number(user.balance);
    const adjustmentAmount = Number(amount);

    // Prevent negative balance for deductions
    if (adjustmentAmount < 0 && currentBalance + adjustmentAmount < 0) {
        throw createError({
            statusCode: 400,
            message: `Insufficient balance. Current: ¥${currentBalance.toFixed(2)}, Attempted deduction: ¥${Math.abs(adjustmentAmount).toFixed(2)}`,
        });
    }

    try {
        // Execute adjustment in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create adjustment record
            const adjustment = await tx.balanceAdjustment.create({
                data: {
                    userId,
                    amount: adjustmentAmount,
                    type,
                    reason: reason.trim(),
                    operatorName: payload.username || payload.name || 'admin',
                },
            });

            // Update user balance
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    balance: {
                        increment: adjustmentAmount,
                    },
                },
                select: { balance: true },
            });

            return { adjustment, newBalance: updatedUser.balance };
        });

        // Log audit action
        const headers = getHeaders(event);
        await logAdminAction({
            adminName: payload.username || payload.name || 'admin',
            action: 'BALANCE_ADJUST',
            targetType: 'User',
            targetId: userId.toString(),
            details: {
                adjustmentId: result.adjustment.id,
                type,
                amount: adjustmentAmount,
                reason: reason.trim(),
                previousBalance: currentBalance,
                newBalance: Number(result.newBalance),
            },
            ipAddress: headers['x-forwarded-for']?.split(',')[0] || headers['x-real-ip'],
            userAgent: headers['user-agent'],
        });

        console.log(`[BalanceAdjust] Success: userId=${userId}, type=${type}, amount=${adjustmentAmount}, newBalance=${result.newBalance}`);

        return {
            success: true,
            message: adjustmentAmount > 0
                ? `Successfully added ¥${adjustmentAmount.toFixed(2)} to user balance`
                : `Successfully deducted ¥${Math.abs(adjustmentAmount).toFixed(2)} from user balance`,
            adjustment: {
                id: result.adjustment.id,
                amount: adjustmentAmount,
                type,
                newBalance: Number(result.newBalance),
            },
        };
    } catch (error: any) {
        console.error(`[BalanceAdjust] Failed: ${error.message}`);
        throw createError({
            statusCode: 500,
            message: 'Failed to adjust balance',
        });
    }
});
