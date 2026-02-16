/**
 * Admin Password Change API
 * PUT /api/admin/users/:id/password
 */
import bcrypt from 'bcryptjs';
import prisma from '~/server/utils/prisma';
import { logAdminAction } from '~/server/utils/auditLog';

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
    const { password } = body;

    // Validate password
    if (!password || typeof password !== 'string') {
        throw createError({
            statusCode: 400,
            message: 'Password is required',
        });
    }

    if (password.length < 8) {
        throw createError({
            statusCode: 400,
            message: 'Password must be at least 8 characters',
        });
    }

    // Find user
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, email: true, phone: true },
    });

    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found',
        });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        // Log audit action
        const headers = getHeaders(event);
        await logAdminAction({
            adminName: payload.username || payload.name || 'admin',
            action: 'PASSWORD_CHANGE',
            targetType: 'User',
            targetId: userId.toString(),
            details: {
                targetUsername: user.username,
                targetEmail: user.email,
            },
            ipAddress: headers['x-forwarded-for']?.split(',')[0] || headers['x-real-ip'],
            userAgent: headers['user-agent'],
        });

        console.log(`[PasswordChange] Success: userId=${userId}, by=${payload.username || 'admin'}`);

        return {
            success: true,
            message: 'Password changed successfully',
        };
    } catch (error: any) {
        console.error(`[PasswordChange] Failed: ${error.message}`);
        throw createError({
            statusCode: 500,
            message: 'Failed to change password',
        });
    }
});
