import {
  DEFAULT_LOCALE,
  HREFLANG,
  LOCALES,
  localizePath,
  stripLocale,
  useTranslations,
  type Locale,
} from '@/lib/i18n'

/**
 * Fuente única de verdad para los metadatos del sitio público.
 *
 * Todo lo que necesite el `<head>` (dominio, textos por defecto, perfiles
 * sociales, datos de contacto) vive aquí para que no se duplique entre el
 * layout, el sitemap y los bloques de datos estructurados.
 */

export const SITE_URL = 'https://www.vmv-arquitectos.com'

export const SITE_NAME = 'VMV Arquitectos'

export const DEFAULT_OG_IMAGE = 'https://cdn.vmv-arquitectos.com/og.jpg'

export const CONTACT_EMAIL = 'ventas@vmvarquitectos.com'

export const CONTACT_PHONE = '+1 555 824 1933'

/** Perfiles verificables de la firma; alimentan `sameAs` en los datos estructurados. */
export const SOCIAL_PROFILES = [
  'https://www.instagram.com/vmv_arquitectos',
  'https://www.facebook.com/vmvarquitectos',
  'https://www.tiktok.com/@vmv.arquitectos',
  'https://mx.linkedin.com/in/vmv-arquitectos-76b657263',
  'https://pin.it/4eHgcY2c5',
]

/**
 * Normaliza una ruta a URL absoluta sin barra final, que es la forma canónica
 * que impone el redirect de `vercel.json`. Sin esto las canónicas y el sitemap
 * apuntarían a URLs que responden 301 y diluyen las señales.
 */
export const absoluteUrl = (pathname: string): string => {
  if (pathname.startsWith('http')) {
    return pathname
  }
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  // La raíz conserva su barra (es la excepción del redirect de vercel.json);
  // el resto de rutas la pierden.
  const clean = path === '/' ? '/' : path.replace(/\/+$/, '')
  return `${SITE_URL}${clean}`
}

/** URL absoluta de una ruta neutra en un idioma concreto. */
export const localizedUrl = (pathname: string, locale: Locale): string =>
  absoluteUrl(localizePath(pathname, locale))

/**
 * Las dos versiones de una misma página más `x-default`. Google solo trata
 * `/` y `/en` como traducciones si ambas se declaran y se apuntan entre sí.
 */
export const alternateUrls = (pathname: string) => {
  const neutral = stripLocale(pathname)
  return [
    ...LOCALES.map((locale) => ({
      hreflang: HREFLANG[locale],
      href: localizedUrl(neutral, locale),
    })),
    { hreflang: 'x-default', href: localizedUrl(neutral, DEFAULT_LOCALE) },
  ]
}

/** Identificadores estables del grafo, para que los nodos se referencien entre sí. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`

/** El sitio se declara una vez por idioma, cada uno con su propio `@id`. */
export const websiteId = (locale: Locale) => `${localizedUrl('/', locale)}#website`

/**
 * La firma como prestador de servicios profesionales: es el nodo que Google usa
 * para el panel de conocimiento y al que cuelgan el resto de las páginas.
 */
export const organizationSchema = (locale: Locale) => {
  const t = useTranslations(locale)
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: 'VMV',
    url: `${SITE_URL}/`,
    description: t.seo.organizationDescription,
    image: DEFAULT_OG_IMAGE,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon-512.png`,
    },
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Guadalajara',
      addressRegion: 'Jalisco',
      addressCountry: 'MX',
    },
    areaServed: {
      '@type': 'Country',
      name: t.seo.country,
    },
    knowsAbout: [...t.seo.knowsAbout],
    sameAs: SOCIAL_PROFILES,
  }
}

export const websiteSchema = (locale: Locale) => {
  const t = useTranslations(locale)
  return {
    '@type': 'WebSite',
    '@id': websiteId(locale),
    url: localizedUrl('/', locale),
    name: SITE_NAME,
    description: t.seo.homeDescription,
    inLanguage: HREFLANG[locale],
    publisher: { '@id': ORGANIZATION_ID },
  }
}

export interface BreadcrumbItem {
  name: string
  /** Ruta neutra, sin prefijo de idioma. */
  url: string
}

export const breadcrumbSchema = (items: BreadcrumbItem[], locale: Locale) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: localizedUrl(item.url, locale),
  })),
})
