/**
 * 管理员创建用户 API
 * 
 * 在官网数据库创建用户并设置随机密码
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// 验证管理员 Token
const verifyAdminToken = (event: any) => {
    const adminToken = getCookie(event, 'admin_token');
    if (!adminToken) {
        throw createError({ statusCode: 401, message: '需要管理员登录' });
    }
    // 简单验证 token 格式（实际应该验证 JWT）
    const parts = adminToken.split('.');
    if (parts.length !== 3) {
        throw createError({ statusCode: 401, message: '无效的管理员 Token' });
    }
    return true;
};

// 生成随机密码
const generatePassword = (length: number = 12): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// 生成用户名
const generateUsername = (): string => {
    return `user_${crypto.randomBytes(4).toString('hex')}`;
};

export default defineEventHandler(async (event) => {
    // 验证管理员权限
    verifyAdminToken(event);

    const body = await readBody(event);
    const { nickname, initialBalance = 0, initialFreeQuota = 1.0 } = body;

    if (!nickname) {
        throw createError({ statusCode: 400, message: '请提供用户昵称' });
    }

    // 生成用户名和密码
    const username = generateUsername();
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('[Admin] Creating user:', { username, nickname });

    try {
        // 创建用户
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name: nickname,
            }
        });

        console.log('[Admin] User created:', user.id);

        return {
            success: true,
            message: '用户创建成功',
            user: {
                id: user.id,
                username: user.username,
                name: user.name
            },
            password: password  // 返回明文密码（只这一次）
        };
    } catch (e: any) {
        console.error('[Admin] Failed to create user:', e);
        throw createError({ statusCode: 500, message: '创建用户失败' });
    }
});
