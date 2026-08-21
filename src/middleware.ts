import { defineMiddleware } from 'astro:middleware'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const LOGIN_PATH = '/dashboard/login'

/** Rutas del dashboard accesibles sin sesión. */
const PUBLIC_DASHBOARD_PATHS = new Set([LOGIN_PATH, '/dashboard/logout'])

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/')
  const isAction = pathname.startsWith('/_actions/')

  // El sitio público no necesita sesión: se evita tocar cookies para que las
  // respuestas se puedan cachear en el edge.
  if (!isDashboard && !isAction) {
    return next()
  }

  const supabase = createSupabaseServerClient(context.request, context.cookies)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    // La allowlist es la fuente de verdad: estar autenticado no basta.
    const { data } = await supabase
      .from('dashboard_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()
    isAdmin = Boolean(data)
  }

  context.locals.supabase = supabase
  context.locals.user = user
  context.locals.isAdmin = isAdmin

  if (isDashboard && !PUBLIC_DASHBOARD_PATHS.has(pathname) && !isAdmin) {
    const redirectTo = encodeURIComponent(pathname + context.url.search)
    return context.redirect(`${LOGIN_PATH}?redirectTo=${redirectTo}`, 302)
  }

  return next()
})
