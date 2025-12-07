import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

export const signUserToken = (user: { id: number; email: string | null; name: string | null }) => {
    return jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: '7d' });
};

export const verifyUserToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (e) {
        return null;
    }
};
