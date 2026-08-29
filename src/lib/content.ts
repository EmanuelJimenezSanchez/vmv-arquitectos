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
 * Cache en memoria del proceso serverless. Vercel reutiliza la instancia entre
 * requests cercanos, así que esto evita consultar Supabase en cada visita sin
 * retrasar los cambios más de `CACHE_TTL_MS`.
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

export const getServicios = (): Promise<Servicio[]> =>
  cached('servicios', async () => {
    const { data, error } = await supabasePublic
      .from('servicios')
      .select(
        'id, slug, title, description, details, footer, image_url, image_alt, orden, publicado, updated_at, servicio_fotos(id, servicio_id, src, alt, orden)',
      )
      .eq('publicado', true)
      .order('orden', { ascending: true })
      .order('orden', { ascending: true, referencedTable: 'servicio_fotos' })

    if (error) {
      throw new Error(`No se pudieron cargar los servicios: ${error.message}`)
    }

    const rows = (data ?? []) as (ServicioRow & { servicio_fotos: ServicioFotoRow[] })[]

    return rows.map((row) => ({
      id: row.slug,
      title: row.title,
      description: row.description,
      details: row.details,
      footer: row.footer,
      image: row.image_url ?? '',
      imageAlt: row.image_alt,
      gallery: (row.servicio_fotos ?? []).map((foto) => ({ src: foto.src, alt: foto.alt })),
    }))
  })

export const getGaleria = (): Promise<Galeria[]> =>
  cached('galeria', async () => {
    const { data, error } = await supabasePublic
      .from('galeria')
      .select('id, slug, title, description, image_desktop, image_mobile, orden, publicado')
      .eq('publicado', true)
      .order('orden', { ascending: true })

    if (error) {
      throw new Error(`No se pudo cargar la galería: ${error.message}`)
    }

    return ((data ?? []) as GaleriaRow[]).map((row) => ({
      id: row.slug,
      title: row.title,
      description: row.description,
      images: {
        desktop: row.image_desktop ?? '',
        mobile: row.image_mobile ?? row.image_desktop ?? '',
      },
    }))
  })

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

const PROYECTO_SELECT =
  'id, slug, title, tagline, resumen, descripcion, cover_url, cover_alt, firma, tipologia, anio,' +
  ' area, ubicacion, niveles, orden, publicado, updated_at,' +
  ' proyecto_fotos(id, proyecto_id, src, alt, ancha, width, height, orden),' +
  ' proyecto_documentos(id, proyecto_id, titulo, descripcion, preview_url, archivo_url, preview_width, preview_height, orden),' +
  ' proyecto_creditos(id, proyecto_id, rol, nombre, orden)'

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
const toCreditos = (rows: ProyectoCreditoRow[]): ProyectoCreditoGrupo[] => {
  const grupos = new Map<string, string[]>()
  byOrden(rows).forEach((row) => {
    const nombres = grupos.get(row.rol)
    if (nombres) {
      nombres.push(row.nombre)
    } else {
      grupos.set(row.rol, [row.nombre])
    }
  })
  return [...grupos].map(([rol, nombres]) => ({ rol, nombres }))
}

const toProyecto = (row: ProyectoJoined): Proyecto => ({
  id: row.slug,
  title: row.title,
  tagline: row.tagline,
  resumen: row.resumen,
  parrafos: toParrafos(row.descripcion),
  cover: row.cover_url ?? '',
  coverAlt: row.cover_alt || `Proyecto ${row.title} de VMV Arquitectos`,
  firma: row.firma,
  tipologia: row.tipologia,
  anio: row.anio,
  area: row.area,
  ubicacion: row.ubicacion,
  niveles: row.niveles,
  fotos: byOrden(row.proyecto_fotos).map((foto) => ({
    src: foto.src,
    alt: foto.alt,
    ancha: foto.ancha,
    width: foto.width,
    height: foto.height,
  })),
  documentos: byOrden(row.proyecto_documentos)
    // Sin imagen no hay nada que enseñar en la página.
    .filter((doc) => Boolean(doc.preview_url))
    .map((doc) => ({
      titulo: doc.titulo,
      descripcion: doc.descripcion,
      preview: doc.preview_url ?? '',
      previewWidth: doc.preview_width,
      previewHeight: doc.preview_height,
      archivo: doc.archivo_url ?? '',
    })),
  creditos: toCreditos(row.proyecto_creditos),
})

export const getProyectos = (): Promise<Proyecto[]> =>
  cached('proyectos', async () => {
    const { data, error } = await supabasePublic
      .from('proyectos')
      .select(PROYECTO_SELECT)
      .eq('publicado', true)
      .order('orden', { ascending: true })

    if (error) {
      throw new Error(`No se pudieron cargar los proyectos: ${error.message}`)
    }

    return ((data ?? []) as unknown as ProyectoJoined[]).map(toProyecto)
  })

export const getProyectoBySlug = async (slug: string): Promise<Proyecto | undefined> => {
  const proyectos = await getProyectos()
  return proyectos.find((proyecto) => proyecto.id === slug)
}
