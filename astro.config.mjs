// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
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
  //
  // El sitemap no se genera con `@astrojs/sitemap`: en SSR solo veía las rutas
  // estáticas y dejaba fuera las fichas de proyecto. Se construye en tiempo de
  // petición desde `src/pages/sitemap.xml.ts`.
  integrations: [react({ include: ['**/dashboard/**'] })],

  site: 'https://www.vmv-arquitectos.com',
})
