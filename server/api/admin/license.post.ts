/**
 * License 生成 API (调用 TalentAI 后端)
 */
import { verifyAdminAuth } from '../../utils/adminAuth';
import { sendEmailCode } from '../../utils/email';

// TalentAI API 地址
const TALENTAI_API = process.env.TALENTAI_API_URL || 'https://talentai.intjsys.com';

export default defineEventHandler(async (event) => {
    // 验证管理员权限
    verifyAdminAuth(event);

    const body = await readBody(event);
    const { customer, machine_id, edition, days, customer_email } = body;

    // 参数校验
    if (!customer || !machine_id) {
        throw createError({
            statusCode: 400,
            message: '客户名称和机器指纹为必填项'
        });
    }

    try {
        // 调用 TalentAI 后端生成 License
        const response = await $fetch(`${TALENTAI_API}/api/license/generate`, {
            method: 'POST',
            body: {
                customer,
                machine_id,
                edition: edition || 'professional',
                days: days || 365,
                customer_email
            }
        });

        // 如果提供了客户邮箱，发送授权邮件
        let emailSent = false;
        if (customer_email && response.success && response.license_key) {
            try {
                await sendLicenseEmail(customer_email, {
                    customer,
                    edition: edition || 'professional',
                    licenseKey: response.license_key,
                    licId: response.lic_id,
                    expiresAt: response.expires_at
                });
                emailSent = true;
            } catch (emailError) {
                console.error('[License] 邮件发送失败:', emailError);
            }
        }

        return {
            ...response,
            email_sent: emailSent
        };

    } catch (error: any) {
        console.error('[License] 生成失败:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.data?.detail || error.message || 'License 生成失败'
        });
    }
});


/**
 * 发送 License 授权邮件
 */
async function sendLicenseEmail(
    email: string,
    data: {
        customer: string;
        edition: string;
        licenseKey: string;
        licId: string;
        expiresAt: string;
    }
) {
    const { Resend } = await import('resend');

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || '简序智能 INTJsys <noreply@auth.intjsys.com>';

    if (!apiKey) {
        throw new Error('未配置 RESEND_API_KEY');
    }

    const resend = new Resend(apiKey);

    const editionNames: Record<string, string> = {
        standard: '标准版',
        professional: '专业版',
        enterprise: '企业版',
        flagship: '旗舰版'
    };

    const expiresDate = new Date(data.expiresAt).toLocaleDateString('zh-CN');

    await resend.emails.send({
        from,
        to: email,
        subject: `【简序智能】TalentAI 软件授权书 - ${data.customer}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="font-size: 24px; font-weight: 800; color: #111; margin: 0;">简序智能</h1>
                    <p style="font-size: 14px; color: #666; margin: 8px 0 0;">TalentAI 智能招聘匹配系统 - 软件授权书</p>
                </div>
                
                <div style="background: #f9f9f9; border: 1px solid #eee; padding: 32px; margin-bottom: 24px;">
                    <h2 style="font-size: 18px; color: #333; margin: 0 0 20px;">授权信息</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #666; width: 120px;">授权编号</td>
                            <td style="padding: 8px 0; font-weight: 600;">${data.licId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">被授权方</td>
                            <td style="padding: 8px 0; font-weight: 600;">${data.customer}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">授权版本</td>
                            <td style="padding: 8px 0; font-weight: 600;">${editionNames[data.edition] || data.edition}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">有效期至</td>
                            <td style="padding: 8px 0; font-weight: 600;">${expiresDate}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background: #111; color: #fff; padding: 24px; margin-bottom: 24px;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #999;">License Key (请复制以下密钥并在系统激活页面粘贴)：</p>
                    <div style="background: #222; padding: 16px; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 12px; line-height: 1.6;">
                        ${data.licenseKey}
                    </div>
                </div>
                
                <div style="font-size: 13px; color: #666; line-height: 1.8;">
                    <p><strong>激活步骤：</strong></p>
                    <ol style="padding-left: 20px; margin: 8px 0;">
                        <li>打开 TalentAI 系统，进入激活页面</li>
                        <li>将上方 License Key 完整复制</li>
                        <li>粘贴到激活输入框，点击"激活"</li>
                    </ol>
                    <p style="margin-top: 16px;">如有任何问题，请联系技术支持：<a href="mailto:support@intjsys.com" style="color: #111;">support@intjsys.com</a></p>
                </div>
                
                <div style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #999; text-align: center;">
                    <p>© 2026 深圳市简序智能科技有限公司</p>
                    <p>此邮件由系统自动发送，请勿直接回复</p>
                </div>
            </div>
        `
    });

    console.log(`[License] 授权邮件已发送: ${email}`);
}
