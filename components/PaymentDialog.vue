<template>
  <Teleport to="body">
    <div v-if="visible" class="payment-overlay" @click.self="handleClose">
      <div class="payment-dialog">
        <!-- 头部 -->
        <div class="dialog-header">
          <h3>充值</h3>
          <button class="close-btn" @click="handleClose">×</button>
        </div>

        <!-- 内容区 -->
        <div class="dialog-content">
          <!-- 套餐选择 -->
          <div class="package-selection">
            <div class="packages">
              <div class="package-card"
                v-for="(pkg, index) in packages"
                :key="index"
                :class="{ selected: selectedIndex === index }"
                @click="selectedIndex = index"
              >
                <div class="package-amount">¥{{ pkg.amount }}</div>
                <div v-if="pkg.bonus" class="package-bonus">{{ pkg.bonus }}</div>
              </div>
            </div>

            <div class="custom-amount">
              <label>
                <input
                  type="radio"
                  :checked="selectedIndex === -1"
                  @change="selectedIndex = -1"
                />
                自定义金额
              </label>
              <input
                v-if="selectedIndex === -1"
                v-model.number="customAmount"
                type="number"
                min="1"
                max="10000"
                placeholder="1-10000 元"
                class="amount-input"
              />
            </div>

            <button class="submit-btn" @click="createOrder" :disabled="loading">
              {{ loading ? '跳转中...' : '前往支付' }}
            </button>

            <p class="payment-hint">点击后将跳转至支付宝完成支付</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}>();

// 套餐配置（1:1 充值）
const packages = [
  { amount: 10, bonus: '' },
  { amount: 50, bonus: '满10赠额' },
  { amount: 100, bonus: '满20赠额' },
];

// 状态
const selectedIndex = ref(0);
const customAmount = ref<number | null>(null);
const loading = ref(false);

// 监听弹窗打开，重置状态
watch(() => props.visible, (val) => {
  if (val) {
    selectedIndex.value = 0;
    customAmount.value = null;
    loading.value = false;
  }
});

// 关闭弹窗
function handleClose() {
  emit('update:visible', false);
}

// 创建订单并跳转支付
async function createOrder() {
  loading.value = true;

  try {
    const body: any = {};
    if (selectedIndex.value >= 0) {
      body.packageIndex = selectedIndex.value;
    } else if (customAmount.value && customAmount.value >= 1) {
      body.customAmount = customAmount.value;
    } else {
      alert('请选择充值套餐或输入有效金额');
      loading.value = false;
      return;
    }

    const response = await $fetch('/api/payment/create', {
      method: 'POST',
      body,
    });

    const data = response as any;
    if (!data.success || !data.payUrl) {
      throw new Error(data.message || '创建订单失败');
    }

    // 跳转到支付宝支付页面
    window.location.href = data.payUrl;
  } catch (error: any) {
    alert(error.message || '创建订单失败');
    loading.value = false;
  }
}
</script>

<style scoped>
.payment-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.payment-dialog {
  background: #fff;
  border: 1px solid #111;
  width: 400px;
  max-width: 90vw;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #111;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.dialog-header .close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.dialog-content {
  padding: 20px;
}

.packages {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.package-card {
  flex: 1;
  padding: 16px 12px;
  border: 2px solid #ddd;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.package-card:hover {
  border-color: #999;
}

.package-card.selected {
  border-color: #111;
  background: #f5f5f5;
}

.package-amount {
  font-size: 24px;
  font-weight: 700;
  color: #111;
}

.package-bonus {
  font-size: 11px;
  color: #e74c3c;
  margin-top: 4px;
}

.custom-amount {
  margin-bottom: 20px;
}

.custom-amount label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.amount-input {
  width: 100%;
  margin-top: 8px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #111;
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #333;
}

.submit-btn:disabled {
  background: #999;
  cursor: not-allowed;
}

.payment-hint {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 12px;
}
</style>
