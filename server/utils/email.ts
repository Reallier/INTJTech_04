/**
 * Resend 邮件发送工具
 * 
 * 环境变量:
 * - RESEND_API_KEY: Resend API Key
 * - RESEND_FROM: 发件人地址 (需要验证域名)
 * 
 * 免费额度: 3000 封/月
 * 文档: https://resend.com/docs
 */

import { Resend } from 'resend';

// 配置
const config = {
    apiKey: process.env.RESEND_API_KEY || '',
    from: process.env.RESEND_FROM || '简序智能 INTJsys <noreply@auth.intjsys.com>'
};

/**
 * 发送验证码邮件
 * @param email 目标邮箱
 * @param code 验证码
 * @returns 发送结果
 */
export const sendEmailCode = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    // 开发环境模拟发送
    if (process.env.NODE_ENV !== 'production' || !config.apiKey) {
        console.log(`[Email Mock] 向 ${email} 发送验证码: ${code}`);
        return { success: true, message: '验证码已发送（开发模式）' };
    }

    try {
        const resend = new Resend(config.apiKey);

        const { data, error } = await resend.emails.send({
            from: config.from,
            to: email,
            subject: '【简序智能】登录验证码',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="font-size: 24px; font-weight: 800; color: #111; margin: 0;">简序智能</h1>
                        <p style="font-size: 14px; color: #666; margin: 8px 0 0;">INTJsys</p>
                    </div>
                    <div style="background: #f9f9f9; border: 1px solid #eee; padding: 32px; text-align: center;">
                        <p style="font-size: 16px; color: #333; margin: 0 0 20px;">您的登录验证码是：</p>
                        <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #111; font-family: monospace;">
                            ${code}
                        </div>
                        <p style="font-size: 14px; color: #999; margin: 20px 0 0;">验证码 5 分钟内有效，请勿泄露给他人</p>
                    </div>
                    <p style="font-size: 12px; color: #999; text-align: center; margin-top: 24px;">
                        如果这不是您的操作，请忽略此邮件
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('[Email] Resend 错误:', error);
            return { success: false, message: error.message };
        }

        console.log(`[Email] 发送成功: ${email}, ID: ${data?.id}`);
        return { success: true, message: '验证码已发送' };
    } catch (error: any) {
        console.error('[Email] 发送异常:', error);
        return { success: false, message: error.message || '邮件发送失败' };
    }
};

/**
 * 生成 6 位随机验证码
 */
export const generateCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
