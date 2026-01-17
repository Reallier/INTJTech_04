/**
 * 管理员认证辅助函数
 * 支持从 cookie 或 Authorization header 获取 token
 */
import { H3Event } from 'h3';
import { verifyUserToken } from './jwt';

export function getAdminToken(event: H3Event): string | null {
    // 首先尝试从 cookie 获取
    let adminToken = getCookie(event, 'admin_token');

    // 如果 cookie 中没有，尝试从 Authorization header 获取
    if (!adminToken) {
        const authHeader = getHeader(event, 'authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            adminToken = authHeader.substring(7);
        }
    }

    return adminToken || null;
}

export function verifyAdminAuth(event: H3Event): { id: string; role?: string } {
    const adminToken = getAdminToken(event);

    if (!adminToken) {
        throw createError({ statusCode: 401, message: '需要管理员登录' });
    }

    const payload = verifyUserToken(adminToken) as any;
    if (!payload) {
        throw createError({ statusCode: 401, message: '无效的 Token' });
    }

    return payload;
}
