<template>
  <div class="admin-page">
    <!-- 顶部导航 -->
    <header class="admin-header">
      <div class="header-left">
        <div class="brand-mark"></div>
        <span class="brand-title">简序智能 管理后台</span>
      </div>
      <div class="header-right">
        <button class="btn-logout" @click="handleLogout">退出登录</button>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <main class="admin-main">
      <!-- 统计卡片 -->
      <section class="stats-section">
        <div class="stat-card">
          <div class="stat-icon users-icon">👥</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.total_users }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon balance-icon">💰</div>
          <div class="stat-info">
            <div class="stat-value">¥{{ formatNumber(stats.total_balance) }}</div>
            <div class="stat-label">总余额</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon today-icon">📈</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.today_new_users }}</div>
            <div class="stat-label">今日新增</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon trans-icon">📊</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.total_transactions }}</div>
            <div class="stat-label">交易记录</div>
          </div>
        </div>
      </section>
      
      <!-- 用户列表 -->
      <section class="users-section">
        <div class="section-header">
          <h2>用户管理</h2>
          <div class="header-actions">
            <div class="search-box">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="搜索用户ID或昵称..."
                @input="debouncedSearch"
              />
            </div>
            <button class="btn-create" @click="showCreateUserModal = true">
              + 创建用户
            </button>
          </div>
        </div>
        
        <div class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>用户ID</th>
                <th>昵称</th>
                <th>余额</th>
                <th>免费额度</th>
                <th>可用总额</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.user_id">
                <td class="user-id">{{ user.user_id }}</td>
                <td>{{ user.nickname || '-' }}</td>
                <td class="balance">¥{{ formatNumber(user.balance) }}</td>
                <td class="free-quota">¥{{ formatNumber(user.free_quota) }}</td>
                <td class="total">¥{{ formatNumber(user.total_available) }}</td>
                <td class="date">{{ formatDate(user.created_at) }}</td>
                <td>
                  <button class="btn-recharge" @click="openRechargeModal(user)">
                    充值
                  </button>
                </td>
              </tr>
              <tr v-if="users.length === 0 && !loading">
                <td colspan="7" class="empty-row">暂无用户数据</td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="loading" class="loading-overlay">
            加载中...
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="pagination">
          <button :disabled="page === 0" @click="page--; fetchUsers()">上一页</button>
          <span>第 {{ page + 1 }} 页</span>
          <button :disabled="users.length < pageSize" @click="page++; fetchUsers()">下一页</button>
        </div>
      </section>
    </main>
    
    <!-- 充值弹窗 -->
    <div v-if="showRechargeModal" class="modal-overlay" @click.self="closeRechargeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>用户充值</h3>
          <button class="modal-close" @click="closeRechargeModal">×</button>
        </div>
        <div class="modal-body">
          <p class="user-info">
            用户：<strong>{{ selectedUser?.nickname || selectedUser?.user_id }}</strong>
          </p>
          <p class="current-balance">
            当前余额：¥{{ formatNumber(selectedUser?.balance || 0) }}
          </p>
          <div class="form-group">
            <label>充值金额（元）</label>
            <input 
              v-model.number="rechargeAmount" 
              type="number" 
              min="0.01" 
              step="0.01"
              placeholder="请输入充值金额"
            />
          </div>
          <div class="form-group">
            <label>备注（可选）</label>
            <input 
              v-model="rechargeRemark" 
              type="text" 
              placeholder="充值备注"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeRechargeModal">取消</button>
          <button class="btn-confirm" @click="handleRecharge" :disabled="recharging">
            {{ recharging ? '处理中...' : '确认充值' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 创建用户弹窗 -->
    <div v-if="showCreateUserModal" class="modal-overlay" @click.self="closeCreateUserModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>创建新用户</h3>
          <button class="modal-close" @click="closeCreateUserModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>昵称 *</label>
            <input 
              v-model="newUserNickname" 
              type="text" 
              placeholder="请输入用户昵称"
            />
          </div>
          <p class="hint">用户名和密码将自动生成</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeCreateUserModal">取消</button>
          <button class="btn-confirm" @click="handleCreateUser" :disabled="creatingUser">
            {{ creatingUser ? '创建中...' : '创建用户' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 显示新用户凭证弹窗 -->
    <div v-if="showCredentialsModal" class="modal-overlay">
      <div class="modal-content credentials-modal">
        <div class="modal-header">
          <h3>✅ 用户创建成功</h3>
        </div>
        <div class="modal-body">
          <p class="warning">⚠️ 请妥善保存以下凭证，密码只显示一次！</p>
          <div class="credential-item">
            <label>用户名</label>
            <div class="credential-value">{{ newCredentials.username }}</div>
          </div>
          <div class="credential-item">
            <label>密码</label>
            <div class="credential-value password">{{ newCredentials.password }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-confirm" @click="closeCredentialsModal">我已保存，关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'admin'
});

const ADMIN_API_BASE = useRuntimeConfig().public.hirestreamApiUrl || 'https://app.reallier.top:5443';

// 状态
const loading = ref(false);
const users = ref([]);
const stats = ref({
  total_users: 0,
  total_balance: 0,
  today_new_users: 0,
  total_transactions: 0
});
const page = ref(0);
const pageSize = 20;
const searchQuery = ref('');

// 充值弹窗状态
const showRechargeModal = ref(false);
const selectedUser = ref(null);
const rechargeAmount = ref(null);
const rechargeRemark = ref('');
const recharging = ref(false);

// 创建用户弹窗状态
const showCreateUserModal = ref(false);
const newUserNickname = ref('');
const creatingUser = ref(false);

// 显示凭证弹窗状态
const showCredentialsModal = ref(false);
const newCredentials = ref({ username: '', password: '' });

// 获取 token
const getToken = () => {
  const token = useCookie('admin_token');
  return token.value;
};

// 获取统计数据
const fetchStats = async () => {
  try {
    const response = await $fetch(`${ADMIN_API_BASE}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    stats.value = response;
  } catch (e) {
    console.error('Failed to fetch stats:', e);
  }
};

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      skip: String(page.value * pageSize),
      limit: String(pageSize)
    });
    if (searchQuery.value) {
      params.append('search', searchQuery.value);
    }
    
    const response = await $fetch(`${ADMIN_API_BASE}/api/admin/users?${params}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    users.value = response.users;
  } catch (e) {
    console.error('Failed to fetch users:', e);
  } finally {
    loading.value = false;
  }
};

// 搜索防抖
let searchTimeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 0;
    fetchUsers();
  }, 300);
};

// 打开充值弹窗
const openRechargeModal = (user) => {
  selectedUser.value = user;
  rechargeAmount.value = null;
  rechargeRemark.value = '';
  showRechargeModal.value = true;
};

// 关闭充值弹窗
const closeRechargeModal = () => {
  showRechargeModal.value = false;
  selectedUser.value = null;
};

// 处理充值
const handleRecharge = async () => {
  if (!rechargeAmount.value || rechargeAmount.value <= 0) {
    alert('请输入有效的充值金额');
    return;
  }
  
  recharging.value = true;
  try {
    const response = await $fetch(
      `${ADMIN_API_BASE}/api/admin/users/${selectedUser.value.user_id}/recharge`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        body: {
          amount: rechargeAmount.value,
          remark: rechargeRemark.value || undefined
        }
      }
    );
    
    if (response.success) {
      alert(`充值成功！新余额：¥${response.new_balance.toFixed(2)}`);
      closeRechargeModal();
      fetchUsers();
      fetchStats();
    } else {
      alert(response.message || '充值失败');
    }
  } catch (e) {
    console.error('Recharge failed:', e);
    alert('充值失败，请稍后重试');
  } finally {
    recharging.value = false;
  }
};

// 关闭创建用户弹窗
const closeCreateUserModal = () => {
  showCreateUserModal.value = false;
  newUserNickname.value = '';
};

// 处理创建用户
const handleCreateUser = async () => {
  if (!newUserNickname.value.trim()) {
    alert('请输入用户昵称');
    return;
  }
  
  creatingUser.value = true;
  try {
    const response = await $fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        Cookie: `admin_token=${getToken()}`
      },
      body: {
        nickname: newUserNickname.value
      }
    });
    
    if (response.success) {
      // 显示凭证弹窗
      newCredentials.value = {
        username: response.user.username,
        password: response.password
      };
      closeCreateUserModal();
      showCredentialsModal.value = true;
      fetchStats();
    } else {
      alert(response.message || '创建失败');
    }
  } catch (e: any) {
    console.error('Create user failed:', e);
    alert(e.data?.message || '创建失败，请稍后重试');
  } finally {
    creatingUser.value = false;
  }
};

// 关闭凭证弹窗
const closeCredentialsModal = () => {
  showCredentialsModal.value = false;
  newCredentials.value = { username: '', password: '' };
};

// 登出
const handleLogout = () => {
  const token = useCookie('admin_token');
  token.value = null;
  navigateTo('/admin/login');
};

// 格式化数字
const formatNumber = (num) => {
  if (typeof num !== 'number') return '0.00';
  return num.toFixed(2);
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN');
};

// 初始化
onMounted(() => {
  fetchStats();
  fetchUsers();
});
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f3f4f6;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.btn-logout {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #e5e7eb;
}

.admin-main {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 统计卡片 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 12px;
}

.users-icon { background: #dbeafe; }
.balance-icon { background: #dcfce7; }
.today-icon { background: #fef3c7; }
.trans-icon { background: #f3e8ff; }

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

/* 用户列表 */
.users-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.search-box input {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 250px;
}

.search-box input:focus {
  outline: none;
  border-color: #6366f1;
}

.users-table-container {
  position: relative;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.users-table th {
  background: #f9fafb;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
}

.users-table td {
  font-size: 14px;
  color: #374151;
}

.user-id {
  font-family: monospace;
  font-size: 12px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.balance, .free-quota, .total {
  font-weight: 600;
}

.balance { color: #059669; }
.total { color: #2563eb; }

.date {
  color: #6b7280;
  font-size: 13px;
}

.btn-recharge {
  padding: 6px 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-recharge:hover {
  opacity: 0.9;
}

.empty-row {
  text-align: center;
  color: #6b7280;
  padding: 40px !important;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #6b7280;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.pagination button {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 20px;
}

.user-info, .current-balance {
  margin: 0 0 16px;
  font-size: 14px;
  color: #374151;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  padding: 10px 20px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}

.btn-confirm {
  padding: 10px 20px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 创建用户按钮 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-create {
  padding: 8px 16px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-create:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 凭证弹窗 */
.credentials-modal .modal-body {
  text-align: center;
}

.warning {
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 20px;
}

.hint {
  color: #6b7280;
  font-size: 13px;
  margin: 0;
}

.credential-item {
  margin: 16px 0;
  text-align: left;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.credential-item label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.credential-value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  font-family: monospace;
}

.credential-value.password {
  color: #059669;
}
</style>
