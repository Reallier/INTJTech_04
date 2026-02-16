import { verifyUserToken } from '~/server/utils/jwt';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token');
    console.log('[User API] Token cookie:', token);

    if (!token) {
        console.log('[User API] No token found in cookie');
        return { user: null };
    }

    const payload = verifyUserToken(token) as any;
    if (!payload || !payload.id) {
        console.log('[User API] Invalid token payload:', payload);
        return { user: null };
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.id }
    });
    console.log('[User API] User found:', user ? user.id : 'NOT FOUND');

    return { user };
});
