import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
     // baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      baseUrl: 'http://api.hihesab.test',
      apiBase: 'http://api.hihesab.test/api',
    },
  },
  devServer: {
     host: 'hihesab.test',
    port: 3000,
  },
  modules: ["@nuxt/image", "@nuxt/icon", "nuxt-auth-sanctum"],
  // @ts-ignore
  sanctum: {
    baseUrl: "http://api.hihesab.test", // Laravel API
    endpoints: {
      login: "/api/login",
      logout: "/api/logout",
    },
    redirect: {
      onLogin: "/",
      onLogout: "/login",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // fonts: {
  //   providers: {
  //     custom: "./app/assets/font-providers/custom",
  //   },
  // },

  icon: {
    size: "20",
    customCollections: [
      {
        prefix: "svg",
        dir: "./app/assets/vectors",
      },
    ],
  },
});
