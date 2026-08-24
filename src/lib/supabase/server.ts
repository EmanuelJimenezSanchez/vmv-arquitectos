import { createServerClient, createBrowserClient, parseCookieHeader } from '@supabase/ssr'
import type { AstroCookies } from 'astro'
import type { SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Faltan PUBLIC_SUPABASE_URL y/o PUBLIC_SUPABASE_ANON_KEY. Revisa tu archivo .env.',
  )
}

/**
 * Cliente ligado a la sesión del visitante: lee las cookies del request y
 * escribe las que Supabase renueve a través de Astro, de modo que el login
 * persiste entre navegaciones.
 */
export const createSupabaseServerClient = (
  request: Request,
  cookies: AstroCookies,
): SupabaseClient =>
  createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () =>
        parseCookieHeader(request.headers.get('cookie') ?? '').map(({ name, value }) => ({
          name,
          value: value ?? '',
        })),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, { ...options, path: options?.path ?? '/' })
        })
      },
    },
  })

/**
 * Cliente anónimo sin sesión, para las lecturas públicas del sitio (SSR).
 * No toca cookies, así que la respuesta se puede cachear en el edge.
 */
export const supabasePublic: SupabaseClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  cookies: { getAll: () => [], setAll: () => {} },
})
