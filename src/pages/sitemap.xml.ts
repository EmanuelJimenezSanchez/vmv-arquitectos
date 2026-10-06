import type { APIRoute } from 'astro'
import { getProyectos } from '@/lib/content'
import { DEFAULT_LOCALE, HREFLANG, LOCALES } from '@/lib/i18n'
import { localizedUrl } from '@/lib/seo'

/**
 * El sitio se sirve en SSR, así que `@astrojs/sitemap` solo veía las rutas
 * estáticas y dejaba fuera todas las fichas de proyecto. Aquí se construye en
 * tiempo de petición a partir del mismo contenido que renderiza el sitio.
 *
 * Cada ruta aparece una vez por idioma y todas las entradas de una misma página
 * declaran `xhtml:link` hacia sus traducciones: es la forma en que Google sabe
 * que `/projects` y `/en/projects` son la misma página en dos idiomas.
 */
interface SitemapEntry {
  /** Ruta neutra, sin prefijo de idioma. */
  path: string
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
  // El slug no se traduce, así que la lista de rutas es la misma en los dos
  // idiomas y basta con cargar el contenido una vez.
  const projects = await getProyectos(DEFAULT_LOCALE)

  const entries: SitemapEntry[] = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/projects', changefreq: 'weekly', priority: '0.9' },
    ...projects.map((project): SitemapEntry => ({
      path: `/projects/${project.id}`,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  ]

  const alternates = (path: string) =>
    [
      ...LOCALES.map((locale) => ({
        hreflang: HREFLANG[locale],
        href: localizedUrl(path, locale),
      })),
      { hreflang: 'x-default', href: localizedUrl(path, DEFAULT_LOCALE) },
    ]
      .map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}"/>`,
      )
      .join('\n')

  const urls = entries
    .flatMap((entry) =>
      LOCALES.map(
        (locale) => `  <url>
    <loc>${escapeXml(localizedUrl(entry.path, locale))}</loc>
${alternates(entry.path)}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
      ),
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
