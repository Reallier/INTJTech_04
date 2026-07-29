<script setup lang="ts">
import { domesticProofAssets, domesticValueCards } from "~/data/domesticHome.mjs";

useHead({
  title: "案例库｜Reallier 简序智能",
  meta: [
    {
      name: "description",
      content: "简序智能面向国内企业公开展示的脱敏案例、交付证据与工程能力。",
    },
  ],
});
</script>

<template>
  <main class="cases-page">
    <section class="cases-hero">
      <div>
        <p class="eyebrow">PUBLIC CASE LIBRARY / CN</p>
        <h1>案例不是口号，<br /><span>是可判断的工程证据。</span></h1>
        <p>
          国内站仅展示脱敏后的问题、方法和交付边界，不嵌入国际站实时系统，不直连产品后台，也不收集用户内容。
        </p>
      </div>
    </section>

    <section class="case-list">
      <article v-for="(card, index) in domesticValueCards" :key="card.id">
        <div class="case-index">
          <span>0{{ index + 1 }}</span>
          <small>{{ card.tag }}</small>
        </div>
        <div class="case-copy">
          <h2>{{ card.title }}</h2>
          <p>{{ card.desc }}</p>
          <strong>{{ card.note }}</strong>
        </div>
        <div class="case-signal" aria-hidden="true">
          <i></i><i></i><i></i>
        </div>
      </article>
    </section>

    <section class="capability-evidence">
      <header>
        <p class="eyebrow">CAPABILITY EVIDENCE / 01—04</p>
        <h2>公开能力资产</h2>
      </header>
      <div class="evidence-grid">
        <article v-for="asset in domesticProofAssets" :key="asset.name">
          <span>{{ asset.stat }}</span>
          <h3>{{ asset.name }}</h3>
          <p>{{ asset.desc }}</p>
          <div>
            <small v-for="tag in asset.tags" :key="tag">{{ tag }}</small>
          </div>
        </article>
      </div>
    </section>

    <section class="cases-cta">
      <p>需要判断你的系统是否适合类似路径？</p>
      <NuxtLink to="/contact">
        发一个具体问题
        <span aria-hidden="true">→</span>
      </NuxtLink>
    </section>
  </main>
</template>

<style scoped>
.cases-page {
  min-height: 100vh;
  background: var(--bg-main);
}

.eyebrow,
.case-index,
.capability-evidence article > span,
.capability-evidence small {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

.eyebrow {
  margin: 0 0 18px;
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  opacity: 1;
  animation: none;
}

.cases-hero {
  padding: 78px 0 72px;
  border-bottom: 1px solid var(--border);
  background:
    radial-gradient(650px 300px at 86% 5%, rgba(32, 95, 98, 0.1), transparent 72%),
    var(--bg-main);
}

.cases-hero > div,
.case-list,
.capability-evidence,
.cases-cta {
  width: min(1160px, calc(100% - 64px));
  margin: 0 auto;
}

.cases-hero h1 {
  max-width: 820px;
  margin: 0;
  font-size: clamp(45px, 5.2vw, 68px);
  line-height: 1.08;
  letter-spacing: -0.035em;
}

.cases-hero h1 span {
  color: var(--accent);
}

.cases-hero h1 + p {
  max-width: 700px;
  margin: 28px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.8;
}

.case-list {
  padding: 64px 0;
}

.case-list article {
  min-height: 190px;
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr) 170px;
  border-top: 1px solid var(--fg);
}

.case-list article:last-child {
  border-bottom: 1px solid var(--fg);
}

.case-index,
.case-copy,
.case-signal {
  padding: 28px 24px;
}

.case-index {
  display: flex;
  flex-direction: column;
  gap: 46px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
}

.case-index small {
  color: var(--muted-light);
  font-size: 9px;
  line-height: 1.5;
}

.case-copy {
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}

.case-copy h2 {
  margin: 0 0 14px;
  font-size: 25px;
  line-height: 1.3;
}

.case-copy p {
  max-width: 680px;
  margin: 0 0 14px;
  color: var(--muted);
  font-size: 14px;
}

.case-copy strong {
  color: var(--fg);
  font-size: 12px;
  font-weight: 650;
}

.case-signal {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.case-signal i {
  width: 24px;
  background: var(--accent-quiet);
}

.case-signal i:first-child { height: 30%; }
.case-signal i:nth-child(2) { height: 68%; background: var(--accent); }
.case-signal i:last-child { height: 92%; background: var(--surface-deep); }

.capability-evidence {
  padding: 0 0 72px;
}

.capability-evidence header {
  margin-bottom: 28px;
}

.capability-evidence h2 {
  margin: 0;
  font-size: clamp(30px, 3vw, 40px);
}

.evidence-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--fg);
  border-bottom: 1px solid var(--fg);
}

.capability-evidence article {
  min-width: 0;
  padding: 24px;
}

.capability-evidence article + article {
  border-left: 1px solid var(--border);
}

.capability-evidence article > span {
  color: var(--accent);
  font-size: 9px;
}

.capability-evidence h3 {
  min-height: 54px;
  margin: 34px 0 12px;
  font-size: 18px;
}

.capability-evidence article p {
  min-height: 112px;
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

.capability-evidence article div {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.capability-evidence small {
  padding: 4px 6px;
  background: var(--accent-quiet);
  color: var(--accent);
  font-size: 9px;
}

.cases-cta {
  padding: 28px 0;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  border-top: 1px solid var(--border);
}

.cases-cta p {
  margin: 0;
  color: var(--muted);
}

.cases-cta a {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  font-weight: 700;
}

.cases-cta a > span {
  color: var(--accent);
}

@media (max-width: 900px) {
  .case-list article {
    grid-template-columns: 150px minmax(0, 1fr);
  }

  .case-signal {
    display: none;
  }

  .case-copy {
    border-right: 0;
  }

  .evidence-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .capability-evidence article:nth-child(3) {
    border-top: 1px solid var(--border);
    border-left: 0;
  }

  .capability-evidence article:nth-child(4) {
    border-top: 1px solid var(--border);
  }
}

@media (max-width: 640px) {
  .cases-hero > div,
  .case-list,
  .capability-evidence,
  .cases-cta {
    width: calc(100% - 32px);
  }

  .cases-hero {
    padding: 52px 0;
  }

  .cases-hero h1 {
    font-size: clamp(38px, 11vw, 50px);
  }

  .case-list article {
    padding: 22px 0;
    grid-template-columns: 1fr;
  }

  .case-index,
  .case-copy {
    padding: 0;
  }

  .case-index {
    margin-bottom: 16px;
    flex-direction: row;
    justify-content: space-between;
    gap: 18px;
  }

  .case-copy {
    border: 0;
  }

  .case-copy h2 {
    font-size: 22px;
  }

  .evidence-grid {
    grid-template-columns: 1fr;
  }

  .capability-evidence article,
  .capability-evidence article + article,
  .capability-evidence article:nth-child(4) {
    padding: 22px 0;
    border-left: 0;
    border-top: 1px solid var(--border);
  }

  .capability-evidence article:first-child {
    border-top: 0;
  }

  .capability-evidence h3,
  .capability-evidence article p {
    min-height: 0;
  }

  .cases-cta {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
