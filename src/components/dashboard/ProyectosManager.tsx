import { useMemo, useRef, useState } from 'react'
import { actions } from 'astro:actions'
import { Banner, Button, Field, inputClass, slugify } from './ui'
import { useUpload } from './useUpload'

const IMAGE_ACCEPT = 'image/webp,image/jpeg,image/png,image/avif'

interface Foto {
  id?: string
  src: string
  alt: string
  ancha: boolean
}

interface Documento {
  id?: string
  titulo: string
  descripcion: string
  preview_url: string | null
  archivo_url: string | null
}

interface Credito {
  id?: string
  rol: string
  nombre: string
}

export interface ProyectoRecord {
  id: string
  slug: string
  title: string
  tagline: string
  resumen: string
  descripcion: string
  cover_url: string | null
  cover_alt: string
  firma: string
  tipologia: string
  anio: number | null
  area: string
  ubicacion: string
  niveles: string
  orden: number
  publicado: boolean
  proyecto_fotos: Foto[]
  proyecto_documentos: Documento[]
  proyecto_creditos: Credito[]
}

interface Draft {
  id?: string
  slug: string
  title: string
  tagline: string
  resumen: string
  descripcion: string
  coverUrl: string | null
  coverAlt: string
  firma: string
  tipologia: string
  anio: string
  area: string
  ubicacion: string
  niveles: string
  publicado: boolean
  fotos: Foto[]
  documentos: Documento[]
  creditos: Credito[]
}

const emptyDraft = (): Draft => ({
  slug: '',
  title: '',
  tagline: '',
  resumen: '',
  descripcion: '',
  coverUrl: null,
  coverAlt: '',
  firma: 'VMV Arquitectos',
  tipologia: '',
  anio: '',
  area: '',
  ubicacion: '',
  niveles: '',
  publicado: true,
  fotos: [],
  documentos: [],
  creditos: [],
})

const toDraft = (proyecto: ProyectoRecord): Draft => ({
  id: proyecto.id,
  slug: proyecto.slug,
  title: proyecto.title,
  tagline: proyecto.tagline,
  resumen: proyecto.resumen,
  descripcion: proyecto.descripcion,
  coverUrl: proyecto.cover_url,
  coverAlt: proyecto.cover_alt,
  firma: proyecto.firma,
  tipologia: proyecto.tipologia,
  anio: proyecto.anio ? String(proyecto.anio) : '',
  area: proyecto.area,
  ubicacion: proyecto.ubicacion,
  niveles: proyecto.niveles,
  publicado: proyecto.publicado,
  fotos: proyecto.proyecto_fotos.map((foto) => ({
    src: foto.src,
    alt: foto.alt,
    ancha: foto.ancha,
  })),
  documentos: proyecto.proyecto_documentos.map((doc) => ({
    titulo: doc.titulo,
    descripcion: doc.descripcion,
    preview_url: doc.preview_url,
    archivo_url: doc.archivo_url,
  })),
  creditos: proyecto.proyecto_creditos.map((credito) => ({
    rol: credito.rol,
    nombre: credito.nombre,
  })),
})

/** Mueve un elemento de una lista sin mutarla; null si el destino no existe. */
const moved = <T,>(items: T[], from: number, to: number): T[] | null => {
  if (to < 0 || to >= items.length) return null
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export default function ProyectosManager({ initial }: { initial: ProyectoRecord[] }) {
  const [proyectos, setProyectos] = useState(initial)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const dragIndex = useRef<number | null>(null)

  const { upload, uploading, uploadError, clearUploadError } = useUpload()

  const slugTaken = useMemo(
    () => proyectos.some((p) => p.slug === draft?.slug && p.id !== draft?.id),
    [proyectos, draft],
  )

  const refresh = async () => {
    const { data } = await actions.proyectos.list({})
    if (data) {
      setProyectos(data as ProyectoRecord[])
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

    const { error: saveError } = await actions.proyectos.save({
      id: draft.id,
      slug: draft.slug || slugify(draft.title),
      title: draft.title,
      tagline: draft.tagline,
      resumen: draft.resumen,
      descripcion: draft.descripcion,
      coverUrl: draft.coverUrl,
      coverAlt: draft.coverAlt,
      firma: draft.firma,
      tipologia: draft.tipologia,
      anio: draft.anio ? Number(draft.anio) : null,
      area: draft.area,
      ubicacion: draft.ubicacion,
      niveles: draft.niveles,
      publicado: draft.publicado,
      fotos: draft.fotos.map(({ src, alt, ancha }) => ({ src, alt, ancha })),
      documentos: draft.documentos.map((doc) => ({
        titulo: doc.titulo,
        descripcion: doc.descripcion,
        previewUrl: doc.preview_url,
        archivoUrl: doc.archivo_url,
      })),
      creditos: draft.creditos
        .filter((credito) => credito.rol.trim() && credito.nombre.trim())
        .map(({ rol, nombre }) => ({ rol: rol.trim(), nombre: nombre.trim() })),
    })

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    await refresh()
    setDraft(null)
    setNotice('Proyecto guardado. Los cambios se ven en el sitio en menos de un minuto.')
    window.scrollTo({ top: 0 })
  }

  const handleDelete = async (proyecto: ProyectoRecord) => {
    const confirmed = window.confirm(
      `¿Eliminar «${proyecto.title}»? También se borrarán del bucket su portada, sus ${proyecto.proyecto_fotos.length} fotos y sus planos. Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    const { error: deleteError } = await actions.proyectos.remove({ id: proyecto.id })
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await refresh()
    setNotice('Proyecto eliminado.')
  }

  const commitOrder = async (ordered: ProyectoRecord[]) => {
    setProyectos(ordered)
    const { error: reorderError } = await actions.proyectos.reorder({
      ids: ordered.map((p) => p.id),
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

    const ordered = moved(proyectos, source, target)
    if (ordered) void commitOrder(ordered)
  }

  const handleCoverUpload = async (file: File) => {
    const url = await upload(file, 'proyectos')
    if (url) patch({ coverUrl: url })
  }

  const handleFotosUpload = async (files: FileList) => {
    const uploaded: Foto[] = []
    for (const file of Array.from(files)) {
      const url = await upload(file, 'proyectos')
      if (url) uploaded.push({ src: url, alt: '', ancha: false })
    }
    if (uploaded.length > 0) {
      setDraft((current) => ({ ...current!, fotos: [...current!.fotos, ...uploaded] }))
    }
  }

  const patchDocumento = (index: number, values: Partial<Documento>) => {
    if (!draft) return
    const documentos = [...draft.documentos]
    documentos[index] = { ...documentos[index], ...values }
    patch({ documentos })
  }

  const patchCredito = (index: number, values: Partial<Credito>) => {
    if (!draft) return
    const creditos = [...draft.creditos]
    creditos[index] = { ...creditos[index], ...values }
    patch({ creditos })
  }

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
            <h1 className="vmv-title-3">{draft.id ? 'Editar proyecto' : 'Nuevo proyecto'}</h1>
            <p className="vmv-body-3 text-vmv-muted-foreground">
              {draft.id ? draft.slug : 'Completa los datos y guarda para publicarlo.'}
            </p>
          </div>
          <Button onClick={closeDraft} disabled={saving}>
            ← Volver a proyectos
          </Button>
        </div>

        {banners}

        {/* ─── Datos generales ─────────────────────────── */}
        <section className="flex flex-col gap-5 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
              Datos generales
            </h2>
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
              hint={
                slugTaken ? 'Ya existe un proyecto con este slug.' : 'Aparece en la URL del sitio.'
              }
            >
              <input
                className={inputClass}
                value={draft.slug}
                onChange={(event) => patch({ slug: slugify(event.target.value) })}
              />
            </Field>
            <Field label="Frase del hero" hint="Línea corta bajo el título en la portada.">
              <input
                className={inputClass}
                value={draft.tagline}
                onChange={(event) => patch({ tagline: event.target.value })}
              />
            </Field>
            <Field label="Texto alternativo de la portada">
              <input
                className={inputClass}
                value={draft.coverAlt}
                onChange={(event) => patch({ coverAlt: event.target.value })}
              />
            </Field>
          </div>

          <Field label="Entradilla" hint="El párrafo destacado que abre la descripción.">
            <textarea
              rows={3}
              className={inputClass}
              value={draft.resumen}
              onChange={(event) => patch({ resumen: event.target.value })}
            />
          </Field>

          <Field
            label="Descripción"
            hint="Separa los párrafos con una línea en blanco: así se publican."
          >
            <textarea
              rows={14}
              className={inputClass}
              value={draft.descripcion}
              onChange={(event) => patch({ descripcion: event.target.value })}
            />
          </Field>

          <div className="flex flex-col gap-3">
            <span className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
              Portada
            </span>
            <div className="flex flex-wrap items-center gap-4">
              {draft.coverUrl ? (
                <img
                  src={draft.coverUrl}
                  alt=""
                  className="h-28 w-44 border border-vmv-border object-cover"
                />
              ) : (
                <div className="vmv-caption-1 flex h-28 w-44 items-center justify-center border border-dashed border-vmv-border text-vmv-muted-foreground">
                  Sin portada
                </div>
              )}
              <input
                type="file"
                accept={IMAGE_ACCEPT}
                className="vmv-body-3 text-vmv-muted-foreground"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void handleCoverUpload(file)
                  event.target.value = ''
                }}
              />
              {draft.coverUrl && (
                <Button variant="ghost" onClick={() => patch({ coverUrl: null })}>
                  Quitar
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* ─── Ficha técnica ───────────────────────────── */}
        <section className="flex flex-col gap-5 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <h2 className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
            Ficha técnica
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Firma">
              <input
                className={inputClass}
                value={draft.firma}
                onChange={(event) => patch({ firma: event.target.value })}
              />
            </Field>
            <Field label="Tipología" hint="Casa residencial, oficinas…">
              <input
                className={inputClass}
                value={draft.tipologia}
                onChange={(event) => patch({ tipologia: event.target.value })}
              />
            </Field>
            <Field label="Año de construcción">
              <input
                className={inputClass}
                inputMode="numeric"
                value={draft.anio}
                onChange={(event) => patch({ anio: event.target.value.replace(/[^0-9]/g, '') })}
              />
            </Field>
            <Field label="Área útil" hint="Con unidad, por ejemplo «350 m²».">
              <input
                className={inputClass}
                value={draft.area}
                onChange={(event) => patch({ area: event.target.value })}
              />
            </Field>
            <Field label="Localización">
              <input
                className={inputClass}
                value={draft.ubicacion}
                onChange={(event) => patch({ ubicacion: event.target.value })}
              />
            </Field>
            <Field label="Niveles">
              <input
                className={inputClass}
                value={draft.niveles}
                onChange={(event) => patch({ niveles: event.target.value })}
              />
            </Field>
          </div>
        </section>

        {/* ─── Galería ─────────────────────────────────── */}
        <section className="flex flex-col gap-4 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
              Galería ({draft.fotos.length})
            </h2>
            <input
              type="file"
              multiple
              accept={IMAGE_ACCEPT}
              className="vmv-body-3 text-vmv-muted-foreground"
              onChange={(event) => {
                if (event.target.files?.length) void handleFotosUpload(event.target.files)
                event.target.value = ''
              }}
            />
          </div>

          {draft.fotos.length === 0 ? (
            <p className="vmv-body-3 border border-dashed border-vmv-border px-4 py-6 text-center text-vmv-muted-foreground">
              Aún no hay fotos. Súbelas para que aparezcan en la galería del proyecto.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {draft.fotos.map((foto, index) => (
                <li key={`${foto.src}-${index}`} className="flex gap-3 border border-vmv-border p-3">
                  <img src={foto.src} alt="" className="h-20 w-20 shrink-0 object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <input
                      className={inputClass}
                      placeholder="Texto alternativo"
                      value={foto.alt}
                      onChange={(event) => {
                        const fotos = [...draft.fotos]
                        fotos[index] = { ...foto, alt: event.target.value }
                        patch({ fotos })
                      }}
                    />
                    <label className="vmv-caption-1 flex items-center gap-2 text-vmv-muted-foreground">
                      <input
                        type="checkbox"
                        checked={foto.ancha}
                        onChange={(event) => {
                          const fotos = [...draft.fotos]
                          fotos[index] = { ...foto, ancha: event.target.checked }
                          patch({ fotos })
                        }}
                      />
                      Ocupa el ancho completo
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const fotos = moved(draft.fotos, index, index - 1)
                          if (fotos) patch({ fotos })
                        }}
                        disabled={index === 0}
                        aria-label="Mover antes"
                      >
                        ←
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const fotos = moved(draft.fotos, index, index + 1)
                          if (fotos) patch({ fotos })
                        }}
                        disabled={index === draft.fotos.length - 1}
                        aria-label="Mover después"
                      >
                        →
                      </Button>
                      <Button
                        variant="danger"
                        className="ml-auto"
                        onClick={() => patch({ fotos: draft.fotos.filter((_, i) => i !== index) })}
                      >
                        Quitar
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ─── Documentos técnicos ─────────────────────── */}
        <section className="flex flex-col gap-4 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
                Documentos técnicos ({draft.documentos.length})
              </h2>
              <p className="vmv-caption-1 text-vmv-muted-foreground">
                Planos: una imagen para verlos en la página y, si quieres, el PDF para descargar.
              </p>
            </div>
            <Button
              onClick={() =>
                patch({
                  documentos: [
                    ...draft.documentos,
                    { titulo: '', descripcion: '', preview_url: null, archivo_url: null },
                  ],
                })
              }
            >
              Añadir plano
            </Button>
          </div>

          {draft.documentos.length === 0 ? (
            <p className="vmv-body-3 border border-dashed border-vmv-border px-4 py-6 text-center text-vmv-muted-foreground">
              Sin planos. La sección de documentos técnicos no aparecerá en la página.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {draft.documentos.map((doc, index) => (
                <li key={index} className="flex flex-col gap-4 border border-vmv-border p-3">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Título">
                      <input
                        className={inputClass}
                        placeholder="Planta baja"
                        value={doc.titulo}
                        onChange={(event) => patchDocumento(index, { titulo: event.target.value })}
                      />
                    </Field>
                    <Field label="Descripción">
                      <input
                        className={inputClass}
                        value={doc.descripcion}
                        onChange={(event) =>
                          patchDocumento(index, { descripcion: event.target.value })
                        }
                      />
                    </Field>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {doc.preview_url ? (
                      <img
                        src={doc.preview_url}
                        alt=""
                        className="h-24 w-32 border border-vmv-border object-contain"
                      />
                    ) : (
                      <div className="vmv-caption-1 flex h-24 w-32 items-center justify-center border border-dashed border-vmv-border text-center text-vmv-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <label className="vmv-caption-1 flex flex-wrap items-center gap-2 text-vmv-muted-foreground">
                        Imagen del plano
                        <input
                          type="file"
                          accept={IMAGE_ACCEPT}
                          className="vmv-body-3"
                          onChange={async (event) => {
                            const file = event.target.files?.[0]
                            event.target.value = ''
                            if (!file) return
                            const url = await upload(file, 'planos')
                            if (url) patchDocumento(index, { preview_url: url })
                          }}
                        />
                      </label>
                      <label className="vmv-caption-1 flex flex-wrap items-center gap-2 text-vmv-muted-foreground">
                        PDF descargable (opcional)
                        <input
                          type="file"
                          accept="application/pdf"
                          className="vmv-body-3"
                          onChange={async (event) => {
                            const file = event.target.files?.[0]
                            event.target.value = ''
                            if (!file) return
                            const url = await upload(file, 'planos')
                            if (url) patchDocumento(index, { archivo_url: url })
                          }}
                        />
                      </label>
                      {doc.archivo_url && (
                        <span className="vmv-caption-1 flex items-center gap-2 text-vmv-muted-foreground">
                          PDF cargado
                          <Button
                            variant="ghost"
                            onClick={() => patchDocumento(index, { archivo_url: null })}
                          >
                            Quitar
                          </Button>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const documentos = moved(draft.documentos, index, index - 1)
                        if (documentos) patch({ documentos })
                      }}
                      disabled={index === 0}
                      aria-label="Mover antes"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const documentos = moved(draft.documentos, index, index + 1)
                        if (documentos) patch({ documentos })
                      }}
                      disabled={index === draft.documentos.length - 1}
                      aria-label="Mover después"
                    >
                      ↓
                    </Button>
                    <Button
                      variant="danger"
                      className="ml-auto"
                      onClick={() =>
                        patch({ documentos: draft.documentos.filter((_, i) => i !== index) })
                      }
                    >
                      Quitar plano
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ─── Créditos ────────────────────────────────── */}
        <section className="flex flex-col gap-4 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
                Colaboradores ({draft.creditos.length})
              </h2>
              <p className="vmv-caption-1 text-vmv-muted-foreground">
                Se agrupan por rol en el orden en que los captures.
              </p>
            </div>
            <Button
              onClick={() =>
                patch({
                  creditos: [
                    ...draft.creditos,
                    {
                      // Repetir el rol anterior ahorra teclear al capturar
                      // varios nombres del mismo equipo.
                      rol: draft.creditos.at(-1)?.rol ?? 'Diseño arquitectónico',
                      nombre: '',
                    },
                  ],
                })
              }
            >
              Añadir colaborador
            </Button>
          </div>

          {draft.creditos.length === 0 ? (
            <p className="vmv-body-3 border border-dashed border-vmv-border px-4 py-6 text-center text-vmv-muted-foreground">
              Sin colaboradores. El bloque de créditos no aparecerá en la página.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {draft.creditos.map((credito, index) => (
                <li
                  key={index}
                  className="grid gap-3 border border-vmv-border p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                  <Field label="Rol">
                    <input
                      className={inputClass}
                      placeholder="Diseño arquitectónico"
                      value={credito.rol}
                      onChange={(event) => patchCredito(index, { rol: event.target.value })}
                    />
                  </Field>
                  <Field label="Nombre">
                    <input
                      className={inputClass}
                      value={credito.nombre}
                      onChange={(event) => patchCredito(index, { nombre: event.target.value })}
                    />
                  </Field>
                  <div className="flex items-end gap-1">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const creditos = moved(draft.creditos, index, index - 1)
                        if (creditos) patch({ creditos })
                      }}
                      disabled={index === 0}
                      aria-label="Mover antes"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const creditos = moved(draft.creditos, index, index + 1)
                        if (creditos) patch({ creditos })
                      }}
                      disabled={index === draft.creditos.length - 1}
                      aria-label="Mover después"
                    >
                      ↓
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        patch({ creditos: draft.creditos.filter((_, i) => i !== index) })
                      }
                    >
                      Quitar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

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
            <span className="vmv-caption-1 text-vmv-muted-foreground">Subiendo archivos…</span>
          )}
        </footer>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="vmv-title-3">Proyectos</h1>
          <p className="vmv-body-3 text-vmv-muted-foreground">
            Arrastra las tarjetas para cambiar el orden del portafolio. Ese mismo orden decide cuál
            es el «siguiente proyecto» al final de cada ficha.
          </p>
        </div>
        <Button variant="solid" onClick={() => openDraft(emptyDraft())}>
          Nuevo proyecto
        </Button>
      </div>

      {banners}

      {proyectos.length === 0 ? (
        <p className="vmv-body-3 border border-dashed border-vmv-border px-4 py-10 text-center text-vmv-muted-foreground">
          Todavía no hay proyectos. Crea el primero para que aparezca el portafolio.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {proyectos.map((proyecto, index) => (
            <li
              key={proyecto.id}
              draggable
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
              {proyecto.cover_url && (
                <img
                  src={proyecto.cover_url}
                  alt=""
                  className="h-16 w-24 shrink-0 object-cover"
                  loading="lazy"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="vmv-body-2 truncate">
                  {proyecto.title}
                  {!proyecto.publicado && (
                    <span className="vmv-caption-1 ml-2 text-vmv-muted-foreground">(oculto)</span>
                  )}
                </p>
                <p className="vmv-caption-1 text-vmv-muted-foreground">
                  {proyecto.slug} · {proyecto.proyecto_fotos.length} fotos ·{' '}
                  {proyecto.proyecto_documentos.length} planos
                  {proyecto.anio ? ` · ${proyecto.anio}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/projects/${proyecto.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="vmv-body-3 border border-vmv-border px-3.5 py-2 transition-colors duration-200 hover:bg-vmv-muted"
                >
                  Ver
                </a>
                <Button onClick={() => openDraft(toDraft(proyecto))}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(proyecto)}>
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
