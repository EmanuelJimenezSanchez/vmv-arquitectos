/**
 * Formas de las filas tal como viven en Supabase. Los componentes públicos
 * siguen consumiendo los tipos de dominio de `@/lib/content`, que se derivan
 * de estas filas.
 *
 * Las columnas `_en` guardan la traducción al inglés (ver
 * `supabase/migrations/0004_i18n.sql`). Nunca son `null`: cuando no hay
 * traducción valen '' y la capa de contenido cae al español.
 */

export interface ServicioRow {
  id: string
  slug: string
  title: string
  title_en: string
  description: string
  description_en: string
  details: string
  details_en: string
  footer: string
  footer_en: string
  image_url: string | null
  image_alt: string
  image_alt_en: string
  orden: number
  publicado: boolean
  updated_at: string
}

export interface ServicioFotoRow {
  id: string
  servicio_id: string
  src: string
  alt: string
  alt_en: string
  orden: number
}

export interface GaleriaRow {
  id: string
  slug: string
  title: string
  title_en: string
  description: string
  description_en: string
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
  title_en: string
  tagline: string
  tagline_en: string
  resumen: string
  resumen_en: string
  descripcion: string
  descripcion_en: string
  cover_url: string | null
  cover_alt: string
  cover_alt_en: string
  firma: string
  tipologia: string
  tipologia_en: string
  anio: number | null
  area: string
  area_en: string
  ubicacion: string
  ubicacion_en: string
  niveles: string
  niveles_en: string
  orden: number
  publicado: boolean
  updated_at: string
}

export interface ProyectoFotoRow {
  id: string
  proyecto_id: string
  src: string
  alt: string
  alt_en: string
  ancha: boolean
  width: number | null
  height: number | null
  orden: number
}

export interface ProyectoDocumentoRow {
  id: string
  proyecto_id: string
  titulo: string
  titulo_en: string
  descripcion: string
  descripcion_en: string
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
  rol_en: string
  nombre: string
  orden: number
}
