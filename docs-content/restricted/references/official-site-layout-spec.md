# 官网页面布局规范

## 概述

本文档记录了官网（intjsys.com）页面布局的标准规范，确保所有页面的内容宽度、边距一致。

## 问题背景

在开发 MCP & Skill 页面时，发现内容区域宽度与首页不一致，导致视觉上的不协调。

### 错误做法 ❌

```html
<!-- 嵌套结构 - 会导致双重边距 -->
<section class="section my-section">
  <div class="container">
    <!-- 内容 -->
  </div>
</section>
```

问题：
- `.section` 和 `.container` 各自有 padding/max-width 设置
- 嵌套导致双重边距，内容区域变窄
- 与首页布局不一致

### 正确做法 ✅

```html
<!-- 扁平结构 - 与首页一致 -->
<section class="section container my-section">
  <!-- 内容直接放这里 -->
</section>
```

优点：
- section 直接同时应用 `.section` 和 `.container` 两个类
- 避免嵌套，消除双重边距
- 与首页 `.bento.container` 布局完全一致

## CSS 规范

### 核心类定义

```css
/* 容器类 - 控制最大宽度和左右边距 */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
}

/* Section 类 - 只控制上下边距和边框 */
.section {
  padding: 80px 0;
  border-bottom: 1px solid var(--border);
}

/* Bento 类（首页）- 只控制上下边距 */
.bento {
  padding: 80px 0;
}
```

### 关键原则

1. **扁平优于嵌套**：section 直接使用 container 类，不要嵌套
2. **职责分离**：
   - `.container`：负责水平方向（max-width + 左右 padding）
   - `.section`/`.bento`：负责垂直方向（上下 padding）
3. **统一宽度**：所有内容区域 max-width 统一为 1280px

## 最终内容宽度计算

- 容器最大宽度：1280px
- 左右 padding：各 40px
- **实际内容宽度**：1280px - 80px = **1200px**

## 与 Footer/Header 的对齐

Footer 使用独立的 SiteFooter 组件：

```css
.site-footer {
  padding: 40px;  /* 上下左右均 40px */
}

.footer-main {
  max-width: 1280px;
  margin: 0 auto;
}
```

Footer 内容宽度 = min(1280px, viewport - 80px)，与页面内容区域对齐。

## 页面模板

新建页面时，使用以下结构：

```vue
<template>
  <div class="page">
    <SiteHeader @open-login="showLoginModal = true" />

    <main>
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <!-- hero 内容 -->
        </div>
      </section>

      <!-- 内容 Section - 注意 container 直接加在 section 上 -->
      <section class="section container my-section">
        <!-- 内容直接放这里，不需要嵌套 container -->
      </section>
    </main>

    <SiteFooter />
    <LoginModal v-model="showLoginModal" />
  </div>
</template>
```

## 相关文件

- `pages/index.vue`：首页布局参考
- `pages/skills.vue`：MCP & Skill 页面
- `components/SiteHeader.vue`：共享头部
- `components/SiteFooter.vue`：共享页脚

---

*最后更新：2026-01-19*
