/**
 * Auth 中间件 - 普通用户认证
 * 
 * 检查用户是否已登录，否则重定向到登录页
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user, fetchUser } = useAuth();

    console.log('[auth middleware] Running for:', to.path);
    console.log('[auth middleware] Current user state:', user.value);

    // 如果 user 状态还没获取，尝试获取
    if (!user.value) {
        console.log('[auth middleware] No user, calling fetchUser...');
        await fetchUser();
        console.log('[auth middleware] After fetchUser, user:', user.value);
    }

    // 如果仍然没有用户，重定向到登录页
    if (!user.value) {
        console.log('[auth middleware] Still no user, redirecting to login');
        return navigateTo(`/login?redirect=${to.path.replace('/', '')}`);
    }

    console.log('[auth middleware] User authenticated:', user.value.name);
});
