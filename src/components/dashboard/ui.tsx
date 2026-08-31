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

/** Lado mayor, en px, de la miniatura que dibuja la proporción. */
const RATIO_BOX = 46

/**
 * Ayuda visual de proporción: dibuja a escala el recorte que va a aplicar el
 * sitio, para que se vea de un vistazo si la imagen tiene que ser horizontal
 * o vertical sin tener que interpretar «16:9».
 *
 * `ratio` es [ancho, alto]; sin él se muestra el caso «no se recorta».
 */
export const AspectHint = ({
  ratio,
  label,
  note,
}: {
  ratio?: [number, number]
  label: string
  note?: string
}) => {
  const [w, h] = ratio ?? [4, 3]
  const box = ratio
    ? {
        width: w >= h ? RATIO_BOX : Math.round((RATIO_BOX * w) / h),
        height: w >= h ? Math.round((RATIO_BOX * h) / w) : RATIO_BOX,
      }
    : { width: RATIO_BOX, height: Math.round(RATIO_BOX * 0.75) }

  return (
    <div className="flex items-center gap-3 border border-vmv-border bg-vmv-muted/40 px-3 py-2.5">
      <div
        className="flex shrink-0 items-center justify-center"
        style={{ width: RATIO_BOX, height: RATIO_BOX }}
        aria-hidden="true"
      >
        <div
          className={`border ${
            ratio
              ? 'border-vmv-sand-9/70 bg-vmv-sand-9/12'
              : 'border-dashed border-vmv-muted-foreground/60'
          }`}
          style={box}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="vmv-caption-1 tracking-[0.16em] text-vmv-foreground uppercase">
          {label}
        </span>
        {note && <span className="vmv-caption-1 text-vmv-muted-foreground">{note}</span>}
      </div>
    </div>
  )
}

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
