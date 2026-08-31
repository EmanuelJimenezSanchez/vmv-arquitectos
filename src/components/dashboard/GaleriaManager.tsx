import { useMemo, useRef, useState } from 'react'
import { actions } from 'astro:actions'
import { AspectHint, Banner, Button, Field, inputClass, slugify } from './ui'
import { useUpload } from './useUpload'

export interface GaleriaRecord {
  id: string
  slug: string
  title: string
  description: string
  image_desktop: string | null
  image_mobile: string | null
  orden: number
  publicado: boolean
}

interface Draft {
  id?: string
  slug: string
  title: string
  description: string
  imageDesktop: string | null
  imageMobile: string | null
  publicado: boolean
}

const emptyDraft = (): Draft => ({
  slug: '',
  title: '',
  description: '',
  imageDesktop: null,
  imageMobile: null,
  publicado: true,
})

const toDraft = (entrada: GaleriaRecord): Draft => ({
  id: entrada.id,
  slug: entrada.slug,
  title: entrada.title,
  description: entrada.description,
  imageDesktop: entrada.image_desktop,
  imageMobile: entrada.image_mobile,
  publicado: entrada.publicado,
})

export default function GaleriaManager({ initial }: { initial: GaleriaRecord[] }) {
  const [entradas, setEntradas] = useState(initial)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const dragIndex = useRef<number | null>(null)

  const { upload, uploading, uploadError, clearUploadError } = useUpload()

  const slugTaken = useMemo(
    () => entradas.some((e) => e.slug === draft?.slug && e.id !== draft?.id),
    [entradas, draft],
  )

  const refresh = async () => {
    const { data } = await actions.galeria.list({})
    if (data) {
      setEntradas(data as GaleriaRecord[])
    }
  }

  const patch = (values: Partial<Draft>) => setDraft((current) => ({ ...current!, ...values }))

  // El formulario ocupa su propia vista, así que al abrirlo o cerrarlo se
  // vuelve al inicio y se limpian los avisos de la vista anterior.
  const openDraft = (next: Draft) => {
    setError(null)
    setNotice(null)
    clearUploadError()
    setDraft(next)
    window.scrollTo({ top: 0 })
  }

  const closeDraft = () => {
    setError(null)
    clearUploadError()
    setDraft(null)
    window.scrollTo({ top: 0 })
  }

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    setError(null)

    const { error: saveError } = await actions.galeria.save({
      id: draft.id,
      slug: draft.slug || slugify(draft.title),
      title: draft.title,
      description: draft.description,
      imageDesktop: draft.imageDesktop,
      imageMobile: draft.imageMobile,
      publicado: draft.publicado,
    })

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    await refresh()
    setDraft(null)
    setNotice('Entrada guardada. Los cambios se ven en el sitio en menos de un minuto.')
    window.scrollTo({ top: 0 })
  }

  const handleDelete = async (entrada: GaleriaRecord) => {
    if (!window.confirm(`¿Eliminar «${entrada.title}» y sus imágenes del bucket?`)) return

    const { error: deleteError } = await actions.galeria.remove({ id: entrada.id })
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await refresh()
    setNotice('Entrada eliminada.')
  }

  const handleDrop = async (target: number) => {
    const source = dragIndex.current
    dragIndex.current = null
    if (source === null || source === target) return

    const ordered = [...entradas]
    const [moved] = ordered.splice(source, 1)
    ordered.splice(target, 0, moved)
    setEntradas(ordered)

    const { error: reorderError } = await actions.galeria.reorder({
      ids: ordered.map((e) => e.id),
    })
    if (reorderError) {
      setError(reorderError.message)
      await refresh()
    }
  }

  const uploadInto = async (file: File, target: 'imageDesktop' | 'imageMobile') => {
    const uploaded = await upload(file, 'galeria')
    if (uploaded) patch({ [target]: uploaded.url } as Partial<Draft>)
  }

  const ImageSlot = ({
    label,
    value,
    target,
    ratio,
    ratioLabel,
    note,
  }: {
    label: string
    value: string | null
    target: 'imageDesktop' | 'imageMobile'
    ratio: [number, number]
    ratioLabel: string
    note: string
  }) => (
    <div className="flex flex-col gap-3">
      <span className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
        {label}
      </span>
      <AspectHint ratio={ratio} label={ratioLabel} note={note} />
      {value ? (
        <img src={value} alt="" className="h-32 w-full border border-vmv-border object-cover" />
      ) : (
        <div className="vmv-caption-1 flex h-32 items-center justify-center border border-dashed border-vmv-border text-vmv-muted-foreground">
          Sin imagen
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/webp,image/jpeg,image/png,image/avif"
          className="vmv-body-3 text-vmv-muted-foreground"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void uploadInto(file, target)
            event.target.value = ''
          }}
        />
        {value && (
          <Button variant="ghost" onClick={() => patch({ [target]: null } as Partial<Draft>)}>
            Quitar
          </Button>
        )}
      </div>
    </div>
  )

  const banners = (
    <>
      {error && <Banner tone="error">{error}</Banner>}
      {uploadError && <Banner tone="error">{uploadError}</Banner>}
      {notice && !error && <Banner tone="ok">{notice}</Banner>}
    </>
  )

  if (draft) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="vmv-title-3">{draft.id ? 'Editar entrada' : 'Nueva entrada'}</h1>
            <p className="vmv-body-3 text-vmv-muted-foreground">
              {draft.id ? draft.slug : 'Completa los datos y guarda para publicarla.'}
            </p>
          </div>
          <Button onClick={closeDraft} disabled={saving}>
            ← Volver a la galería
          </Button>
        </div>

        {banners}

        <section className="flex flex-col gap-5 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <header className="flex items-center justify-end gap-4">
            <label className="vmv-body-3 flex items-center gap-2 text-vmv-muted-foreground">
              <input
                type="checkbox"
                checked={draft.publicado}
                onChange={(event) => patch({ publicado: event.target.checked })}
              />
              Publicada
            </label>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Título">
              <input
                className={inputClass}
                value={draft.title}
                onChange={(event) => {
                  const title = event.target.value
                  patch(draft.id ? { title } : { title, slug: slugify(title) })
                }}
              />
            </Field>
            <Field
              label="Slug"
              hint={slugTaken ? 'Ya existe una entrada con este slug.' : undefined}
            >
              <input
                className={inputClass}
                value={draft.slug}
                onChange={(event) => patch({ slug: slugify(event.target.value) })}
              />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              rows={3}
              className={inputClass}
              value={draft.description}
              onChange={(event) => patch({ description: event.target.value })}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <ImageSlot
              label="Escritorio"
              value={draft.imageDesktop}
              target="imageDesktop"
              ratio={[16, 9]}
              ratioLabel="Horizontal 16:9"
              note="Se abre a pantalla completa en escritorio."
            />
            <ImageSlot
              label="Móvil"
              value={draft.imageMobile}
              target="imageMobile"
              ratio={[9, 16]}
              ratioLabel="Vertical 9:16"
              note="La misma toma, reencuadrada en vertical para el celular."
            />
          </div>

          <footer className="flex flex-wrap items-center gap-3">
            <Button
              variant="solid"
              onClick={handleSave}
              disabled={saving || uploading || !draft.title || slugTaken}
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
            <Button onClick={closeDraft} disabled={saving}>
              Cancelar
            </Button>
            {uploading && (
              <span className="vmv-caption-1 text-vmv-muted-foreground">Subiendo imágenes…</span>
            )}
          </footer>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="vmv-title-3">Galería</h1>
          <p className="vmv-body-3 text-vmv-muted-foreground">
            Cada entrada necesita una imagen para escritorio y otra para móvil.
          </p>
        </div>
        <Button variant="solid" onClick={() => openDraft(emptyDraft())}>
          Nueva entrada
        </Button>
      </div>

      {banners}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entradas.map((entrada, index) => (
          <li
            key={entrada.id}
            draggable
            onDragStart={() => {
              dragIndex.current = index
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => void handleDrop(index)}
            className="flex flex-col gap-3 border border-vmv-border p-3"
          >
            {entrada.image_desktop ? (
              <img
                src={entrada.image_desktop}
                alt=""
                className="aspect-16/10 w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="vmv-caption-1 flex aspect-16/10 items-center justify-center border border-dashed border-vmv-border text-vmv-muted-foreground">
                Sin imagen
              </div>
            )}
            <div>
              <p className="vmv-body-2 truncate">
                {entrada.title}
                {!entrada.publicado && (
                  <span className="vmv-caption-1 ml-2 text-vmv-muted-foreground">(oculta)</span>
                )}
              </p>
              <p className="vmv-caption-1 text-vmv-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, '0')} · {entrada.slug}
              </p>
            </div>
            <div className="mt-auto flex items-center gap-2">
              <Button onClick={() => openDraft(toDraft(entrada))}>Editar</Button>
              <Button variant="danger" onClick={() => handleDelete(entrada)}>
                Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
