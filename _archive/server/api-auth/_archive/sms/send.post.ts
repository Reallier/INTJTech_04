/**
 * 发送短信验证码 API
 * 
 * POST /api/auth/sms/send
 * Body: { "phone": "13800138000" }
 */
import prisma from '~/server/utils/prisma';
import { sendSmsCode, generateSmsCode } from '~/server/utils/sms';
import { TOKEN_CONFIG } from '~/server/utils/jwt';

// 发送频率限制（秒）
const SEND_INTERVAL = 60;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { phone } = body;

    // 验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        return {
            success: false,
            message: '请输入正确的手机号'
        };
    }

    console.log('[SMS Send] 请求发送验证码:', phone);

    // 检查发送频率（1分钟内不能重复发送）
    const recentCode = await prisma.smsCode.findFirst({
        where: {
            phone,
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
    const code = generateSmsCode();
    const expiresAt = new Date(Date.now() + TOKEN_CONFIG.smsCodeExpiry * 60 * 1000);

    // 保存到数据库
    await prisma.smsCode.create({
        data: {
            phone,
            code,
            expiresAt
        }
    });

    // 发送短信
    const result = await sendSmsCode(phone, code);

    if (!result.success) {
        console.error('[SMS Send] 发送失败:', result.message);
        return {
            success: false,
            message: '验证码发送失败，请稍后重试'
        };
    }

    console.log('[SMS Send] 验证码已发送:', phone);

    return {
        success: true,
        message: '验证码已发送'
    };
});
