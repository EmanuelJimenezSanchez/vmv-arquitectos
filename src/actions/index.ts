import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import type { SupabaseClient } from '@supabase/supabase-js'
import { invalidateContentCache } from '@/lib/content'
import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  ALLOWED_MIME_TYPES,
  MAX_DOCUMENT_BYTES,
  MAX_UPLOAD_BYTES,
  buildObjectKey,
  createUploadUrl,
  deleteObject,
  keyFromPublicUrl,
  publicUrl,
} from '@/lib/r2'

/**
 * Toda mutación pasa por aquí. La allowlist ya se validó en el middleware,
 * pero se vuelve a exigir por si una action se invoca fuera de /dashboard.
 */
const requireAdmin = (locals: App.Locals): SupabaseClient => {
  if (!locals.isAdmin || !locals.supabase) {
    throw new ActionError({ code: 'FORBIDDEN', message: 'No tienes acceso al dashboard.' })
  }
  return locals.supabase
}

const fail = (message: string, error: { message: string } | null): never => {
  throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: `${message}: ${error?.message}` })
}

/** Borra del bucket las imágenes que dejaron de estar referenciadas. */
const deleteOrphanImages = async (urls: (string | null | undefined)[]) => {
  await Promise.allSettled(
    urls
      .filter((url): url is string => Boolean(url))
      .map((url) => keyFromPublicUrl(url))
      .filter((key): key is string => Boolean(key))
      .map((key) => deleteObject(key)),
  )
}

const fotoSchema = z.object({
  src: z.string().url(),
  alt: z.string().max(300).default(''),
})

const servicioSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones.'),
  title: z.string().min(1).max(160),
  description: z.string().max(600).default(''),
  details: z.string().max(600).default(''),
  footer: z.string().max(80).default(''),
  imageUrl: z.string().url().nullable().default(null),
  imageAlt: z.string().max(300).default(''),
  publicado: z.boolean().default(true),
  gallery: z.array(fotoSchema).max(60).default([]),
})

/**
 * Mismo select que usa la página del panel, para que las formas coincidan.
 * Va en una sola línea a propósito: el cliente de Supabase deriva los tipos
 * del literal, y partirlo con `+` lo degrada a `string` y rompe la inferencia.
 */
export const PROYECTO_ADMIN_SELECT =
  '*, proyecto_fotos(id, src, alt, ancha, orden), proyecto_documentos(id, titulo, descripcion, preview_url, archivo_url, orden), proyecto_creditos(id, rol, nombre, orden)'

const proyectoFotoSchema = z.object({
  src: z.string().url(),
  alt: z.string().max(300).default(''),
  ancha: z.boolean().default(false),
})

const proyectoDocumentoSchema = z.object({
  titulo: z.string().min(1).max(160),
  descripcion: z.string().max(600).default(''),
  previewUrl: z.string().url().nullable().default(null),
  archivoUrl: z.string().url().nullable().default(null),
})

const proyectoCreditoSchema = z.object({
  rol: z.string().min(1).max(120),
  nombre: z.string().min(1).max(160),
})

const proyectoSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones.'),
  title: z.string().min(1).max(160),
  tagline: z.string().max(300).default(''),
  resumen: z.string().max(1200).default(''),
  descripcion: z.string().max(20000).default(''),
  coverUrl: z.string().url().nullable().default(null),
  coverAlt: z.string().max(300).default(''),
  firma: z.string().max(160).default('VMV Arquitectos'),
  tipologia: z.string().max(160).default(''),
  anio: z.number().int().min(1900).max(2200).nullable().default(null),
  area: z.string().max(80).default(''),
  ubicacion: z.string().max(200).default(''),
  niveles: z.string().max(80).default(''),
  publicado: z.boolean().default(true),
  fotos: z.array(proyectoFotoSchema).max(80).default([]),
  documentos: z.array(proyectoDocumentoSchema).max(30).default([]),
  creditos: z.array(proyectoCreditoSchema).max(40).default([]),
})

const galeriaSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones.'),
  title: z.string().min(1).max(160),
  description: z.string().max(600).default(''),
  imageDesktop: z.string().url().nullable().default(null),
  imageMobile: z.string().url().nullable().default(null),
  publicado: z.boolean().default(true),
})

export const server = {
  uploads: {
    /**
     * Devuelve una URL firmada para subir directo a R2. El archivo nunca pasa
     * por el servidor de Astro, así que no topa con el límite de payload de
     * las funciones serverless.
     */
    sign: defineAction({
      input: z.object({
        folder: z.enum(['services', 'galeria', 'proyectos', 'planos']),
        fileName: z.string().min(1).max(200),
        contentType: z.enum([...ALLOWED_MIME_TYPES, ...ALLOWED_DOCUMENT_MIME_TYPES]),
        size: z.number().int().positive().max(MAX_DOCUMENT_BYTES),
      }),
      handler: async ({ folder, fileName, contentType, size }, context) => {
        requireAdmin(context.locals)

        // El PDF solo tiene sentido como plano descargable; en el resto de
        // carpetas el archivo se acaba pintando en un <img>.
        const isDocument = (ALLOWED_DOCUMENT_MIME_TYPES as readonly string[]).includes(contentType)
        if (isDocument && folder !== 'planos') {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'Los PDF solo se pueden subir como documentos técnicos.',
          })
        }

        const maxBytes = isDocument ? MAX_DOCUMENT_BYTES : MAX_UPLOAD_BYTES
        if (size > maxBytes) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: `El archivo supera los ${Math.round(maxBytes / (1024 * 1024))} MB.`,
          })
        }

        const key = buildObjectKey(folder, fileName, contentType)
        const uploadUrl = await createUploadUrl(key, contentType)

        return { key, uploadUrl, url: publicUrl(key) }
      },
    }),
  },

  servicios: {
    list: defineAction({
      handler: async (_input, context) => {
        const supabase = requireAdmin(context.locals)
        const { data, error } = await supabase
          .from('servicios')
          .select('*, servicio_fotos(id, src, alt, orden)')
          .order('orden', { ascending: true })
          .order('orden', { ascending: true, referencedTable: 'servicio_fotos' })

        if (error) {
          fail('No se pudieron cargar los servicios', error)
        }
        return data ?? []
      },
    }),

    save: defineAction({
      input: servicioSchema,
      handler: async (input, context) => {
        const supabase = requireAdmin(context.locals)

        const payload = {
          slug: input.slug,
          title: input.title,
          description: input.description,
          details: input.details,
          footer: input.footer,
          image_url: input.imageUrl,
          image_alt: input.imageAlt,
          publicado: input.publicado,
        }

        let servicioId = input.id

        if (servicioId) {
          const { error } = await supabase.from('servicios').update(payload).eq('id', servicioId)
          if (error) {
            fail('No se pudo guardar el servicio', error)
          }
        } else {
          // Nuevo servicio: se coloca al final del orden actual.
          const { data: last } = await supabase
            .from('servicios')
            .select('orden')
            .order('orden', { ascending: false })
            .limit(1)
            .maybeSingle()

          const { data, error } = await supabase
            .from('servicios')
            .insert({ ...payload, orden: (last?.orden ?? -1) + 1 })
            .select('id')
            .single()

          if (error || !data) {
            fail('No se pudo crear el servicio', error)
          }
          servicioId = data!.id
        }

        // Las fotos se reemplazan en bloque: es la operación que hace el
        // formulario y evita tener que diffear orden por orden.
        const { data: previas } = await supabase
          .from('servicio_fotos')
          .select('src')
          .eq('servicio_id', servicioId!)

        const { error: deleteError } = await supabase
          .from('servicio_fotos')
          .delete()
          .eq('servicio_id', servicioId!)
        if (deleteError) {
          fail('No se pudieron actualizar las fotos', deleteError)
        }

        if (input.gallery.length > 0) {
          const { error: insertError } = await supabase.from('servicio_fotos').insert(
            input.gallery.map((foto, index) => ({
              servicio_id: servicioId!,
              src: foto.src,
              alt: foto.alt,
              orden: index,
            })),
          )
          if (insertError) {
            fail('No se pudieron guardar las fotos', insertError)
          }
        }

        const conservadas = new Set(input.gallery.map((foto) => foto.src))
        await deleteOrphanImages(
          (previas ?? []).map((foto) => foto.src).filter((src) => !conservadas.has(src)),
        )

        invalidateContentCache('servicios')
        return { id: servicioId! }
      },
    }),

    remove: defineAction({
      input: z.object({ id: z.string().uuid() }),
      handler: async ({ id }, context) => {
        const supabase = requireAdmin(context.locals)

        const { data: servicio } = await supabase
          .from('servicios')
          .select('image_url, servicio_fotos(src)')
          .eq('id', id)
          .maybeSingle()

        const { error } = await supabase.from('servicios').delete().eq('id', id)
        if (error) {
          fail('No se pudo eliminar el servicio', error)
        }

        await deleteOrphanImages([
          servicio?.image_url,
          ...((servicio?.servicio_fotos ?? []) as { src: string }[]).map((foto) => foto.src),
        ])

        invalidateContentCache('servicios')
        return { ok: true }
      },
    }),

    reorder: defineAction({
      input: z.object({ ids: z.array(z.string().uuid()).min(1) }),
      handler: async ({ ids }, context) => {
        const supabase = requireAdmin(context.locals)

        const results = await Promise.all(
          ids.map((id, orden) => supabase.from('servicios').update({ orden }).eq('id', id)),
        )
        const failed = results.find((result) => result.error)
        if (failed?.error) {
          fail('No se pudo reordenar', failed.error)
        }

        invalidateContentCache('servicios')
        return { ok: true }
      },
    }),
  },

  proyectos: {
    list: defineAction({
      handler: async (_input, context) => {
        const supabase = requireAdmin(context.locals)
        const { data, error } = await supabase
          .from('proyectos')
          .select(PROYECTO_ADMIN_SELECT)
          .order('orden', { ascending: true })
          .order('orden', { ascending: true, referencedTable: 'proyecto_fotos' })
          .order('orden', { ascending: true, referencedTable: 'proyecto_documentos' })
          .order('orden', { ascending: true, referencedTable: 'proyecto_creditos' })

        if (error) {
          fail('No se pudieron cargar los proyectos', error)
        }
        return data ?? []
      },
    }),

    save: defineAction({
      input: proyectoSchema,
      handler: async (input, context) => {
        const supabase = requireAdmin(context.locals)

        const payload = {
          slug: input.slug,
          title: input.title,
          tagline: input.tagline,
          resumen: input.resumen,
          descripcion: input.descripcion,
          cover_url: input.coverUrl,
          cover_alt: input.coverAlt,
          firma: input.firma,
          tipologia: input.tipologia,
          anio: input.anio,
          area: input.area,
          ubicacion: input.ubicacion,
          niveles: input.niveles,
          publicado: input.publicado,
        }

        let proyectoId = input.id
        let coverPrevio: string | null = null

        if (proyectoId) {
          const { data: previo } = await supabase
            .from('proyectos')
            .select('cover_url')
            .eq('id', proyectoId)
            .maybeSingle()
          coverPrevio = previo?.cover_url ?? null

          const { error } = await supabase.from('proyectos').update(payload).eq('id', proyectoId)
          if (error) {
            fail('No se pudo guardar el proyecto', error)
          }
        } else {
          const { data: last } = await supabase
            .from('proyectos')
            .select('orden')
            .order('orden', { ascending: false })
            .limit(1)
            .maybeSingle()

          const { data, error } = await supabase
            .from('proyectos')
            .insert({ ...payload, orden: (last?.orden ?? -1) + 1 })
            .select('id')
            .single()

          if (error || !data) {
            fail('No se pudo crear el proyecto', error)
          }
          proyectoId = data!.id
        }

        // Las tres colecciones se reemplazan en bloque, igual que la galería
        // de un servicio: es lo que hace el formulario y evita diffear orden
        // por orden.
        const { data: fotosPrevias } = await supabase
          .from('proyecto_fotos')
          .select('src')
          .eq('proyecto_id', proyectoId!)

        const { data: documentosPrevios } = await supabase
          .from('proyecto_documentos')
          .select('preview_url, archivo_url')
          .eq('proyecto_id', proyectoId!)

        const limpiezas = await Promise.all([
          supabase.from('proyecto_fotos').delete().eq('proyecto_id', proyectoId!),
          supabase.from('proyecto_documentos').delete().eq('proyecto_id', proyectoId!),
          supabase.from('proyecto_creditos').delete().eq('proyecto_id', proyectoId!),
        ])
        const limpiezaFallida = limpiezas.find((result) => result.error)
        if (limpiezaFallida?.error) {
          fail('No se pudo actualizar el contenido del proyecto', limpiezaFallida.error)
        }

        if (input.fotos.length > 0) {
          const { error } = await supabase.from('proyecto_fotos').insert(
            input.fotos.map((foto, index) => ({
              proyecto_id: proyectoId!,
              src: foto.src,
              alt: foto.alt,
              ancha: foto.ancha,
              orden: index,
            })),
          )
          if (error) {
            fail('No se pudieron guardar las fotos', error)
          }
        }

        if (input.documentos.length > 0) {
          const { error } = await supabase.from('proyecto_documentos').insert(
            input.documentos.map((doc, index) => ({
              proyecto_id: proyectoId!,
              titulo: doc.titulo,
              descripcion: doc.descripcion,
              preview_url: doc.previewUrl,
              archivo_url: doc.archivoUrl,
              orden: index,
            })),
          )
          if (error) {
            fail('No se pudieron guardar los documentos', error)
          }
        }

        if (input.creditos.length > 0) {
          const { error } = await supabase.from('proyecto_creditos').insert(
            input.creditos.map((credito, index) => ({
              proyecto_id: proyectoId!,
              rol: credito.rol,
              nombre: credito.nombre,
              orden: index,
            })),
          )
          if (error) {
            fail('No se pudieron guardar los créditos', error)
          }
        }

        const conservadas = new Set(
          [
            input.coverUrl,
            ...input.fotos.map((foto) => foto.src),
            ...input.documentos.flatMap((doc) => [doc.previewUrl, doc.archivoUrl]),
          ].filter((url): url is string => Boolean(url)),
        )

        await deleteOrphanImages(
          [
            coverPrevio,
            ...(fotosPrevias ?? []).map((foto) => foto.src),
            ...(documentosPrevios ?? []).flatMap((doc) => [doc.preview_url, doc.archivo_url]),
          ].filter((url): url is string => Boolean(url) && !conservadas.has(url as string)),
        )

        invalidateContentCache('proyectos')
        return { id: proyectoId! }
      },
    }),

    remove: defineAction({
      input: z.object({ id: z.string().uuid() }),
      handler: async ({ id }, context) => {
        const supabase = requireAdmin(context.locals)

        const { data: proyecto } = await supabase
          .from('proyectos')
          .select('cover_url, proyecto_fotos(src), proyecto_documentos(preview_url, archivo_url)')
          .eq('id', id)
          .maybeSingle()

        const { error } = await supabase.from('proyectos').delete().eq('id', id)
        if (error) {
          fail('No se pudo eliminar el proyecto', error)
        }

        await deleteOrphanImages([
          proyecto?.cover_url,
          ...((proyecto?.proyecto_fotos ?? []) as { src: string }[]).map((foto) => foto.src),
          ...(
            (proyecto?.proyecto_documentos ?? []) as {
              preview_url: string | null
              archivo_url: string | null
            }[]
          ).flatMap((doc) => [doc.preview_url, doc.archivo_url]),
        ])

        invalidateContentCache('proyectos')
        return { ok: true }
      },
    }),

    reorder: defineAction({
      input: z.object({ ids: z.array(z.string().uuid()).min(1) }),
      handler: async ({ ids }, context) => {
        const supabase = requireAdmin(context.locals)

        const results = await Promise.all(
          ids.map((id, orden) => supabase.from('proyectos').update({ orden }).eq('id', id)),
        )
        const failed = results.find((result) => result.error)
        if (failed?.error) {
          fail('No se pudo reordenar', failed.error)
        }

        invalidateContentCache('proyectos')
        return { ok: true }
      },
    }),
  },

  galeria: {
    list: defineAction({
      handler: async (_input, context) => {
        const supabase = requireAdmin(context.locals)
        const { data, error } = await supabase
          .from('galeria')
          .select('*')
          .order('orden', { ascending: true })

        if (error) {
          fail('No se pudo cargar la galería', error)
        }
        return data ?? []
      },
    }),

    save: defineAction({
      input: galeriaSchema,
      handler: async (input, context) => {
        const supabase = requireAdmin(context.locals)

        const payload = {
          slug: input.slug,
          title: input.title,
          description: input.description,
          image_desktop: input.imageDesktop,
          image_mobile: input.imageMobile,
          publicado: input.publicado,
        }

        if (input.id) {
          const { data: previa } = await supabase
            .from('galeria')
            .select('image_desktop, image_mobile')
            .eq('id', input.id)
            .maybeSingle()

          const { error } = await supabase.from('galeria').update(payload).eq('id', input.id)
          if (error) {
            fail('No se pudo guardar la entrada', error)
          }

          const reemplazadas = [
            previa?.image_desktop !== input.imageDesktop ? previa?.image_desktop : null,
            previa?.image_mobile !== input.imageMobile ? previa?.image_mobile : null,
          ]
          await deleteOrphanImages(reemplazadas)

          invalidateContentCache('galeria')
          return { id: input.id }
        }

        const { data: last } = await supabase
          .from('galeria')
          .select('orden')
          .order('orden', { ascending: false })
          .limit(1)
          .maybeSingle()

        const { data, error } = await supabase
          .from('galeria')
          .insert({ ...payload, orden: (last?.orden ?? -1) + 1 })
          .select('id')
          .single()

        if (error || !data) {
          fail('No se pudo crear la entrada', error)
        }

        invalidateContentCache('galeria')
        return { id: data!.id }
      },
    }),

    remove: defineAction({
      input: z.object({ id: z.string().uuid() }),
      handler: async ({ id }, context) => {
        const supabase = requireAdmin(context.locals)

        const { data: entrada } = await supabase
          .from('galeria')
          .select('image_desktop, image_mobile')
          .eq('id', id)
          .maybeSingle()

        const { error } = await supabase.from('galeria').delete().eq('id', id)
        if (error) {
          fail('No se pudo eliminar la entrada', error)
        }

        await deleteOrphanImages([entrada?.image_desktop, entrada?.image_mobile])

        invalidateContentCache('galeria')
        return { ok: true }
      },
    }),

    reorder: defineAction({
      input: z.object({ ids: z.array(z.string().uuid()).min(1) }),
      handler: async ({ ids }, context) => {
        const supabase = requireAdmin(context.locals)

        const results = await Promise.all(
          ids.map((id, orden) => supabase.from('galeria').update({ orden }).eq('id', id)),
        )
        const failed = results.find((result) => result.error)
        if (failed?.error) {
          fail('No se pudo reordenar', failed.error)
        }

        invalidateContentCache('galeria')
        return { ok: true }
      },
    }),
  },
}
