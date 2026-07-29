<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

const route = useRoute();
const mobileMenuOpen = ref(false);

const navItems = [
  { label: "首页", to: "/" },
  { label: "案例库", to: "/cases" },
  { label: "交付能力", to: "/#delivery" },
  { label: "行业场景", to: "/#industries" },
  { label: "关于", to: "/about" },
  { label: "联系", to: "/contact" },
];

const closeMenu = () => {
  mobileMenuOpen.value = false;
  if (typeof document !== "undefined") document.body.style.overflow = "";
};

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (typeof document !== "undefined") {
    document.body.style.overflow = mobileMenuOpen.value ? "hidden" : "";
  }
};

const isActive = (to: string) => {
  if (to.startsWith("/#")) return route.path === "/" && route.hash === to.slice(1);
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to);
};

watch(() => route.fullPath, closeMenu);
onBeforeUnmount(closeMenu);
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <NuxtLink to="/" class="logo" aria-label="Reallier 简序智能首页" @click="closeMenu">
        <img src="/site-logo.svg" alt="" class="logo-mark" />
        <span class="logo-word">Reallier</span>
      </NuxtLink>

      <button
        class="hamburger"
        :class="{ 'is-active': mobileMenuOpen }"
        type="button"
        aria-label="切换主导航"
        :aria-expanded="mobileMenuOpen"
        @click.stop="toggleMenu"
      >
        <span></span><span></span><span></span>
      </button>

      <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMenu"></div>

      <nav class="nav" :class="{ 'nav-open': mobileMenuOpen }" aria-label="主导航">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: isActive(item.to) }"
          @click="closeMenu"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink to="/contact" class="nav-cta" @click="closeMenu">
          讨论具体系统
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10030;
  isolation: isolate;
  border-bottom: 1px solid var(--border);
  background: var(--navbar-bg);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.header-inner {
  width: min(var(--max-content), calc(100% - 48px));
  height: 68px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.logo-mark {
  width: 32px;
  height: 32px;
  display: block;
}

.logo-word {
  color: var(--fg);
  font-size: 20px;
  font-weight: 760;
  letter-spacing: -0.035em;
}

.nav {
  display: flex;
  align-items: center;
  gap: clamp(16px, 2vw, 28px);
}

.nav-link {
  position: relative;
  padding: 8px 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: color 180ms var(--ease);
}

.nav-link::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 2px;
  left: 0;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 180ms var(--ease);
}

.nav-link:hover,
.nav-link.active {
  border-color: transparent;
  background: transparent;
  color: var(--fg);
}

.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
}

.nav-cta {
  min-height: 40px;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--accent);
  border-radius: 2px;
  background: var(--accent);
  color: var(--on-deep);
  font-size: 13px;
  font-weight: 700;
}

.nav-cta:hover {
  border-color: var(--surface-deep);
  background: var(--surface-deep);
}

.hamburger {
  width: 42px;
  height: 42px;
  display: none;
  padding: 0;
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
}

.hamburger span {
  width: 18px;
  height: 2px;
  display: block;
  margin: 4px auto;
  background: var(--fg);
  transition: transform 180ms ease, opacity 180ms ease;
}

.hamburger.is-active span:first-child {
  transform: translateY(6px) rotate(45deg);
}

.hamburger.is-active span:nth-child(2) {
  opacity: 0;
}

.hamburger.is-active span:last-child {
  transform: translateY(-6px) rotate(-45deg);
}

.mobile-overlay {
  position: fixed;
  inset: 68px 0 0;
  background: rgba(16, 37, 29, 0.28);
}

@media (max-width: 980px) {
  .header-inner {
    width: min(100% - 32px, var(--max-content));
  }

  .hamburger {
    display: block;
    margin-left: auto;
  }

  .nav {
    position: fixed;
    inset: 68px 16px auto;
    max-height: calc(100dvh - 88px);
    overflow-y: auto;
    overscroll-behavior: contain;
    display: none;
    padding: 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: 0 24px 80px rgba(16, 37, 29, 0.2);
  }

  .nav.nav-open {
    display: grid;
  }

  .nav-link {
    min-height: 48px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--line-soft);
    font-size: 15px;
  }

  .nav-link::after {
    display: none;
  }

  .nav-cta {
    min-height: 50px;
    margin-top: 4px;
    justify-content: space-between;
  }
}

@media (max-width: 520px) {
  .header-inner {
    width: calc(100% - 24px);
    height: 64px;
  }

  .nav {
    inset: 64px 12px auto;
    max-height: calc(100dvh - 80px);
  }

  .mobile-overlay {
    inset: 64px 0 0;
  }
}
</style>
