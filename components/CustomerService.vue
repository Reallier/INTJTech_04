<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const isOpen = ref(false);
const isHovered = ref(false);
const inputMessage = ref('');
const messages = ref<{ role: 'user' | 'assistant', content: string }[]>([
  { role: 'assistant', content: '您好！我是简序智能体客服，请问有什么可以帮助您？（支持 MBTI 解析咨询、系统故障报修等）' }
]);
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => {
      scrollToBottom();
    });
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  const text = inputMessage.value.trim();
  if (!text || isLoading.value) return;

  messages.value.push({ role: 'user', content: text });
  inputMessage.value = '';
  isLoading.value = true;
  nextTick(scrollToBottom);

  try {
    const res = await fetch('/api/v1/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text }) // Pass session ID here later if needed
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    // Set up a placeholder for the incoming stream
    messages.value.push({
      role: 'assistant',
      content: ''
    });
    const currentAssistantMsgIndex = messages.value.length - 1;

    // Read the SSE stream manually
    const reader = res.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    if (reader) {
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process SSE formatted chunks (data: {...}\n\n)
        const lines = buffer.split('\n\n');
        // Keep the last incomplete chunk in the buffer
        buffer = lines.pop() || '';

        for (const block of lines) {
          const dataMatch = block.match(/^data:\s*(.*)/);
          if (dataMatch && dataMatch[1]) {
            try {
              const eventData = JSON.parse(dataMatch[1]);
              
              if (eventData.text) {
                // Hide loading dots when real text starts arriving
                isLoading.value = false;
                messages.value[currentAssistantMsgIndex].content += eventData.text;
                nextTick(scrollToBottom);
              } else if (eventData.status) {
                // Show thinking/tool status temporarily
                console.log('App02 Agent status:', eventData.status);
              } else if (eventData.error) {
                messages.value[currentAssistantMsgIndex].content += `\n[系统异常]: ${eventData.error}`;
              } else if (eventData.done) {
                isLoading.value = false;
              }
            } catch (e) {
               // Ignore unparseable fragments 
            }
          }
        }
      }
    }
  } catch (err: any) {
    console.error('Chat API Error:', err);
    messages.value.push({
      role: 'assistant',
      content: '⚠️ 无法连接简序云端算力节点，请稍后再试。'
    });
  } finally {
    isLoading.value = false;
    nextTick(scrollToBottom);
  }
};
</script>

<template>
  <div class="customer-service-wrapper">
    <!-- Chat Window -->
    <transition name="fade-slide">
      <div v-show="isOpen" class="chat-window">
        <div class="chat-header">
          <div class="header-info">
            <div class="avatar-robot"><i class="fa-solid fa-robot"></i></div>
            <div class="titles">
              <h3>简序智能服务专家</h3>
              <span class="status"><span class="dot"></span> App02 Qwen 双擎在线</span>
            </div>
          </div>
          <button class="close-btn" @click="toggleChat"><i class="fa-solid fa-times"></i></button>
        </div>
        
        <div class="chat-messages" ref="messagesContainer">
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            :class="['message', msg.role]"
          >
            <div class="message-content">{{ msg.content }}</div>
          </div>
          <div v-if="isLoading" class="message assistant typing">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div class="chat-inputArea">
          <input 
            v-model="inputMessage" 
            @keyup.enter="sendMessage"
            type="text" 
            placeholder="输入您的问题..."
            :disabled="isLoading"
          />
          <button @click="sendMessage" :disabled="!inputMessage.trim() || isLoading">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </transition>

    <!-- Floating Button (Trigger) -->
    <div 
      class="float-btn" 
      @click="toggleChat"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      :class="{ 'is-open': isOpen }"
    >
      <div v-if="!isOpen" class="btn-content">
        <i v-if="!isHovered" class="fa-brands fa-rocketchat prompt-icon pulse"></i>
        <i v-else class="fa-solid fa-headset prompt-icon"></i>
      </div>
      <div v-else class="btn-content close-icon">
        <i class="fa-solid fa-chevron-down"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-service-wrapper {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* Floating Trigger Button */
.float-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #111 0%, #333 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-top: 16px;
  border: 2px solid rgba(255,255,255,0.1);
}

.float-btn:hover {
  transform: scale(1.1) translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #222 0%, #444 100%);
}

.float-btn.is-open {
  background: white;
  color: #333;
  transform: scale(0.85);
}

.btn-content {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Chat Window */
.chat-window {
  width: 380px;
  height: 600px;
  max-height: calc(100vh - 120px);
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
}

.chat-header {
  padding: 20px;
  background: linear-gradient(135deg, #111 0%, #2a2a2a 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-robot {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.titles h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status {
  font-size: 11px;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 8px #4ade80;
  animation: blink 2s infinite;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: white;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f9f9f9;
}

.message {
  display: flex;
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
}

.message.user .message-content {
  background: #111;
  color: white;
  border-radius: 18px 18px 0 18px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.message.assistant {
  align-self: flex-start;
}

.message.assistant .message-content {
  background: white;
  color: #333;
  border-radius: 18px 18px 18px 0;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  font-size: 14px;
  line-height: 1.5;
}

.message-content {
  padding: 12px 16px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.chat-inputArea {
  padding: 16px;
  background: white;
  border-top: 1px solid rgba(0,0,0,0.05);
  display: flex;
  gap: 10px;
}

.chat-inputArea input {
  flex: 1;
  border: none;
  background: #f1f1f1;
  padding: 12px 16px;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  transition: background 0.2s;
}

.chat-inputArea input:focus {
  background: #e8e8e8;
}

.chat-inputArea button {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: #111;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.chat-inputArea button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.chat-inputArea button:not(:disabled):hover {
  background: #333;
  transform: translateY(-2px);
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 16px;
  background: white;
  border-radius: 18px 18px 18px 0;
  border: 1px solid rgba(0,0,0,0.05);
  align-items: center;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #aaa;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

/* Animations */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Transition classes */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
