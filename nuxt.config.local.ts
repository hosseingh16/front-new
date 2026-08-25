import tailwindcss from "@tailwindcss/vite";
//import fs from "node:fs";

// Node.js SSR cannot verify the local api.hihesab.test dev certificate.
// Browser/Postman work; only server-side $fetch fails without this in dev.
// if (process.env.NODE_ENV === "development") {
//    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// }

// const certKey = "./docker/certs/hihesab.test-key.pem";
// const certCert = "./docker/certs/hihesab.test.pem";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
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
      // baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      baseUrl: "https://api.hihesab.test",
      apiBase: "https://api.hihesab.test/api/v1",
      neshanMapKey: process.env.NUXT_PUBLIC_NESHAN_MAP_KEY || "",
      neshanServiceKey: process.env.NUXT_PUBLIC_NESHAN_SERVICE_KEY || "",
    },
  },
  // ...(fs.existsSync(certKey) && fs.existsSync(certCert)
  //   ? {
  //       devServer: {
  //         https: {
  //           key: fs.readFileSync(certKey, "utf8"),
  //           cert: fs.readFileSync(certCert, "utf8"),
  //         },
  //         host: "hihesab.test",
  //         port: 3000,
  //       },
  //     }
  //   : {
  //       devServer: {
  //         host: "hihesab.test",
  //         port: 3000,
  //       },
  //     }),

  devServer: {
    host: "127.0.0.1",
    port: 3000,
  },

  modules: ["@nuxt/image", "@nuxt/icon", "nuxt-auth-sanctum", "@nuxtjs/seo"],
  sanctum: {
    mode: "cookie",
    baseUrl: "https://api.hihesab.test",
    origin: "https://hihesab.test",
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
    url: process.env.NUXT_PUBLIC_BASE_URL || "https://hihesab.test", // your real domain
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
