/**
 * 验证码登录/注册 API
 * 
 * POST /api/auth/sms/verify
 * Body: { "phone": "13800138000", "code": "123456" }
 * 
 * 用户不存在时自动注册
 */
import prisma from '~/server/utils/prisma';
import { signAccessToken, generateRefreshToken, getRefreshTokenExpiry, TOKEN_CONFIG } from '~/server/utils/jwt';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { phone, code } = body;

    // 验证参数
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        return { success: false, message: '请输入正确的手机号' };
    }
    if (!code || !/^\d{6}$/.test(code)) {
        return { success: false, message: '请输入6位验证码' };
    }

    console.log('[SMS Verify] 验证登录:', phone);

    // 查找有效的验证码
    const smsCode = await prisma.smsCode.findFirst({
        where: {
            phone,
            code,
            used: false,
            expiresAt: { gte: new Date() }
        },
        orderBy: { createdAt: 'desc' }
    });

    if (!smsCode) {
        console.log('[SMS Verify] 验证码无效或已过期:', phone);
        return { success: false, message: '验证码错误或已过期' };
    }

    // 标记验证码已使用
    await prisma.smsCode.update({
        where: { id: smsCode.id },
        data: { used: true }
    });

    // 查找或创建用户
    let user = await prisma.user.findUnique({ where: { phone } });
    let isNewUser = false;

    if (!user) {
        console.log('[SMS Verify] 新用户注册:', phone);
        isNewUser = true;
        user = await prisma.user.create({
            data: {
                phone,
                name: `用户${phone.slice(-4)}`  // 默认昵称
            }
        });
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
        console.log('[SMS Verify] 删除旧设备 Token:', tokensToDelete.length);
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
        maxAge: 15 * 60,  // 15分钟
        path: '/',
        ...(isDev ? {} : { domain: '.intjsys.com', secure: true }),
        sameSite: 'lax'
    });

    console.log('[SMS Verify] 登录成功:', user.id, isNewUser ? '(新用户)' : '');

    return {
        success: true,
        message: isNewUser ? '注册成功' : '登录成功',
        accessToken,
        user: {
            id: user.id,
            phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
            email: user.email?.replace(/(.{2}).*(@.*)/, '$1***$2'),
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            balance: user.balance,
            freeQuota: user.freeQuota
        }
    };
});
