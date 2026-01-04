// Nuxt configuration for 简序智能官网 v1 - 极简工业风
export default defineNuxtConfig({
  app: {
    head: {
      title: "简序智能 | INTJ Tech - 秩序即是自由",
      meta: [
        {
          name: "description",
          content:
            "我们重新编排业务的逻辑序数。简序智能（INTJ Tech）致力于将复杂的非结构化碎片，转化为稳健且可进化的生产力组件。"
        }
      ],
      link: [
        // Google Fonts - Inter (新设计核心字体)
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com"
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous"
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        },
        // Favicon
        {
          rel: "icon",
          type: "image/png",
          href: "/site-logo.png",
          sizes: "32x32"
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/site-logo.png",
          sizes: "64x64"
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/site-logo.png",
          sizes: "128x128"
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/site-logo.png",
          sizes: "256x256"
        },
        // FontAwesome (保留兼容性)
        {
          rel: "stylesheet",
          href:
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
          integrity:
            "sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==",
          crossorigin: "anonymous",
          referrerpolicy: "no-referrer"
        }
      ]
    }
  },
  css: ["@/assets/styles/main.css"],
  compatibilityDate: "2024-09-27",
  nitro: {
    preset: "node-server"
  },
  runtimeConfig: {
    public: {
      hirestreamApiUrl: process.env.HIRESTREAM_API_URL || 'https://api.talentai.reallier.top:5443',
      hirestreamUrl: process.env.HIRESTREAM_URL || 'https://talentai.reallier.top:5443'
    }
  },
  devtools: { enabled: false }
});
