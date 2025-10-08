import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/image", "@nuxt/icon", "@nuxt/fonts"],
  vite: {
    plugins: [tailwindcss()],
  },

  fonts: {
    providers: {
      custom: "./app/assets/font-providers/custom"
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
