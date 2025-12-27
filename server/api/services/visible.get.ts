/**
 * 公开 API：获取可见的服务列表
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 服务的完整配置（UI相关）
const SERVICE_UI_CONFIG: Record<string, any> = {
    hirestream: {
        icon: 'fa-magnet',
        description: '智能简历与JD匹配分析，快速筛选候选人',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        href: '/api/services/hirestream-redirect',
        stats: '简历智能评分'
    },
    customerservice: {
        icon: 'fa-comments',
        description: '7×24 自动化客户问答，提升服务效率',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        href: 'https://cs.reallier.top:5443',
        external: true,
        stats: '多轮对话'
    },
    mindai: {
        icon: 'fa-star',
        description: '16型人格智能判定，情景化测试体验',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        href: '/api/services/mindai-redirect',
        stats: '认知功能分析'
    },
    contract: {
        icon: 'fa-file-signature',
        description: 'AI合同风险智能分析，识别潜在问题',
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        href: '/api/services/contract-redirect',
        stats: '风险点识别'
    },
    zhihu: {
        icon: 'fa-book',
        description: '智能文章收藏与语义搜索，打造个人知识库',
        color: '#0ea5e9',
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        href: '/api/services/zhihu-redirect',
        stats: '语义检索'
    },
    boss: {
        icon: 'fa-briefcase',
        description: 'Boss直聘智能求职Agent，自动化投递管理',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        href: '/api/services/boss-redirect',
        stats: '自动打招呼'
    },
    resume: {
        icon: 'fa-file-alt',
        description: 'AI智能简历精修，提升信息密度与表达效果',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        href: '/api/services/resume-redirect',
        stats: '三维优化'
    },
    monitor: {
        icon: 'fa-chart-bar',
        description: '智能资源监控Agent，实时监控服务器状态',
        color: '#14b8a6',
        gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        href: '/api/services/monitor-redirect',
        stats: '实时监控'
    }
};

export default defineEventHandler(async () => {
    // 获取可见的服务配置
    const dbServices = await prisma.serviceConfig.findMany({
        where: { visible: true },
        orderBy: { sortOrder: 'asc' }
    });

    // 合并数据库配置和 UI 配置
    const services = dbServices.map(s => ({
        id: s.serviceId,
        title: s.title,
        ...SERVICE_UI_CONFIG[s.serviceId]
    }));

    return { success: true, services };
});
