/**
 * 管理员操作审计日志工具
 */
import prisma from './prisma';

export interface AuditLogParams {
    adminName: string;
    action: string;
    targetType: string;
    targetId: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}

/**
 * 记录管理员操作日志
 */
export async function logAdminAction(params: AuditLogParams): Promise<void> {
    try {
        await prisma.adminAuditLog.create({
            data: {
                adminName: params.adminName,
                action: params.action,
                targetType: params.targetType,
                targetId: params.targetId,
                details: params.details ? JSON.stringify(params.details) : null,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
            },
        });
        console.log(`[Audit] ${params.action}: ${params.targetType}/${params.targetId} by ${params.adminName}`);
    } catch (error) {
        // 审计日志失败不应影响业务
        console.error('[Audit] Failed to log action:', error);
    }
}

/**
 * 操作类型常量
 */
export const AuditActions = {
    REFUND_APPROVE: 'REFUND_APPROVE',
    REFUND_REJECT: 'REFUND_REJECT',
    USER_UPDATE: 'USER_UPDATE',
    USER_CREATE: 'USER_CREATE',
    USER_DELETE: 'USER_DELETE',
    SERVICE_UPDATE: 'SERVICE_UPDATE',
    LICENSE_CREATE: 'LICENSE_CREATE',
} as const;
