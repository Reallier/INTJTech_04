<template>
  <div class="callback-page">
    <div class="callback-container">
      <!-- 加载中 -->
      <div v-if="status === 'loading'" class="loading-section">
        <div class="spinner"></div>
        <p>正在确认支付结果...</p>
      </div>

      <!-- 支付成功 -->
      <div v-else-if="status === 'success'" class="success-section">
        <div class="status-icon success">✓</div>
        <h2>支付成功！</h2>
        <p class="amount">已到账 <strong>¥{{ amount }}</strong></p>
        <NuxtLink to="/" class="back-btn">返回首页</NuxtLink>
      </div>

      <!-- 支付失败/取消 -->
      <div v-else-if="status === 'failed'" class="failed-section">
        <div class="status-icon failed">✕</div>
        <h2>支付未完成</h2>
        <p>{{ message || '订单未支付或已取消' }}</p>
        <NuxtLink to="/" class="back-btn">返回首页</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const status = ref<'loading' | 'success' | 'failed'>('loading');
const amount = ref('0.00');
const message = ref('');

onMounted(async () => {
  // 从 URL 获取订单号（支付宝同步返回）
  const outTradeNo = route.query.out_trade_no as string;

  if (!outTradeNo) {
    status.value = 'failed';
    message.value = '缺少订单信息';
    return;
  }

  try {
    // 查询订单状态
    const response = await $fetch(`/api/payment/status?orderId=${outTradeNo}`);
    const data = response as any;

    if (data.status === 'PAID') {
      status.value = 'success';
      amount.value = data.amount?.toFixed(2) || '0.00';
    } else {
      status.value = 'failed';
      message.value = data.message || '订单未支付';
    }
  } catch (error: any) {
    status.value = 'failed';
    message.value = error.message || '查询订单失败';
  }
});
</script>

<style scoped>
.callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.callback-container {
  background: #fff;
  padding: 48px 64px;
  text-align: center;
  border: 1px solid #111;
  max-width: 400px;
}

.loading-section .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #ddd;
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 16px;
}

.status-icon.success {
  background: #27ae60;
  color: #fff;
}

.status-icon.failed {
  background: #e74c3c;
  color: #fff;
}

h2 {
  margin: 0 0 8px;
  font-size: 24px;
}

.amount {
  font-size: 16px;
  color: #333;
}

.amount strong {
  font-size: 24px;
  color: #111;
}

.back-btn {
  display: inline-block;
  margin-top: 24px;
  padding: 12px 32px;
  background: #111;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

.back-btn:hover {
  background: #333;
}
</style>
