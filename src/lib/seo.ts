/**
 * Fuente única de verdad para los metadatos del sitio público.
 *
 * Todo lo que necesite el `<head>` (dominio, textos por defecto, perfiles
 * sociales, datos de contacto) vive aquí para que no se duplique entre el
 * layout, el sitemap y los bloques de datos estructurados.
 */

export const SITE_URL = 'https://www.vmv-arquitectos.com'

export const SITE_NAME = 'VMV Arquitectos'

export const SITE_LOCALE = 'es_MX'

export const DEFAULT_TITLE = 'VMV Arquitectos | Diseño y construcción de espacios para habitar'

export const DEFAULT_DESCRIPTION =
  'Despacho de arquitectura, interiorismo y construcción. Espacios residenciales y comerciales pensados para vivirse. Con base en Guadalajara y proyectos en todo México.'

export const DEFAULT_OG_IMAGE = 'https://cdn.vmv-arquitectos.com/og.jpg'

export const DEFAULT_OG_ALT = 'VMV Arquitectos — Diseño y construcción de espacios para habitar'

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

/** Identificadores estables del grafo, para que los nodos se referencien entre sí. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

/**
 * La firma como prestador de servicios profesionales: es el nodo que Google usa
 * para el panel de conocimiento y al que cuelgan el resto de las páginas.
 */
export const organizationSchema = () => ({
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: 'VMV',
  url: `${SITE_URL}/`,
  description: DEFAULT_DESCRIPTION,
  image: DEFAULT_OG_IMAGE,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/favicon.svg`,
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
    name: 'México',
  },
  knowsAbout: [
    'Arquitectura residencial',
    'Arquitectura comercial',
    'Interiorismo',
    'Construcción',
    'Remodelación',
  ],
  sameAs: SOCIAL_PROFILES,
})

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  inLanguage: 'es-MX',
  publisher: { '@id': ORGANIZATION_ID },
})

export interface BreadcrumbItem {
  name: string
  url: string
}

export const breadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.url),
  })),
})
