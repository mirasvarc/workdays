// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxt/scripts'],

  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-MZBP79JPH1',
      }
    }
  },
  
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  }

})