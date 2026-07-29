<script setup lang="ts">
useHead({
  title: "简序智能 | 官网二维码",
  meta: [
    {
      name: "description",
      content: "简序智能 INTJsys 官网移动宣传页，扫码访问 intjsys.com。",
    },
  ],
});
</script>

<template>
  <main class="promo-page">
    <section class="promo-card" aria-label="简序智能官网二维码">
      <header class="promo-header">
        <img src="/site-logo.svg" alt="" class="brand-logo" />
        <div>
          <p class="eyebrow">INTJSYS.COM</p>
          <h1>简序智能</h1>
        </div>
      </header>

      <div class="promo-copy">
        <p class="lead">面向国内企业的 AI 系统工程工作室</p>
        <p class="summary">
          把 Agent、数据、流程和部署环境整理成可交付、可观察、可长期维护的生产系统。
        </p>
      </div>

      <div class="capability-list" aria-label="核心能力">
        <span>Agent 架构</span>
        <span>私有化基础设施</span>
        <span>AI 转型路径</span>
      </div>

      <div class="qr-panel">
        <img src="/intjsys-website-qr.png" alt="访问简序智能官网二维码" class="qr-image" />
        <div class="qr-copy">
          <strong>扫码访问官网</strong>
          <span>intjsys.com</span>
        </div>
      </div>

      <footer class="promo-actions">
        <a href="https://intjsys.com/" class="primary-action">打开官网</a>
        <NuxtLink to="/contact" class="secondary-action">联系咨询</NuxtLink>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.promo-page {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 18px;
  color: #f7f4ee;
  background:
    linear-gradient(90deg, rgba(247, 244, 238, 0.08) 1px, transparent 1px),
    linear-gradient(rgba(247, 244, 238, 0.07) 1px, transparent 1px),
    #090a0c;
  background-size: 34px 34px;
}

.promo-card {
  width: 100%;
  max-width: 430px;
  min-height: min(720px, calc(100dvh - 36px));
  display: grid;
  align-content: space-between;
  gap: 22px;
  padding: 22px;
  border: 1px solid rgba(247, 244, 238, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(240, 180, 41, 0.18), transparent 38%),
    rgba(9, 10, 12, 0.88);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
}

.promo-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
}

.eyebrow {
  margin: 0 0 2px;
  color: #f0b429;
  font-family: "SF Mono", "Roboto Mono", monospace;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  font-size: 24px;
  line-height: 1.08;
  letter-spacing: 0;
}

.promo-copy {
  display: grid;
  gap: 10px;
}

.lead {
  margin: 0;
  font-size: clamp(30px, 9vw, 42px);
  line-height: 1.08;
  font-weight: 950;
  letter-spacing: 0;
}

.summary {
  margin: 0;
  color: rgba(247, 244, 238, 0.72);
  font-size: 15px;
  line-height: 1.65;
}

.capability-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.capability-list span {
  padding: 7px 9px;
  border: 1px solid rgba(247, 244, 238, 0.16);
  color: rgba(247, 244, 238, 0.82);
  background: rgba(247, 244, 238, 0.06);
  font-size: 12px;
  font-weight: 800;
}

.qr-panel {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px;
  border: 1px solid rgba(247, 244, 238, 0.18);
  border-radius: 8px;
  background: rgba(247, 244, 238, 0.06);
}

.qr-image {
  width: 128px;
  height: 128px;
  flex: 0 0 auto;
  padding: 8px;
  border-radius: 6px;
  background: #fff;
}

.qr-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.qr-copy strong {
  font-size: 18px;
  line-height: 1.2;
}

.qr-copy span {
  color: #32d6d0;
  font-family: "SF Mono", "Roboto Mono", monospace;
  font-size: 12px;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.promo-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.primary-action,
.secondary-action {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid currentColor;
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
}

.primary-action {
  color: #0a0b0d;
  border-color: #f0b429;
  background: #f0b429;
}

.secondary-action {
  color: #f7f4ee;
  border-color: rgba(247, 244, 238, 0.28);
  background: rgba(247, 244, 238, 0.06);
}

@media (max-width: 380px) {
  .promo-page {
    padding: 12px;
  }

  .promo-card {
    min-height: calc(100dvh - 24px);
    gap: 18px;
    padding: 18px;
  }

  .lead {
    font-size: 29px;
  }

  .qr-panel {
    gap: 12px;
    padding: 12px;
  }

  .qr-image {
    width: 112px;
    height: 112px;
  }
}
</style>
