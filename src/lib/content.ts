import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n'
import { supabasePublic } from '@/lib/supabase/server'
import type {
  GaleriaRow,
  ProyectoCreditoRow,
  ProyectoDocumentoRow,
  ProyectoFotoRow,
  ProyectoRow,
  ServicioFotoRow,
  ServicioRow,
} from '@/lib/supabase/types'

/**
 * Tipos de dominio que consumen las secciones públicas. Se mantienen con la
 * misma forma que tenían los antiguos `src/data/*.ts` para que el markup no
 * tuviera que reescribirse al migrar a Supabase.
 */

export interface ServicioFoto {
  src: string
  alt: string
}

export interface Servicio {
  id: string
  title: string
  description: string
  details: string
  footer: string
  image: string
  imageAlt: string
  gallery: ServicioFoto[]
}

export interface Galeria {
  id: string
  title: string
  description: string
  images: {
    desktop: string
    mobile: string
  }
}

/**
 * Elige la traducción y cae al español cuando falta.
 *
 * El fallback es por campo, no por fila: un proyecto con el título traducido
 * pero la descripción a medias se ve coherente en lugar de mezclar una ficha
 * vacía con otra llena. Así el inglés se puede publicar poco a poco desde el
 * panel sin dejar huecos en el sitio.
 */
const traducir = (base: string, traduccion: string | null | undefined, locale: Locale): string => {
  if (locale === DEFAULT_LOCALE) {
    return base
  }
  const limpia = (traduccion ?? '').trim()
  return limpia || base
}

/**
 * Cache en memoria del proceso serverless. Vercel reutiliza la instancia entre
 * requests cercanos, así que esto evita consultar Supabase en cada visita sin
 * retrasar los cambios más de `CACHE_TTL_MS`.
 *
 * Se cachean las filas crudas, no el resultado ya traducido: los dos idiomas
 * salen de la misma consulta y traducir es solo elegir una columna.
 */
const CACHE_TTL_MS = 60_000

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<unknown>>()

const cached = async <T>(key: string, load: () => Promise<T>): Promise<T> => {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (entry && entry.expiresAt > Date.now()) {
    return entry.value
  }

  const value = await load()
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS })
  return value
}

/** Invalida el cache tras guardar desde el dashboard. */
export const invalidateContentCache = (key?: string) => {
  if (key) {
    cache.delete(key)
    return
  }
  cache.clear()
}

type ServicioJoined = ServicioRow & { servicio_fotos: ServicioFotoRow[] }

const SERVICIO_SELECT = '*, servicio_fotos(*)'

const serviciosRows = (): Promise<ServicioJoined[]> =>
  cached('servicios', async () => {
    const { data, error } = await supabasePublic
      .from('servicios')
      .select(SERVICIO_SELECT)
      .eq('publicado', true)
      .order('orden', { ascending: true })
      .order('orden', { ascending: true, referencedTable: 'servicio_fotos' })

    if (error) {
      throw new Error(`No se pudieron cargar los servicios: ${error.message}`)
    }

    return (data ?? []) as unknown as ServicioJoined[]
  })

const toServicio = (row: ServicioJoined, locale: Locale): Servicio => ({
  id: row.slug,
  title: traducir(row.title, row.title_en, locale),
  description: traducir(row.description, row.description_en, locale),
  details: traducir(row.details, row.details_en, locale),
  footer: traducir(row.footer, row.footer_en, locale),
  image: row.image_url ?? '',
  imageAlt: traducir(row.image_alt, row.image_alt_en, locale),
  gallery: (row.servicio_fotos ?? []).map((foto) => ({
    src: foto.src,
    alt: traducir(foto.alt, foto.alt_en, locale),
  })),
})

export const getServicios = async (locale: Locale = DEFAULT_LOCALE): Promise<Servicio[]> =>
  (await serviciosRows()).map((row) => toServicio(row, locale))

const galeriaRows = (): Promise<GaleriaRow[]> =>
  cached('galeria', async () => {
    const { data, error } = await supabasePublic
      .from('galeria')
      .select('*')
      .eq('publicado', true)
      .order('orden', { ascending: true })

    if (error) {
      throw new Error(`No se pudo cargar la galería: ${error.message}`)
    }

    return (data ?? []) as unknown as GaleriaRow[]
  })

export const getGaleria = async (locale: Locale = DEFAULT_LOCALE): Promise<Galeria[]> =>
  (await galeriaRows()).map((row) => ({
    id: row.slug,
    title: traducir(row.title, row.title_en, locale),
    description: traducir(row.description, row.description_en, locale),
    images: {
      desktop: row.image_desktop ?? '',
      mobile: row.image_mobile ?? row.image_desktop ?? '',
    },
  }))

export interface ProyectoFoto {
  src: string
  alt: string
  ancha: boolean
  width: number | null
  height: number | null
}

export interface ProyectoDocumento {
  titulo: string
  descripcion: string
  preview: string
  previewWidth: number | null
  previewHeight: number | null
  archivo: string
}

/** Colaboradores agrupados por rol, en el orden en que se capturaron. */
export interface ProyectoCreditoGrupo {
  rol: string
  nombres: string[]
}

export interface Proyecto {
  id: string
  title: string
  tagline: string
  resumen: string
  /** `descripcion` ya separada en párrafos. */
  parrafos: string[]
  cover: string
  coverAlt: string
  firma: string
  tipologia: string
  anio: number | null
  area: string
  ubicacion: string
  niveles: string
  fotos: ProyectoFoto[]
  documentos: ProyectoDocumento[]
  creditos: ProyectoCreditoGrupo[]
}

const PROYECTO_SELECT = '*, proyecto_fotos(*), proyecto_documentos(*), proyecto_creditos(*)'

type ProyectoJoined = ProyectoRow & {
  proyecto_fotos: ProyectoFotoRow[]
  proyecto_documentos: ProyectoDocumentoRow[]
  proyecto_creditos: ProyectoCreditoRow[]
}

const byOrden = <T extends { orden: number }>(rows: T[] | null | undefined): T[] =>
  [...(rows ?? [])].sort((a, b) => a.orden - b.orden)

/**
 * El cuerpo se captura como un solo texto en el panel; aquí se parte en
 * párrafos por línea en blanco, que es como se escribe de forma natural.
 */
const toParrafos = (descripcion: string): string[] =>
  descripcion
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean)

/** Agrupa los créditos por rol conservando el orden de captura. */
const toCreditos = (rows: ProyectoCreditoRow[], locale: Locale): ProyectoCreditoGrupo[] => {
  const grupos = new Map<string, string[]>()
  byOrden(rows).forEach((row) => {
    const rol = traducir(row.rol, row.rol_en, locale)
    const nombres = grupos.get(rol)
    if (nombres) {
      nombres.push(row.nombre)
    } else {
      grupos.set(rol, [row.nombre])
    }
  })
  return [...grupos].map(([rol, nombres]) => ({ rol, nombres }))
}

const toProyecto = (row: ProyectoJoined, locale: Locale): Proyecto => {
  const title = traducir(row.title, row.title_en, locale)
  return {
    id: row.slug,
    title,
    tagline: traducir(row.tagline, row.tagline_en, locale),
    resumen: traducir(row.resumen, row.resumen_en, locale),
    parrafos: toParrafos(traducir(row.descripcion, row.descripcion_en, locale)),
    cover: row.cover_url ?? '',
    coverAlt: traducir(row.cover_alt, row.cover_alt_en, locale) || `${title} — VMV Arquitectos`,
    firma: row.firma,
    tipologia: traducir(row.tipologia, row.tipologia_en, locale),
    anio: row.anio,
    area: traducir(row.area, row.area_en, locale),
    ubicacion: traducir(row.ubicacion, row.ubicacion_en, locale),
    niveles: traducir(row.niveles, row.niveles_en, locale),
    fotos: byOrden(row.proyecto_fotos).map((foto) => ({
      src: foto.src,
      alt: traducir(foto.alt, foto.alt_en, locale),
      ancha: foto.ancha,
      width: foto.width,
      height: foto.height,
    })),
    documentos: byOrden(row.proyecto_documentos)
      // Sin imagen no hay nada que enseñar en la página.
      .filter((doc) => Boolean(doc.preview_url))
      .map((doc) => ({
        titulo: traducir(doc.titulo, doc.titulo_en, locale),
        descripcion: traducir(doc.descripcion, doc.descripcion_en, locale),
        preview: doc.preview_url ?? '',
        previewWidth: doc.preview_width,
        previewHeight: doc.preview_height,
        archivo: doc.archivo_url ?? '',
      })),
    creditos: toCreditos(row.proyecto_creditos, locale),
  }
}

const proyectosRows = (): Promise<ProyectoJoined[]> =>
  cached('proyectos', async () => {
    const { data, error } = await supabasePublic
      .from('proyectos')
      .select(PROYECTO_SELECT)
      .eq('publicado', true)
      .order('orden', { ascending: true })

    if (error) {
      throw new Error(`No se pudieron cargar los proyectos: ${error.message}`)
    }

    return (data ?? []) as unknown as ProyectoJoined[]
  })

export const getProyectos = async (locale: Locale = DEFAULT_LOCALE): Promise<Proyecto[]> =>
  (await proyectosRows()).map((row) => toProyecto(row, locale))

export const getProyectoBySlug = async (
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Proyecto | undefined> => {
  const proyectos = await getProyectos(locale)
  return proyectos.find((proyecto) => proyecto.id === slug)
}
