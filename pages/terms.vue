<script setup lang="ts">
useHead({
  title: "服务条款｜Reallier 简序智能",
  meta: [
    {
      name: "description",
      content: "简序智能国内展示站服务条款。",
    },
  ],
});
</script>

<template>
  <main class="legal-page">
    <header class="legal-hero">
      <p>LEGAL / TERMS</p>
      <h1>服务条款</h1>
      <span>更新日期：2026 年 7 月 29 日</span>
    </header>

    <div class="legal-content">
      <section>
        <h2>一、网站定位</h2>
        <p>
          intjsys.com 是深圳市简序智能科技有限责任公司的国内品牌展示与商务咨询网站。
          网站公开内容用于介绍公司、工程能力、脱敏案例、合作方式和联系方式。
        </p>
        <p>
          当前网站不提供用户注册、评论、订阅、支付、公开生成式 AI、算法推荐、可搜索知识库、
          Admin 控制台或国际站产品后台入口。
        </p>
      </section>

      <section>
        <h2>二、咨询与项目服务</h2>
        <p>
          通过网站、邮件或企业微信进行的初步沟通不自动构成报价、承诺或服务合同。
          项目范围、成果、费用、周期、验收、数据处理、知识产权和保密义务，以双方另行签署的合同或书面确认文件为准。
        </p>
        <p>
          网站展示的架构、指标、案例与方法可能经过脱敏、抽象或简化，不应被视为适用于所有场景的保证。
        </p>
      </section>

      <section>
        <h2>三、内容与知识产权</h2>
        <p>
          网站中的品牌标识、文字、图形、页面设计、案例表达和其他内容，除另有标注外，由我们或相关权利人依法享有权利。
          你可以为正常了解和商务沟通浏览、引用少量内容，但不得未经授权批量复制、镜像、出售、冒充来源或用于误导性宣传。
        </p>
      </section>

      <section>
        <h2>四、合理使用</h2>
        <p>访问本网站时，不得实施下列行为：</p>
        <ul>
          <li>破坏、干扰、绕过或测试网站安全措施；</li>
          <li>未经授权抓取、批量下载或占用过量资源；</li>
          <li>冒用他人身份发送咨询或提交违法、有害内容；</li>
          <li>侵犯他人隐私、知识产权或其他合法权益；</li>
          <li>利用网站从事违反适用法律法规的活动。</li>
        </ul>
      </section>

      <section>
        <h2>五、外部链接与可用性</h2>
        <p>
          网站可能提供备案管理系统等外部链接。外部网站由其运营者负责，我们不控制其内容、可用性或信息处理方式。
          我们会尽力保持本站安全稳定，但不保证网站始终不中断、无错误或满足特定用途。
        </p>
      </section>

      <section>
        <h2>六、责任边界</h2>
        <p>
          在法律允许范围内，因依赖公开展示内容作出决策、第三方服务、网络中断、不可抗力或非我们可控原因造成的损失，
          我们按照适用法律和双方有效约定承担责任。任何具体服务责任以项目合同为准。
        </p>
      </section>

      <section>
        <h2>七、条款更新与联系</h2>
        <p>
          我们可能根据网站范围或适用要求更新本条款，并在页面顶部标注最新日期。
          对本条款有疑问，请联系
          <a href="mailto:reallier@intjsys.com">reallier@intjsys.com</a>。
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

.legal-content p,
.legal-content li {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}

.legal-content p {
  margin: 0 0 12px;
}

.legal-content p:last-child {
  margin-bottom: 0;
}

.legal-content ul {
  margin: 0;
  padding-left: 22px;
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
