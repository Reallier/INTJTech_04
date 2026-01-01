<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  redirectTarget?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success', redirectTarget?: string): void;
}>();

const { fetchUser } = useAuth();

const form = ref({
  username: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

// 关闭 Modal
const closeModal = () => {
  emit('update:modelValue', false);
  error.value = '';
  form.value = { username: '', password: '' };
};

// 处理登录
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
      await fetchUser();
      closeModal();
      emit('success', props.redirectTarget);
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

// 点击遮罩关闭
const handleOverlayClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
    closeModal();
  }
};

// ESC 键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    closeModal();
  }
};

// 监听键盘事件
if (typeof window !== 'undefined') {
  watch(() => props.modelValue, (visible) => {
    if (visible) {
      document.addEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    }
  });
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container">
          <!-- 关闭按钮 -->
          <button class="modal-close" @click="closeModal" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- Modal 内容 -->
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">登录</h2>
              <p class="modal-subtitle">登录您的智能工作空间</p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <label class="form-label">用户名</label>
                <input 
                  v-model="form.username" 
                  type="text" 
                  placeholder="请输入用户名"
                  :disabled="loading"
                  autocomplete="username"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label class="form-label">密码</label>
                <input 
                  v-model="form.password" 
                  type="password" 
                  placeholder="请输入密码"
                  :disabled="loading"
                  autocomplete="current-password"
                  class="form-input"
                />
              </div>

              <div v-if="error" class="error-message">
                {{ error }}
              </div>

              <button type="submit" class="btn-submit" :disabled="loading">
                <span v-if="loading">登录中...</span>
                <span v-else>登录</span>
              </button>
            </form>

            <p class="register-hint">
              暂不支持自助注册，请联系管理员开通账号
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal 遮罩 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* Modal 容器 */
.modal-container {
  position: relative;
  background: #fff;
  border: 1px solid #111;
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  overflow-y: auto;
}

/* 关闭按钮 */
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #ddd;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #111;
  border-color: #111;
  color: #fff;
}

/* Modal 内容 */
.modal-content {
  padding: 48px 40px 40px;
}

.modal-header {
  text-align: center;
  margin-bottom: 32px;
}

.modal-title {
  font-size: 28px;
  font-weight: 800;
  color: #111;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.modal-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 表单样式 */
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

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  font-size: 15px;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #111;
}

.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

/* 错误消息 */
.error-message {
  padding: 12px 16px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
  font-size: 14px;
}

/* 提交按钮 */
.btn-submit {
  width: 100%;
  padding: 16px;
  background: #111;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-submit:hover:not(:disabled) {
  background: #333;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 注册提示 */
.register-hint {
  margin-top: 24px;
  font-size: 13px;
  color: #999;
  text-align: center;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
