import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente para el navegador (login del dashboard). Comparte las mismas cookies
 * que el cliente de servidor, así que la sesión queda disponible en SSR.
 */
export const supabaseBrowser = createBrowserClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
)
