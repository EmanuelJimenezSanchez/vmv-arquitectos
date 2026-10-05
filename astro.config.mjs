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

  // El español se sirve en la raíz y el inglés bajo /en. Las rutas de cada
  // idioma existen como archivos en `src/pages`, así que aquí no se pide
  // redirección automática: esto solo declara los idiomas para que
  // `Astro.currentLocale` y las utilidades del framework los conozcan.
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  site: 'https://www.vmv-arquitectos.com',
})
