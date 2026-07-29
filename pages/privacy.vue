<script setup lang="ts">
useHead({
  title: "隐私政策｜Reallier 简序智能",
  meta: [
    {
      name: "description",
      content: "简序智能国内展示站隐私政策。",
    },
  ],
});
</script>

<template>
  <main class="legal-page">
    <header class="legal-hero">
      <p>LEGAL / PRIVACY</p>
      <h1>隐私政策</h1>
      <span>更新日期：2026 年 7 月 29 日</span>
    </header>

    <div class="legal-content">
      <section>
        <h2>一、适用范围</h2>
        <p>
          本政策适用于深圳市简序智能科技有限责任公司运营的国内官方网站
          <strong>intjsys.com</strong>。当前网站仅提供品牌、能力、脱敏案例、联系方式和法务信息展示，
          不提供用户注册、评论、订阅、支付、公开生成式 AI、算法推荐或可搜索知识库功能。
        </p>
        <p>独立产品、项目交付或第三方平台适用其各自的隐私说明和合同约定，不属于本政策覆盖范围。</p>
      </section>

      <section>
        <h2>二、我们处理的信息</h2>
        <h3>2.1 主动联系信息</h3>
        <p>
          当你通过电子邮件、企业微信或其他公开联系方式与我们沟通时，我们会处理你主动提供的姓名、
          公司、联系方式、项目背景及附件，用于回复咨询、判断合作范围和履行后续约定。
        </p>
        <h3>2.2 基础访问日志</h3>
        <p>
          为保障网站安全和稳定运行，托管与网络设施可能记录访问时间、IP 地址、请求路径、设备/浏览器类型、
          错误和安全事件等必要日志。我们不在本网站建立用户画像，也不基于个人特征进行推荐。
        </p>
      </section>

      <section>
        <h2>三、Cookie 与第三方资源</h2>
        <p>
          当前网站不使用广告、个性化推荐或跨站追踪 Cookie。若为安全、负载均衡或基础会话使用必要 Cookie，
          其用途仅限于网站正常运行。
        </p>
        <p>
          国内构建不加载 Google Fonts、境外 Font Awesome CDN 或国际站实时演示。页面中的备案链接会跳转至
          工业和信息化部备案管理系统，跳转后由该网站按照其规则处理信息。
        </p>
      </section>

      <section>
        <h2>四、保存、共享与安全</h2>
        <p>
          我们仅在实现沟通、履约、安全审计或法定义务所需期间保存信息，并采取合理的访问控制、备份和安全措施。
          除依法提供、取得你的授权、完成你要求的服务或使用必要服务商外，我们不会出售或无关共享个人信息。
        </p>
        <p>
          国内网站本身不主动将访问者信息传输至国际站产品后台。具体项目如涉及数据处理、委托处理或跨境场景，
          将在项目启动前另行评估并通过合同明确。
        </p>
      </section>

      <section>
        <h2>五、你的权利</h2>
        <p>
          你可以依法请求查阅、更正、复制或删除我们持有的个人信息，也可以撤回同意或要求说明处理规则。
          请通过 <a href="mailto:reallier@intjsys.com">reallier@intjsys.com</a> 联系我们。
          为保护信息安全，我们可能需要核验请求人的身份。
        </p>
      </section>

      <section>
        <h2>六、未成年人</h2>
        <p>
          本网站面向企业与专业用户，不以未成年人为目标用户。未成年人如需向我们提交个人信息，应在监护人指导下进行。
        </p>
      </section>

      <section>
        <h2>七、政策更新</h2>
        <p>
          当网站范围、信息处理方式或适用要求发生变化时，我们会更新本政策并修改顶部日期。
          若未来新增账号、互动、生成式 AI 或其他数据功能，将在上线前补充相应告知与控制措施。
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.legal-page {
  min-height: 100vh;
  padding-bottom: 80px;
  background: var(--bg-main);
}

.legal-hero,
.legal-content {
  width: min(860px, calc(100% - 48px));
  margin: 0 auto;
}

.legal-hero {
  padding: 72px 0 44px;
  border-bottom: 1px solid var(--fg);
}

.legal-hero p,
.legal-hero span {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
}

.legal-hero p {
  margin: 0 0 18px;
  color: var(--accent);
  font-weight: 700;
}

.legal-hero h1 {
  margin: 0 0 20px;
  font-size: clamp(42px, 6vw, 64px);
  letter-spacing: -0.035em;
}

.legal-hero span {
  color: var(--muted-light);
}

.legal-content {
  padding-top: 24px;
}

.legal-content section {
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
}

.legal-content h2 {
  margin: 0 0 18px;
  font-size: 22px;
}

.legal-content h3 {
  margin: 22px 0 8px;
  font-size: 16px;
}

.legal-content p {
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}

.legal-content p:last-child {
  margin-bottom: 0;
}

.legal-content strong {
  color: var(--fg);
}

.legal-content a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 640px) {
  .legal-hero,
  .legal-content {
    width: calc(100% - 32px);
  }

  .legal-hero {
    padding: 48px 0 34px;
  }

  .legal-content section {
    padding: 24px 0;
  }
}
</style>
