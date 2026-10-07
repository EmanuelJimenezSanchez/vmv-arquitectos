import { useState, type FormEvent } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'

interface Props {
  redirectTo: string
}

export default function LoginForm({ redirectTo }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="vmv-body-3 w-full border border-vmv-border bg-transparent py-3 pr-12 pl-4 text-vmv-foreground outline-none focus-visible:border-vmv-foreground"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-4 text-vmv-muted-foreground transition-colors duration-200 hover:text-vmv-foreground focus-visible:text-vmv-foreground focus-visible:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
              aria-hidden="true"
            >
              {showPassword ? (
                <>
                  <path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.39-1.61" />
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="m2 2 20 20" />
                </>
              ) : (
                <>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>
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
