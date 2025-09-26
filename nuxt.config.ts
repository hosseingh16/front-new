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
      custom: "./app/assets/font-providers/custom",
      customLegacy: "./app/assets/font-providers/custom-legacy",
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
