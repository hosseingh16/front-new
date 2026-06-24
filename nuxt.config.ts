import tailwindcss from "@tailwindcss/vite";
import fs from 'node:fs'

const certKey = './docker/certs/hihesab.test-key.pem'
const certCert = './docker/certs/hihesab.test.pem'

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      // baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://api.hihesab.test',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.hihesab.test/api/v1',
    },
  },
  ...(fs.existsSync(certKey) && fs.existsSync(certCert)
    ? {
      devServer: {
        https: {
          key: fs.readFileSync(certKey, 'utf8'),
          cert: fs.readFileSync(certCert, 'utf8'),
        },
        host: 'hihesab.test',
        port: 3000,
      },
    }
    : {
      devServer: {
        host: 'hihesab.test',
        port: 3000,
      },
    }),
  modules: ["@nuxt/image", "@nuxt/icon", "nuxt-auth-sanctum", "@nuxtjs/seo"],
  // @ts-ignore
  sanctum: {
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://api.hihesab.test',
    endpoints: {
      login: "/api/login",
      logout: "/api/logout",
    },
    redirect: {
      onLogin: "/",
      onLogout: "/login",
    },
  },
  site: {
    url: process.env.NUXT_PUBLIC_BASE_URL || 'https://hihesab.test', // your real domain
    name: 'های‌حساب',
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'vee-validate'
      ]
    }
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