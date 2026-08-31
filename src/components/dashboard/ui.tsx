import { useRef, useState, type ReactNode } from 'react'

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

/** Formatos de imagen que acepta el pipeline de subida. */
export const IMAGE_ACCEPT = 'image/webp,image/jpeg,image/png,image/avif'

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

/**
 * Zona de carga de archivos: acepta arrastrar y soltar, y también funciona
 * como botón (clic o Enter/Espacio) para abrir el selector del sistema.
 *
 * Filtra por `accept` lo que se suelta, para que arrastrar una carpeta o un
 * archivo que no toca no dispare una subida que el servidor va a rechazar.
 */
export const FileDrop = ({
  accept,
  multiple = false,
  disabled = false,
  busy = false,
  label,
  hint,
  compact = false,
  className = '',
  onFiles,
}: {
  accept: string
  multiple?: boolean
  disabled?: boolean
  busy?: boolean
  /** Texto principal; por defecto habla de imágenes. */
  label?: string
  /** Línea secundaria: formatos aceptados, tamaño recomendado, etc. */
  hint?: string
  /** Versión de una sola línea, para huecos estrechos. */
  compact?: boolean
  className?: string
  onFiles: (files: File[]) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const blocked = disabled || busy

  const accepts = (file: File) => {
    const patterns = accept
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
    if (patterns.length === 0) return true
    const name = file.name.toLowerCase()
    const type = file.type.toLowerCase()
    return patterns.some((pattern) =>
      pattern.startsWith('.')
        ? name.endsWith(pattern)
        : pattern.endsWith('/*')
          ? type.startsWith(pattern.slice(0, -1))
          : type === pattern,
    )
  }

  const emit = (list: FileList | null) => {
    if (!list?.length) return
    const files = Array.from(list).filter(accepts)
    if (files.length) onFiles(multiple ? files : files.slice(0, 1))
  }

  return (
    <div
      role="button"
      tabIndex={blocked ? -1 : 0}
      aria-disabled={blocked || undefined}
      aria-busy={busy || undefined}
      onClick={() => !blocked && inputRef.current?.click()}
      onKeyDown={(event) => {
        if (blocked) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(event) => {
        if (blocked) return
        event.preventDefault()
        setOver(true)
      }}
      onDragLeave={(event) => {
        // `dragleave` también salta al pasar por los hijos: sólo apagamos el
        // resaltado cuando el puntero sale de verdad del contenedor.
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
        setOver(false)
      }}
      onDrop={(event) => {
        if (blocked) return
        event.preventDefault()
        setOver(false)
        emit(event.dataTransfer.files)
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-1 border border-dashed text-center transition-colors duration-200 outline-none ${
        compact ? 'px-4 py-3' : 'px-4 py-6'
      } ${
        blocked
          ? 'cursor-default border-vmv-border text-vmv-muted-foreground opacity-60'
          : over
            ? 'border-vmv-foreground bg-vmv-muted text-vmv-foreground'
            : 'border-vmv-border text-vmv-muted-foreground hover:border-vmv-foreground hover:bg-vmv-muted hover:text-vmv-foreground focus-visible:border-vmv-foreground focus-visible:bg-vmv-muted'
      } ${className}`}
    >
      <span className="vmv-body-3 flex items-center gap-2">
        <span aria-hidden="true" className="text-base leading-none">
          {busy ? '⋯' : '↑'}
        </span>
        {busy
          ? 'Subiendo…'
          : (label ?? (multiple ? 'Arrastra imágenes aquí' : 'Arrastra la imagen aquí'))}
      </span>
      {!busy && (
        <span className="vmv-caption-1 text-vmv-muted-foreground">
          {hint ?? 'o haz clic para seleccionar'}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={blocked}
        className="hidden"
        onChange={(event) => {
          emit(event.target.files)
          event.target.value = ''
        }}
      />
    </div>
  )
}
