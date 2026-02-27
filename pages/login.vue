<script setup lang="ts">
const route = useRoute();
const { user, fetchUser } = useAuth();

// Get redirect target from query params
const redirectTarget = computed(() => route.query.redirect as string || '');

// Redirect mapping
const redirectUrls: Record<string, string> = {
    'hirestream': '/api/services/hirestream-redirect',
    'mindai': 'https://mbti.intjsys.com',
    'contract': '/api/services/contract-redirect',
};

// If already logged in, redirect to target or home
if (user.value) {
    if (redirectTarget.value && redirectUrls[redirectTarget.value]) {
        navigateTo(redirectUrls[redirectTarget.value], { external: true });
    } else {
        navigateTo('/');
    }
}

const form = ref({
    username: '',
    password: ''
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
    if (!form.value.username || !form.value.password) {
        error.value = '请输入用户名和密码';
        return;
    }
    
    loading.value = true;
    error.value = '';
    
    try {
        const response = await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                username: form.value.username,
                password: form.value.password
            }
        });
        
        if (response.success) {
            // 登录成功，刷新用户状态
            await fetchUser();
            
            // 跳转到目标服务或首页
            if (redirectTarget.value && redirectUrls[redirectTarget.value]) {
                navigateTo(redirectUrls[redirectTarget.value], { external: true });
            } else {
                navigateTo('/');
            }
        } else {
            error.value = response.message || '登录失败';
        }
    } catch (e: any) {
        console.error('Login error:', e);
        error.value = e.data?.message || '登录失败，请稍后重试';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">
         <img src="/site-logo.png" alt="Logo" />
      </div>
      <h1>欢迎回来</h1>
      <p class="subtitle">登录您的智能工作空间</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input 
            v-model="form.username" 
            type="text" 
            placeholder="用户名"
            :disabled="loading"
            autocomplete="username"
          />
        </div>
        
        <div class="form-group">
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="密码"
            :disabled="loading"
            autocomplete="current-password"
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading">登录中...</span>
          <span v-else>登录</span>
        </button>
      </form>
      
      <p class="register-hint">
        暂不支持自助注册，请联系管理员开通账号
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Inter', sans-serif;
    padding: 20px;
}

.login-card {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    width: 100%;
    max-width: 420px;
    text-align: center;
    animation: slideUp 0.5s ease-out;
}

.logo img {
    height: 60px;
    margin-bottom: 1.5rem;
}

h1 {
    font-size: 1.8rem;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    font-weight: 700;
}

.subtitle {
    color: #666;
    margin-bottom: 2rem;
    font-size: 0.95rem;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
}

.error-message {
    padding: 12px;
    background: #fff2f0;
    border: 1px solid #ffccc7;
    border-radius: 8px;
    color: #ff4d4f;
    font-size: 14px;
}

.btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.register-hint {
    margin-top: 24px;
    font-size: 13px;
    color: #999;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
