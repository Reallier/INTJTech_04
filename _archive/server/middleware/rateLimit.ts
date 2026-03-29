/**
 * API 限流中间件
 * 基于 IP 地址的请求频率限制
 */

// 存储请求记录（生产环境应使用 Redis）
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// 限流配置
const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
    // 支付相关接口 - 严格限制
    '/api/payment/create': { maxRequests: 10, windowMs: 60000 },   // 每分钟 10 次
    '/api/refund/request': { maxRequests: 5, windowMs: 60000 },    // 每分钟 5 次

    // 登录接口 - 防暴力破解
    '/api/auth/login': { maxRequests: 10, windowMs: 60000 },       // 每分钟 10 次
    '/api/auth/sms/send': { maxRequests: 3, windowMs: 60000 },     // 每分钟 3 次

    // 默认限制
    'default': { maxRequests: 100, windowMs: 60000 },              // 每分钟 100 次
};

// 定期清理过期记录
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requestCounts.entries()) {
        if (value.resetTime < now) {
            requestCounts.delete(key);
        }
    }
}, 60000);

/**
 * 获取客户端 IP
 */
function getClientIP(event: any): string {
    const headers = getHeaders(event);
    return (
        headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        headers['x-real-ip'] ||
        event.node?.req?.socket?.remoteAddress ||
        'unknown'
    );
}

/**
 * 检查是否超过限流
 */
function checkRateLimit(ip: string, path: string): { allowed: boolean; remaining: number; resetTime: number } {
    const config = RATE_LIMITS[path] || RATE_LIMITS['default'];
    const key = `${ip}:${path}`;
    const now = Date.now();

    let record = requestCounts.get(key);

    // 如果没有记录或已过期，创建新记录
    if (!record || record.resetTime < now) {
        record = { count: 0, resetTime: now + config.windowMs };
        requestCounts.set(key, record);
    }

    // 增加计数
    record.count++;

    const allowed = record.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - record.count);

    return { allowed, remaining, resetTime: record.resetTime };
}

export default defineEventHandler((event) => {
    const path = getRequestURL(event).pathname;

    // 只对需要限流的接口进行限制
    const needsRateLimit = Object.keys(RATE_LIMITS).some(p => path.startsWith(p)) ||
        path.startsWith('/api/payment') ||
        path.startsWith('/api/refund') ||
        path.startsWith('/api/auth');

    if (!needsRateLimit) {
        return;
    }

    const ip = getClientIP(event);
    const result = checkRateLimit(ip, path);

    // 设置限流相关响应头
    setHeader(event, 'X-RateLimit-Remaining', result.remaining.toString());
    setHeader(event, 'X-RateLimit-Reset', result.resetTime.toString());

    if (!result.allowed) {
        console.log(`[RateLimit] Blocked: IP=${ip}, path=${path}`);
        throw createError({
            statusCode: 429,
            message: '请求过于频繁，请稍后再试',
        });
    }
});
