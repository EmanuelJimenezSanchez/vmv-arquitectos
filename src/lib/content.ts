import { supabasePublic } from '@/lib/supabase/server'
import type { GaleriaRow, ServicioFotoRow, ServicioRow } from '@/lib/supabase/types'

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
