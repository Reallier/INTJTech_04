/**
 * 认证状态管理 Composable
 * 
 * 功能：
 * - 用户状态管理
 * - 自动刷新 Access Token
 * - 登出处理
 */

// Token 刷新状态
let refreshPromise: Promise<boolean> | null = null;

export const useAuth = () => {
    const user = useState<any>('user', () => null);
    const isRefreshing = useState<boolean>('isRefreshing', () => false);

    /**
     * 尝试刷新 Token
     * 返回 true 表示刷新成功，false 表示需要重新登录
     */
    const refreshToken = async (): Promise<boolean> => {
        // 避免重复刷新
        if (refreshPromise) {
            return refreshPromise;
        }

        isRefreshing.value = true;

        refreshPromise = (async () => {
            try {
                console.log('[useAuth] Refreshing token...');
                const result = await $fetch<{
                    success: boolean;
                    accessToken?: string;
                    user?: any;
                }>('/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (result.success && result.user) {
                    user.value = result.user;
                    console.log('[useAuth] Token refreshed successfully');
                    return true;
                } else {
                    console.log('[useAuth] Token refresh failed');
                    user.value = null;
                    return false;
                }
            } catch (e) {
                console.error('[useAuth] Token refresh error:', e);
                user.value = null;
                return false;
            } finally {
                isRefreshing.value = false;
                refreshPromise = null;
            }
        })();

        return refreshPromise;
    };

    /**
     * 获取当前用户信息
     * 如果 Access Token 过期，会自动尝试刷新
     */
    const fetchUser = async () => {
        console.log('[useAuth] fetchUser called, isServer:', import.meta.server);

        try {
            // 在 SSR 环境中，需要手动传递请求头中的 Cookie
            const headers: Record<string, string> = {};
            if (import.meta.server) {
                const requestHeaders = useRequestHeaders(['cookie']);
                if (requestHeaders.cookie) {
                    headers.cookie = requestHeaders.cookie;
                }
            }

            const result = await $fetch('/api/user/me', {
                credentials: 'include',
                headers
            });

            if (result && result.user) {
                user.value = result.user;
                console.log('[useAuth] User set:', user.value?.name || user.value?.phone);
            } else {
                // 尝试刷新 Token
                const refreshed = await refreshToken();
                if (!refreshed) {
                    user.value = null;
                }
            }
        } catch (e: any) {
            console.error('[useAuth] Error fetching user:', e);

            // 如果是 401 错误，尝试刷新 Token
            if (e.statusCode === 401 || e.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    // 刷新成功后重试获取用户
                    try {
                        const result = await $fetch('/api/user/me', { credentials: 'include' });
                        if (result && result.user) {
                            user.value = result.user;
                            return;
                        }
                    } catch (retryError) {
                        console.error('[useAuth] Retry failed:', retryError);
                    }
                }
            }

            user.value = null;
        }
    };

    /**
     * 登出
     */
    const logout = async () => {
        try {
            await $fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (e) {
            console.error('[useAuth] Logout API error:', e);
        }
        user.value = null;
        location.href = '/';
    };

    return { user, fetchUser, logout, refreshToken, isRefreshing };
};
