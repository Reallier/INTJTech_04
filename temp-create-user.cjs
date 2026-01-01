const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('test123', 10);
    const user = await prisma.user.upsert({
        where: { username: 'testuser' },
        update: { password: hash },
        create: { username: 'testuser', password: hash, name: 'Test User', balance: 100, freeQuota: 50, role: 'user' }
    });
    console.log('Created:', user.id, user.username);
}

main().finally(() => prisma.$disconnect());
