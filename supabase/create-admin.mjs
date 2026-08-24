/**
 * Da de alta a un administrador del dashboard: crea (o reutiliza) el usuario en
 * Supabase Auth y lo agrega a la allowlist `dashboard_users`.
 *
 *   node --env-file=.env supabase/create-admin.mjs correo@vmv.com "contraseña" "Nombre"
 */
import { createClient } from '@supabase/supabase-js'

const [email, password, nombre] = process.argv.slice(2)

if (!email || !password) {
  console.error('Uso: node --env-file=.env supabase/create-admin.mjs <email> <password> [nombre]')
  process.exit(1)
}

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Faltan PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const run = async () => {
  let userId

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    // Ya existía: se busca para reutilizar su id y solo actualizar la contraseña.
    const { data: list, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    if (listError) {
      throw new Error(listError.message)
    }
    const existing = list.users.find((user) => user.email === email)
    if (!existing) {
      throw new Error(createError.message)
    }
    userId = existing.id
    await supabase.auth.admin.updateUserById(userId, { password })
    console.log(`· Usuario existente: se actualizó la contraseña de ${email}`)
  } else {
    userId = created.user.id
    console.log(`✓ Usuario creado: ${email}`)
  }

  const { error: allowlistError } = await supabase
    .from('dashboard_users')
    .upsert({ user_id: userId, email, nombre: nombre ?? null }, { onConflict: 'user_id' })

  if (allowlistError) {
    throw new Error(allowlistError.message)
  }

  console.log(`✓ ${email} tiene acceso al dashboard.`)
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
