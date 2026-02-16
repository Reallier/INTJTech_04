/**
 * 用户账户信息 API
 * 
 * 从 TalentAI 服务获取用户的账户余额和用量信息
 */
import { verifyUserToken, signUserToken } from '~/server/utils/jwt';
import prisma from '~/server/utils/prisma';

const HIRESTREAM_API_URL = process.env.HIRESTREAM_API_URL || 'https://api.talentai.intjsys.com';

export default defineEventHandler(async (event) => {
    // 1. 验证用户身份
    const token = getCookie(event, 'auth_token');

    if (!token) {
        return { success: false, message: 'Unauthorized' };
    }

    const payload = verifyUserToken(token) as any;
    if (!payload || !payload.id) {
        return { success: false, message: 'Invalid token' };
    }

    // 2. 获取用户信息
    const user = await prisma.user.findUnique({
        where: { id: payload.id }
    });

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    // 3. 调用 HireStream API 获取账户信息
    try {
        const serviceToken = signUserToken(user);

        const response = await fetch(`${HIRESTREAM_API_URL}/api/user/account`, {
            headers: {
                'Authorization': `Bearer ${serviceToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const accountData = await response.json();
            return {
                success: true,
                data: {
                    balance: accountData.balance || 0,
                    free_quota: accountData.free_quota || 0,
                    total_available: (accountData.balance || 0) + (accountData.free_quota || 0),
                    total_usage: accountData.total_usage || 0,
                    usage_this_month: accountData.usage_this_month || 0
                }
            };
        } else {
            console.error('[Account API] HireStream API error:', response.status);
        }
    } catch (e) {
        console.error('[Account API] Failed to fetch from HireStream:', e);
    }

    // 如果无法获取远程数据，返回默认值
    return {
        success: true,
        data: {
            balance: 0,
            free_quota: 1.00,
            total_available: 1.00,
            total_usage: 0,
            usage_this_month: 0
        }
    };
});
