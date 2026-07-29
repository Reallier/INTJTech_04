<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-contact">
        <a href="mailto:reallier@intjsys.com">reallier@intjsys.com</a>
        <span>深圳市简序智能科技有限责任公司</span>
      </div>

      <div class="footer-center">
        <span>© 2026 Reallier 简序智能</span>
        <span class="footer-divider">|</span>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          粤ICP备2026005920号
        </a>
      </div>

      <div class="footer-legal">
        <NuxtLink to="/privacy">隐私政策</NuxtLink>
        <NuxtLink to="/terms">服务条款</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 38px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, var(--surface-deep-hover), var(--surface-deep));
  color: var(--on-deep);
}

.footer-main {
  width: min(var(--max-content), calc(100% - 48px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 32px;
}

.footer-contact {
  display: grid;
  gap: 5px;
  font-size: 13px;
}

.footer-contact span,
.footer-center,
.footer-center a,
.footer-legal a {
  color: var(--on-deep-muted);
  font-size: 12px;
}

.footer-contact a {
  color: var(--on-deep);
  font-size: 14px;
}

.footer-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
}

.footer-legal {
  display: flex;
  justify-content: flex-end;
  gap: 22px;
}

.footer-contact a:hover,
.footer-center a:hover,
.footer-legal a:hover {
  color: var(--on-deep);
}

@media (max-width: 900px) {
  .footer-main {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-center {
    flex-wrap: wrap;
    white-space: normal;
  }

  .footer-legal {
    justify-content: center;
  }
}
</style>
