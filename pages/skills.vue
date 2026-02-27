<script setup lang="ts">
import { ref, computed } from 'vue';

const showLoginModal = ref(false);
const activeCategory = ref('all');

// ============ 核心资产 - 自研能力 ============
const coreAssets = [
  {
    id: 'talentai',
    name: 'TalentAI 语义匹配',
    desc: '企业级简历-JD 双向认知匹配引擎，支持语义理解与多维度评分。',
    category: 'matching',
    status: 'PRODUCTION',
    security: 'A+',
    latency: '< 200ms',
    compatibility: ['Claude', 'Cursor', 'Gemini'],
    deployment: ['cloud', 'private'],
    flagship: true,
  },
  {
    id: 'ocr',
    name: '多模态 OCR',
    desc: '基于 Vision LLM 的文档解析，支持 PDF/图片/手写体识别。',
    category: 'document',
    status: 'PRODUCTION',
    security: 'A',
    latency: '< 500ms',
    compatibility: ['Claude', 'Cursor'],
    deployment: ['cloud', 'private'],
    flagship: false,
  },
  {
    id: 'security-audit',
    name: '安全审计',
    desc: 'Prompt Injection 防护与敏感信息脱敏引擎。',
    category: 'security',
    status: 'PRODUCTION',
    security: 'A+',
    latency: '< 50ms',
    compatibility: ['All'],
    deployment: ['private'],
    flagship: false,
  },
  {
    id: 'atomic-notes',
    name: 'atomic-notes',
    desc: '原子笔记方法论 Skill，基于 Zettelkasten 的知识管理。',
    category: 'knowledge',
    status: 'PRODUCTION',
    security: 'A',
    latency: 'N/A',
    compatibility: ['Claude', 'Gemini'],
    deployment: ['skill'],
    flagship: false,
  },
  {
    id: 'ois-json-first',
    name: 'ois-json-first',
    desc: 'OIS 可观测智能脚本的 JSON-First 状态管理模式。',
    category: 'engineering',
    status: 'PRODUCTION',
    security: 'A',
    latency: 'N/A',
    compatibility: ['Claude', 'Gemini'],
    deployment: ['skill'],
    flagship: false,
  },
];

// ============ 精选开源 Skills ============
const curatedSkills = [
  {
    id: 'code-review',
    name: 'code-review',
    desc: '自动化 PR 审查与代码质量分析',
    category: 'development',
    stars: '20.7k',
    source: 'awesome-claude-code',
    url: 'https://github.com/hesreallyhim/awesome-claude-code',
    license: 'MIT',
    verified: true,
    lastUpdate: '3 天前',
  },
  {
    id: 'deep-research',
    name: 'deep-research',
    desc: '多源深度调研与信息聚合',
    category: 'research',
    stars: '20.7k',
    source: 'awesome-claude-skills',
    url: 'https://github.com/ComposioHQ/awesome-claude-skills',
    license: 'MIT',
    verified: true,
    lastUpdate: '1 周前',
  },
  {
    id: 'docx',
    name: 'docx',
    desc: 'Word 文档读写与格式化处理',
    category: 'document',
    stars: '20.7k',
    source: 'awesome-claude-skills',
    url: 'https://github.com/ComposioHQ/awesome-claude-skills',
    license: 'MIT',
    verified: true,
    lastUpdate: '2 周前',
  },
  {
    id: 'pdf',
    name: 'pdf',
    desc: 'PDF 解析与结构化内容提取',
    category: 'document',
    stars: '20.7k',
    source: 'awesome-claude-skills',
    url: 'https://github.com/ComposioHQ/awesome-claude-skills',
    license: 'MIT',
    verified: true,
    lastUpdate: '2 周前',
  },
  {
    id: 'debugger',
    name: 'debugger',
    desc: '交互式调试辅助与错误追踪',
    category: 'development',
    stars: '1.4k',
    source: 'awesome-agent-skills',
    url: 'https://github.com/heilcheng/awesome-agent-skills',
    license: 'Apache-2.0',
    verified: true,
    lastUpdate: '1 周前',
  },
  {
    id: 'vllm-deploy',
    name: 'vllm-deploy',
    desc: 'vLLM 推理服务标准化部署工作流',
    category: 'infra',
    stars: '797',
    source: 'AI-research-SKILLs',
    url: 'https://github.com/zechenzhangAGI/AI-research-SKILLs',
    license: 'MIT',
    verified: false,
    lastUpdate: '1 月前',
  },
];

// ============ MCP Servers ============
const mcpServers = [
  {
    id: 'intjsys-talentai',
    name: 'intjsys-talentai',
    desc: 'TalentAI 语义匹配 MCP 连接器',
    internal: true,
    url: 'mcp.intjsys.com/talentai',
    status: 'LIVE',
    security: 'A+',
  },
  {
    id: 'intjsys-ocr',
    name: 'intjsys-ocr',
    desc: '多模态 OCR 服务连接器',
    internal: true,
    url: 'mcp.intjsys.com/ocr',
    status: 'COMING',
    security: 'A',
  },
  {
    id: 'filesystem',
    name: 'filesystem',
    desc: '本地文件系统安全访问',
    internal: false,
    stars: '7.2k',
    source: 'Anthropic',
    url: 'https://github.com/modelcontextprotocol/servers',
    verified: true,
  },
  {
    id: 'github',
    name: 'github',
    desc: 'GitHub API 全功能集成',
    internal: false,
    stars: '7.2k',
    source: 'Anthropic',
    url: 'https://github.com/modelcontextprotocol/servers',
    verified: true,
  },
  {
    id: 'postgres',
    name: 'postgres',
    desc: 'PostgreSQL 数据库操作',
    internal: false,
    stars: '7.2k',
    source: 'Anthropic',
    url: 'https://github.com/modelcontextprotocol/servers',
    verified: true,
  },
  {
    id: 'brave-search',
    name: 'brave-search',
    desc: 'Brave 搜索引擎接入',
    internal: false,
    stars: '3.2k',
    source: 'Brave',
    url: 'https://github.com/brave/brave-search-mcp-server',
    verified: true,
  },
  {
    id: 'playwright',
    name: 'playwright',
    desc: '浏览器自动化与 Web 抓取',
    internal: false,
    stars: '25.7k',
    source: 'Microsoft',
    url: 'https://github.com/microsoft/playwright-mcp',
    verified: true,
  },
];

// ============ Agent 精选 ============
const curatedAgents = [
  // 暂无纯评测项目
];

// 筛选后的项目
const filteredCoreAssets = computed(() => {
  if (activeCategory.value === 'all') return coreAssets;
  return coreAssets.filter(a => a.category === activeCategory.value);
});

const filteredSkills = computed(() => {
  if (activeCategory.value === 'all') return curatedSkills;
  return curatedSkills.filter(s => s.category === activeCategory.value);
});

// 类别
const categories = [
  { id: 'all', label: '全部' },
  { id: 'matching', label: '智能匹配' },
  { id: 'document', label: '文档处理' },
  { id: 'development', label: '开发工具' },
  { id: 'research', label: '调研分析' },
  { id: 'security', label: '安全审计' },
];

// 市场统计 (模拟)
const marketStats = {
  totalSkills: '63,000+',
  verifiedSkills: '127',
  mcpServers: '1,200+',
  intjsysAssets: '5',
};
</script>

<template>
  <div class="page">
    <!-- 使用共享 Header 组件 -->
    <SiteHeader @open-login="showLoginModal = true" />

    <main>
      <!-- Hero - 技术选型中心 -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge">TECHNICAL CURATION CENTER</div>
          <h1 class="hero-title">技术选型中心</h1>
          <p class="hero-subtitle">
            企业级 AI 能力的严选入口 —— 我们构建可商用的核心资产，也精选经过验证的开源作品。<br>
            每一项入选，都体现我们的技术判断力。
          </p>
          
          <!-- 市场统计 -->
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-value">{{ marketStats.intjsysAssets }}</div>
              <div class="stat-label">自研资产</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ marketStats.verifiedSkills }}</div>
              <div class="stat-label">精选验证</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ marketStats.mcpServers }}</div>
              <div class="stat-label">MCP 生态</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ marketStats.totalSkills }}</div>
              <div class="stat-label">全球 Skills</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 核心资产 -->
      <section class="section container core-section">
          <div class="section-header">
            <div class="section-title-group">
              <span class="section-tag">[ CORE ASSETS ]</span>
              <h2 class="section-title">核心资产</h2>
            </div>
            <p class="section-desc">自研能力 · 商业授权 · SLA 保障</p>
          </div>

          <!-- Flagship 展示 -->
          <div class="flagship-card">
            <div class="flagship-header">
              <div class="flagship-badges">
                <span class="badge flagship-badge">FLAGSHIP</span>
                <span class="badge intjsys-badge">INTJsys</span>
                <span class="badge security-badge">A+ Security</span>
              </div>
              <div class="flagship-latency">< 200ms</div>
            </div>
            <div class="flagship-body">
              <h3 class="flagship-name">TalentAI 语义匹配引擎</h3>
              <p class="flagship-desc">
                企业级简历-JD 双向认知匹配引擎。基于自研语义理解模型，支持多维度评分、批量处理与私有化部署。
                已服务多家企业客户，日均处理 10,000+ 匹配任务。
              </p>
              <div class="flagship-meta">
                <div class="meta-group">
                  <span class="meta-label">兼容客户端</span>
                  <div class="meta-tags">
                    <span class="compat-tag">Claude</span>
                    <span class="compat-tag">Cursor</span>
                    <span class="compat-tag">Gemini</span>
                  </div>
                </div>
                <div class="meta-group">
                  <span class="meta-label">部署方式</span>
                  <div class="meta-tags">
                    <span class="deploy-tag cloud">Cloud SaaS</span>
                    <span class="deploy-tag private">私有部署</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flagship-actions">
              <a href="https://talentai.intjsys.com" target="_blank" class="btn-primary">立即体验</a>
              <a href="/docs" class="btn-secondary">技术文档</a>
              <button class="btn-outline" @click="showLoginModal = true">咨询私有部署</button>
            </div>
          </div>

          <!-- 其他核心资产 -->
          <div class="assets-grid">
            <div v-for="asset in coreAssets.filter(a => !a.flagship)" :key="asset.id" class="asset-card">
              <div class="asset-header">
                <span class="asset-name">{{ asset.name }}</span>
                <div class="asset-badges">
                  <span class="badge intjsys-mini">INTJsys</span>
                  <span class="badge security-mini">{{ asset.security }}</span>
                </div>
              </div>
              <p class="asset-desc">{{ asset.desc }}</p>
              <div class="asset-footer">
                <div class="asset-compat">
                  <span v-for="c in asset.compatibility.slice(0,2)" :key="c" class="compat-mini">{{ c }}</span>
                </div>
                <span class="asset-status" :class="asset.status.toLowerCase()">{{ asset.status }}</span>
              </div>
            </div>
          </div>
      </section>

      <!-- 精选开源 Skills -->
      <section class="section container curated-section">
          <div class="section-header">
            <div class="section-title-group">
              <span class="section-tag">[ CURATED SKILLS ]</span>
              <h2 class="section-title">精选开源</h2>
            </div>
            <p class="section-desc">经过验证的开源 Skills · MIT/Apache 许可 · INTJsys 质量背书</p>
          </div>

          <!-- 类别筛选 -->
          <div class="filter-row">
            <button 
              v-for="cat in categories" 
              :key="cat.id" 
              class="filter-btn"
              :class="{ active: activeCategory === cat.id }"
              @click="activeCategory = cat.id"
            >
              {{ cat.label }}
            </button>
          </div>

          <!-- Skills 网格 -->
          <div class="skills-grid">
            <a 
              v-for="skill in filteredSkills" 
              :key="skill.id" 
              :href="skill.url" 
              target="_blank" 
              class="skill-card"
            >
              <div class="skill-header">
                <code class="skill-name">{{ skill.name }}</code>
                <div class="skill-badges">
                  <span v-if="skill.verified" class="badge verified-badge" title="INTJsys 验证">✓</span>
                  <span class="badge stars-badge">★ {{ skill.stars }}</span>
                </div>
              </div>
              <p class="skill-desc">{{ skill.desc }}</p>
              <div class="skill-footer">
                <div class="skill-meta">
                  <span class="skill-source">{{ skill.source }}</span>
                  <span class="skill-license">{{ skill.license }}</span>
                </div>
                <span class="skill-update">{{ skill.lastUpdate }}</span>
              </div>
            </a>
          </div>

          <div class="more-link">
            <a href="https://skillsmp.com" target="_blank">
              探索全球 63,000+ Skills →
            </a>
          </div>
      </section>

      <!-- MCP Servers -->
      <section class="section container mcp-section">
          <div class="section-header">
            <div class="section-title-group">
              <span class="section-tag">[ MCP SERVERS ]</span>
              <h2 class="section-title">Agent 连接器</h2>
            </div>
            <p class="section-desc">Model Context Protocol · 即插即用 · 标准化接入</p>
          </div>

          <div class="mcp-grid">
            <!-- 自研 MCP -->
            <div class="mcp-group">
              <div class="mcp-group-label">自研服务</div>
              <div class="mcp-list">
                <div v-for="server in mcpServers.filter(s => s.internal)" :key="server.id" class="mcp-card internal">
                  <div class="mcp-header">
                    <code class="mcp-name">{{ server.name }}</code>
                    <span class="badge intjsys-mini">INTJsys</span>
                  </div>
                  <p class="mcp-desc">{{ server.desc }}</p>
                  <div class="mcp-footer">
                    <code class="mcp-url">{{ server.url }}</code>
                    <span class="mcp-status" :class="server.status.toLowerCase()">{{ server.status }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 精选 MCP -->
            <div class="mcp-group">
              <div class="mcp-group-label">精选开源</div>
              <div class="mcp-list">
                <a 
                  v-for="server in mcpServers.filter(s => !s.internal)" 
                  :key="server.id" 
                  :href="server.url" 
                  target="_blank"
                  class="mcp-card curated"
                >
                  <div class="mcp-header">
                    <code class="mcp-name">{{ server.name }}</code>
                    <span v-if="server.verified" class="badge verified-mini">✓</span>
                  </div>
                  <p class="mcp-desc">{{ server.desc }}</p>
                  <div class="mcp-footer">
                    <span class="mcp-source">{{ server.source }}</span>
                    <span class="mcp-stars">★ {{ server.stars }}</span>
                  </div>
                </a>
              </div>
	            </div>
		          </div>
		      </section>
	    </main>

    <!-- 使用共享 Footer 组件 -->
    <SiteFooter />

    <!-- 登录 Modal -->
    <LoginModal v-model="showLoginModal" />
  </div>
</template>

<style scoped>
/* ========================================
   CSS Variables - 极简工业风设计系统
   ======================================== */
.page {
  /* CSS Variables */
  --bg: #ffffff;
  --fg: #111111;
  --muted: #666666;
  --border: rgba(0, 0, 0, 0.08);
  --grid-line: rgba(0, 0, 0, 0.04);
  --accent: #000000;
  --radius: 12px;
  --section-padding: 160px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --success: #22c55e;
  
  /* Base Styles */
  min-height: 100vh;
  color: var(--fg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  background-color: var(--bg);
  background-image: 
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 40px 40px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
}

/* Panel Inner */
.panel-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

/* ========================================
   Header (与首页完全一致)
   ======================================== */
.header {
  position: sticky;
  top: 0;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid var(--fg);
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
  padding: 0;
  box-sizing: border-box;
}

.logo {
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.04em;
  text-decoration: none;
  color: var(--fg);
  transition: opacity 0.2s var(--ease);
}

.logo:hover {
  opacity: 0.7;
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
  font-weight: 500;
  text-decoration: none;
  color: var(--muted);
  transition: color 0.2s var(--ease);
}

.nav-link:hover {
  color: var(--fg);
}

.btn-login {
  padding: 8px 16px;
  border: 1px solid var(--fg);
  border-radius: 0;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  color: var(--fg);
  transition: all 0.2s var(--ease);
}

.btn-login:hover {
  background: var(--fg);
  color: #fff;
}

/* 用户下拉卡片 */
.user-dropdown {
  position: relative;
}

.btn-user {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--fg);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.btn-user:hover {
  background: var(--fg);
  color: #fff;
}

.btn-user .arrow {
  font-size: 10px;
  opacity: 0.6;
}

.user-card {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 240px;
  background: #fff;
  border: 1px solid var(--fg);
  z-index: 1001;
}

.user-card-header {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: var(--fg);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-card-id {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

.user-card-stats {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}

.stat-label {
  font-size: 12px;
  color: var(--muted);
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
}

.btn-logout {
  display: block;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: none;
  font-size: 13px;
  color: var(--muted);
  cursor: pointer;
}

.btn-logout:hover { background: #f5f5f5; color: var(--fg); }

/* Dropdown Panels */
.dropdown-panel {
  position: absolute;
  top: 72px;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--fg);
  padding: 32px 0;
  z-index: 999;
}

.panel-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}

.panel-grid { display: grid; gap: 16px; }
.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(4, 1fr); }

.panel-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  text-decoration: none;
  border: 1px solid #000;
  background: #fff;
  transition: background 0.15s;
}

.panel-item:hover { background: rgba(0, 0, 0, 0.03); }

.panel-icon {
  font-size: 20px;
  font-weight: 700;
  font-family: monospace;
  color: var(--fg);
}

.panel-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.panel-title { font-size: 14px; font-weight: 700; letter-spacing: 0.05em; color: var(--fg); }
.panel-meta { font-size: 10px; padding: 2px 6px; background: #f0f0f0; color: var(--muted); }
.panel-desc { font-size: 13px; color: var(--muted); margin: 0; }

/* ========================================
   Hero - 技术选型中心
   ======================================== */
.hero {
  padding: 100px 0 60px;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.hero-badge {
  display: inline-block;
  padding: 8px 20px;
  background: var(--fg);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 64px;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 0 0 24px;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--muted);
  max-width: 700px;
  margin: 0 auto 48px;
  line-height: 1.8;
}

/* 统计行 */
.stats-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 13px;
  color: var(--muted);
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}

/* ========================================
   Section 通用样式 (与首页 bento 一致)
   ======================================== */
.section {
  padding: 80px 0;
  border-bottom: 1px solid var(--border);
}

.section-header {
  margin-bottom: 48px;
}

.section-header.center {
  text-align: center;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.section-header.center .section-title-group {
  justify-content: center;
}

.section-tag {
  font-size: 13px;
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 0.05em;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.section-desc {
  font-size: 15px;
  color: var(--muted);
  margin: 0;
}

/* ========================================
   Flagship 卡片
   ======================================== */
.flagship-card {
  padding: 40px;
  border: 2px solid var(--fg);
  background: #fff;
  margin-bottom: 32px;
}

.flagship-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.flagship-badges {
  display: flex;
  gap: 8px;
}

.badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  letter-spacing: 0.05em;
}

.flagship-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #000;
}

.intjsys-badge {
  background: var(--fg);
  color: #fff;
}

.security-badge {
  background: #dcfce7;
  color: #166534;
}

.flagship-latency {
  font-family: monospace;
  font-size: 14px;
  color: var(--success);
  font-weight: 600;
}

.flagship-body {
  margin-bottom: 32px;
}

.flagship-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px;
}

.flagship-desc {
  font-size: 16px;
  color: var(--muted);
  line-height: 1.7;
  margin: 0 0 24px;
  max-width: 800px;
}

.flagship-meta {
  display: flex;
  gap: 48px;
}

.meta-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-label {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-tags {
  display: flex;
  gap: 8px;
}

.compat-tag {
  font-size: 12px;
  padding: 4px 12px;
  background: #f5f5f5;
  font-weight: 500;
}

.deploy-tag {
  font-size: 12px;
  padding: 4px 12px;
  font-weight: 500;
}

.deploy-tag.cloud {
  background: #dbeafe;
  color: #1e40af;
}

.deploy-tag.private {
  background: #fef3c7;
  color: #92400e;
}

.flagship-actions {
  display: flex;
  gap: 16px;
}

.btn-primary {
  padding: 12px 32px;
  background: var(--fg);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  padding: 12px 32px;
  background: transparent;
  color: var(--fg);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid var(--fg);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--fg);
  color: #fff;
}

.btn-outline {
  padding: 12px 32px;
  background: transparent;
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  border: 1px dashed var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  border-color: var(--fg);
  color: var(--fg);
}

/* ========================================
   Assets Grid
   ======================================== */
.core-section {
  background: transparent;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.asset-card {
  padding: 24px;
  border: 1px solid var(--fg);
  background: #fff;
  transition: transform 0.2s;
}

.asset-card:hover {
  transform: translateY(-2px);
}

.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.asset-name {
  font-size: 14px;
  font-weight: 600;
}

.asset-badges {
  display: flex;
  gap: 4px;
}

.intjsys-mini {
  font-size: 8px;
  padding: 2px 6px;
  background: var(--fg);
  color: #fff;
}

.security-mini {
  font-size: 8px;
  padding: 2px 6px;
  background: #dcfce7;
  color: #166534;
}

.asset-desc {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
  margin: 0 0 16px;
}

.asset-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.asset-compat {
  display: flex;
  gap: 4px;
}

.compat-mini {
  font-size: 10px;
  padding: 2px 6px;
  background: #f5f5f5;
}

.asset-status {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
}

.asset-status.production {
  background: #dcfce7;
  color: #166534;
}

/* ========================================
   Curated Skills
   ======================================== */
.curated-section {
  background: transparent;
}

.filter-row {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  background: #fff;
  border: 1px solid var(--fg);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--fg);
}

.filter-btn.active {
  background: var(--fg);
  color: #fff;
  border-color: var(--fg);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.skill-card {
  padding: 24px;
  background: #fff;
  border: 1px solid var(--fg);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.skill-card:hover {
  border-color: var(--fg);
  border-style: solid;
  transform: translateY(-2px);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.skill-name {
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
}

.skill-badges {
  display: flex;
  gap: 6px;
}

.verified-badge {
  background: #dcfce7;
  color: #166534;
  font-size: 10px;
  padding: 2px 6px;
}

.stars-badge {
  background: #f5f5f5;
  color: var(--muted);
  font-size: 10px;
  padding: 2px 8px;
}

.skill-desc {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
  margin: 0 0 16px;
}

.skill-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.skill-meta {
  display: flex;
  gap: 12px;
}

.skill-source {
  color: var(--muted);
}

.skill-license {
  color: var(--muted);
  padding: 1px 6px;
  background: #f5f5f5;
}

.skill-update {
  color: var(--muted);
}

.more-link {
  text-align: center;
}

.more-link a {
  font-size: 14px;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}

.more-link a:hover {
  color: var(--fg);
}

/* ========================================
   MCP Servers
   ======================================== */
.mcp-section {
  background: transparent;
}

.mcp-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
}

.mcp-group-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.mcp-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mcp-card {
  padding: 20px;
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.mcp-card.internal {
  border: 1px solid var(--fg);
}

.mcp-card.curated {
  border: 1px solid var(--fg);
}

.mcp-card:hover {
  transform: translateY(-2px);
}

.mcp-card.curated:hover {
  border-color: var(--fg);
}

.mcp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.mcp-name {
  font-family: monospace;
  font-size: 13px;
  font-weight: 600;
}

.verified-mini {
  font-size: 9px;
  padding: 2px 5px;
  background: #dcfce7;
  color: #166534;
}

.mcp-desc {
  font-size: 13px;
  color: var(--muted);
  margin: 0 0 12px;
}

.mcp-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.mcp-url {
  font-family: monospace;
  color: var(--muted);
}

.mcp-status {
  font-weight: 600;
  padding: 2px 8px;
}

.mcp-status.live {
  background: #dcfce7;
  color: #166534;
}

.mcp-status.coming {
  background: #f5f5f5;
  color: var(--muted);
}

.mcp-source {
  color: var(--muted);
}

.mcp-stars {
  color: var(--muted);
}

/* ========================================
   Pricing
   ======================================== */
.pricing-section {
  background: transparent;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.pricing-card {
  padding: 32px;
  border: 1px solid var(--fg);
  background: #fff;
  text-align: center;
  transition: all 0.2s;
}

.pricing-card:hover {
  border-color: var(--fg);
}

.pricing-card.featured {
  border: 2px solid var(--fg);
  transform: scale(1.02);
}

.pricing-header {
  margin-bottom: 24px;
}

.pricing-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
}

.pricing-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  background: #f5f5f5;
  display: inline-block;
}

.pricing-card.featured .pricing-tag {
  background: var(--fg);
  color: #fff;
}

.pricing-body {
  margin-bottom: 24px;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.pricing-features li {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
  color: var(--muted);
}

.pricing-features li:last-child {
  border-bottom: none;
}

.pricing-features li::before {
  content: '✓';
  margin-right: 12px;
  color: var(--success);
}

.btn-pricing {
  display: block;
  width: 100%;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  background: transparent;
  border: 1px solid var(--fg);
  color: var(--fg);
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
}

.btn-pricing:hover {
  background: var(--fg);
  color: #fff;
}

.btn-pricing.featured {
  background: var(--fg);
  color: #fff;
}

.btn-pricing.featured:hover {
  opacity: 0.9;
}

/* ========================================
   Connect Section
   ======================================== */
.connect-section {
  background: transparent;
}

.connect-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.connect-block {
  padding: 24px;
  border: 1px solid var(--fg);
  background: #fff;
}

.connect-block h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 16px;
}

.code-block {
  background: #0d0d0d;
  padding: 20px;
}

.code-block code {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #22c55e;
  line-height: 1.7;
}

.platform-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.platform {
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  padding: 10px 20px;
  background: #fff;
  border: 1px solid var(--fg);
}

/* ========================================
   Footer
   ======================================== */
.system-footer {
  border-top: 1px solid var(--fg);
  padding: 32px 0;
  background: #fff;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-brand { font-weight: 700; font-size: 16px; }
.brand-en { font-weight: 400; color: var(--muted); margin-left: 4px; }
.footer-meta { font-size: 11px; color: var(--muted); font-family: monospace; margin-top: 4px; }

.nodes-copyright, .nodes-icp { font-size: 12px; color: var(--muted); text-align: right; }
.nodes-icp a { color: inherit; text-decoration: none; }


/* ========================================
   Agent 精选
   ======================================== */
.agent-section {
  padding-top: 100px;
  padding-bottom: 100px;
  background: transparent;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.agent-card {
  padding: 28px;
  background: #fff;
  border: 1px solid var(--fg);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s var(--ease);
  display: flex;
  flex-direction: column;
}

.agent-card:hover {
  transform: translateY(-4px);
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.08);
}

.agent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.agent-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--fg);
}

.agent-badges {
  display: flex;
  gap: 6px;
}

.service-badge {
  font-size: 10px;
  padding: 3px 8px;
  background: #fef3c7;
  color: #92400e;
  font-weight: 600;
}

.agent-desc {
  color: var(--muted);
  font-size: 0.95rem;
  margin: 0 0 16px;
  line-height: 1.6;
  flex: 1;
}

.agent-features {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.feature-tag {
  font-size: 11px;
  padding: 4px 10px;
  background: #f0f0f0;
  color: var(--fg);
  font-weight: 500;
}

.agent-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.agent-meta {
  display: flex;
  gap: 12px;
}

.agent-source {
  font-size: 12px;
  color: var(--muted);
}

.agent-license {
  font-size: 11px;
  padding: 2px 6px;
  background: #e0f2fe;
  color: #0369a1;
}

.view-detail {
  font-size: 13px;
  font-weight: 600;
  color: var(--fg);
}

/* ========================================
   Responsive
   ======================================== */
@media (max-width: 1200px) {
  .assets-grid { grid-template-columns: repeat(2, 1fr); }
  .skills-grid { grid-template-columns: repeat(2, 1fr); }
  .agents-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 1024px) {
  .mcp-grid { grid-template-columns: 1fr; }
  .connect-grid { grid-template-columns: 1fr; }
  .pricing-grid { grid-template-columns: 1fr; }
  .pricing-card.featured { transform: none; }
}

@media (max-width: 768px) {
  .hero-title { font-size: 40px; }
  .stats-row { flex-wrap: wrap; gap: 24px; }
  .stat-divider { display: none; }
  .assets-grid { grid-template-columns: 1fr; }
  .skills-grid { grid-template-columns: 1fr; }
  .agents-grid { grid-template-columns: 1fr; }
  .flagship-meta { flex-direction: column; gap: 16px; }
  .flagship-actions { flex-direction: column; }
  .panel-grid { grid-template-columns: 1fr !important; }
  .platform-row { flex-wrap: wrap; justify-content: center; }
  .footer-inner { flex-direction: column; gap: 16px; text-align: center; }
  .nodes-copyright, .nodes-icp { text-align: center; }
}
</style>
