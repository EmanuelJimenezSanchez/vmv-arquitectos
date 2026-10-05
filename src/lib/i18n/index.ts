import { en } from './en'
import { es, type Dictionary } from './es'
import { DEFAULT_LOCALE, getLocale, type Locale } from './config'

export * from './config'
export type { Dictionary }

const dictionaries: Record<Locale, Dictionary> = { es, en }

/**
 * Textos de un idioma. Se accede por propiedad (`t.nav.about`), así que un
 * error de nombre lo caza TypeScript en vez de aparecer como hueco en la página.
 */
export const useTranslations = (locale: Locale): Dictionary =>
  dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE]

/** Atajo para los `.astro`, que siempre tienen `Astro.url` a mano. */
export const t = (url: URL | string): Dictionary => useTranslations(getLocale(url))

/**
 * Rellena los huecos `{clave}` de un texto del diccionario.
 * Un hueco sin valor se deja tal cual para que el faltante se note.
 */
export const format = (
  template: string,
  values: Record<string, string | number | undefined>,
): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key]
    return value === undefined ? match : String(value)
  })
