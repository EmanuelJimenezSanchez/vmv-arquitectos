/**
 * Formas de las filas tal como viven en Supabase. Los componentes públicos
 * siguen consumiendo los tipos de dominio de `@/lib/content`, que se derivan
 * de estas filas.
 */

export interface ServicioRow {
  id: string
  slug: string
  title: string
  description: string
  details: string
  footer: string
  image_url: string | null
  image_alt: string
  orden: number
  publicado: boolean
  updated_at: string
}

export interface ServicioFotoRow {
  id: string
  servicio_id: string
  src: string
  alt: string
  orden: number
}

export interface GaleriaRow {
  id: string
  slug: string
  title: string
  description: string
  image_desktop: string | null
  image_mobile: string | null
  orden: number
  publicado: boolean
  updated_at: string
}
