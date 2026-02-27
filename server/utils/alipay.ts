/**
 * 支付宝 SDK 工具类
 * 使用 alipay-sdk 封装电脑网站支付接口
 */
import { AlipaySdk } from 'alipay-sdk';

// 从环境变量读取配置
const config = useRuntimeConfig();

// 初始化支付宝 SDK 实例
let alipayClient: any = null;

function getAlipayClient(): any {
    if (!alipayClient) {
        const appId = config.alipayAppId || process.env.ALIPAY_APP_ID;
        const privateKey = config.alipayPrivateKey || process.env.ALIPAY_PRIVATE_KEY;
        const alipayPublicKey = config.alipayPublicKey || process.env.ALIPAY_PUBLIC_KEY;

        if (!appId || !privateKey || !alipayPublicKey) {
            throw new Error('支付宝配置缺失：请检查 ALIPAY_APP_ID, ALIPAY_PRIVATE_KEY, ALIPAY_PUBLIC_KEY');
        }

        alipayClient = new AlipaySdk({
            appId,
            privateKey,
            alipayPublicKey,
            gateway: 'https://openapi.alipay.com/gateway.do',
            signType: 'RSA2',
        });
    }
    return alipayClient;
}

/**
 * 创建电脑网站支付订单（跳转支付）
 * @param orderId 业务订单号
 * @param amount 金额（元）
 * @param subject 商品标题
 * @returns 支付跳转 URL
 */
export async function createPagePayOrder(
    orderId: string,
    amount: number,
    subject: string
): Promise<{ payUrl: string }> {
    const client = getAlipayClient();
    const notifyUrl = config.alipayNotifyUrl || process.env.ALIPAY_NOTIFY_URL || 'https://intjsys.com/api/payment/notify';
    const returnUrl = config.alipayReturnUrl || process.env.ALIPAY_RETURN_URL || 'https://intjsys.com/payment/callback';

    // 使用 pageExec 生成跳转 URL
    const result = client.pageExecute('alipay.trade.page.pay', 'GET', {
        notify_url: notifyUrl,
        return_url: returnUrl,
        bizContent: {
            out_trade_no: orderId,
            total_amount: amount.toFixed(2),
            subject: subject,
            product_code: 'FAST_INSTANT_TRADE_PAY',  // 电脑网站支付固定值
        },
    });

    console.log(`[Alipay] Created page pay order: ${orderId}, amount: ${amount}`);

    return {
        payUrl: result as string,
    };
}

/**
 * 验证支付宝异步通知签名
 * @param params 通知参数
 * @returns 验签结果
 */
export function verifyNotifySignature(params: Record<string, string>): boolean {
    const client = getAlipayClient();

    try {
        return client.checkNotifySign(params);
    } catch (error) {
        console.error('验签失败:', error);
        return false;
    }
}

/**
 * 主动查询订单状态
 * @param orderId 业务订单号
 * @returns 订单状态
 */
export async function queryOrderStatus(orderId: string): Promise<{
    tradeStatus: string;
    tradeNo?: string;
    buyerLogonId?: string;
}> {
    const client = getAlipayClient();

    const result = await client.exec('alipay.trade.query', {
        bizContent: {
            out_trade_no: orderId,
        },
    });

    const response = result as any;

    if (response.code !== '10000') {
        return { tradeStatus: 'NOT_FOUND' };
    }

    return {
        tradeStatus: response.tradeStatus,
        tradeNo: response.tradeNo,
        buyerLogonId: response.buyerLogonId,
    };
}

/**
 * 发起退款
 * @param tradeNo 支付宝交易号
 * @param refundAmount 退款金额
 * @param outRequestNo 退款请求号（唯一）
 * @returns 退款结果
 */
export async function refundPayment(
    tradeNo: string,
    refundAmount: number,
    outRequestNo: string
): Promise<{ success: boolean; refundTradeNo?: string; message?: string }> {
    const client = getAlipayClient();

    try {
        const result = await client.exec('alipay.trade.refund', {
            bizContent: {
                trade_no: tradeNo,
                refund_amount: refundAmount.toFixed(2),
                out_request_no: outRequestNo,
            },
        });

        const response = result as any;

        if (response.code === '10000') {
            console.log(`[Alipay] Refund success: tradeNo=${tradeNo}, amount=${refundAmount}`);
            return {
                success: true,
                refundTradeNo: response.tradeNo,
            };
        } else {
            console.error('[Alipay] Refund failed:', response);
            return {
                success: false,
                message: response.subMsg || response.msg || 'Refund failed',
            };
        }
    } catch (error: any) {
        console.error('[Alipay] Refund error:', error);
        return {
            success: false,
            message: error.message || 'Unknown error',
        };
    }
}
