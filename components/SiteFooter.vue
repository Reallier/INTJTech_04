<template>
  <footer class="site-footer">
    <div class="footer-main">
      <!-- 左侧：联系方式 -->
      <div class="footer-contact">
        <a href="mailto:reallier@intjsys.com" class="contact-email">reallier@intjsys.com</a>
        <div class="contact-wechat">
          <img src="/wechat-contact.png" alt="企业微信" />
          <span>企业微信</span>
        </div>
      </div>

      <!-- 中间：版权与备案 -->
      <div class="footer-center">
        <span>© 2025 简序智能 INTJsys</span>
        <span class="footer-divider">·</span>
        <span>深圳 · 香港 · 上海</span>
        <span class="footer-divider">·</span>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026005920号</a>
      </div>

      <!-- 右侧：法律链接 -->
      <div class="footer-legal">
        <a href="/privacy">隐私政策</a>
        <a href="/terms">服务条款</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: #111;
  color: #fff;
  margin-top: 120px;
  padding: 40px;
}

.footer-main {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

/* 左侧联系方式 */
.footer-contact {
  display: flex;
  align-items: center;
  gap: 24px;
}

.contact-email {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
}

.contact-email:hover {
  text-decoration: underline;
}

.contact-wechat {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-wechat img {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 4px;
  padding: 2px;
}

.contact-wechat span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

/* 中间版权信息 */
.footer-center {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.footer-center a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
}

.footer-center a:hover {
  color: #fff;
}

.footer-divider {
  color: rgba(255, 255, 255, 0.3);
}

/* 右侧法律链接 */
.footer-legal {
  display: flex;
  gap: 24px;
}

.footer-legal a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 13px;
}

.footer-legal a:hover {
  color: #fff;
}

/* 响应式 */
@media (max-width: 768px) {
  .footer-main {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  
  .footer-contact {
    flex-direction: column;
  }
  
  .footer-center {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
