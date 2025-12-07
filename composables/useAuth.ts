export const useAuth = () => {
    const user = useState<any>('user', () => null);

    const fetchUser = async () => {
        console.log('[useAuth] fetchUser called');
        // Use $fetch for direct API call (not useFetch which is for SSR/hydration)
        try {
            const result = await $fetch('/api/user/me', {
                credentials: 'include' // Ensure cookies are sent
            });
            console.log('[useAuth] API result:', result);
            if (result && result.user) {
                user.value = result.user;
                console.log('[useAuth] User set:', user.value);
            } else {
                user.value = null;
                console.log('[useAuth] No user in response');
            }
        } catch (e) {
            console.error('[useAuth] Error fetching user:', e);
            user.value = null;
        }
    };

    const logout = () => {
        const token = useCookie('auth_token');
        token.value = null;
        user.value = null;
        location.href = '/';
    };

    return { user, fetchUser, logout };
};
