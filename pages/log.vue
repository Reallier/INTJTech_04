<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showProductMenu = ref(false)
const showTechMenu = ref(false)

const toggleProductMenu = () => {
  showProductMenu.value = !showProductMenu.value
  showTechMenu.value = false
}

const toggleTechMenu = () => {
  showTechMenu.value = !showTechMenu.value
  showProductMenu.value = false
}

const closeMenus = () => {
  showProductMenu.value = false
  showTechMenu.value = false
}

onMounted(() => {
  window.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  window.removeEventListener('click', closeMenus)
})

const logs = [
  { date: '2025-12-30', version: 'v4.0.0', module: 'AIOps', content: 'Integrated unified observability stack (Tempo/Loki/Grafana). Achieved sub-second RCA capabilities.' },
  { date: '2025-12-28', version: 'v3.8.2', module: 'Agent Matrix', content: 'Deployed SEAM v4.8 OIS Protocol. Replaced conversational interfaces with JSON-first state management.' },
  { date: '2025-12-15', version: 'v3.5.0', module: 'TalentAI', content: 'Implemented Deep Defense Security Layer v2.2 with automated payload heuristics.' },
  { date: '2025-11-20', version: 'v3.0.0', module: 'Core Architecture', content: 'Completed migration to Nuxt 3 with full SSR support and edge caching.' },
  { date: '2025-10-05', version: 'v2.4.0', module: 'Knowledge Graph', content: 'Initial deployment of hybrid-search vector engine.' }
]
</script>

<template>
  <div class="page">
    <header class="header">
      <!-- Wide Layout (0 padding) to match Bento -->
      <div class="header-inner">
        <a href="/" class="logo">简序智能<span>INTJsys</span></a>
        <nav class="nav">
          <div class="nav-item">
            <button class="nav-link" @click.stop="toggleProductMenu" :class="{ 'active': showProductMenu }">
              产品矩阵
            </button>
          </div>
          <div class="nav-item">
             <button class="nav-link" @click.stop="toggleTechMenu" :class="{ 'active': showTechMenu }">
              技术资源
            </button>
          </div>

          <a href="/login" class="btn-login">CONSOLE</a>
        </nav>
      </div>
      
      <!-- Compact Panels -->
      <div class="dropdown-panel" v-show="showProductMenu">
        <div class="panel-inner">
           <div class="panel-grid cols-3">
              <a href="/login" class="panel-item">
                <div class="panel-icon">[ ]</div>
                <div class="panel-content">
                  <div class="panel-head">
                     <span class="panel-title">TALENTAI</span>
                     <span class="panel-meta">PROD</span>
                  </div>
                  <p class="panel-desc">AI 驱动的确定性人才发现引擎。</p>
                </div>
              </a>
              <a href="/#products" class="panel-item">
                <div class="panel-icon">//</div>
                <div class="panel-content">
                  <div class="panel-head">
                     <span class="panel-title">BRIDGE</span>
                     <span class="panel-meta">CUSTOM</span>
                  </div>
                  <p class="panel-desc">定制化 AI 中台与存量业务注入。</p>
                </div>
              </a>
              <a href="/#products" class="panel-item">
                <div class="panel-icon">{ }</div>
                <div class="panel-content">
                  <div class="panel-head">
                     <span class="panel-title">LABS</span>
                     <span class="panel-meta">BETA</span>
                  </div>
                  <p class="panel-desc">前沿工具与原子组件原型库。</p>
                </div>
              </a>
           </div>
        </div>
      </div>

      <div class="dropdown-panel" v-show="showTechMenu">
        <div class="panel-inner">
           <div class="panel-grid cols-4">
              <a href="/#deep-dive" class="panel-item">
                <div class="panel-icon">&</div>
                <div class="panel-content">
                  <div class="panel-head">
                     <span class="panel-title">PHILOSOPHY</span>
                  </div>
                  <p class="panel-desc">核心架构设计原则。</p>
                </div>
              </a>
              <a href="/#tech-stack" class="panel-item">
                <div class="panel-icon">_</div>
                <div class="panel-content">
                  <div class="panel-head">
                     <span class="panel-title">SPECS</span>
                  </div>
                  <p class="panel-desc">技术栈与实现细节。</p>
                </div>
              </a>
              <a href="/log" class="panel-item">
                <div class="panel-icon">::</div>
                <div class="panel-content">
                  <div class="panel-head">
                     <span class="panel-title">LOGS</span>
                     <span class="panel-meta">LIVE</span>
                  </div>
                  <p class="panel-desc">实时工程演进记录。</p>
                </div>
              </a>
              <a href="/docs" class="panel-item">
                <div class="panel-icon">< ></div>
                <div class="panel-content">
                  <div class="panel-head">
                     <span class="panel-title">API</span>
                     <span class="panel-meta">DOCS</span>
                  </div>
                  <p class="panel-desc">标准化接口集成指南。</p>
                </div>
              </a>
           </div>
        </div>
      </div>

    </header>

    <main class="container log-page">
        <div class="header-spacer"></div>
        <div class="log-header">
            <h1 class="page-title">SYSTEM LOGS / 研发日志</h1>
            <p class="page-desc">Engineering Commits & System Status</p>
        </div>
        
        <div class="log-list">
            <div v-for="log in logs" :key="log.date" class="log-entry">
                <div class="log-meta">
                    <span class="log-date">{{ log.date }}</span>
                    <span class="log-ver">{{ log.version }}</span>
                </div>
                <div class="log-content">
                    <h3 class="log-title">{{ log.module }}</h3>
                    <p class="log-desc">{{ log.content }}</p>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col footer-brand-col">
            <a href="/" class="footer-brand-link">
              <span class="footer-brand-text">简序智能</span>
            </a>
            <p class="footer-desc">构建高效、智能的 AI 工具组件，让逻辑驱动生产力。</p>
          </div>
          <div class="footer-col">
            <h5>产品中心</h5>
            <a href="#">TalentAI</a>
            <a href="#">实验室</a>
          </div>
          <div class="footer-col">
            <h5>企业服务</h5>
            <a href="#">INTJ Bridge</a>
            <a href="#">定制咨询</a>
          </div>
          <div class="footer-col">
            <h5>关于</h5>
            <a href="/about">团队故事</a>
            <a href="mailto:contact@intjtech.cn">联系我们</a>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© 2025 深圳简序智能科技有限公司</div>
          <span>SZ · HK · SH</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page {
  --bg: #ffffff;
  --fg: #111111;
  --muted: #666666;
  --border: rgba(0, 0, 0, 0.08);
  --border-strong: #000000;
  --grid-line: rgba(0, 0, 0, 0.04);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  
  min-height: 100vh;
  color: var(--fg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
  background-color: var(--bg);
  background-image: 
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 40px 40px, 40px 40px;
  background-position: 0 0, 0 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box; 
}

/* Header - Sticky */
.header {
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-strong);
  z-index: 1000;
}

.header-inner {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0; /* Match Bento 0-padding */
  box-sizing: border-box;
}

.logo {
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.04em;
  text-decoration: none;
  color: var(--fg);
}
.logo span {
  font-weight: 400;
  color: var(--muted);
  margin-left: 4px;
}

.nav {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-link {
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  color: var(--fg);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
}
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #000;
}

/* Compact Dropdown Panel */
.dropdown-panel {
  position: absolute;
  top: 72px;
  left: 0;
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #000;
  padding: 24px 0; 
  z-index: 999;
}

.panel-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0; /* Match Bento 0-padding */
  box-sizing: border-box;
}

.panel-grid {
  display: grid;
  gap: 16px; 
}
.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(4, 1fr); }

.panel-item {
  display: flex;
  flex-direction: row; 
  align-items: flex-start;
  gap: 16px; 
  padding: 16px; 
  text-decoration: none;
  border: 1px solid transparent; 
  transition: background 0.1s, border-color 0.1s;
}

.panel-item:hover {
  background: #f4f4f4;
  border: 1px solid #000;
}

.panel-icon {
  width: 48px; height: 48px;
  background: #f8f8f8;
  display: flex; align-items: center; justify-content: center;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-weight: 700;
  font-size: 16px;
  color: #000;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.05);
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px; /* Tight text gap */
}

.panel-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.panel-title {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 14px; 
  letter-spacing: -0.01em;
  color: #000;
  text-transform: uppercase;
}

.panel-meta {
  font-family: 'SF Mono', monospace;
  font-size: 10px;
  color: #666;
  background: #eee;
  padding: 2px 5px;
  border-radius: 0;
}

.panel-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

.btn-login {
  padding: 8px 16px;
  border: 1px solid #000;
  border-radius: 0;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  color: #000;
  text-transform: uppercase;
}
.btn-login:hover {
  background: #000;
  color: #fff;
}

/* Log Page Specific */
.log-page { padding-top: 80px; padding-bottom: 120px; }
.log-header { margin-bottom: 80px; padding-bottom: 40px; border-bottom: 1px solid var(--border); }
.page-title { font-size: 48px; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 16px; color: var(--fg); }
.page-desc { font-family: 'SF Mono', monospace; color: var(--muted); font-size: 16px; }
.log-list { display: flex; flex-direction: column; gap: 0; }
.log-entry { display: grid; grid-template-columns: 200px 1fr; gap: 60px; padding: 40px 0; border-bottom: 1px solid var(--border); align-items: flex-start; }
.log-meta { display: flex; flex-direction: column; gap: 8px; }
.log-date { font-family: 'SF Mono', monospace; font-weight: 700; color: var(--fg); font-size: 14px; }
.log-ver { font-family: 'SF Mono', monospace; color: var(--muted); font-size: 12px; background: #f4f4f4; display: inline-block; padding: 2px 6px; border-radius: 0; width: fit-content; }
.log-content { display: flex; flex-direction: column; gap: 12px; }
.log-title { font-size: 20px; font-weight: 700; color: var(--fg); margin: 0; }
.log-desc { color: var(--muted); line-height: 1.6; font-size: 16px; margin: 0; }
.footer { padding: 100px 0 60px; border-top: 1px solid var(--border); font-size: 14px; color: var(--muted); background: transparent; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 80px; }
.footer-brand-link { display: inline-block; text-decoration: none; margin-bottom: 24px; }
.footer-brand-text { font-family: system-ui, -apple-system, sans-serif; font-weight: 900; font-size: 20px; letter-spacing: -0.02em; color: var(--fg); line-height: 1; }
.footer-col h5 { color: var(--fg); margin-bottom: 24px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; }
.footer-col a { display: block; color: var(--muted); text-decoration: none; margin-bottom: 12px; transition: color 0.2s; }
.footer-col a:hover { color: var(--fg); }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 40px; border-top: 1px solid var(--border); }
@media (max-width: 768px) {
  .logo, .nav, .footer-grid { flex-direction: column; align-items: flex-start; }
  .nav { gap: 20px; margin-top: 20px; }
  .panel-grid { grid-template-columns: 1fr; }
  .log-entry { grid-template-columns: 1fr; gap: 16px; }
}
</style>

<!-- Global: overflow-x on html to allow sticky -->
<style>
html {
  overflow-x: hidden;
}
</style>
