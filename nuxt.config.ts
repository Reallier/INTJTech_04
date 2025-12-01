// Nuxt configuration for 简序智能官网 v0
export default defineNuxtConfig({
  app: {
    head: {
      title: "简序智能｜面向小微企业的 AI Agent 技术伙伴",
      meta: [
        {
          name: "description",
          content:
            "小而精的工程团队，帮小微企业把重复又重要的工作交给 Agent 处理，让自动化落地更省时间、更可控。"
        }
      ],
      link: [
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
  devtools: { enabled: false }
});
