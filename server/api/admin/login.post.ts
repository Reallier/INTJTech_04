/**
 * 管理员登录 API
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signUserToken } from '../../utils/jwt';

const prisma = new PrismaClient();

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

    // 生成 JWT
    const token = signUserToken(user);

    // 设置 Cookie
    const isDev = process.env.NODE_ENV !== 'production';
    setCookie(event, 'admin_token', token, {
        httpOnly: false,
        maxAge: 60 * 60 * 24, // 24 小时
        path: '/',
        ...(isDev ? {} : { domain: '.reallier.top', secure: true }),
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
