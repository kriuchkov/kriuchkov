// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  // Senior Developer Mode: Strict type checking during build
  typescript: {
    typeCheck: true
  },

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#111827' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  nitro: {
    static: true,
    preset: 'github_pages'
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils/module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  
  icon: {
    serverBundle: {
      collections: ['heroicons', 'heroicons-outline', 'heroicons-solid', 'simple-icons']
    },
    clientBundle: {
      scan: true
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark'
  },

  image: {
    quality: 80,
    format: ['webp']
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          preload: ['ts', 'js', 'css', 'java', 'json', 'bash', 'vue', 'go', 'yaml']
        }
      }
    }
  }
})
