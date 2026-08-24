import type { ReactNode } from 'react'

export const Field = ({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) => (
  <label className="flex flex-col gap-2">
    <span className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
      {label}
    </span>
    {children}
    {hint && <span className="vmv-caption-1 text-vmv-muted-foreground">{hint}</span>}
  </label>
)

export const inputClass =
  'vmv-body-3 w-full border border-vmv-border bg-transparent px-3 py-2.5 text-vmv-foreground outline-none focus-visible:border-vmv-foreground'

export const Button = ({
  variant = 'outline',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline' | 'ghost' | 'danger'
}) => {
  const variants = {
    solid: 'border-vmv-foreground bg-vmv-foreground text-vmv-background hover:opacity-90',
    outline: 'border-vmv-border text-vmv-foreground hover:bg-vmv-muted',
    ghost: 'border-transparent text-vmv-muted-foreground hover:text-vmv-foreground',
    danger: 'border-red-500/40 text-red-500 hover:bg-red-500/10',
  }

  return (
    <button
      {...props}
      className={`vmv-body-3 cursor-pointer border px-3.5 py-2 transition-colors duration-200 disabled:cursor-default disabled:opacity-45 ${variants[variant]} ${className}`}
    />
  )
}

export const Banner = ({ tone, children }: { tone: 'error' | 'ok'; children: ReactNode }) => (
  <p
    role="status"
    className={`vmv-body-3 border px-4 py-3 ${
      tone === 'error'
        ? 'border-red-500/40 bg-red-500/10 text-red-500'
        : 'border-vmv-border bg-vmv-muted text-vmv-foreground'
    }`}
  >
    {children}
  </p>
)

/** Convierte un título en un slug estable para usar como identificador. */
export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
