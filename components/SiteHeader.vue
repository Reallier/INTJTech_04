<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

const emit = defineEmits(['open-login']);

const { user, fetchUser, logout } = useAuth();
const showProductMenu = ref(false);
const showTechMenu = ref(false);
const showUserCard = ref(false);

const runtimeConfig = useRuntimeConfig();

const productDirectUrls = computed(() => ({
  talentai: runtimeConfig.public.hirestreamUrl || 'https://talentai.intjsys.com',
  mindai: 'https://mbti.intjsys.com',
  contract: '/api/services/contract-redirect',
}));

const handleProductClick = (productKey: string, e: Event) => {
  e.preventDefault();
  showProductMenu.value = false;
  const url = productDirectUrls.value[productKey as keyof typeof productDirectUrls.value];
  if (url) {
    window.open(url, '_blank');
  }
};

const toggleProductMenu = () => {
  showProductMenu.value = !showProductMenu.value;
  showTechMenu.value = false;
  showUserCard.value = false;
};

const toggleTechMenu = () => {
  showTechMenu.value = !showTechMenu.value;
  showProductMenu.value = false;
  showUserCard.value = false;
};

const toggleUserCard = () => {
  showUserCard.value = !showUserCard.value;
  showProductMenu.value = false;
  showTechMenu.value = false;
};

const handleLogout = async () => {
  showUserCard.value = false;
  await logout();
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.nav-dropdown')) {
      showProductMenu.value = false;
      showTechMenu.value = false;
    }
  });
}

onMounted(async () => {
  await fetchUser();
});
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <a href="/" class="logo">简序智能<span>INTJsys</span></a>
      <nav class="nav">
        <div class="nav-item">
          <NuxtLink to="/" class="nav-link" :class="{ active: $route.path === '/' }">
            首页
          </NuxtLink>
        </div>
        <div class="nav-item">
          <button class="nav-link" @click.stop="toggleProductMenu" :class="{ 'active': showProductMenu }">
            产品矩阵
          </button>
        </div>
        <div class="nav-item">
           <button class="nav-link" @click.stop="toggleTechMenu" :class="{ 'active': showTechMenu }">
            技术资源
          </button>
        </div>
        <div class="nav-item">
          <NuxtLink to="/skills" class="nav-link" :class="{ active: $route.path === '/skills' }">
            MCP & Skill
          </NuxtLink>
        </div>

        <!-- 用户信息卡片 -->
        <div v-if="user" class="user-dropdown">
          <button class="btn-user" @click.stop="toggleUserCard">
            {{ user.username || user.email || 'USER' }}
            <span class="arrow">▼</span>
          </button>
          <div v-show="showUserCard" class="user-card">
            <div class="user-card-header">
              <div class="user-avatar">{{ (user.username || user.email || 'U')[0].toUpperCase() }}</div>
              <div class="user-info">
                <div class="user-card-name">{{ user.username || user.email }}</div>
                <div class="user-card-id">ID: {{ user.id }}</div>
              </div>
            </div>
            <div class="user-card-stats">
              <div class="stat-row">
                <span class="stat-label">账户余额</span>
                <span class="stat-value">￥{{ Number(user.balance || 0).toFixed(2) }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">免费额度</span>
                <span class="stat-value">￥{{ Number(user.freeQuota || 0).toFixed(2) }}</span>
              </div>
            </div>
            <button class="btn-logout" @click="handleLogout">登出账号</button>
          </div>
        </div>
        <button v-else @click="emit('open-login')" class="btn-login">LOGIN</button>
      </nav>
    </div>
    
    <!-- Compact Panels -->
    <div class="dropdown-panel" v-show="showProductMenu">
      <div class="panel-inner">
         <div class="panel-grid" :class="user?.role === 'admin' || user?.role === 'internal' ? 'cols-4' : 'cols-3'">
            <a href="#" @click="handleProductClick('talentai', $event)" class="panel-item">
              <div class="panel-icon">[ ]</div>
              <div class="panel-content">
                <div class="panel-head">
                   <span class="panel-title">TALENTAI</span>
                   <span class="panel-meta">PROD</span>
                </div>
                <p class="panel-desc">AI 驱动的确定性人才发现引擎。</p>
              </div>
            </a>
            <a v-if="user?.role === 'admin' || user?.role === 'internal'" href="#" @click="handleProductClick('mindai', $event)" class="panel-item">
              <div class="panel-icon">∞</div>
              <div class="panel-content">
                <div class="panel-head">
                   <span class="panel-title">MINDAI</span>
                   <span class="panel-meta">INTERNAL</span>
                </div>
                <p class="panel-desc">基于荣格八维的 MBTI 判型智能体。</p>
              </div>
            </a>
            <a href="#products" class="panel-item">
              <div class="panel-icon">//</div>
              <div class="panel-content">
                <div class="panel-head">
                   <span class="panel-title">BRIDGE</span>
                   <span class="panel-meta">CUSTOM</span>
                </div>
                <p class="panel-desc">定制化 AI 中台与存量业务注入。</p>
              </div>
            </a>
            <a href="#products" class="panel-item">
              <div class="panel-icon">{ }</div>
              <div class="panel-content">
                <div class="panel-head">
                   <span class="panel-title">LABS</span>
                   <span class="panel-meta">BETA</span>
                </div>
                <p class="panel-desc">前沿工具与原子组件原型库。</p>
              </div>
            </a>
         </div>
      </div>
    </div>

    <div class="dropdown-panel" v-show="showTechMenu">
      <div class="panel-inner">
         <div class="panel-grid cols-4">
            <a href="#deep-dive" class="panel-item">
              <div class="panel-icon">&</div>
              <div class="panel-content">
                <div class="panel-head">
                   <span class="panel-title">PHILOSOPHY</span>
                </div>
                <p class="panel-desc">核心架构设计原则。</p>
              </div>
            </a>
            <a href="#deep-dive" class="panel-item">
              <div class="panel-icon">_</div>
              <div class="panel-content">
                <div class="panel-head">
                   <span class="panel-title">SPECS</span>
                </div>
                <p class="panel-desc">技术栈与实现细节。</p>
              </div>
            </a>
            <a href="/log" class="panel-item">
              <div class="panel-icon">::</div>
              <div class="panel-content">
                <div class="panel-head">
                   <span class="panel-title">LOGS</span>
                   <span class="panel-meta">LIVE</span>
                </div>
                <p class="panel-desc">实时工程演进记录。</p>
              </div>
            </a>
            <a href="/docs" class="panel-item">
              <div class="panel-icon">< ></div>
              <div class="panel-content">
                <div class="panel-head">
                   <span class="panel-title">API</span>
                   <span class="panel-meta">DOCS</span>
                </div>
                <p class="panel-desc">标准化接口集成指南。</p>
              </div>
            </a>
            <a v-if="user?.role === 'admin' || user?.role === 'internal'" href="https://docs.intjsys.com" target="_blank" class="panel-item">
              <div class="panel-icon">≡</div>
              <div class="panel-content">
                <div class="panel-head">
                   <span class="panel-title">DOCS</span>
                   <span class="panel-meta">INTERNAL</span>
                </div>
                <p class="panel-desc">内部技术文档站。</p>
              </div>
            </a>
         </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* CSS Variables */
.header {
  --bg: #ffffff;
  --fg: #111111;
  --muted: #666666;
  --border: rgba(0, 0, 0, 0.08);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  
  position: sticky;
  top: 0;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid var(--fg);
  z-index: 1000;
}

.header-inner {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

.logo {
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.04em;
  text-decoration: none;
  color: var(--fg);
  transition: opacity 0.2s var(--ease);
}

.logo:hover {
  opacity: 0.7;
}

.logo span {
  font-weight: 400;
  color: var(--muted);
  margin-left: 4px;
}

.nav {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-link {
  position: relative;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  color: var(--fg);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--fg);
  transform: scaleX(0);
  transition: transform 0.2s var(--ease);
}

.nav-link.active::after {
  transform: scaleX(1);
}

.btn-login {
  padding: 8px 16px;
  border: 1px solid var(--fg);
  border-radius: 0;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  color: var(--fg);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.btn-login:hover {
  background: var(--fg);
  color: #fff;
}

/* 用户下拉卡片 */
.user-dropdown {
  position: relative;
}

.btn-user {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--fg);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.btn-user:hover {
  background: var(--fg);
  color: #fff;
}

.btn-user .arrow {
  font-size: 10px;
  opacity: 0.6;
}

.user-card {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 240px;
  background: #fff;
  border: 1px solid var(--fg);
  z-index: 1001;
}

.user-card-header {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: var(--fg);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-card-id {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

.user-card-stats {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}

.stat-label {
  font-size: 12px;
  color: var(--muted);
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
}

.btn-logout {
  display: block;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: none;
  font-size: 13px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #f5f5f5;
  color: var(--fg);
}

/* Dropdown Panels */
.dropdown-panel {
  position: absolute;
  top: 72px;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--fg);
  padding: 32px 0;
  z-index: 999;
}

.panel-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

.panel-grid {
  display: grid;
  gap: 16px;
}

.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(4, 1fr); }

.panel-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  text-decoration: none;
  border: 1px solid #000 !important;
  background: #fff;
  transition: background 0.15s;
}

.panel-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.panel-icon {
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-weight: 700;
  font-size: 16px;
  color: var(--fg);
  flex-shrink: 0;
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.panel-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.panel-title {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: -0.01em;
  color: var(--fg);
  text-transform: uppercase;
}

.panel-meta {
  font-family: 'SF Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 6px;
  border: 1px solid var(--border);
}

.panel-desc {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
  margin: 0;
}
</style>
