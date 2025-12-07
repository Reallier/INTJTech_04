/**
 * Admin 权限中间件
 * 
 * 检查用户是否有有效的 admin_token，否则重定向到登录页
 */
export default defineNuxtRouteMiddleware((to, from) => {
    // 如果是登录页，不需要检查
    if (to.path === '/admin/login') {
        return;
    }

    // 检查 admin_token
    const adminToken = useCookie('admin_token');

    if (!adminToken.value) {
        console.log('[admin middleware] No admin token, redirecting to login');
        return navigateTo('/admin/login');
    }

    // 简单验证 token 格式（JWT 应该有 3 个部分）
    const tokenParts = adminToken.value.split('.');
    if (tokenParts.length !== 3) {
        console.log('[admin middleware] Invalid token format, redirecting to login');
        adminToken.value = null;
        return navigateTo('/admin/login');
    }

    // Token 存在且格式正确，允许访问
    console.log('[admin middleware] Admin token valid, allowing access');
});
