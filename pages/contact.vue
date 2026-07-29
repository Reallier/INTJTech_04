<template>
  <div class="page contact-page">
    <main class="container">
      <header class="page-header">
        <span class="label">— CONTACT</span>
        <h1>联系咨询</h1>
        <p class="subtitle">
          把你的目标、约束与现状发来，我们会用可落地的工程语言给出方案与交付边界。
        </p>
      </header>

      <section class="content-card">
        <h2>联系方式</h2>
        <div class="contact-grid">
          <a class="contact-item" href="mailto:reallier@intjsys.com">
            <span class="k">Email</span>
            <span class="v">reallier@intjsys.com</span>
            <span class="hint">点击发邮件</span>
          </a>

          <a class="contact-item" href="mailto:contact@intjtech.cn">
            <span class="k">Email</span>
            <span class="v">contact@intjtech.cn</span>
            <span class="hint">点击发邮件</span>
          </a>

          <div class="contact-item wechat">
            <span class="k">企业微信</span>
            <div class="wechat-row">
              <img src="/wechat-contact.png" alt="企业微信二维码" />
              <div class="wechat-meta">
                <span class="v">扫码添加</span>
                <span class="hint">备注：技术服务 / 咨询</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="content-card">
        <h2>发来这些信息（可选）</h2>
        <ul class="checklist">
          <li>你要落地的项目/模块（开源项目名、版本、部署环境）</li>
          <li>目标：上线门槛、QPS/并发、延迟、数据规模</li>
          <li>约束：网络隔离、合规要求、可用预算与时间</li>
          <li>现状：现有架构、日志/监控、失败样例（如果是评测/红队）</li>
        </ul>
      </section>
    </main>

  </div>
</template>

<script setup lang="ts">


useSeoMeta({
  title: '联系咨询 - 简序智能',
  description: '技术服务咨询与合作对接。'
});
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background-color: #fafafa;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 64px 24px 0;
}

.page-header {
  margin-bottom: 32px;
}

.label {
  font-size: 0.75rem;
  color: #999;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 12px;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 12px;
  color: #111;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
  line-height: 1.7;
}

.content-card {
  background: #fff;
  border: 1px solid #111;
  padding: 40px;
  margin-bottom: 24px;
}

.content-card h2 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 18px;
  color: #111;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.contact-item {
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  background: #fff;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.08);
  border-color: #111;
}

.contact-item.wechat {
  grid-column: 1 / -1;
}

.k {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.v {
  font-weight: 800;
  color: #111;
}

.hint {
  font-size: 0.85rem;
  color: #666;
}

.wechat-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
}

.wechat-row img {
  width: 88px;
  height: 88px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  padding: 4px;
  object-fit: contain;
}

.wechat-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checklist {
  margin: 0;
  padding-left: 18px;
  color: #333;
}

.checklist li {
  margin: 10px 0;
  line-height: 1.7;
}

@media (max-width: 760px) {
  .container {
    padding-top: 40px;
  }

  .content-card {
    padding: 24px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
