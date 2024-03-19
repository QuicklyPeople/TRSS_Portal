// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 配置默认请求地址
  runtimeConfig: {
    public: {
      apiBase: "https://www.tungraycloud.com:15010/",
      preUri: "https://www.tungraycloud.com:2301/",
      playUri: "https://www.tungraycloud.com:11443/chfs/shared/",
    },
  },
  devtools: { enabled: true },
});
