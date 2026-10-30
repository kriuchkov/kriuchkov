export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  typescript: {
    typeCheck: true
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0E1014' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },
  experimental: {
    payloadExtraction: false, 
    sharedPrerenderData: true, 
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

  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },

  fonts: {
    families: [
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 700, 800] }
    ]
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    // own key, so a choice saved by the old site doesn't override dark
    storageKey: 'tui-theme'
  },

  image: {
    quality: 80,
    format: ['webp']
  },

  postcss: {
    plugins: {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
        }]
      }
    }
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
