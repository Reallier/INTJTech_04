<script setup lang="ts">
const route = useRoute();

useHead({
  htmlAttrs: { lang: "zh-CN" },
});
</script>

<template>
  <div class="layout-default">
    <SiteHeader v-if="route.path !== '/promo'" />
    <NuxtPage />
    <SiteFooter v-if="route.path !== '/promo'" />
  </div>
</template>

<style>
:root {
  --bg-main: #fbfaf4;
  --bg-page: #eef1eb;
  --bg-secondary: #e6e9e1;
  --surface: #fffdf6;
  --surface-muted: #f6f4ec;
  --fg: #12251d;
  --fg-hover: #1b3329;
  --muted: #526159;
  --muted-light: #646f67;
  --surface-deep: #10251d;
  --surface-deep-hover: #193328;
  --on-deep: #fffdf6;
  --on-deep-muted: rgba(255, 253, 246, 0.64);
  --border: rgba(18, 37, 29, 0.13);
  --border-hover: rgba(18, 37, 29, 0.3);
  --line-soft: rgba(18, 37, 29, 0.075);
  --accent: #205f62;
  --accent-hover: #174c4f;
  --accent-quiet: #dce9e4;
  --navbar-bg: rgba(251, 250, 244, 0.92);
  --max-content: 1200px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --font-family-base: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
    Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --color-bg: var(--bg-secondary);
  --color-surface: var(--bg-main);
  --color-text: var(--fg);
  --color-text-muted: var(--muted);
  --color-primary: var(--accent);
  --color-border: var(--border);
}

* {
  box-sizing: border-box;
}

html {
  overflow-x: clip;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  overflow-x: clip;
  background: var(--bg-page);
  color: var(--fg);
  font-family: var(--font-family-base);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--fg);
  text-decoration: none;
}

button {
  font: inherit;
}

h1,
h2,
h3,
h4,
p {
  margin-top: 0;
}

.layout-default {
  min-height: 100vh;
}
</style>
