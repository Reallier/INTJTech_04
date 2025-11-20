// Nuxt configuration for 紫薯科技官网 v0
export default defineNuxtConfig({
  app: {
    head: {
      title: "紫薯科技｜面向小微企业的 AI Agent 技术伙伴",
      meta: [
        {
          name: "description",
          content:
            "小而精的工程团队，帮小微企业把重复又重要的工作交给 Agent 处理，让自动化落地更省时间、更可控。"
        }
      ]
    }
  },
  css: ["@/assets/styles/main.css"],
  compatibilityDate: "2024-09-27",
  nitro: {
    preset: "vercel"
  },
  devtools: { enabled: false }
});
