import { useState, type FormEvent } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'

interface Props {
  redirectTo: string
}

export default function LoginForm({ redirectTo }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(
        signInError.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos.'
          : signInError.message,
      )
      setLoading(false)
      return
    }

    // Recarga completa para que el middleware lea la cookie de sesión recién
    // escrita y resuelva los permisos en el servidor.
    window.location.assign(redirectTo.startsWith('/') ? redirectTo : '/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
          Correo
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          className="vmv-body-3 border border-vmv-border bg-transparent px-4 py-3 text-vmv-foreground outline-none focus-visible:border-vmv-foreground"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
          Contraseña
        </span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          className="vmv-body-3 border border-vmv-border bg-transparent px-4 py-3 text-vmv-foreground outline-none focus-visible:border-vmv-foreground"
        />
      </label>

      {error && <p className="vmv-body-3 text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="vmv-body-3 mt-2 cursor-pointer border border-vmv-foreground bg-vmv-foreground px-4 py-3 text-vmv-background transition-opacity duration-200 hover:opacity-90 disabled:cursor-default disabled:opacity-50"
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
