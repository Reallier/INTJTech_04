/**
 * 邮箱验证码登录/注册 API
 * 
 * POST /api/auth/email/verify
 * Body: { "email": "user@example.com", "code": "123456" }
 * 
 * 用户不存在时自动注册
 */
import prisma from '~/server/utils/prisma';
import { signAccessToken, generateRefreshToken, getRefreshTokenExpiry, TOKEN_CONFIG } from '~/server/utils/jwt';

// 邮箱格式验证
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, code } = body;

    // 验证参数
    if (!email || !EMAIL_REGEX.test(email)) {
        return { success: false, message: '请输入正确的邮箱地址' };
    }
    if (!code || !/^\d{6}$/.test(code)) {
        return { success: false, message: '请输入6位验证码' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('[Email Verify] 验证登录:', normalizedEmail);

    // 查找有效的验证码（复用 sms_codes 表）
    const emailCode = await prisma.smsCode.findFirst({
        where: {
            phone: normalizedEmail,
            code,
            used: false,
            expiresAt: { gte: new Date() }
        },
        orderBy: { createdAt: 'desc' }
    });

    if (!emailCode) {
        console.log('[Email Verify] 验证码无效或已过期:', normalizedEmail);
        return { success: false, message: '验证码错误或已过期' };
    }

    // 标记验证码已使用
    await prisma.smsCode.update({
        where: { id: emailCode.id },
        data: { used: true }
    });

    // 查找或创建用户
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    let isNewUser = false;

    if (!user) {
        console.log('[Email Verify] 新用户注册:', normalizedEmail);
        isNewUser = true;

        // 获取客户端 IP
        const clientIp = getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
            || getHeader(event, 'x-real-ip')
            || 'unknown';

        // 防刷检查：24小时内同一 IP 最多注册 3 个账号
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentRegistrations = await prisma.balanceAdjustment.count({
            where: {
                type: 'PROMOTION',
                reason: '新用户注册赠送',
                createdAt: { gte: oneDayAgo },
                // 通过 operatorName 记录 IP（复用字段）
                operatorName: { startsWith: `system:${clientIp}` }
            }
        });

        if (recentRegistrations >= 3) {
            console.log('[Email Verify] IP 注册频率限制:', clientIp, recentRegistrations);
            return { success: false, message: '注册过于频繁，请稍后再试' };
        }

        // 新用户赠送额度
        const NEW_USER_BONUS = 10.0;

        // 使用事务确保原子性
        const result = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: normalizedEmail,
                    name: normalizedEmail.split('@')[0],
                    freeQuota: NEW_USER_BONUS
                }
            });

            // 记录赠送流水（用于审计），operatorName 包含 IP 用于防刷统计
            await tx.balanceAdjustment.create({
                data: {
                    userId: newUser.id,
                    amount: NEW_USER_BONUS,
                    type: 'PROMOTION',
                    reason: '新用户注册赠送',
                    operatorName: `system:${clientIp}`
                }
            });

            return newUser;
        });

        user = result;
        console.log('[Email Verify] 赠送新用户额度:', NEW_USER_BONUS, 'IP:', clientIp);
    }

    // 检查设备数量限制（最多3台设备）
    const existingTokens = await prisma.refreshToken.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' }
    });

    // 如果已有3个设备，删除最早的
    if (existingTokens.length >= TOKEN_CONFIG.maxDevices) {
        const tokensToDelete = existingTokens.slice(0, existingTokens.length - TOKEN_CONFIG.maxDevices + 1);
        await prisma.refreshToken.deleteMany({
            where: { id: { in: tokensToDelete.map(t => t.id) } }
        });
        console.log('[Email Verify] 删除旧设备 Token:', tokensToDelete.length);
    }

    // 生成 Token
    const accessToken = signAccessToken(user);
    const refreshToken = generateRefreshToken();
    const refreshExpiry = getRefreshTokenExpiry();

    // 获取 User-Agent
    const userAgent = getHeader(event, 'user-agent') || '';

    // 保存 Refresh Token
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: refreshExpiry,
            userAgent: userAgent.slice(0, 255)
        }
    });

    // 设置 Refresh Token Cookie
    const isDev = process.env.NODE_ENV !== 'production';
    setCookie(event, 'refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: TOKEN_CONFIG.refreshTokenExpiry * 24 * 60 * 60,
        path: '/',
        ...(isDev ? {} : { domain: '.intjsys.com', secure: true }),
        sameSite: 'lax'
    });

    // 同时设置 auth_token（兼容旧逻辑）
    setCookie(event, 'auth_token', accessToken, {
        httpOnly: false,
        maxAge: 15 * 60,
        path: '/',
        ...(isDev ? {} : { domain: '.intjsys.com', secure: true }),
        sameSite: 'lax'
    });

    console.log('[Email Verify] 登录成功:', user.id, isNewUser ? '(新用户)' : '');

    return {
        success: true,
        message: isNewUser ? '注册成功' : '登录成功',
        accessToken,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            phone: user.phone,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            balance: user.balance,
            freeQuota: user.freeQuota
        }
    };
});
