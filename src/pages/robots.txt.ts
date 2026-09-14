import type { APIRoute } from 'astro'
import { SITE_URL } from '@/lib/seo'

/**
 * Se sirve desde una ruta y no desde `public/` para que el host del sitemap
 * salga siempre de la misma constante que el resto de los metadatos.
 */
const body = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /dashboard/
Disallow: /_actions/

Sitemap: ${SITE_URL}/sitemap.xml
`

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
