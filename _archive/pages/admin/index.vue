<template>
  <div class="admin-page">
    <!-- 顶部导航 -->
    <header class="admin-header">
      <div class="header-left">
        <img src="/site-logo.png" alt="简序智能 Logo" class="brand-logo" />
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
          <div class="stat-icon users-icon"><FaIcon icon="users" /></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.total_users }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon balance-icon"><FaIcon icon="wallet" /></div>
          <div class="stat-info">
            <div class="stat-value">¥{{ formatNumber(stats.total_balance) }}</div>
            <div class="stat-label">总余额</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon today-icon"><FaIcon icon="chart-line" /></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.today_new_users }}</div>
            <div class="stat-label">今日新增</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon trans-icon"><FaIcon icon="chart-bar" /></div>
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
                <th>账号</th>
                <th>昵称</th>
                <th>角色</th>
                <th>状态</th>
                <th>设备</th>
                <th>余额</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.user_id" :class="{ 'disabled-row': user.status === 'disabled' }">
                <td class="user-id">{{ user.user_id }}</td>
                <td class="user-account">{{ user.email || user.phone || user.username || '-' }}</td>
                <td>{{ user.nickname || '-' }}</td>
                <td class="user-role">
                  <select 
                    :value="user.role" 
                    @change="updateUserRole(user, $event.target.value)"
                    :disabled="updatingRole === user.user_id"
                    class="role-select"
                  >
                    <option value="user">普通用户</option>
                    <option value="internal">内部用户</option>
                    <option value="admin">管理员</option>
                  </select>
                </td>
                <td class="user-status">
                  <span :class="['status-badge', user.status === 'active' ? 'active' : 'disabled']">
                    {{ user.status === 'active' ? '正常' : '已禁用' }}
                  </span>
                </td>
                <td class="device-count">
                  <button class="btn-devices" @click="openSessionsModal(user)" :title="`${user.device_count} 台设备在线`">
                    {{ user.device_count }} 台
                  </button>
                </td>
                <td class="balance">¥{{ formatNumber(user.total_available) }}</td>
                <td class="date">{{ formatDate(user.created_at) }}</td>
                <td class="action-buttons">
                  <button class="btn-recharge" @click="openRechargeModal(user)">充值</button>
                  <button class="btn-adjust" @click="openBalanceAdjustModal(user)">调余额</button>
                  <button class="btn-password" @click="openPasswordModal(user)">改密</button>
                  <button 
                    :class="user.status === 'active' ? 'btn-disable' : 'btn-enable'" 
                    @click="toggleUserStatus(user)"
                    :disabled="togglingStatus === user.user_id"
                  >
                    {{ user.status === 'active' ? '禁用' : '启用' }}
                  </button>
                  <button class="btn-delete" @click="openDeleteModal(user)">删除</button>
                </td>

              </tr>
              <tr v-if="users.length === 0 && !loading">
                <td colspan="9" class="empty-row">暂无用户数据</td>
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
      
      <!-- 订单管理 -->
      <section class="orders-section">
        <div class="section-header">
          <h2><FaIcon icon="receipt" style="margin-right: 8px;" />订单管理</h2>
          <div class="header-actions">
            <div class="search-box">
              <input 
                v-model="orderSearch" 
                type="text" 
                placeholder="搜索订单号/交易号"
                @input="debouncedOrderSearch"
              />
            </div>
            <select v-model="orderStatusFilter" @change="fetchOrders" class="status-filter">
              <option value="ALL">全部状态</option>
              <option value="PENDING">待支付</option>
              <option value="PAID">已支付</option>
              <option value="CLOSED">已关闭</option>
              <option value="REFUNDED">已退款</option>
            </select>
          </div>
        </div>
        
        <div class="orders-table-container">
          <table class="orders-table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>用户</th>
                <th>金额</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="order-id">{{ order.orderId }}</td>
                <td class="order-user">{{ order.user?.email || order.user?.username || order.userId }}</td>
                <td class="order-amount">¥{{ order.amount.toFixed(2) }}</td>
                <td>
                  <span :class="['status-badge', order.status.toLowerCase()]">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                <td class="date">{{ formatDate(order.createdAt) }}</td>
                <td class="action-buttons">
                  <button class="btn-status" @click="openOrderStatusModal(order)">改状态</button>
                </td>
              </tr>
              <tr v-if="orders.length === 0 && !loadingOrders">
                <td colspan="6" class="empty-row">暂无订单数据</td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="loadingOrders" class="loading-overlay">
            加载中...
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="pagination">
          <button :disabled="orderPage === 0" @click="orderPage--; fetchOrders()">上一页</button>
          <span>第 {{ orderPage + 1 }} 页 / 共 {{ orderTotalPages }} 页</span>
          <button :disabled="orderPage >= orderTotalPages - 1" @click="orderPage++; fetchOrders()">下一页</button>
        </div>
      </section>
      
      <!-- 服务管理 -->

      <section class="services-section">
        <div class="section-header">
          <h2><FaIcon icon="cubes" style="margin-right: 8px;" />服务管理</h2>
        </div>
        
        <div class="services-table-container">
          <table class="services-table">
            <thead>
              <tr>
                <th>服务名称</th>
                <th>服务ID</th>
                <th>排序</th>
                <th>显示状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in serviceConfigs" :key="service.serviceId">
                <td class="service-title">{{ service.title }}</td>
                <td class="service-id">{{ service.serviceId }}</td>
                <td class="service-order">{{ service.sortOrder }}</td>
                <td class="service-toggle">
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="service.visible" 
                      @change="toggleServiceVisibility(service)"
                      :disabled="updatingService === service.serviceId"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="toggle-label">{{ service.visible ? '显示' : '隐藏' }}</span>
                </td>
              </tr>
              <tr v-if="serviceConfigs.length === 0 && !loadingServices">
                <td colspan="4" class="empty-row">暂无服务配置</td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="loadingServices" class="loading-overlay">
            加载中...
          </div>
        </div>
      </section>

      <section class="services-section">
        <div class="section-header">
          <h2><FaIcon icon="book" style="margin-right: 8px;" />文档可见度</h2>
        </div>

        <div class="services-table-container">
          <table class="services-table">
            <thead>
              <tr>
                <th>文档</th>
                <th>Slug</th>
                <th>默认层级</th>
                <th>当前层级</th>
                <th>发布状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in docsConfigs" :key="doc.id">
                <td class="service-title">
                  <div>{{ doc.title }}</div>
                  <small class="doc-summary">{{ doc.summary }}</small>
                </td>
                <td class="service-id">{{ doc.slug }}</td>
                <td class="service-order">{{ doc.sourceVisibility }}</td>
                <td class="user-role">
                  <select
                    :value="doc.visibility"
                    @change="updateDocVisibility(doc, $event.target.value)"
                    :disabled="updatingDoc === doc.id"
                    class="role-select"
                  >
                    <option value="public">public</option>
                    <option value="restricted">restricted</option>
                    <option value="internal">internal</option>
                  </select>
                </td>
                <td class="service-toggle">
                  <label class="toggle-switch">
                    <input
                      type="checkbox"
                      :checked="doc.published"
                      @change="toggleDocPublished(doc)"
                      :disabled="updatingDoc === doc.id"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="toggle-label">{{ doc.published ? '已发布' : '已隐藏' }}</span>
                </td>
              </tr>
              <tr v-if="docsConfigs.length === 0 && !loadingDocs">
                <td colspan="5" class="empty-row">暂无文档配置</td>
              </tr>
            </tbody>
          </table>

          <div v-if="loadingDocs" class="loading-overlay">
            加载中...
          </div>
        </div>
      </section>
      
      <!-- License 授权管理 -->
      <section class="license-section">
        <div class="section-header">
          <h2><FaIcon icon="key" style="margin-right: 8px;" />License 授权</h2>
        </div>
        
        <div class="license-content">
          <div class="license-form">
            <h3>生成新授权</h3>
            <div class="form-row">
              <div class="form-group">
                <label>客户名称 *</label>
                <input 
                  v-model="licenseForm.customer" 
                  type="text" 
                  placeholder="如：老王科技有限公司"
                />
              </div>
              <div class="form-group">
                <label>机器指纹 *</label>
                <input 
                  v-model="licenseForm.machine_id" 
                  type="text" 
                  placeholder="客户服务器的 Machine ID"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>授权版本</label>
                <select v-model="licenseForm.edition">
                  <option value="standard">标准版 (50用户)</option>
                  <option value="professional">专业版 (200用户)</option>
                  <option value="enterprise">企业版 (1000用户)</option>
                  <option value="flagship">旗舰版 (无限)</option>
                </select>
              </div>
              <div class="form-group">
                <label>有效天数</label>
                <input 
                  v-model.number="licenseForm.days" 
                  type="number" 
                  min="1"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group full-width">
                <label>客户邮箱 (可选，填写后自动发送授权邮件)</label>
                <input 
                  v-model="licenseForm.customer_email" 
                  type="email" 
                  placeholder="zhangsan@example.com"
                />
              </div>
            </div>
            <div class="form-actions">
              <button 
                class="btn-generate" 
                @click="handleGenerateLicense" 
                :disabled="generatingLicense"
              >
                <FaIcon icon="magic" style="margin-right: 6px;" />
                {{ generatingLicense ? '生成中...' : '生成 License' }}
              </button>
            </div>
          </div>
          
          <!-- 生成结果 -->
          <div v-if="generatedLicense" class="license-result">
            <div class="result-header">
              <FaIcon icon="check-circle" style="color: #22c55e; margin-right: 8px;" />
              <span>License 生成成功</span>
              <span v-if="generatedLicense.email_sent" class="email-badge">
                <FaIcon icon="envelope" /> 邮件已发送
              </span>
            </div>
            <div class="result-info">
              <div class="info-item">
                <span class="label">License ID:</span>
                <span class="value">{{ generatedLicense.lic_id }}</span>
              </div>
              <div class="info-item">
                <span class="label">有效期至:</span>
                <span class="value">{{ formatDate(generatedLicense.expires_at) }}</span>
              </div>
            </div>
            <div class="license-key-box">
              <label>License Key (点击复制):</label>
              <div 
                class="key-content" 
                @click="copyLicenseKey"
                title="点击复制"
              >
                {{ generatedLicense.license_key }}
              </div>
              <span v-if="keyCopied" class="copy-hint">✓ 已复制</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 退款申请审核 -->
      <section class="refund-section">
        <div class="section-header">
          <h2><FaIcon icon="undo" style="margin-right: 8px;" />退款申请审核</h2>
          <button class="btn-refresh" @click="fetchRefundRequests">
            <FaIcon icon="sync" :class="{ spinning: loadingRefunds }" />
          </button>
        </div>
        
        <div class="refund-table-container">
          <table class="refund-table">
            <thead>
              <tr>
                <th>申请ID</th>
                <th>用户</th>
                <th>退款金额</th>
                <th>申请原因</th>
                <th>申请时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="refund in refundRequests" :key="refund.id">
                <td class="refund-id">{{ refund.id }}</td>
                <td class="refund-user">{{ refund.user?.name || refund.user?.email || refund.userId }}</td>
                <td class="refund-amount">¥{{ Number(refund.amount).toFixed(2) }}</td>
                <td class="refund-reason">{{ refund.reason || '-' }}</td>
                <td class="refund-date">{{ formatDate(refund.createdAt) }}</td>
                <td class="refund-status">
                  <span :class="['status-badge', getRefundStatusClass(refund.status)]">
                    {{ getRefundStatusText(refund.status) }}
                  </span>
                </td>
                <td class="action-buttons" v-if="refund.status === 'PENDING'">
                  <button class="btn-approve" @click="handleRefundAction(refund, 'approve')" :disabled="processingRefund === refund.id">
                    通过
                  </button>
                  <button class="btn-reject" @click="handleRefundAction(refund, 'reject')" :disabled="processingRefund === refund.id">
                    拒绝
                  </button>
                </td>
                <td v-else class="action-buttons">
                  <span class="processed-hint">{{ refund.status === 'APPROVED' ? '已退款' : '已拒绝' }}</span>
                </td>
              </tr>
              <tr v-if="refundRequests.length === 0 && !loadingRefunds">
                <td colspan="7" class="empty-row">暂无退款申请</td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="loadingRefunds" class="loading-overlay">
            加载中...
          </div>
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
            <label>用户名 *</label>
            <input 
              v-model="newUsername" 
              type="text" 
              placeholder="请输入登录用户名"
            />
          </div>
          <div class="form-group">
            <label>昵称（可选）</label>
            <input 
              v-model="newUserNickname" 
              type="text" 
              placeholder="请输入显示昵称"
            />
          </div>
          <p class="hint">密码将自动生成</p>
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
          <h3><FaIcon icon="check-circle" style="margin-right: 8px; color: #22c55e;" />用户创建成功</h3>
        </div>
        <div class="modal-body">
          <p class="warning"><FaIcon icon="exclamation-triangle" style="margin-right: 6px;" />请妥善保存以下凭证，密码只显示一次！</p>
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
    
    <!-- 删除用户确认弹窗 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <h3><FaIcon icon="exclamation-triangle" style="margin-right: 8px; color: #ef4444;" />确认删除</h3>
          <button class="modal-close" @click="closeDeleteModal">×</button>
        </div>
        <div class="modal-body">
          <p class="delete-warning">确定要删除用户 <strong>{{ userToDelete?.nickname || userToDelete?.user_id }}</strong> 吗？</p>
          <p class="delete-info">此操作将同时删除该用户的所有使用记录和交易记录，且不可恢复。</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeDeleteModal">取消</button>
          <button class="btn-danger" @click="handleDeleteUser" :disabled="deleting">
            {{ deleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 设备管理弹窗 -->
    <div v-if="showSessionsModal" class="modal-overlay" @click.self="closeSessionsModal">
      <div class="modal-content sessions-modal">
        <div class="modal-header">
          <h3><FaIcon icon="laptop" style="margin-right: 8px;" />登录设备管理</h3>
          <button class="modal-close" @click="closeSessionsModal">×</button>
        </div>
        <div class="modal-body">
          <p class="user-info">用户：<strong>{{ sessionsUser?.nickname || sessionsUser?.email || sessionsUser?.user_id }}</strong></p>
          
          <div v-if="loadingSessions" class="loading-text">加载中...</div>
          
          <div v-else-if="sessions.length === 0" class="empty-sessions">
            暂无登录设备
          </div>
          
          <div v-else class="sessions-list">
            <div v-for="session in sessions" :key="session.id" class="session-item">
              <div class="session-info">
                <div class="session-device">
                  <FaIcon :icon="session.device === 'iPhone' || session.device === 'Android' ? 'mobile-alt' : 'laptop'" />
                  {{ session.device }}
                </div>
                <div class="session-time">
                  登录时间：{{ formatDate(session.createdAt) }}
                </div>
              </div>
              <button 
                class="btn-kick" 
                @click="kickSession(session.id)"
                :disabled="deletingSession === session.id"
              >
                {{ deletingSession === session.id ? '处理中...' : '踢下线' }}
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeSessionsModal">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 余额调整弹窗 -->
    <div v-if="showBalanceAdjustModal" class="modal-overlay" @click.self="closeBalanceAdjustModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>余额调整</h3>
          <button class="modal-close" @click="closeBalanceAdjustModal">×</button>
        </div>
        <div class="modal-body">
          <p class="user-info">
            用户：<strong>{{ balanceAdjustUser?.nickname || balanceAdjustUser?.email || balanceAdjustUser?.user_id }}</strong>
          </p>
          <p class="user-info">
            当前余额：<strong>¥{{ formatNumber(balanceAdjustUser?.total_available || 0) }}</strong>
          </p>
          <div class="form-group">
            <label>调整类型</label>
            <select v-model="balanceAdjustType">
              <option value="COMPENSATION">补偿（增加余额）</option>
              <option value="DEDUCTION">扣减（减少余额）</option>
              <option value="PROMOTION">促销赠送</option>
            </select>
          </div>
          <div class="form-group">
            <label>调整金额</label>
            <input 
              v-model.number="balanceAdjustAmount" 
              type="number" 
              min="0.01"
              step="0.01"
              placeholder="请输入金额（正数）"
            />
          </div>
          <div class="form-group">
            <label>调整原因 *</label>
            <textarea 
              v-model="balanceAdjustReason" 
              placeholder="请输入调整原因（必填）"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeBalanceAdjustModal">取消</button>
          <button class="btn-confirm" @click="handleBalanceAdjust" :disabled="adjustingBalance">
            {{ adjustingBalance ? '处理中...' : '确认调整' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 密码修改弹窗 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>修改密码</h3>
          <button class="modal-close" @click="closePasswordModal">×</button>
        </div>
        <div class="modal-body">
          <p class="user-info">
            用户：<strong>{{ passwordUser?.nickname || passwordUser?.username || passwordUser?.email || passwordUser?.user_id }}</strong>
          </p>
          <div class="form-group">
            <label>新密码</label>
            <input 
              v-model="newPassword" 
              type="password" 
              placeholder="请输入新密码（至少8位）"
            />
          </div>
          <div class="form-group">
            <label>确认密码</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="请再次输入新密码"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closePasswordModal">取消</button>
          <button class="btn-confirm" @click="handlePasswordChange" :disabled="changingPassword">
            {{ changingPassword ? '处理中...' : '确认修改' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 订单状态修改弹窗 -->
    <div v-if="showOrderStatusModal" class="modal-overlay" @click.self="closeOrderStatusModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>修改订单状态</h3>
          <button class="modal-close" @click="closeOrderStatusModal">×</button>
        </div>
        <div class="modal-body">
          <p class="user-info">
            订单号：<strong>{{ orderToUpdate?.orderId }}</strong>
          </p>
          <p class="user-info">
            当前状态：<strong>{{ getStatusLabel(orderToUpdate?.status || '') }}</strong>
          </p>
          <div class="form-group">
            <label>新状态</label>
            <select v-model="newOrderStatus">
              <option value="PENDING">待支付</option>
              <option value="PAID">已支付</option>
              <option value="CLOSED">已关闭</option>
              <option value="REFUNDED">已退款</option>
            </select>
          </div>
          <div class="form-group">
            <label>修改原因（可选）</label>
            <textarea 
              v-model="orderStatusReason" 
              placeholder="请输入修改原因"
              rows="2"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeOrderStatusModal">取消</button>
          <button class="btn-confirm" @click="handleOrderStatusChange" :disabled="updatingOrderStatus">
            {{ updatingOrderStatus ? '处理中...' : '确认修改' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
definePageMeta({
  middleware: 'admin'
});

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

// 余额调整弹窗状态
const showBalanceAdjustModal = ref(false);
const balanceAdjustUser = ref(null);
const balanceAdjustAmount = ref(null);
const balanceAdjustType = ref('COMPENSATION');
const balanceAdjustReason = ref('');
const adjustingBalance = ref(false);

// 密码修改弹窗状态
const showPasswordModal = ref(false);
const passwordUser = ref(null);
const newPassword = ref('');
const confirmPassword = ref('');
const changingPassword = ref(false);

// 订单管理状态
const orders = ref([]);
const loadingOrders = ref(false);
const orderPage = ref(0);
const orderTotalPages = ref(1);
const orderSearch = ref('');
const orderStatusFilter = ref('ALL');

// 订单状态修改弹窗
const showOrderStatusModal = ref(false);
const orderToUpdate = ref(null);
const newOrderStatus = ref('');
const orderStatusReason = ref('');
const updatingOrderStatus = ref(false);

// 创建用户弹窗状态

const showCreateUserModal = ref(false);
const newUsername = ref('');
const newUserNickname = ref('');
const creatingUser = ref(false);

// 显示凭证弹窗状态
const showCredentialsModal = ref(false);
const newCredentials = ref({ username: '', password: '' });

// 删除用户弹窗状态
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const deleting = ref(false);

// 服务配置状态
const serviceConfigs = ref([]);
const loadingServices = ref(false);
const updatingService = ref('');

// 文档配置状态
const docsConfigs = ref([]);
const loadingDocs = ref(false);
const updatingDoc = ref('');

// 禁用/启用状态
const togglingStatus = ref(null);

// 角色更新状态
const updatingRole = ref(null);

// 设备管理弹窗状态
const showSessionsModal = ref(false);
const sessionsUser = ref(null);
const sessions = ref([]);
const loadingSessions = ref(false);
const deletingSession = ref('');

// License 生成状态
const licenseForm = ref({
  customer: '',
  machine_id: '',
  edition: 'professional',
  days: 365,
  customer_email: ''
});
const generatingLicense = ref(false);
const generatedLicense = ref(null);
const keyCopied = ref(false);

// 退款审核状态
const refundRequests = ref([]);
const loadingRefunds = ref(false);
const processingRefund = ref(null);

// 获取 token
const getToken = () => {
  const token = useCookie('admin_token');
  return token.value;
};

// 处理 API 错误 - 401 时跳转登录
const handleApiError = (e) => {
  if (e?.status === 401 || e?.statusCode === 401) {
    console.warn('[Admin] Token 已过期，跳转登录...');
    const adminToken = useCookie('admin_token');
    adminToken.value = null;
    navigateTo('/admin/login');
    return true;
  }
  return false;
};

// 获取统计数据 - 使用官网 API
const fetchStats = async () => {
  const token = getToken();
  if (!token) {
    console.error('No token available');
    return;
  }
  try {
    const response = await $fetch('/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    stats.value = response;
  } catch (e) {
    if (!handleApiError(e)) {
      console.error('Failed to fetch stats:', e);
    }
  }
};

// 获取用户列表 - 使用官网 API
const fetchUsers = async () => {
  const token = getToken();
  if (!token) {
    console.error('No token available');
    return;
  }
  loading.value = true;
  try {
    const params = new URLSearchParams({
      skip: String(page.value * pageSize),
      limit: String(pageSize)
    });
    if (searchQuery.value) {
      params.append('search', searchQuery.value);
    }
    
    const response = await $fetch(`/api/admin/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    users.value = response.users;
  } catch (e) {
    if (!handleApiError(e)) {
      console.error('Failed to fetch users:', e);
    }
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
      `/api/admin/users/${selectedUser.value.user_id}/recharge`,
      {
        method: 'POST',
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

// 打开余额调整弹窗
const openBalanceAdjustModal = (user) => {
  balanceAdjustUser.value = user;
  balanceAdjustAmount.value = null;
  balanceAdjustType.value = 'COMPENSATION';
  balanceAdjustReason.value = '';
  showBalanceAdjustModal.value = true;
};

// 关闭余额调整弹窗
const closeBalanceAdjustModal = () => {
  showBalanceAdjustModal.value = false;
  balanceAdjustUser.value = null;
};

// 处理余额调整
const handleBalanceAdjust = async () => {
  if (!balanceAdjustAmount.value || balanceAdjustAmount.value === 0) {
    alert('请输入有效的调整金额');
    return;
  }
  if (!balanceAdjustReason.value.trim()) {
    alert('请输入调整原因');
    return;
  }
  
  adjustingBalance.value = true;
  try {
    const response = await $fetch(
      `/api/admin/users/${balanceAdjustUser.value.user_id}/balance-adjust`,
      {
        method: 'POST',
        body: {
          amount: balanceAdjustType.value === 'DEDUCTION' ? -Math.abs(balanceAdjustAmount.value) : Math.abs(balanceAdjustAmount.value),
          type: balanceAdjustType.value,
          reason: balanceAdjustReason.value.trim()
        }
      }
    );
    
    if (response.success) {
      alert(response.message);
      closeBalanceAdjustModal();
      fetchUsers();
      fetchStats();
    } else {
      alert(response.message || '调整失败');
    }
  } catch (e) {
    console.error('Balance adjust failed:', e);
    alert(e?.data?.message || '调整失败，请稍后重试');
  } finally {
    adjustingBalance.value = false;
  }
};

// 打开密码修改弹窗
const openPasswordModal = (user) => {
  passwordUser.value = user;
  newPassword.value = '';
  confirmPassword.value = '';
  showPasswordModal.value = true;
};

// 关闭密码修改弹窗
const closePasswordModal = () => {
  showPasswordModal.value = false;
  passwordUser.value = null;
  newPassword.value = '';
  confirmPassword.value = '';
};

// 处理密码修改
const handlePasswordChange = async () => {
  if (!newPassword.value || newPassword.value.length < 8) {
    alert('密码长度至少8位');
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    alert('两次输入的密码不一致');
    return;
  }
  
  changingPassword.value = true;
  try {
    const response = await $fetch(
      `/api/admin/users/${passwordUser.value.user_id}/password`,
      {
        method: 'PUT',
        body: {
          password: newPassword.value
        }
      }
    );
    
    if (response.success) {
      alert('密码修改成功');
      closePasswordModal();
    } else {
      alert(response.message || '修改失败');
    }
  } catch (e) {
    console.error('Password change failed:', e);
    alert(e?.data?.message || '修改失败，请稍后重试');
  } finally {
    changingPassword.value = false;
  }
};

// ==== 订单管理函数 ====

// 状态标签映射
const getStatusLabel = (status) => {
  const labels = {
    'PENDING': '待支付',
    'PAID': '已支付',
    'CLOSED': '已关闭',
    'REFUNDED': '已退款',
  };
  return labels[status] || status;
};

// 获取订单列表
const fetchOrders = async () => {
  const token = getToken();
  if (!token) {
    console.error('No token available');
    return;
  }
  loadingOrders.value = true;
  try {
    const params = new URLSearchParams({
      page: orderPage.value.toString(),
      pageSize: '15',
    });
    if (orderStatusFilter.value !== 'ALL') {
      params.append('status', orderStatusFilter.value);
    }
    if (orderSearch.value.trim()) {
      params.append('search', orderSearch.value.trim());
    }
    
    const response = await $fetch(`/api/admin/orders?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      orders.value = response.orders;
      orderTotalPages.value = response.pagination.totalPages || 1;
    }
  } catch (e) {
    console.error('Fetch orders failed:', e);
    if (!handleApiError(e)) {
      alert('获取订单列表失败');
    }
  } finally {
    loadingOrders.value = false;
  }
};

// 订单搜索防抖
let orderSearchTimeout;
const debouncedOrderSearch = () => {
  clearTimeout(orderSearchTimeout);
  orderSearchTimeout = setTimeout(() => {
    orderPage.value = 0;
    fetchOrders();
  }, 300);
};

// 打开订单状态修改弹窗
const openOrderStatusModal = (order) => {
  orderToUpdate.value = order;
  newOrderStatus.value = order.status;
  orderStatusReason.value = '';
  showOrderStatusModal.value = true;
};

// 关闭订单状态修改弹窗
const closeOrderStatusModal = () => {
  showOrderStatusModal.value = false;
  orderToUpdate.value = null;
  newOrderStatus.value = '';
  orderStatusReason.value = '';
};

// 处理订单状态修改
const handleOrderStatusChange = async () => {
  if (!newOrderStatus.value) {
    alert('请选择新状态');
    return;
  }
  if (newOrderStatus.value === orderToUpdate.value.status) {
    alert('新状态与当前状态相同');
    return;
  }
  
  updatingOrderStatus.value = true;
  try {
    const response = await $fetch(
      `/api/admin/orders/${orderToUpdate.value.id}/status`,
      {
        method: 'PUT',
        body: {
          status: newOrderStatus.value,
          reason: orderStatusReason.value.trim() || undefined,
        },
      }
    );
    
    if (response.success) {
      alert(response.message);
      closeOrderStatusModal();
      fetchOrders();
    } else {
      alert(response.message || '修改失败');
    }
  } catch (e) {
    console.error('Order status change failed:', e);
    alert(e?.data?.message || '修改失败，请稍后重试');
  } finally {
    updatingOrderStatus.value = false;
  }
};

// 关闭创建用户弹窗

const closeCreateUserModal = () => {
  showCreateUserModal.value = false;
  newUsername.value = '';
  newUserNickname.value = '';
};

// 处理创建用户
const handleCreateUser = async () => {
  if (!newUsername.value.trim()) {
    alert('请输入用户名');
    return;
  }
  
  creatingUser.value = true;
  try {
    const response = await $fetch('/api/admin/users', {
      method: 'POST',
      body: {
        username: newUsername.value,
        nickname: newUserNickname.value || newUsername.value
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
      fetchUsers();
    } else {
      alert(response.message || '创建失败');
    }
  } catch (e) {
    console.error('Create user failed:', e);
    alert('创建失败，请稍后重试');
  } finally {
    creatingUser.value = false;
  }
};

// 关闭凭证弹窗
const closeCredentialsModal = () => {
  showCredentialsModal.value = false;
  newCredentials.value = { username: '', password: '' };
};

// 打开删除确认弹窗
const openDeleteModal = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

// 关闭删除确认弹窗
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

// 处理删除用户
const handleDeleteUser = async () => {
  if (!userToDelete.value) return;
  
  deleting.value = true;
  try {
    const response = await $fetch(
      `/api/admin/users/${userToDelete.value.user_id}`,
      {
        method: 'DELETE'
      }
    );
    
    if (response.success) {
      alert(response.message);
      closeDeleteModal();
      fetchUsers();
      fetchStats();
    } else {
      alert(response.message || '删除失败');
    }
  } catch (e) {
    console.error('Delete user failed:', e);
    alert('删除失败，请稍后重试');
  } finally {
    deleting.value = false;
  }
};

// 禁用/启用用户
const toggleUserStatus = async (user) => {
  const token = getToken();
  if (!token) return;
  togglingStatus.value = user.user_id;
  try {
    const response = await $fetch(
      `/api/admin/users/${user.user_id}/toggle-status`,
      { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.success) {
      user.status = response.status;
      if (response.status === 'disabled') {
        user.device_count = 0;
      }
    } else {
      alert(response.message || '操作失败');
    }
  } catch (e) {
    console.error('Toggle status failed:', e);
    alert('操作失败，请稍后重试');
  } finally {
    togglingStatus.value = null;
  }
};

// 更新用户角色
const updateUserRole = async (user, newRole) => {
  if (user.role === newRole) return;
  const token = getToken();
  if (!token) return;
  
  updatingRole.value = user.user_id;
  try {
    const response = await $fetch(
      `/api/admin/users/${user.user_id}/role`,
      { 
        method: 'PATCH', 
        body: { role: newRole },
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.success) {
      user.role = newRole;
    } else {
      alert(response.message || '更新失败');
    }
  } catch (e) {
    console.error('Update role failed:', e);
    alert('更新失败，请稍后重试');
  } finally {
    updatingRole.value = null;
  }
};

// 打开设备管理弹窗
const openSessionsModal = async (user) => {
  sessionsUser.value = user;
  showSessionsModal.value = true;
  loadingSessions.value = true;
  
  try {
    const response = await $fetch(`/api/admin/users/${user.user_id}/sessions`);
    if (response.success) {
      sessions.value = response.sessions;
    }
  } catch (e) {
    console.error('Fetch sessions failed:', e);
  } finally {
    loadingSessions.value = false;
  }
};

// 关闭设备管理弹窗
const closeSessionsModal = () => {
  showSessionsModal.value = false;
  sessionsUser.value = null;
  sessions.value = [];
};

// 踢下线
const kickSession = async (sessionId) => {
  deletingSession.value = sessionId;
  try {
    const response = await $fetch(`/api/admin/sessions/${sessionId}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      sessions.value = sessions.value.filter(s => s.id !== sessionId);
      if (sessionsUser.value) {
        sessionsUser.value.device_count--;
      }
    } else {
      alert(response.message || '操作失败');
    }
  } catch (e) {
    console.error('Kick session failed:', e);
    alert('操作失败');
  } finally {
    deletingSession.value = '';
  }
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

// 获取服务配置列表
const fetchServiceConfigs = async () => {
  const token = getToken();
  if (!token) return;
  loadingServices.value = true;
  try {
    const response = await $fetch('/api/admin/services', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.success) {
      serviceConfigs.value = response.services;
    }
  } catch (e) {
    if (!handleApiError(e)) {
      console.error('Failed to fetch service configs:', e);
    }
  } finally {
    loadingServices.value = false;
  }
};

// 切换服务显示状态
const toggleServiceVisibility = async (service) => {
  updatingService.value = service.serviceId;
  try {
    const response = await $fetch('/api/admin/services', {
      method: 'PUT',
      body: {
        serviceId: service.serviceId,
        visible: !service.visible
      }
    });
    
    if (response.success) {
      // 更新本地状态
      service.visible = !service.visible;
    } else {
      alert('更新失败');
    }
  } catch (e) {
    console.error('Failed to update service:', e);
    alert('更新失败，请稍后重试');
  } finally {
    updatingService.value = '';
  }
};

// 获取文档配置列表
const fetchDocsConfigs = async () => {
  const token = getToken();
  if (!token) return;
  loadingDocs.value = true;
  try {
    const response = await $fetch('/api/admin/docs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.success) {
      docsConfigs.value = response.docs;
    }
  } catch (e) {
    if (!handleApiError(e)) {
      console.error('Failed to fetch docs configs:', e);
    }
  } finally {
    loadingDocs.value = false;
  }
};

const updateDocVisibility = async (doc, visibility) => {
  updatingDoc.value = doc.id;
  try {
    const response = await $fetch('/api/admin/docs', {
      method: 'PUT',
      body: {
        docId: doc.id,
        visibility
      }
    });

    if (response.success) {
      doc.visibility = visibility;
    } else {
      alert('更新失败');
    }
  } catch (e) {
    console.error('Failed to update doc visibility:', e);
    alert('更新失败，请稍后重试');
  } finally {
    updatingDoc.value = '';
  }
};

const toggleDocPublished = async (doc) => {
  updatingDoc.value = doc.id;
  try {
    const response = await $fetch('/api/admin/docs', {
      method: 'PUT',
      body: {
        docId: doc.id,
        published: !doc.published
      }
    });

    if (response.success) {
      doc.published = !doc.published;
    } else {
      alert('更新失败');
    }
  } catch (e) {
    console.error('Failed to update doc published state:', e);
    alert('更新失败，请稍后重试');
  } finally {
    updatingDoc.value = '';
  }
};

// ============ License 生成 ============

// 生成 License
const handleGenerateLicense = async () => {
  if (!licenseForm.value.customer.trim()) {
    alert('请输入客户名称');
    return;
  }
  if (!licenseForm.value.machine_id.trim()) {
    alert('请输入机器指纹');
    return;
  }
  
  const token = getToken();
  if (!token) return;
  
  generatingLicense.value = true;
  generatedLicense.value = null;
  keyCopied.value = false;
  
  try {
    const response = await $fetch('/api/admin/license', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: {
        customer: licenseForm.value.customer,
        machine_id: licenseForm.value.machine_id,
        edition: licenseForm.value.edition,
        days: licenseForm.value.days,
        customer_email: licenseForm.value.customer_email || undefined
      }
    });
    
    if (response.success) {
      generatedLicense.value = response;
      // 清空表单（保留版本和天数）
      licenseForm.value.customer = '';
      licenseForm.value.machine_id = '';
      licenseForm.value.customer_email = '';
    } else {
      alert(response.message || 'License 生成失败');
    }
  } catch (e) {
    console.error('Generate license failed:', e);
    alert(e.data?.message || 'License 生成失败，请检查服务器配置');
  } finally {
    generatingLicense.value = false;
  }
};

// 复制 License Key
const copyLicenseKey = async () => {
  if (!generatedLicense.value?.license_key) return;
  
  try {
    await navigator.clipboard.writeText(generatedLicense.value.license_key);
    keyCopied.value = true;
    setTimeout(() => { keyCopied.value = false; }, 2000);
  } catch (e) {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = generatedLicense.value.license_key;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    keyCopied.value = true;
    setTimeout(() => { keyCopied.value = false; }, 2000);
  }
};

// ============ 退款审核 ============

// 获取退款申请列表
const fetchRefundRequests = async () => {
  const token = getToken();
  if (!token) return;
  loadingRefunds.value = true;
  try {
    const response = await $fetch('/api/admin/refunds', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.success) {
      refundRequests.value = response.refunds;
    }
  } catch (e) {
    if (!handleApiError(e)) {
      console.error('Failed to fetch refund requests:', e);
    }
  } finally {
    loadingRefunds.value = false;
  }
};

// 退款状态文本
const getRefundStatusText = (status) => {
  const map = {
    'PENDING': '待审核',
    'APPROVED': '已通过',
    'REJECTED': '已拒绝'
  };
  return map[status] || status;
};

// 退款状态样式类
const getRefundStatusClass = (status) => {
  const map = {
    'PENDING': 'pending',
    'APPROVED': 'active',
    'REJECTED': 'disabled'
  };
  return map[status] || '';
};

// 处理退款审核
const handleRefundAction = async (refund, action) => {
  const token = getToken();
  if (!token) return;
  
  const confirmMsg = action === 'approve' 
    ? `确定通过此退款申请吗？将退还 ¥${Number(refund.amount).toFixed(2)} 给用户` 
    : '确定拒绝此退款申请吗？';
    
  if (!confirm(confirmMsg)) return;
  
  processingRefund.value = refund.id;
  try {
    const response = await $fetch(`/api/admin/refunds/${refund.id}/${action}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.success) {
      alert(response.message);
      fetchRefundRequests();
      fetchStats();
    } else {
      alert(response.message || '操作失败');
    }
  } catch (e) {
    console.error('Refund action failed:', e);
    alert('操作失败，请稍后重试');
  } finally {
    processingRefund.value = null;
  }
};

// 初始化
onMounted(() => {
  fetchStats();
  fetchUsers();
  fetchOrders();
  fetchServiceConfigs();
  fetchDocsConfigs();
  fetchRefundRequests();
});
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background-color: #fafafa;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
}

.admin-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.brand-title {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-logout {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #e0e0e0;
  font-size: 12px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  border-color: #000000;
  color: #000000;
}

.admin-main {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 统计卡片 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: #000000;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 1px solid #e0e0e0;
  color: #000000;
}

.users-icon, .balance-icon, .today-icon, .trans-icon { 
  background: #fafafa; 
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 11px;
  color: #666666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

/* 快捷入口 */
.quick-links-section {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.quick-link-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  text-decoration: none;
  transition: all 0.2s;
  flex: 1;
  max-width: 400px;
}

.quick-link-card:hover {
  border-color: #000000;
}

.docs-card {
  border-left: 3px solid #000000;
}

.quick-link-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  color: #000000;
}

.quick-link-info {
  flex: 1;
}

.quick-link-title {
  font-size: 13px;
  font-weight: 700;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.quick-link-desc {
  font-size: 12px;
  color: #666666;
  margin-top: 2px;
}

.quick-link-arrow {
  font-size: 12px;
  color: #999999;
}

/* 用户列表 */
.users-section {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.section-header h2 {
  font-size: 13px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-box input {
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  font-size: 13px;
  width: 260px;
  background: #fafafa;
  transition: all 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #000000;
  background: #ffffff;
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
  padding: 8px 14px;
  background: #000000;
  color: #ffffff;
  border: none;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-recharge:hover {
  background: #333333;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-delete {
  padding: 8px 14px;
  background: transparent;
  color: #cc0000;
  border: 1px solid #ffcccc;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: #fff5f5;
  border-color: #cc0000;
}

.btn-adjust {
  padding: 8px 14px;
  background: transparent;
  color: #059669;
  border: 1px solid #059669;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-adjust:hover {
  background: #f0fdf4;
}

.btn-password {
  padding: 8px 14px;
  background: transparent;
  color: #6366f1;
  border: 1px solid #6366f1;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-password:hover {
  background: #eef2ff;
}

.btn-danger {
  padding: 12px 20px;
  background: #cc0000;
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.btn-danger:hover {
  background: #aa0000;
}

.btn-danger:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.delete-modal .modal-body {
  text-align: center;
}

.delete-warning {
  font-size: 15px;
  color: #000000;
  margin-bottom: 12px;
}

.delete-info {
  font-size: 13px;
  color: #666666;
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
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 420px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
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
  color: #666666;
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
  padding: 12px 20px;
  background: transparent;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.btn-cancel:hover {
  border-color: #000000;
}

.btn-confirm {
  padding: 12px 20px;
  background: #000000;
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
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
  padding: 10px 18px;
  background: #000000;
  color: #ffffff;
  border: none;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-create:hover {
  background: #333333;
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

/* 订单管理区块 */
.orders-section {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 24px;
  margin-bottom: 24px;
}

.orders-section .header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.orders-section .search-box input {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  font-size: 13px;
  width: 200px;
}

.orders-section .status-filter {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  font-size: 13px;
  background: #fff;
}

.orders-table-container {
  position: relative;
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.orders-table th,
.orders-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.orders-table th {
  background: #fafafa;
  font-weight: 600;
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-id {
  font-family: monospace;
  font-size: 12px;
  color: #666;
}

.order-user {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-amount {
  font-weight: 600;
  color: #059669;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.paid {
  background: #d1fae5;
  color: #059669;
}

.status-badge.closed {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.refunded {
  background: #fce7f3;
  color: #db2777;
}

.btn-status {
  padding: 6px 12px;
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-status:hover {
  background: #eff6ff;
}

/* 服务管理区块 */
.services-section {

  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 24px;
}

.services-table-container {
  position: relative;
  overflow-x: auto;
}

.services-table {
  width: 100%;
  border-collapse: collapse;
}

.services-table th,
.services-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.services-table th {
  background: #f9fafb;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
}

.services-table td {
  font-size: 14px;
  color: #374151;
}

.service-title {
  font-weight: 600;
}

.service-id {
  font-family: monospace;
  font-size: 12px;
  color: #6b7280;
}

.service-order {
  color: #6b7280;
}

.service-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Toggle 开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.3s;
  border-radius: 26px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background: linear-gradient(135deg, #10b981, #059669);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(22px);
}

.toggle-switch input:disabled + .toggle-slider {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-label {
  font-size: 13px;
  color: #6b7280;
  min-width: 32px;
}

/* 用户状态标记 */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.status-badge.active {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.status-badge.disabled {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.disabled-row {
  background: #fafafa;
  opacity: 0.7;
}

.user-account {
  font-size: 12px;
  color: #666;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 设备数量按钮 */
.btn-devices {
  padding: 4px 10px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-devices:hover {
  background: #e0e0e0;
  border-color: #ccc;
}

/* 禁用/启用按钮 */
.btn-disable {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #fca5a5;
  color: #dc2626;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-disable:hover:not(:disabled) {
  background: #dc2626;
  color: #fff;
}

.btn-enable {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #86efac;
  color: #16a34a;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-enable:hover:not(:disabled) {
  background: #16a34a;
  color: #fff;
}

/* 设备管理弹窗 */
.sessions-modal {
  max-width: 500px;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
}

.session-device {
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.session-time {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.btn-kick {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #fca5a5;
  color: #dc2626;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-kick:hover:not(:disabled) {
  background: #dc2626;
  color: #fff;
}

.btn-kick:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-sessions {
  text-align: center;
  padding: 32px;
  color: #999;
}

.loading-text {
  text-align: center;
  padding: 24px;
  color: #666;
}
/* 角色选择器 */
.role-select {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #e0e0e0;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.role-select:hover:not(:disabled) {
  border-color: #333;
}

.role-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.role-select option[value="admin"] {
  color: #dc2626;
  font-weight: 600;
}

.doc-summary {
  display: block;
  margin-top: 4px;
  color: #6f7b88;
  line-height: 1.5;
}

/* ============ License 授权管理样式 ============ */
.license-section {
  background: transparent;
  border: 1px solid #e0e0e0;
  margin-top: 32px;
}

.license-content {
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.license-form {
  background: #fff;
  border: 1px solid #e0e0e0;
  padding: 24px;
}

.license-form h3 {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  margin-top: 24px;
  text-align: right;
}

.btn-generate {
  padding: 12px 24px;
  background: #111;
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.btn-generate:hover:not(:disabled) {
  background: #333;
}

.btn-generate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.license-result {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 24px;
}

.result-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-bottom: 16px;
}

.email-badge {
  margin-left: auto;
  font-size: 12px;
  font-weight: 400;
  color: #059669;
  background: #d1fae5;
  padding: 4px 8px;
  border-radius: 4px;
}

.result-info {
  display: flex;
  gap: 32px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 12px;
  color: #666;
}

.info-item .value {
  font-size: 14px;
  font-weight: 600;
  color: #111;
}

.license-key-box {
  margin-top: 16px;
}

.license-key-box label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.key-content {
  background: #111;
  color: #22c55e;
  padding: 16px;
  font-family: monospace;
  font-size: 11px;
  line-height: 1.6;
  word-break: break-all;
  cursor: pointer;
  transition: all 0.2s;
  max-height: 120px;
  overflow-y: auto;
}

.key-content:hover {
  background: #222;
}

.copy-hint {
  display: inline-block;
  margin-top: 8px;
  font-size: 12px;
  color: #22c55e;
  font-weight: 600;
}

/* 退款审核样式 */
.refund-section {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 24px;
  margin-bottom: 24px;
}

.refund-table-container {
  position: relative;
  overflow-x: auto;
}

.refund-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.refund-table th,
.refund-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.refund-table th {
  background: #fafafa;
  font-weight: 600;
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.refund-id {
  font-family: monospace;
  color: #666;
}

.refund-amount {
  font-weight: 600;
  color: #e74c3c;
}

.refund-reason {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-approve {
  padding: 6px 12px;
  background: #22c55e;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;
}

.btn-approve:hover:not(:disabled) {
  background: #16a34a;
}

.btn-reject {
  padding: 6px 12px;
  background: #ef4444;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.btn-reject:hover:not(:disabled) {
  background: #dc2626;
}

.btn-refresh {
  background: none;
  border: 1px solid #ddd;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.btn-refresh:hover {
  background: #f5f5f5;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.processed-hint {
  color: #999;
  font-size: 12px;
}

@media (max-width: 1024px) {
  .license-content {
    grid-template-columns: 1fr;
  }
}
</style>
