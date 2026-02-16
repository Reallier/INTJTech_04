/**
 * 腾讯云短信服务工具
 * 
 * 环境变量:
 * - TENCENT_SMS_SECRET_ID: 腾讯云 SecretId
 * - TENCENT_SMS_SECRET_KEY: 腾讯云 SecretKey
 * - TENCENT_SMS_SDK_APPID: 短信应用 SDK AppID
 * - TENCENT_SMS_SIGN_NAME: 短信签名
 * - TENCENT_SMS_TEMPLATE_ID: 验证码模板 ID
 */

import * as tencentcloud from 'tencentcloud-sdk-nodejs';

const SmsClient = tencentcloud.sms.v20210111.Client;

// 配置
const config = {
    secretId: process.env.TENCENT_SMS_SECRET_ID || '',
    secretKey: process.env.TENCENT_SMS_SECRET_KEY || '',
    sdkAppId: process.env.TENCENT_SMS_SDK_APPID || '',
    signName: process.env.TENCENT_SMS_SIGN_NAME || '简序智能',
    templateId: process.env.TENCENT_SMS_TEMPLATE_ID || ''
};

// 创建客户端
const createClient = () => {
    return new SmsClient({
        credential: {
            secretId: config.secretId,
            secretKey: config.secretKey
        },
        region: 'ap-guangzhou',
        profile: {
            httpProfile: {
                endpoint: 'sms.tencentcloudapi.com'
            }
        }
    });
};

/**
 * 发送验证码
 * @param phone 手机号（需要带国际区号，如 +8613800138000）
 * @param code 验证码
 * @returns 发送结果
 */
export const sendSmsCode = async (phone: string, code: string): Promise<{ success: boolean; message: string }> => {
    // 开发环境模拟发送
    if (process.env.NODE_ENV !== 'production' || !config.secretId) {
        console.log(`[SMS Mock] 向 ${phone} 发送验证码: ${code}`);
        return { success: true, message: '验证码已发送（开发模式）' };
    }

    try {
        const client = createClient();

        // 格式化手机号（添加 +86 前缀）
        const formattedPhone = phone.startsWith('+') ? phone : `+86${phone}`;

        const params = {
            PhoneNumberSet: [formattedPhone],
            SmsSdkAppId: config.sdkAppId,
            SignName: config.signName,
            TemplateId: config.templateId,
            TemplateParamSet: [code, '5']  // 验证码和有效分钟数
        };

        const result = await client.SendSms(params);

        if (result.SendStatusSet && result.SendStatusSet[0].Code === 'Ok') {
            console.log(`[SMS] 发送成功: ${phone}`);
            return { success: true, message: '验证码已发送' };
        } else {
            const errMsg = result.SendStatusSet?.[0]?.Message || '发送失败';
            console.error(`[SMS] 发送失败: ${phone}, ${errMsg}`);
            return { success: false, message: errMsg };
        }
    } catch (error: any) {
        console.error('[SMS] 发送异常:', error);
        return { success: false, message: error.message || '短信服务异常' };
    }
};

/**
 * 生成 6 位随机验证码
 */
export const generateSmsCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
