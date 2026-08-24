import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ locals, redirect }) => {
  await locals.supabase?.auth.signOut()
  return redirect('/dashboard/login', 303)
}

export const GET: APIRoute = ({ redirect }) => redirect('/dashboard/login', 302)
