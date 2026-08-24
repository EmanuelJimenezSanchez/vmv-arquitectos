import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import type { SupabaseClient } from '@supabase/supabase-js'
import { invalidateContentCache } from '@/lib/content'
import {
  ALLOWED_MIME_TYPES,
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
        folder: z.enum(['services', 'galeria']),
        fileName: z.string().min(1).max(200),
        contentType: z.enum(ALLOWED_MIME_TYPES),
        size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
      }),
      handler: async ({ folder, fileName, contentType }, context) => {
        requireAdmin(context.locals)

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
