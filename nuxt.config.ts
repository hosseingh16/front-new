import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
  modules: ["@nuxt/image", "@nuxt/icon", "@nuxt/fonts", "nuxt-auth-sanctum"],
  // @ts-ignore
  sanctum: {
    baseUrl: "https://api.hihesab.local", // Laravel API
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

  fonts: {
    providers: {
      custom: "./app/assets/font-providers/custom",
    },
  },

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
