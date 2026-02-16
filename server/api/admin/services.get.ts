/**
 * 管理员获取服务配置列表 API
 */
import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth } from '../../utils/adminAuth';

const prisma = new PrismaClient();

// 默认服务配置
const DEFAULT_SERVICES = [
    { serviceId: 'hirestream', title: '简历匹配', sortOrder: 1 },
    { serviceId: 'customerservice', title: '智能客服', sortOrder: 2 },
    { serviceId: 'mindai', title: 'MBTI判型', sortOrder: 3 },
    { serviceId: 'contract', title: '合同审查', sortOrder: 4 },
    { serviceId: 'zhihu', title: '知乎知识库', sortOrder: 5 },
    { serviceId: 'boss', title: '求职助手', sortOrder: 6 },
    { serviceId: 'resume', title: '简历优化', sortOrder: 7 },
    { serviceId: 'monitor', title: '资源监控', sortOrder: 8 },
];

export default defineEventHandler(async (event) => {
    // 验证管理员 Token（支持 cookie 和 Authorization header）
    verifyAdminAuth(event);

    // 获取数据库中的服务配置
    let services = await prisma.serviceConfig.findMany({
        orderBy: { sortOrder: 'asc' }
    });

    // 如果数据库为空，初始化默认服务配置
    if (services.length === 0) {
        // SQLite 兼容：逐个创建而非 createMany
        for (const s of DEFAULT_SERVICES) {
            await prisma.serviceConfig.create({
                data: {
                    ...s,
                    visible: true
                }
            });
        }
        services = await prisma.serviceConfig.findMany({
            orderBy: { sortOrder: 'asc' }
        });
    }

    return { success: true, services };
});
