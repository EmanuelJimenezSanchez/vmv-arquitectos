/**
 * Configuración de idiomas del sitio público.
 *
 * El español vive en la raíz (`/`, `/projects`) y el inglés bajo el prefijo
 * `/en`. Es la estrategia que Google indexa como dos versiones independientes
 * enlazadas por `hreflang`, a diferencia de una cookie o un parámetro, que
 * dejan una sola URL para ambos idiomas.
 */

export const LOCALES = ['es', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'es'

/** Nombre del idioma en su propia lengua, que es como se etiqueta un selector. */
export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
}

export const LOCALE_SHORT: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
}

/** Valor del atributo `lang` del <html>. */
export const HTML_LANG: Record<Locale, string> = {
  es: 'es-MX',
  en: 'en',
}

/** Valor de `og:locale`, que usa guion bajo y región obligatoria. */
export const OG_LOCALE: Record<Locale, string> = {
  es: 'es_MX',
  en: 'en_US',
}

/** Valor de `hreflang`: el español apunta a México, el inglés queda genérico. */
export const HREFLANG: Record<Locale, string> = {
  es: 'es-MX',
  en: 'en',
}

const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value)

/**
 * Idioma de una ruta. Se lee del primer segmento y cae al español, que es el
 * que no lleva prefijo.
 */
export const getLocale = (url: URL | string): Locale => {
  const pathname = typeof url === 'string' ? url : url.pathname
  const [, first] = pathname.split('/')
  return first && isLocale(first) ? first : DEFAULT_LOCALE
}

/**
 * Primer segmento de las rutas que cambian de nombre según el idioma. La forma
 * neutra es la de la izquierda; cada página vive en `src/pages` con el nombre
 * traducido (`gracias.astro`, `en/thank-you.astro`). Las rutas que no están
 * aquí usan el mismo segmento en los dos idiomas.
 */
const LOCALIZED_SEGMENTS: Partial<Record<Locale, Record<string, string>>> = {
  es: { 'thank-you': 'gracias' },
}

const toNeutralSegment = (segment: string, locale: Locale): string => {
  const entries = Object.entries(LOCALIZED_SEGMENTS[locale] ?? {})
  return entries.find(([, localized]) => localized === segment)?.[0] ?? segment
}

const toLocalizedSegment = (segment: string, locale: Locale): string =>
  LOCALIZED_SEGMENTS[locale]?.[segment] ?? segment

/**
 * Ruta sin el prefijo de idioma, siempre con barra inicial y sin barra final.
 * Es la forma neutra con la que se compara y se reconstruyen las alternativas:
 * `/gracias` y `/en/thank-you` dan ambas `/thank-you`.
 */
export const stripLocale = (pathname: string): string => {
  const [, first, ...rest] = pathname.split('/')
  const prefixed = Boolean(first && isLocale(first))
  const locale = prefixed ? (first as Locale) : DEFAULT_LOCALE
  const segments = (prefixed ? rest : [first, ...rest]).filter(Boolean)
  if (segments.length > 0) {
    segments[0] = toNeutralSegment(segments[0], locale)
  }
  const clean = segments.join('/')
  return clean ? `/${clean}` : '/'
}

/** Aplica el prefijo y el nombre que le tocan a un idioma sobre una ruta neutra. */
export const localizePath = (pathname: string, locale: Locale): string => {
  const [, first = '', ...rest] = stripLocale(pathname).split('/')
  const base = first ? `/${[toLocalizedSegment(first, locale), ...rest].join('/')}` : '/'
  if (locale === DEFAULT_LOCALE) {
    return base
  }
  return base === '/' ? `/${locale}` : `/${locale}${base}`
}

/**
 * Enlaza un ancla de la home desde cualquier página conservando el idioma:
 * `href('/#contacto', 'en')` da `/en#contacto`.
 */
export const localizeHref = (href: string, locale: Locale): string => {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) {
    return href
  }
  const [path, hash] = href.split('#')
  const localized = localizePath(path || '/', locale)
  return hash ? `${localized}#${hash}` : localized
}
