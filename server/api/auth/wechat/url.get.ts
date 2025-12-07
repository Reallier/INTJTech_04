export default defineEventHandler((event) => {
    const config = useRuntimeConfig();
    // Ensure you set these in .env: WECHAT_APP_ID
    const APPID = process.env.WECHAT_APP_ID || 'wx_placeholder_appid';
    // Note: Localhost callback usually requires a proxy or local DNS mapping for WeChat, 
    // but for "Website Apps" it works if configured in WeChat Admin.
    const DOMAIN = process.env.DOMAIN_URL || 'http://localhost:3000';
    const REDIRECT_URI = encodeURIComponent(`${DOMAIN}/api/auth/wechat/callback`);
    const STATE = Math.random().toString(36).substring(7);

    const url = `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_login&state=${STATE}#wechat_redirect`;

    return { url };
});
