<script setup lang="ts">
import {
  domesticBusinessLines,
  domesticProofAssets,
  domesticWorkSteps,
} from "~/data/domesticHome.mjs";

useHead({
  title: "Reallier 简序智能｜企业 AI 系统架构与工程交付",
  meta: [
    {
      name: "description",
      content:
        "从业务判断、AI 与 Agent 系统构建，到可控基础设施和长期治理，简序智能帮助国内企业把 AI 交付进真实业务系统。",
    },
  ],
});

const deliveryStandards = [
  {
    index: "01",
    title: "可运行的系统",
    en: "DEPLOYABLE SYSTEM",
    detail: "目标架构、工作流、数据与工具接口、部署包",
    status: "DEPLOYABLE",
  },
  {
    index: "02",
    title: "可验证的结果",
    en: "MEASURABLE OUTCOMES",
    detail: "业务指标、样本集、评测与回归基线",
    status: "MEASURABLE",
  },
  {
    index: "03",
    title: "可接管的运行",
    en: "OPERABLE HANDOVER",
    detail: "日志监控、权限边界、版本治理与运维手册",
    status: "OPERABLE",
  },
];
</script>

<template>
  <main class="home-page">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-shell">
        <div class="hero-copy">
          <p class="eyebrow">AI 与 AGENT 系统 · 判断 / 构建 / 运行</p>
          <h1 id="hero-title">
            把企业 AI 从<br />
            判断、构建带到<br />
            <span>长期运行</span>
          </h1>
          <p class="hero-summary">
            从业务目标、核心流程和现有系统出发，判断改造顺序，构建可运行的 AI 与 Agent
            系统，再用可控基础设施和持续治理让结果长期生效。
          </p>
          <p class="hero-fit">
            适合已有核心系统、云账单或 AI 落地链路开始变复杂的国内团队。
          </p>
          <NuxtLink to="/contact" class="primary-action">
            聊一个具体系统
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <div class="blueprint" aria-label="判断、构建、运行三阶段交付架构图">
          <div class="blueprint-top">
            <span>REALLIER / SYSTEM DELIVERY</span>
            <strong>CN · DISPLAY EDITION</strong>
          </div>
          <div class="phase-grid">
            <article v-for="step in domesticWorkSteps" :key="step.num" class="phase">
              <span class="phase-number">{{ step.num }}</span>
              <p class="phase-en">
                {{ step.num === "01" ? "DECIDE" : step.num === "02" ? "BUILD" : "OPERATE" }}
              </p>
              <h2>{{ step.title }}</h2>
              <p>{{ step.desc }}</p>
              <div class="phase-track"><span></span><span></span><span></span></div>
              <small>{{ step.num === "01" ? "READY" : step.num === "02" ? "DELIVER" : "GOVERN" }}</small>
            </article>
          </div>
          <div class="blueprint-foot">
            <span>诊断报告</span><i></i><span>可运行系统</span><i></i><span>治理基线</span>
          </div>
        </div>
      </div>
    </section>

    <section id="delivery" class="delivery" aria-labelledby="delivery-title">
      <div class="section-shell">
        <header class="split-heading">
          <div>
            <p class="eyebrow">交付标准</p>
            <p class="section-code">SYSTEM DELIVERY / 01—03</p>
          </div>
          <h2 id="delivery-title">可运行、可验证、可接管，才算完成交付。</h2>
        </header>

        <ol class="standard-list">
          <li v-for="item in deliveryStandards" :key="item.index">
            <span class="row-index">{{ item.index }}</span>
            <div class="row-name">
              <h3>{{ item.title }}</h3>
              <small>{{ item.en }}</small>
            </div>
            <p>{{ item.detail }}</p>
            <strong>{{ item.status }}</strong>
          </li>
        </ol>
      </div>
    </section>

    <section id="industries" class="industries" aria-labelledby="industries-title">
      <div class="industry-shell">
        <header>
          <p class="eyebrow">业务与场景</p>
          <p class="section-code">BUSINESS CONTEXT / 01—03</p>
          <h2 id="industries-title">围绕国内企业的三类系统问题。</h2>
        </header>

        <ol class="industry-list">
          <li v-for="(line, index) in domesticBusinessLines" :key="line.slug">
            <span class="row-index">0{{ index + 1 }}</span>
            <div class="row-name">
              <h3>{{ line.title }}</h3>
              <small>{{ line.tag }}</small>
            </div>
            <p>{{ line.summary }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="proof" aria-labelledby="proof-title">
      <div class="section-shell">
        <header class="split-heading">
          <div>
            <p class="eyebrow">案例与能力证据</p>
            <p class="section-code">PUBLIC SHOWCASE / 01—04</p>
          </div>
          <h2 id="proof-title">保留可判断的工程证据，不直连产品后台。</h2>
        </header>

        <div class="proof-grid">
          <article v-for="(asset, index) in domesticProofAssets" :key="asset.name" class="proof-card">
            <div class="proof-card-top">
              <span>0{{ index + 1 }}</span>
              <strong>{{ asset.stat }}</strong>
            </div>
            <div class="proof-visual" aria-hidden="true">
              <i></i><i></i><i></i><i></i>
            </div>
            <p class="proof-badge">{{ asset.badge }}</p>
            <h3>{{ asset.name }}</h3>
            <p>{{ asset.desc }}</p>
            <div class="proof-tags">
              <span v-for="tag in asset.tags" :key="tag">{{ tag }}</span>
            </div>
          </article>
        </div>

        <NuxtLink to="/cases" class="text-action">
          查看国内案例库
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </section>

    <section class="foundation" aria-labelledby="foundation-title">
      <div class="foundation-shell">
        <p class="eyebrow">04 / 长期运行</p>
        <h2 id="foundation-title">可控基础设施 + 持续治理</h2>
        <ul>
          <li>
            <span aria-hidden="true">01</span>
            <div><h3>可控基础设施</h3><p>计算、存储和部署边界清晰。</p></div>
          </li>
          <li>
            <span aria-hidden="true">02</span>
            <div><h3>全链路可观测</h3><p>调用、成本和异常全程可追踪。</p></div>
          </li>
          <li>
            <span aria-hidden="true">03</span>
            <div><h3>效果质量与评测</h3><p>用评测和回归守住结果质量。</p></div>
          </li>
          <li>
            <span aria-hidden="true">04</span>
            <div><h3>治理与合规</h3><p>权限、数据和变更过程可审计。</p></div>
          </li>
        </ul>
      </div>
    </section>

    <section class="contact-strip">
      <div>
        <p>国内站仅承担品牌展示与商务咨询。</p>
        <NuxtLink to="/contact" class="text-action">
          从一个具体系统开始
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  overflow: clip;
  background: var(--bg-main);
  color: var(--fg);
}

.hero {
  border-bottom: 1px solid var(--border);
  background: var(--bg-main);
}

.hero-shell {
  width: min(1160px, calc(100% - 64px));
  min-height: 620px;
  margin: 0 auto;
  padding: 58px 0 54px;
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(500px, 1.12fr);
  gap: clamp(44px, 5vw, 76px);
  align-items: center;
}

.eyebrow,
.section-code,
.row-index,
.row-name small,
.standard-list strong,
.blueprint,
.proof-card-top,
.proof-badge,
.proof-tags {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

.eyebrow {
  margin: 0 0 9px;
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.11em;
  opacity: 1;
  animation: none;
}

.hero-copy > .eyebrow {
  margin-bottom: 24px;
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(48px, 4.35vw, 58px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.hero-copy h1 span {
  color: var(--accent);
}

.hero-summary {
  max-width: 560px;
  margin: 28px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.8;
}

.hero-fit {
  margin: 15px 0 0;
  font-size: 13px;
  font-weight: 650;
}

.primary-action,
.text-action {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  font-weight: 700;
}

.primary-action {
  min-height: 46px;
  width: max-content;
  margin-top: 26px;
  padding: 0 18px;
  border: 1px solid var(--accent);
  border-radius: 2px;
  background: var(--accent);
  color: var(--on-deep);
  font-size: 14px;
}

.primary-action:hover {
  border-color: var(--surface-deep);
  background: var(--surface-deep);
}

.blueprint {
  position: relative;
  padding: 18px;
  border: 1px solid rgba(18, 37, 29, 0.24);
  border-radius: 6px;
  background:
    linear-gradient(rgba(32, 95, 98, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(32, 95, 98, 0.045) 1px, transparent 1px),
    var(--surface);
  background-size: 24px 24px;
  box-shadow: 0 28px 70px rgba(16, 37, 29, 0.09);
}

.blueprint-top,
.blueprint-foot,
.proof-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.blueprint-top {
  padding-bottom: 13px;
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.blueprint-top strong {
  color: var(--accent);
}

.phase-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--fg);
  border-bottom: 1px solid var(--fg);
}

.phase {
  min-width: 0;
  min-height: 360px;
  padding: 20px 15px;
}

.phase + .phase {
  border-left: 1px solid var(--border);
}

.phase-number {
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
}

.phase-en {
  margin: 42px 0 5px;
  color: var(--muted-light);
  font-size: 9px;
  letter-spacing: 0.12em;
}

.phase h2 {
  margin: 0 0 16px;
  font-size: 18px;
}

.phase > p:last-of-type {
  min-height: 116px;
  margin: 0;
  color: var(--muted);
  font-family: var(--font-family-base);
  font-size: 11px;
  line-height: 1.7;
}

.phase-track {
  margin: 28px 0 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.phase-track span {
  height: 6px;
  flex: 1;
  background: var(--accent-quiet);
}

.phase-track span:first-child {
  background: var(--accent);
}

.phase small {
  color: var(--accent);
  font-size: 9px;
}

.blueprint-foot {
  padding-top: 13px;
  color: var(--muted);
  font-size: 9px;
}

.blueprint-foot i {
  height: 1px;
  flex: 1;
  margin: 0 10px;
  background: var(--border);
}

.delivery,
.proof {
  padding: 58px 0 56px;
  border-bottom: 1px solid var(--line-soft);
}

.delivery {
  background: var(--surface-muted);
}

.proof {
  background: var(--bg-main);
}

.section-shell {
  width: min(1160px, calc(100% - 64px));
  margin: 0 auto;
}

.split-heading {
  display: grid;
  grid-template-columns: minmax(170px, 0.28fr) minmax(0, 0.72fr);
  gap: clamp(48px, 7vw, 96px);
  margin-bottom: 36px;
}

.section-code {
  margin: 0;
  color: var(--muted-light);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.split-heading h2 {
  max-width: 820px;
  margin: 0;
  font-size: clamp(33px, 3vw, 40px);
  font-weight: 600;
  line-height: 1.16;
  letter-spacing: -0.03em;
}

.standard-list,
.industry-list {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--fg);
  border-bottom: 1px solid var(--fg);
  list-style: none;
}

.standard-list li,
.industry-list li {
  position: relative;
  display: grid;
  align-items: stretch;
}

.standard-list li {
  min-height: 88px;
  grid-template-columns: 64px 220px minmax(0, 1fr) 146px;
}

.industry-list li {
  min-height: 72px;
  grid-template-columns: 54px 250px minmax(0, 1fr);
}

.standard-list li + li,
.industry-list li + li {
  border-top: 1px solid var(--border);
}

.row-index,
.row-name,
.standard-list li > p,
.standard-list strong,
.industry-list li > p {
  min-width: 0;
  display: flex;
  align-items: center;
}

.row-index {
  padding: 0 18px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
}

.row-name,
.standard-list li > p,
.standard-list strong,
.industry-list li > p {
  border-left: 1px solid var(--line-soft);
}

.row-name {
  padding: 0 24px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.row-name h3 {
  margin: 0 0 3px;
  font-size: 18px;
  font-weight: 650;
}

.row-name small {
  color: var(--muted-light);
  font-size: 8px;
  letter-spacing: 0.08em;
}

.standard-list li > p,
.industry-list li > p {
  margin: 0;
  padding: 0 26px;
  color: var(--muted);
  font-size: 13px;
}

.standard-list strong {
  justify-content: flex-end;
  padding: 0 18px;
  color: var(--accent);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.industries {
  padding: 50px 0 52px;
  border-bottom: 1px solid var(--line-soft);
  background: var(--bg-main);
}

.industry-shell {
  width: min(1160px, calc(100% - 64px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(270px, 0.35fr) minmax(0, 0.65fr);
  gap: clamp(48px, 6.5vw, 88px);
}

.industry-shell header h2 {
  max-width: 360px;
  margin: 28px 0 0;
  font-size: clamp(29px, 2.6vw, 36px);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.025em;
}

.proof-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--fg);
  border-bottom: 1px solid var(--fg);
}

.proof-card {
  min-width: 0;
  padding: 20px;
}

.proof-card + .proof-card {
  border-left: 1px solid var(--border);
}

.proof-card-top {
  color: var(--muted-light);
  font-size: 9px;
}

.proof-card-top strong {
  color: var(--accent);
}

.proof-visual {
  height: 86px;
  margin: 20px 0;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px;
  background: var(--surface-muted);
  border: 1px solid var(--line-soft);
}

.proof-visual i {
  width: 25%;
  background: var(--accent-quiet);
}

.proof-visual i:nth-child(1) { height: 42%; }
.proof-visual i:nth-child(2) { height: 72%; background: var(--accent); }
.proof-visual i:nth-child(3) { height: 58%; }
.proof-visual i:nth-child(4) { height: 88%; background: var(--accent-hover); }

.proof-badge {
  margin: 0 0 9px;
  color: var(--accent);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.proof-card h3 {
  min-height: 52px;
  margin: 0 0 12px;
  font-size: 18px;
  line-height: 1.4;
}

.proof-card > p:not(.proof-badge) {
  min-height: 112px;
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.7;
}

.proof-tags {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.proof-tags span {
  padding: 4px 6px;
  background: var(--accent-quiet);
  color: var(--accent);
  font-size: 9px;
}

.proof > .section-shell > .text-action {
  margin-top: 26px;
}

.text-action {
  font-size: 14px;
}

.text-action > span {
  color: var(--accent);
  transition: transform 180ms var(--ease);
}

.text-action:hover > span {
  transform: translateX(4px);
}

.foundation {
  position: relative;
  padding: 44px 0;
  overflow: clip;
  background:
    radial-gradient(720px 340px at 82% -10%, rgba(130, 170, 166, 0.16), transparent 70%),
    radial-gradient(560px 300px at 8% 110%, rgba(32, 95, 98, 0.28), transparent 70%),
    var(--surface-deep);
  color: var(--on-deep);
}

.foundation-shell {
  width: min(1160px, calc(100% - 64px));
  margin: 0 auto;
}

.foundation .eyebrow {
  color: #82aaa6;
}

.foundation h2 {
  margin: 0 0 30px;
  font-size: clamp(28px, 3vw, 38px);
  font-weight: 600;
}

.foundation ul {
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  list-style: none;
}

.foundation li {
  min-width: 0;
  padding: 20px 22px 0;
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 12px;
  border-top: 1px solid rgba(255, 253, 246, 0.16);
}

.foundation li:first-child {
  padding-left: 0;
}

.foundation li + li {
  border-left: 1px solid rgba(255, 253, 246, 0.12);
}

.foundation li > span {
  padding-top: 4px;
  color: #82aaa6;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.08em;
}

.foundation h3 {
  margin: 0 0 7px;
  font-size: 14px;
}

.foundation li p {
  margin: 0;
  color: var(--on-deep-muted);
  font-size: 12px;
}

.contact-strip {
  padding: 25px 0;
  border-bottom: 1px solid var(--line-soft);
  background: var(--bg-main);
}

.contact-strip > div {
  width: min(1160px, calc(100% - 64px));
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.contact-strip p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

@media (max-width: 900px) {
  .hero-shell {
    width: min(100% - 40px, 720px);
    grid-template-columns: 1fr;
  }

  .split-heading {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .standard-list li {
    grid-template-columns: 54px 190px minmax(0, 1fr);
  }

  .standard-list strong {
    display: none;
  }

  .industry-shell {
    grid-template-columns: 1fr;
  }

  .proof-grid,
  .foundation ul {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .proof-card:nth-child(3),
  .foundation li:nth-child(3) {
    border-left: 0;
  }

  .proof-card:nth-child(n + 3) {
    border-top: 1px solid var(--border);
  }
}

@media (max-width: 680px) {
  .hero-shell,
  .section-shell,
  .industry-shell,
  .foundation-shell,
  .contact-strip > div {
    width: calc(100% - 32px);
  }

  .hero-shell {
    padding: 42px 0;
  }

  .hero-copy h1 {
    font-size: clamp(36px, 10vw, 46px);
  }

  .primary-action {
    width: 100%;
    justify-content: space-between;
  }

  .phase-grid {
    grid-template-columns: 1fr;
  }

  .phase {
    min-height: 0;
  }

  .phase + .phase {
    border-top: 1px solid var(--border);
    border-left: 0;
  }

  .phase-en {
    margin-top: 26px;
  }

  .phase > p:last-of-type {
    min-height: 0;
  }

  .delivery,
  .proof,
  .industries {
    padding: 44px 0 46px;
  }

  .split-heading h2,
  .industry-shell header h2 {
    font-size: 29px;
  }

  .standard-list li,
  .industry-list li {
    padding: 16px 0;
    grid-template-columns: 38px minmax(0, 1fr);
    grid-template-areas:
      "index name"
      ". detail";
    row-gap: 7px;
  }

  .row-index {
    grid-area: index;
    padding: 5px 0 0;
  }

  .row-name {
    grid-area: name;
  }

  .standard-list li > p,
  .industry-list li > p {
    grid-area: detail;
  }

  .row-name,
  .standard-list li > p,
  .industry-list li > p {
    padding: 0;
    border-left: 0;
  }

  .proof-grid,
  .foundation ul {
    grid-template-columns: 1fr;
  }

  .proof-card,
  .proof-card + .proof-card,
  .foundation li,
  .foundation li + li {
    padding-right: 0;
    padding-left: 0;
    border-left: 0;
  }

  .proof-card + .proof-card,
  .foundation li + li {
    border-top: 1px solid var(--border);
  }

  .proof-card h3,
  .proof-card > p:not(.proof-badge) {
    min-height: 0;
  }

  .foundation {
    padding: 40px 0;
  }

  .foundation li {
    padding: 17px 0;
  }

  .contact-strip > div {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
