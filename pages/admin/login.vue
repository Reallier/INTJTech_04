<template>
  <div class="admin-login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="brand-mark"></div>
          <h1>管理后台</h1>
          <p>HireStream 管理系统</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input 
              id="username"
              v-model="form.username" 
              type="text" 
              placeholder="请输入用户名"
              required
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              id="password"
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码"
              required
              :disabled="loading"
            />
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="loading">登录中...</span>
            <span v-else>登录</span>
          </button>
        </form>
        
        <div class="login-footer">
          <a href="/">← 返回官网</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const form = ref({
  username: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await $fetch('/api/admin/login', {
      method: 'POST',
      body: {
        username: form.value.username,
        password: form.value.password
      }
    });
    
    if (response.success && response.token) {
      // 存储 token 到 cookie
      const adminToken = useCookie('admin_token', {
        maxAge: 60 * 60 * 24 // 24 小时
      });
      adminToken.value = response.token;
      
      // 跳转到后台首页
      navigateTo('/admin');
    } else {
      error.value = response.message || '登录失败';
    }
  } catch (e) {
    console.error('Login error:', e);
    error.value = e.data?.message || '网络错误，请稍后重试';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 48px 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.brand-mark {
  width: 4px;
  height: 32px;
  background: #000000;
  margin: 0 auto 20px;
}

.login-header h1 {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.login-header p {
  color: #666666;
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.01em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input {
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  font-size: 15px;
  background: #fafafa;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #000000;
  background: #ffffff;
}

.form-group input:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
}

.form-group input::placeholder {
  color: #999999;
}

.error-message {
  padding: 14px;
  background: #fff5f5;
  border: 1px solid #ffcccc;
  color: #cc0000;
  font-size: 13px;
  text-align: center;
}

.btn-login {
  padding: 16px 24px;
  background: #000000;
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-login:hover:not(:disabled) {
  background: #333333;
}

.btn-login:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 32px;
  text-align: center;
}

.login-footer a {
  color: #666666;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.login-footer a:hover {
  color: #000000;
}
</style>
