<script setup lang="ts">
const { user } = useAuth();
// If already logged in, redirect home
if (user.value) {
    navigateTo('/');
}

const handleWeChatLogin = async () => {
    try {
        const { data } = await useFetch('/api/auth/wechat/url');
        if (data.value?.url) {
            window.location.href = data.value.url;
        }
    } catch (e) {
        alert("Failed to get login URL");
    }
};

const handleMockLogin = () => {
    // Direct bypass for testing
    window.location.href = '/api/auth/wechat/callback?code=TEST_MOCK_CODE';
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">
         <img src="/site-logo.png" alt="Logo" />
      </div>
      <h1>Welcome Back</h1>
      <p class="subtitle">Sign in to your intelligent workspace</p>

      <div class="actions">
        <button @click="handleWeChatLogin" class="btn btn-wechat">
          <i class="fa-brands fa-weixin"></i>
          <span>WeChat Login</span>
        </button>

        <div class="divider">
            <span>Development Mode</span>
        </div>

        <button @click="handleMockLogin" class="btn btn-mock">
          <i class="fa-solid fa-code"></i>
          <span>Mock Login (No WeChat Required)</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    font-family: 'Inter', sans-serif;
}

.login-card {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
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
    margin-bottom: 2.5rem;
    font-size: 0.95rem;
}

.btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s;
}

.btn-wechat {
    background: #07c160;
    color: white;
}

.btn-wechat:hover {
    background: #06ad56;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
}

.btn-mock {
    background: #f0f0f0;
    color: #666;
    border: 1px dashed #ccc;
}

.btn-mock:hover {
    background: #e5e5e5;
    color: #333;
}

.divider {
    margin: 1.5rem 0;
    font-size: 0.8rem;
    color: #999;
    display: flex;
    align-items: center;
    gap: 10px;
}
.divider::before, .divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #eee;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
