import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      htmlAttrs: {
        lang: "fa",
        dir: "rtl",
      },
    },
  },

  runtimeConfig: {
    public: {
      baseUrl: "https://api.hihesab.com",
      apiBase: "https://api.hihesab.com/api/v1",
      neshanMapKey: process.env.NUXT_PUBLIC_NESHAN_MAP_KEY || "",
      neshanServiceKey: process.env.NUXT_PUBLIC_NESHAN_SERVICE_KEY || "",
    },
  },

  devServer: {
    host: "127.0.0.1",
    port: 3000,
  },

  modules: ["@nuxt/image", "@nuxt/icon", "nuxt-auth-sanctum", "@nuxtjs/seo"],

  sanctum: {
    mode: "cookie",
    baseUrl: "https://api.hihesab.com",
    origin: "https://admin.hihesab.com",

    endpoints: {
      csrf: "/sanctum/csrf-cookie",
      login: "/login",
      logout: "/logout",
      user: "/user",
    },

    redirect: {
      onLogin: false,
      onLogout: "/login",
      onAuthOnly: "/login",
    },
  },

  site: {
    url: "https://admin.hihesab.com",
    name: "های‌حساب",
  },

  vite: {
    server: {
      allowedHosts: ["hihesab.test"],
    },

    plugins: [tailwindcss()],

    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "vee-validate",
        "@neshan-maps-platform/vue3-openlayers",
        "@neshan-maps-platform/ol/Feature",
        "@neshan-maps-platform/ol/geom/Point",
        "@neshan-maps-platform/ol/layer/Vector",
        "@neshan-maps-platform/ol/source/Vector",
        "@neshan-maps-platform/ol/style/Style",
        "@neshan-maps-platform/ol/style/Icon",
        "@neshan-maps-platform/ol/proj",
      ],
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
