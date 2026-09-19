const baseURL = process.env.NUXT_APP_BASE_URL ?? (process.dev ? '/' : '/kamlesh1808/')

export default defineNuxtConfig({
  compatibilityDate: '2026-09-07',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      titleTemplate: '%s · Kamlesh Patel',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Notes on software engineering, modernization, and building reliable systems.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css' }
      ]
    },
    baseURL,
  },
  nitro: {
    preset: 'github-pages'
  },

  typescript: { strict: true },
})