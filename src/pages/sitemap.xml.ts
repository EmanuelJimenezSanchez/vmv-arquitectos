import type { APIRoute } from 'astro'
import { getProyectos } from '@/lib/content'
import { absoluteUrl } from '@/lib/seo'

/**
 * El sitio se sirve en SSR, así que `@astrojs/sitemap` solo veía las rutas
 * estáticas y dejaba fuera todas las fichas de proyecto. Aquí se construye en
 * tiempo de petición a partir del mismo contenido que renderiza el sitio.
 */
interface SitemapEntry {
  loc: string
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: string
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const GET: APIRoute = async () => {
  const projects = await getProyectos()

  const entries: SitemapEntry[] = [
    { loc: absoluteUrl('/'), changefreq: 'weekly', priority: '1.0' },
    { loc: absoluteUrl('/projects'), changefreq: 'weekly', priority: '0.9' },
    ...projects.map((project): SitemapEntry => ({
      loc: absoluteUrl(`/projects/${project.id}`),
      changefreq: 'monthly',
      priority: '0.8',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
