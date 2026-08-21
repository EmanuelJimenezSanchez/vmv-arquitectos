import { useMemo, useRef, useState } from 'react'
import { actions } from 'astro:actions'
import { Banner, Button, Field, inputClass, slugify } from './ui'
import { useUpload } from './useUpload'

interface Foto {
  id?: string
  src: string
  alt: string
}

export interface ServicioRecord {
  id: string
  slug: string
  title: string
  description: string
  details: string
  footer: string
  image_url: string | null
  image_alt: string
  orden: number
  publicado: boolean
  servicio_fotos: Foto[]
}

interface Draft {
  id?: string
  slug: string
  title: string
  description: string
  details: string
  footer: string
  imageUrl: string | null
  imageAlt: string
  publicado: boolean
  gallery: Foto[]
}

const emptyDraft = (): Draft => ({
  slug: '',
  title: '',
  description: '',
  details: '',
  footer: '',
  imageUrl: null,
  imageAlt: '',
  publicado: true,
  gallery: [],
})

const toDraft = (servicio: ServicioRecord): Draft => ({
  id: servicio.id,
  slug: servicio.slug,
  title: servicio.title,
  description: servicio.description,
  details: servicio.details,
  footer: servicio.footer,
  imageUrl: servicio.image_url,
  imageAlt: servicio.image_alt,
  publicado: servicio.publicado,
  gallery: servicio.servicio_fotos.map((foto) => ({ src: foto.src, alt: foto.alt })),
})

export default function ServiciosManager({ initial }: { initial: ServicioRecord[] }) {
  const [servicios, setServicios] = useState(initial)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const dragIndex = useRef<number | null>(null)

  const { upload, uploading, uploadError, clearUploadError } = useUpload()

  const editing = draft !== null
  const slugTaken = useMemo(
    () => servicios.some((s) => s.slug === draft?.slug && s.id !== draft?.id),
    [servicios, draft],
  )

  const refresh = async () => {
    const { data } = await actions.servicios.list({})
    if (data) {
      setServicios(data as ServicioRecord[])
    }
  }

  const patch = (values: Partial<Draft>) => setDraft((current) => ({ ...current!, ...values }))

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    setError(null)

    const { error: saveError } = await actions.servicios.save({
      id: draft.id,
      slug: draft.slug || slugify(draft.title),
      title: draft.title,
      description: draft.description,
      details: draft.details,
      footer: draft.footer,
      imageUrl: draft.imageUrl,
      imageAlt: draft.imageAlt,
      publicado: draft.publicado,
      gallery: draft.gallery.map(({ src, alt }) => ({ src, alt })),
    })

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    await refresh()
    setDraft(null)
    setNotice('Servicio guardado. Los cambios se ven en el sitio en menos de un minuto.')
  }

  const handleDelete = async (servicio: ServicioRecord) => {
    const confirmed = window.confirm(
      `¿Eliminar «${servicio.title}»? También se borrarán sus ${servicio.servicio_fotos.length} fotos del bucket. Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    const { error: deleteError } = await actions.servicios.remove({ id: servicio.id })
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await refresh()
    setNotice('Servicio eliminado.')
  }

  const commitOrder = async (ordered: ServicioRecord[]) => {
    setServicios(ordered)
    const { error: reorderError } = await actions.servicios.reorder({
      ids: ordered.map((s) => s.id),
    })
    if (reorderError) {
      setError(reorderError.message)
      await refresh()
    }
  }

  const handleDrop = (target: number) => {
    const source = dragIndex.current
    dragIndex.current = null
    if (source === null || source === target) return

    const ordered = [...servicios]
    const [moved] = ordered.splice(source, 1)
    ordered.splice(target, 0, moved)
    void commitOrder(ordered)
  }

  const handleCoverUpload = async (file: File) => {
    const url = await upload(file, 'services')
    if (url) patch({ imageUrl: url })
  }

  const handleGalleryUpload = async (files: FileList) => {
    const uploaded: Foto[] = []
    for (const file of Array.from(files)) {
      const url = await upload(file, 'services')
      if (url) uploaded.push({ src: url, alt: '' })
    }
    if (uploaded.length > 0) {
      setDraft((current) => ({ ...current!, gallery: [...current!.gallery, ...uploaded] }))
    }
  }

  const moveFoto = (from: number, to: number) => {
    if (!draft || to < 0 || to >= draft.gallery.length) return
    const gallery = [...draft.gallery]
    const [moved] = gallery.splice(from, 1)
    gallery.splice(to, 0, moved)
    patch({ gallery })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="vmv-title-3">Servicios</h1>
          <p className="vmv-body-3 text-vmv-muted-foreground">
            Arrastra las tarjetas para cambiar el orden en que aparecen en el sitio.
          </p>
        </div>
        <Button variant="solid" onClick={() => setDraft(emptyDraft())} disabled={editing}>
          Nuevo servicio
        </Button>
      </div>

      {error && <Banner tone="error">{error}</Banner>}
      {uploadError && <Banner tone="error">{uploadError}</Banner>}
      {notice && !error && <Banner tone="ok">{notice}</Banner>}

      {editing && (
        <section className="flex flex-col gap-5 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <header className="flex items-center justify-between gap-4">
            <h2 className="vmv-title-3">{draft.id ? 'Editar servicio' : 'Nuevo servicio'}</h2>
            <label className="vmv-body-3 flex items-center gap-2 text-vmv-muted-foreground">
              <input
                type="checkbox"
                checked={draft.publicado}
                onChange={(event) => patch({ publicado: event.target.checked })}
              />
              Publicado
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
              hint={slugTaken ? 'Ya existe un servicio con este slug.' : 'Identificador en el sitio.'}
            >
              <input
                className={inputClass}
                value={draft.slug}
                onChange={(event) => patch({ slug: slugify(event.target.value) })}
              />
            </Field>
            <Field label="Etiqueta (footer)">
              <input
                className={inputClass}
                value={draft.footer}
                onChange={(event) => patch({ footer: event.target.value })}
              />
            </Field>
            <Field label="Texto alternativo de la portada">
              <input
                className={inputClass}
                value={draft.imageAlt}
                onChange={(event) => patch({ imageAlt: event.target.value })}
              />
            </Field>
            <Field label="Descripción">
              <textarea
                rows={3}
                className={inputClass}
                value={draft.description}
                onChange={(event) => patch({ description: event.target.value })}
              />
            </Field>
            <Field label="Detalle">
              <textarea
                rows={3}
                className={inputClass}
                value={draft.details}
                onChange={(event) => patch({ details: event.target.value })}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-3">
            <span className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
              Portada
            </span>
            <div className="flex flex-wrap items-center gap-4">
              {draft.imageUrl ? (
                <img
                  src={draft.imageUrl}
                  alt=""
                  className="h-28 w-20 border border-vmv-border object-cover"
                />
              ) : (
                <div className="vmv-caption-1 flex h-28 w-20 items-center justify-center border border-dashed border-vmv-border text-vmv-muted-foreground">
                  Sin foto
                </div>
              )}
              <input
                type="file"
                accept="image/webp,image/jpeg,image/png,image/avif"
                className="vmv-body-3 text-vmv-muted-foreground"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void handleCoverUpload(file)
                  event.target.value = ''
                }}
              />
              {draft.imageUrl && (
                <Button variant="ghost" onClick={() => patch({ imageUrl: null })}>
                  Quitar
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
                Galería ({draft.gallery.length})
              </span>
              <input
                type="file"
                multiple
                accept="image/webp,image/jpeg,image/png,image/avif"
                className="vmv-body-3 text-vmv-muted-foreground"
                onChange={(event) => {
                  if (event.target.files?.length) void handleGalleryUpload(event.target.files)
                  event.target.value = ''
                }}
              />
            </div>

            {draft.gallery.length === 0 ? (
              <p className="vmv-body-3 border border-dashed border-vmv-border px-4 py-6 text-center text-vmv-muted-foreground">
                Aún no hay fotos. Súbelas para que aparezcan al hacer clic en la tarjeta del
                servicio.
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {draft.gallery.map((foto, index) => (
                  <li
                    key={`${foto.src}-${index}`}
                    className="flex gap-3 border border-vmv-border p-3"
                  >
                    <img src={foto.src} alt="" className="h-20 w-20 shrink-0 object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <input
                        className={inputClass}
                        placeholder="Texto alternativo"
                        value={foto.alt}
                        onChange={(event) => {
                          const gallery = [...draft.gallery]
                          gallery[index] = { ...foto, alt: event.target.value }
                          patch({ gallery })
                        }}
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          onClick={() => moveFoto(index, index - 1)}
                          disabled={index === 0}
                          aria-label="Mover antes"
                        >
                          ←
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => moveFoto(index, index + 1)}
                          disabled={index === draft.gallery.length - 1}
                          aria-label="Mover después"
                        >
                          →
                        </Button>
                        <Button
                          variant="danger"
                          className="ml-auto"
                          onClick={() =>
                            patch({ gallery: draft.gallery.filter((_, i) => i !== index) })
                          }
                        >
                          Quitar
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <footer className="flex flex-wrap items-center gap-3">
            <Button
              variant="solid"
              onClick={handleSave}
              disabled={saving || uploading || !draft.title || slugTaken}
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
            <Button
              onClick={() => {
                setDraft(null)
                clearUploadError()
              }}
              disabled={saving}
            >
              Cancelar
            </Button>
            {uploading && (
              <span className="vmv-caption-1 text-vmv-muted-foreground">Subiendo imágenes…</span>
            )}
          </footer>
        </section>
      )}

      <ul className="flex flex-col gap-3">
        {servicios.map((servicio, index) => (
          <li
            key={servicio.id}
            draggable={!editing}
            onDragStart={() => {
              dragIndex.current = index
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(index)}
            className="flex flex-wrap items-center gap-4 border border-vmv-border p-3"
          >
            <span
              className="vmv-caption-1 cursor-grab text-vmv-muted-foreground tabular-nums"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')} ⠿
            </span>
            {servicio.image_url && (
              <img
                src={servicio.image_url}
                alt=""
                className="h-16 w-12 shrink-0 object-cover"
                loading="lazy"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="vmv-body-2 truncate">
                {servicio.title}
                {!servicio.publicado && (
                  <span className="vmv-caption-1 ml-2 text-vmv-muted-foreground">(oculto)</span>
                )}
              </p>
              <p className="vmv-caption-1 text-vmv-muted-foreground">
                {servicio.slug} · {servicio.servicio_fotos.length} fotos
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setDraft(toDraft(servicio))} disabled={editing}>
                Editar
              </Button>
              <Button variant="danger" onClick={() => handleDelete(servicio)} disabled={editing}>
                Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
