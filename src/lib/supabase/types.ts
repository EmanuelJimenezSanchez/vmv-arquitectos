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

export interface ProyectoRow {
  id: string
  slug: string
  title: string
  tagline: string
  resumen: string
  descripcion: string
  cover_url: string | null
  cover_alt: string
  firma: string
  tipologia: string
  anio: number | null
  area: string
  ubicacion: string
  niveles: string
  orden: number
  publicado: boolean
  updated_at: string
}

export interface ProyectoFotoRow {
  id: string
  proyecto_id: string
  src: string
  alt: string
  ancha: boolean
  width: number | null
  height: number | null
  orden: number
}

export interface ProyectoDocumentoRow {
  id: string
  proyecto_id: string
  titulo: string
  descripcion: string
  preview_url: string | null
  archivo_url: string | null
  preview_width: number | null
  preview_height: number | null
  orden: number
}

export interface ProyectoCreditoRow {
  id: string
  proyecto_id: string
  rol: string
  nombre: string
  orden: number
}
