import tailwindcss from "@tailwindcss/vite";

const nonPagePatterns = [
  "!**/components/**",
  "!**/data/**",
  "!**/utils/**",
] as const;

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: {
    enabled: true,
  },

  experimental: {
    purgeCachedData: false,
  },

  nitro: {
    preset: "node-server",
  },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      htmlAttrs: {
        lang: "fa",
        dir: "rtl",
      },
      meta: [
        {
          name: "robots",
          content: "index, follow",
        },
      ],
      script: [
        {
          key: "goftino-widget",
          type: "text/javascript",
          tagPosition: "head",
          textContent:
            '!function(){var i="pEmWrG",d=document,g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.type="text/javascript",g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}();',
        },
        {
          key: "microsoft-clarity",
          type: "text/javascript",
          tagPosition: "head",
          textContent:
            '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "u7z4wy6ec4");',
        },
      ],
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
    origin: "https://hihesab.com",

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
    url: "https://hihesab.com",
    name: "های‌حساب",
  },
  pages: {
    pattern: ["**/*.{vue,js,jsx,mjs,ts,tsx}", ...nonPagePatterns],
  },
  sitemap: {
    exclude: [
      "/dashboard/**",
      new RegExp("/.+/components/.*"),
      new RegExp("/.+/data/.*"),
      new RegExp("/.+/utils/.*"),
    ],
  },

  robots: {
    groups: [
      {
        userAgent: "*",
        disallow: ["/"],
      },
    ],
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
