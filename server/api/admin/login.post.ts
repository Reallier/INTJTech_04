/**
 * 管理员登录 API
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Admin Token 有效期：7 天
const ADMIN_TOKEN_EXPIRY = '7d';

// 为管理员签发长效 Token
const signAdminToken = (user: any): string => {
    const secret = process.env.JWT_SECRET || 'dev_secret_key_123';
    return jwt.sign({
        id: user.id,
        user_id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        type: 'access'  // 保持与 verifyAccessToken 验证逻辑兼容
    }, secret, { expiresIn: ADMIN_TOKEN_EXPIRY });
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
        return {
            success: false,
            message: '请输入用户名和密码'
        };
    }

    console.log('[Admin Login] Attempting login for:', username);

    // 查找用户
    const user = await prisma.user.findFirst({
        where: { username }
    });

    if (!user) {
        console.log('[Admin Login] User not found:', username);
        return {
            success: false,
            message: '用户名或密码错误'
        };
    }

    // 检查是否为管理员
    if (user.role !== 'admin') {
        console.log('[Admin Login] User is not admin:', username);
        return {
            success: false,
            message: '无管理员权限'
        };
    }

    if (!user.password) {
        console.log('[Admin Login] User has no password set:', username);
        return {
            success: false,
            message: '账号未设置密码，请联系管理员'
        };
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        console.log('[Admin Login] Invalid password for:', username);
        return {
            success: false,
            message: '用户名或密码错误'
        };
    }

    console.log('[Admin Login] Login successful for:', username);

    // 生成长效 Admin JWT（7天有效期）
    const token = signAdminToken(user);

    // 设置 Cookie（与 Token 有效期一致：7天）
    const isDev = process.env.NODE_ENV !== 'production';
    setCookie(event, 'admin_token', token, {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7, // 7 天
        path: '/',
        ...(isDev ? {} : { domain: '.intjsys.com', secure: true }),
        sameSite: 'lax'
    });

    return {
        success: true,
        message: '登录成功',
        token: token,
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
        }
    };
});
