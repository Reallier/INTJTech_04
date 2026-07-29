import { domesticPublicRoutes } from "./data/domesticPolicy.mjs";

// Nuxt configuration for 简序智能国内宣传站 - intjsys.com
export default defineNuxtConfig({
  app: {
    head: {
      title: "简序智能 | INTJsys - 秩序即是自由",
      meta: [
        {
          name: "description",
          content:
            "我们重新编排业务的逻辑序数。简序智能（INTJsys）致力于将复杂的非结构化碎片，转化为稳健且可进化的生产力组件。"
        }
      ],
      link: [
        // Favicon
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/site-logo.svg?v=20260729"
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/site-logo.png?v=20260729",
          sizes: "1024x1024"
        },
        {
          rel: "apple-touch-icon",
          href: "/site-logo.png?v=20260729"
        }
      ]
    }
  },
  hooks: {
    "pages:extend"(pages) {
      const allowed = new Set(domesticPublicRoutes);
      const publicPages = pages.filter((page) => allowed.has(page.path));
      pages.splice(0, pages.length, ...publicPages);
    }
  },
  css: ["@/assets/styles/main.css"],
  compatibilityDate: "2024-09-27",
  nitro: {
    preset: "node-server"
  },
  devtools: { enabled: false }
});
