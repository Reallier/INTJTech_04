import prisma from '~/server/utils/prisma';
import { signUserToken } from '~/server/utils/jwt';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const code = query.code as string;

    console.log('[Auth Callback] Code received:', code);

    if (!code) {
        throw createError({ statusCode: 400, statusMessage: 'No code provided' });
    }

    let userInfo: any = {};
    let openid = '';
    let unionid: string | null = null;

    const APPID = process.env.WECHAT_APP_ID;
    const SECRET = process.env.WECHAT_APP_SECRET;

    // --- MOCK MODE FOR TESTING WITHOUT REAL KEYS ---
    if (code === 'TEST_MOCK_CODE') {
        openid = 'mock_openid_' + Math.floor(Math.random() * 10000);
        userInfo = {
            nickname: 'Mock User',
            headimgurl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        };
        console.log('[Auth Callback] Mock data used:', openid);
    } else {
        // REAL PRODUCTION MODE
        if (!APPID || !SECRET) {
            throw createError({ statusCode: 500, statusMessage: 'Server missing WeChat configuration (WECHAT_APP_ID/SECRET)' });
        }

        try {
            // 1. Get Access Token
            const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${SECRET}&code=${code}&grant_type=authorization_code`;
            const tokenData: any = await $fetch(tokenUrl);
            console.log('[Auth Callback] Token response:', tokenData);

            if (tokenData.errcode) {
                throw createError({ statusCode: 400, statusMessage: `WeChat Error: ${tokenData.errmsg}` });
            }

            openid = tokenData.openid;
            const accessToken = tokenData.access_token;
            unionid = tokenData.unionid || null;

            // 2. Get User Info
            const userUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}`;
            userInfo = await $fetch(userUrl);
            console.log('[Auth Callback] User Info response:', userInfo);

        } catch (error: any) {
            console.error('[Auth Callback] Error:', error);
            throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to connect to WeChat' });
        }
    }

    // 3. Find or Create User
    // We prioritize UnionID if available, else OpenID
    let user = await prisma.user.findFirst({
        where: {
            OR: [
                { openid: openid },
                ...(unionid ? [{ unionid: unionid }] : [])
            ]
        }
    });

    if (!user) {
        console.log('[Auth Callback] Creating new user...');
        user = await prisma.user.create({
            data: {
                openid,
                unionid,
                name: userInfo.nickname || 'WeChat User',
                avatar: userInfo.headimgurl
            }
        });
    } else {
        console.log('[Auth Callback] Found existing user:', user.id);
    }

    // 4. Generate JWT
    const token = signUserToken(user);
    console.log('[Auth Callback] Generated Token');

    // 5. Redirect to Home (or specific callback page)
    // Cookie 设置为根域名共享
    setCookie(event, 'auth_token', token, {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        domain: '.intjsys.com',  // 允许所有子域访问
        secure: true,             // HTTPS 环境必须
        sameSite: 'lax'           // 允许跨子域导航时携带
    });
    console.log('[Auth Callback] Cookie set, redirecting...');

    return sendRedirect(event, '/?login=success');
});
