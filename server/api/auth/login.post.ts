/**
 * 用户名密码登录 API
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

    console.log('[Login] Attempting login for:', username);

    // 查找用户
    const user = await prisma.user.findFirst({
        where: { username }
    });

    if (!user) {
        console.log('[Login] User not found:', username);
        return {
            success: false,
            message: '用户名或密码错误'
        };
    }

    if (!user.password) {
        console.log('[Login] User has no password set:', username);
        return {
            success: false,
            message: '账号未设置密码，请联系管理员'
        };
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        console.log('[Login] Invalid password for:', username);
        return {
            success: false,
            message: '用户名或密码错误'
        };
    }

    console.log('[Login] Login successful for:', username);

    // 生成 JWT
    const token = signUserToken(user);

    // 设置 Cookie（跨子域共享）
    setCookie(event, 'auth_token', token, {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7, // 7 天
        path: '/',
        domain: '.reallier.top',
        secure: true,
        sameSite: 'lax'
    });

    return {
        success: true,
        message: '登录成功',
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            avatar: user.avatar
        }
    };
});
