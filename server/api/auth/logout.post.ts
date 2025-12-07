/**
 * 登出 API
 * 
 * 清除跨子域的 auth_token Cookie
 */
export default defineEventHandler(async (event) => {
    // 清除 Cookie，必须使用与设置时相同的 domain
    setCookie(event, 'auth_token', '', {
        httpOnly: false,
        maxAge: 0,  // 立即过期
        path: '/',
        domain: '.reallier.top',
        secure: true,
        sameSite: 'lax'
    });

    console.log('[Logout] Cookie cleared');

    return { success: true, message: '已登出' };
});
