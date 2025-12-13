<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

definePageMeta({
  middleware: 'auth'
});

const { user, logout } = useAuth();

// 账户信息
const accountInfo = ref({
  balance: 0,
  free_quota: 0,
  total_available: 0,
  total_usage: 0,
  usage_this_month: 0
});

const loading = ref(true);

// 服务列表
const services = [
  {
    id: 'hirestream',
    title: '简历匹配',
    icon: '🧲',
    description: '智能简历与JD匹配分析，快速筛选候选人',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    href: '/api/services/hirestream-redirect',
    stats: '简历智能评分'
  },
  {
    id: 'customerservice',
    title: '智能客服',
    icon: '💬',
    description: '7×24 自动化客户问答，提升服务效率',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    href: 'https://cs.reallier.top:5443',
    external: true,
    stats: '多轮对话'
  },
  {
    id: 'mindai',
    title: 'MBTI判型',
    icon: '🌟',
    description: '16型人格智能判定，情景化测试体验',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    href: '/api/services/mindai-redirect',
    stats: '认知功能分析'
  },
  {
    id: 'contract',
    title: '合同审查',
    icon: '📝',
    description: 'AI合同风险智能分析，识别潜在问题',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    href: '/api/services/contract-redirect',
    stats: '风险点识别'
  }
];

// 获取账户信息
const fetchAccountInfo = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/user/account');
    if (response.success) {
      accountInfo.value = response.data;
    }
  } catch (e) {
    console.error('Failed to fetch account info:', e);
  } finally {
    loading.value = false;
  }
};

// 格式化金额
const formatMoney = (amount: number) => {
  return amount.toFixed(2);
};

// 处理登出
const handleLogout = async () => {
  await logout();
  navigateTo('/');
};

onMounted(() => {
  fetchAccountInfo();
});
</script>

<template>
  <div class="console-page">
    <!-- 顶部导航 -->
    <header class="console-header">
      <div class="header-left">
        <a href="/" class="brand">
          <img src="/site-logo.png" alt="简序智能" class="brand-logo" />
          <span class="brand-name">简序智能</span>
        </a>
      </div>
      <div class="header-right">
        <div class="user-info" v-if="user">
          <img 
            :src="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'" 
            alt="Avatar" 
            class="user-avatar"
          />
          <span class="user-name">{{ user.name }}</span>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          退出
        </button>
      </div>
    </header>

    <main class="console-main">
      <!-- 欢迎区域 -->
      <section class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">
            👋 欢迎回来，<span class="user-highlight">{{ user?.name || '用户' }}</span>
          </h1>
          <p class="welcome-subtitle">选择一个服务开始使用，或查看您的账户信息</p>
        </div>
      </section>

      <!-- 账户概览卡片 -->
      <section class="account-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            账户概览
          </h2>
        </div>
        <div class="account-cards" :class="{ loading: loading }">
          <div class="account-card balance-card">
            <div class="card-icon">💰</div>
            <div class="card-content">
              <div class="card-value">¥{{ formatMoney(accountInfo.balance) }}</div>
              <div class="card-label">账户余额</div>
            </div>
          </div>
          <div class="account-card quota-card">
            <div class="card-icon">🎁</div>
            <div class="card-content">
              <div class="card-value">¥{{ formatMoney(accountInfo.free_quota) }}</div>
              <div class="card-label">免费额度</div>
            </div>
          </div>
          <div class="account-card total-card">
            <div class="card-icon">📊</div>
            <div class="card-content">
              <div class="card-value">¥{{ formatMoney(accountInfo.total_available) }}</div>
              <div class="card-label">可用总额</div>
            </div>
          </div>
          <div class="account-card usage-card">
            <div class="card-icon">📈</div>
            <div class="card-content">
              <div class="card-value">¥{{ formatMoney(accountInfo.usage_this_month) }}</div>
              <div class="card-label">本月消费</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 服务入口 -->
      <section class="services-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            我的服务
          </h2>
        </div>
        <div class="services-grid">
          <a 
            v-for="service in services" 
            :key="service.id"
            :href="service.href"
            :target="service.external ? '_blank' : undefined"
            class="service-card"
            :style="{ '--card-color': service.color, '--card-gradient': service.gradient }"
          >
            <div class="service-icon">{{ service.icon }}</div>
            <div class="service-content">
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
              <div class="service-stats">
                <span class="stats-badge">{{ service.stats }}</span>
              </div>
            </div>
            <div class="service-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </a>
        </div>
      </section>

      <!-- 快速链接 -->
      <section class="quick-links">
        <a href="/" class="quick-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          返回首页
        </a>
        <a href="/about" class="quick-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          关于我们
        </a>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="console-footer">
      <p>© 2025 简序智能 · AI Agent 技术服务</p>
    </footer>
  </div>
</template>

<style scoped>
.console-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Header */
.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left .brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #e2e8f0;
  color: #475569;
}

/* Main */
.console-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 32px;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 40px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.user-highlight {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 16px;
  color: #64748b;
}

/* Section Header */
.section-header {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #334155;
}

.section-title svg {
  color: #6366f1;
}

/* Account Cards */
.account-section {
  margin-bottom: 48px;
}

.account-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.account-cards.loading {
  opacity: 0.6;
}

.account-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.account-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.05);
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: #f8fafc;
  border-radius: 12px;
}

.balance-card .card-icon { background: #ecfdf5; }
.quota-card .card-icon { background: #fef3c7; }
.total-card .card-icon { background: #dbeafe; }
.usage-card .card-icon { background: #fce7f3; }

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.card-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}

/* Services Grid */
.services-section {
  margin-bottom: 48px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.service-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
  background: white;
  border-radius: 20px;
  text-decoration: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--card-gradient);
  opacity: 0;
  transition: opacity 0.3s;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 16px 48px rgba(0, 0, 0, 0.05);
  border-color: var(--card-color);
}

.service-card:hover::before {
  opacity: 1;
}

.service-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: var(--card-gradient);
  border-radius: 16px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.service-content {
  flex: 1;
}

.service-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.service-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12px;
}

.stats-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}

.service-arrow {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 10px;
  color: #94a3b8;
  flex-shrink: 0;
  transition: all 0.3s;
}

.service-card:hover .service-arrow {
  background: var(--card-gradient);
  color: white;
  transform: translateX(4px);
}

/* Quick Links */
.quick-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 48px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.2s;
}

.quick-link:hover {
  background: #e2e8f0;
  color: #334155;
}

/* Footer */
.console-footer {
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  border-top: 1px solid #e2e8f0;
  background: white;
}

/* Responsive */
@media (max-width: 1024px) {
  .account-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .console-header {
    padding: 12px 20px;
  }
  
  .console-main {
    padding: 24px 20px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .account-cards {
    grid-template-columns: 1fr;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .service-card {
    padding: 20px;
  }
  
  .service-icon {
    width: 52px;
    height: 52px;
    font-size: 26px;
  }
  
  .user-name {
    display: none;
  }
}
</style>
