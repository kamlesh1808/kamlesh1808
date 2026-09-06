export default defineNuxtConfig({
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
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css' }
      ]
    },
      // Replace with your exact GitHub repository name, keeping the slashes
      baseURL: '/kamlesh1808/'
    },
  nitro: {
    preset: 'github-pages'
  },

  typescript: { strict: true },
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
  }
})