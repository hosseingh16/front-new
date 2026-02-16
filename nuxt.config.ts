import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseUrl: "https://api.hihesab.local", // Laravel API
    },
  },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/image", "@nuxt/icon", "@nuxt/fonts", "nuxt-auth-sanctum"],
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
    customCollections: [
      {
        prefix: "svg",
        dir: "./app/assets/vectors",
      },
    ],
  },
});
