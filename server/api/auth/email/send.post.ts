/**
 * 发送邮箱验证码 API
 * 
 * POST /api/auth/email/send
 * Body: { "email": "user@example.com" }
 */
import prisma from '~/server/utils/prisma';
import { sendEmailCode, generateCode } from '~/server/utils/email';
import { TOKEN_CONFIG } from '~/server/utils/jwt';

// 发送频率限制（秒）
const SEND_INTERVAL = 60;

// 邮箱格式验证
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email } = body;

    // 验证邮箱格式
    if (!email || !EMAIL_REGEX.test(email)) {
        return {
            success: false,
            message: '请输入正确的邮箱地址'
        };
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('[Email Send] 请求发送验证码:', normalizedEmail);

    // 检查发送频率（1分钟内不能重复发送）
    const recentCode = await prisma.smsCode.findFirst({
        where: {
            phone: normalizedEmail,  // 复用 phone 字段存储邮箱
            createdAt: {
                gte: new Date(Date.now() - SEND_INTERVAL * 1000)
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    if (recentCode) {
        const waitSeconds = SEND_INTERVAL - Math.floor((Date.now() - recentCode.createdAt.getTime()) / 1000);
        return {
            success: false,
            message: `请${waitSeconds}秒后再试`
        };
    }

    // 生成验证码
    const code = generateCode();
    const expiresAt = new Date(Date.now() + TOKEN_CONFIG.smsCodeExpiry * 60 * 1000);

    // 保存到数据库（复用 sms_codes 表）
    await prisma.smsCode.create({
        data: {
            phone: normalizedEmail,
            code,
            expiresAt
        }
    });

    // 发送邮件
    const result = await sendEmailCode(normalizedEmail, code);

    if (!result.success) {
        console.error('[Email Send] 发送失败:', result.message);
        return {
            success: false,
            message: '验证码发送失败，请稍后重试'
        };
    }

    console.log('[Email Send] 验证码已发送:', normalizedEmail);

    return {
        success: true,
        message: '验证码已发送到您的邮箱'
    };
});
