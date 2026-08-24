// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'

export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'always',
  },

  adapter: vercel(),

  // El dashboard es la única parte que usa React; el sitio público sigue
  // siendo Astro puro y no carga runtime extra.
  integrations: [
    sitemap({ filter: (page) => !page.includes('/dashboard') }),
    react({ include: ['**/dashboard/**'] }),
  ],

  site: 'https://www.infolavelada.com/',
})