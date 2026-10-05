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
 * Ruta sin el prefijo de idioma, siempre con barra inicial y sin barra final.
 * Es la forma neutra con la que se compara y se reconstruyen las alternativas.
 */
export const stripLocale = (pathname: string): string => {
  const [, first, ...rest] = pathname.split('/')
  const segments = first && isLocale(first) ? rest : [first, ...rest].filter(Boolean)
  const clean = segments.filter(Boolean).join('/')
  return clean ? `/${clean}` : '/'
}

/** Aplica el prefijo que le toca a un idioma sobre una ruta neutra. */
export const localizePath = (pathname: string, locale: Locale): string => {
  const base = stripLocale(pathname)
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
