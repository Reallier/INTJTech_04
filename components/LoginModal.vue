<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  redirectTarget?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success', redirectTarget?: string): void;
}>();

const { fetchUser } = useAuth();

// 表单数据
const email = ref('');
const code = ref('');

// 状态
const loading = ref(false);
const sendingCode = ref(false);
const error = ref('');
const countdown = ref(0);

// 倒计时定时器
let countdownTimer: ReturnType<typeof setInterval> | null = null;

// 邮箱验证
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = computed(() => EMAIL_REGEX.test(email.value));
const isCodeValid = computed(() => /^\d{6}$/.test(code.value));

// 可以发送验证码
const canSendCode = computed(() => isEmailValid.value && !sendingCode.value && countdown.value === 0);

// 关闭 Modal
const closeModal = () => {
  emit('update:modelValue', false);
  error.value = '';
  email.value = '';
  code.value = '';
};

// 发送验证码
const sendCode = async () => {
  if (!canSendCode.value) return;

  sendingCode.value = true;
  error.value = '';

  try {
    const response = await $fetch<{ success: boolean; message: string }>('/api/auth/email/send', {
      method: 'POST',
      body: { email: email.value }
    });

    if (response.success) {
      // 开始60秒倒计时
      countdown.value = 60;
      countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          if (countdownTimer) clearInterval(countdownTimer);
        }
      }, 1000);
    } else {
      error.value = response.message || '发送失败';
    }
  } catch (e: any) {
    error.value = e.data?.message || '发送失败，请稍后重试';
  } finally {
    sendingCode.value = false;
  }
};

// 登录/注册
const handleLogin = async () => {
  if (!isEmailValid.value || !isCodeValid.value) {
    error.value = '请输入正确的邮箱和验证码';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
      accessToken?: string;
      user?: any;
    }>('/api/auth/email/verify', {
      method: 'POST',
      body: {
        email: email.value,
        code: code.value
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
      // 清理倒计时
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdown.value = 0;
      }
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
              <h2 class="modal-title">登录 / 注册</h2>
              <p class="modal-subtitle">输入邮箱即可登录，未注册自动创建账号</p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
              <!-- 邮箱 -->
              <div class="form-group">
                <label class="form-label">邮箱</label>
                <input 
                  v-model="email" 
                  type="email" 
                  placeholder="请输入邮箱地址"
                  :disabled="loading"
                  autocomplete="email"
                  class="form-input"
                />
              </div>

              <!-- 验证码 -->
              <div class="form-group">
                <label class="form-label">验证码</label>
                <div class="code-input-wrapper">
                  <input 
                    v-model="code" 
                    type="text" 
                    inputmode="numeric"
                    placeholder="请输入6位验证码"
                    :disabled="loading"
                    autocomplete="one-time-code"
                    maxlength="6"
                    class="form-input code-input"
                  />
                  <button 
                    type="button" 
                    class="btn-send-code"
                    :disabled="!canSendCode"
                    @click="sendCode"
                  >
                    <span v-if="sendingCode">发送中...</span>
                    <span v-else-if="countdown > 0">{{ countdown }}s</span>
                    <span v-else>获取验证码</span>
                  </button>
                </div>
              </div>

              <div v-if="error" class="error-message">
                {{ error }}
              </div>

              <button 
                type="submit" 
                class="btn-submit" 
                :disabled="loading || !isEmailValid || !isCodeValid"
              >
                <span v-if="loading">登录中...</span>
                <span v-else>登录 / 注册</span>
              </button>
            </form>

            <p class="privacy-hint">
              登录即表示同意
              <a href="/privacy" target="_blank">隐私政策</a>
              和
              <a href="/terms" target="_blank">服务条款</a>
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

/* 验证码输入框布局 */
.code-input-wrapper {
  display: flex;
  gap: 12px;
}

.code-input {
  flex: 1;
}

/* 发送验证码按钮 */
.btn-send-code {
  flex-shrink: 0;
  padding: 14px 20px;
  background: #fff;
  border: 1px solid #111;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: inherit;
}

.btn-send-code:hover:not(:disabled) {
  background: #111;
  color: #fff;
}

.btn-send-code:disabled {
  border-color: #ddd;
  color: #999;
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

/* 隐私提示 */
.privacy-hint {
  margin-top: 24px;
  font-size: 12px;
  color: #999;
  text-align: center;
}

.privacy-hint a {
  color: #666;
  text-decoration: underline;
}

.privacy-hint a:hover {
  color: #111;
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
